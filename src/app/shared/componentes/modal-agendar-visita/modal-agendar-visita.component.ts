import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../../core/api/erro-api';
import { NovoAgendamentoVisita } from '../../../core/modelos/agendamento-visita.model';
import { UnidadeInvestigacao } from '../../../core/modelos/investigacao.model';
import { AgendamentoVisitasService } from '../../../core/servicos/agendamento-visitas.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { BotaoComponent } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';
import { validarTelefoneComIndicativo } from '../../formulario/validadores';
import { CamposAgendarVisitaComponent, UnidadeVisita } from './campos-agendar-visita.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_AGENDAR_VISITA = 'modal-agendar-visita';

/** O que a página passa em `data` ao abrir o modal. */
export interface DadosAgendarVisita {
  /**
   * Unidade cujo "Visitar Unidade" foi clicado. Não há escolha dentro do modal —
   * o modal só abre a partir do cartão da unidade, por isso é ela que se visita.
   */
  unidadeSelecionada: UnidadeInvestigacao;
}

/** Ícone de recurso quando a unidade não traz `icone` nos dados. */
const ICONE_UNIDADE_PADRAO = 'flask-conical';

/**
 * Formulário de pedido de visita a um centro ou laboratório, renderizado como
 * template do `AlertModalService` (sem header nem botões próprios: o fecho é o X do
 * canto e a submissão é o botão do formulário).
 */
@Component({
  selector: 'app-modal-agendar-visita',
  imports: [ReactiveFormsModule, BotaoComponent, IconeComponent, CamposAgendarVisitaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative px-6 pb-10 pt-12 sm:px-10">
      <!-- Fechar -->
      <button
        type="button"
        class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary-deep hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="16" />
      </button>

      <h2 class="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
        {{ textos().titulo }}
      </h2>
      <p class="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-text-secondary">
        {{ textos().subtitulo }}
      </p>

      <form class="mt-10" [formGroup]="formulario" (ngSubmit)="submeter()">
        <!--
          O @if não é decoração: os campos têm de nascer numa vista embebida, criada
          no passe de actualização, depois de o [formGroup] acima já estar ligado.
          Postos aqui directamente, eram construídos no passe de criação — antes do
          binding — e o criarErrosFormulario deles encontrava o form do
          FormGroupDirective a null. É por isso que os passos da candidatura de
          docentes vivem dentro de um @switch. A condição também vale por si: sem a
          unidade vinda do cartão não há formulário que faça sentido mostrar.
        -->
        @if (unidade(); as unidade) {
          <app-campos-agendar-visita [unidade]="unidade" />
        }

        <!-- A falha do POST fica aqui, e não num segundo modal por cima deste:
             o formulário continua preenchido e o pedido repete-se com um clique. -->
        @if (enviar.isError()) {
          <p
            role="alert"
            class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700"
          >
            {{ mensagemErro() }}
          </p>
        }

        <div class="mt-10 flex justify-end">
          <app-botao
            tipo="submit"
            variante="profundo"
            icone="arrow-right"
            posicaoIcone="direita"
            paddingX="px-7"
            paddingY="py-3"
            [aCarregar]="enviar.isPending()"
            [desativado]="enviar.isPending()"
          >
            {{ textos().submeter }}
          </app-botao>
        </div>
      </form>
    </div>
  `,
})
export class ModalAgendarVisitaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);
  private readonly modais = inject(AlertModalService);
  private readonly dadosModal = inject(ModalDataService);
  private readonly agendamentos = inject(AgendamentoVisitasService);

  private readonly dados = this.dadosModal.obterDados<DadosAgendarVisita>();

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    instituicao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarTelefoneComIndicativo],
    }),
    data: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    hora: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    // A unidade clicada no cartão chega já escolhida e não se troca aqui.
    unidade: new FormControl(this.dados?.unidadeSelecionada.id ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    motivo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    participantes: new FormControl('1', {
      nonNullable: true,
      validators: [Validators.required, (campo) => this.validarParticipantes(campo)],
    }),
  });

  protected readonly unidade = computed<UnidadeVisita | undefined>(() => {
    const unidade = this.dados?.unidadeSelecionada;
    return unidade
      ? { rotulo: unidade.nome, icone: unidade.icone ?? ICONE_UNIDADE_PADRAO }
      : undefined;
  });

  /**
   * `POST /agendamento-visitas` — endpoint público, sem `Authorization`. Não há
   * nada para invalidar a seguir: a lista de agendamentos da API pede
   * autenticação e o site nunca a lê.
   */
  protected readonly enviar = injectMutation<void, ErroApi, NovoAgendamentoVisita>(() => ({
    mutationFn: (dados) => this.agendamentos.criar(dados),
  }));

  /**
   * O que se mostra na faixa vermelha do formulário. Os 422 do Laravel trazem a
   * mensagem por campo e chegam **só em português** — a API é monolingue —, mas
   * dizem exactamente o que está errado, por isso passam à frente do texto
   * genérico.
   */
  protected readonly mensagemErro = computed(() => {
    const erro = this.enviar.error();
    if (!erro) {
      return '';
    }

    const doServidor = Object.values(erro.errosValidacao).flat();
    if (doServidor.length) {
      return doServidor.join(' ');
    }

    if (erro.estado === 0) {
      return this.traducao.getTraducao([
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ]);
    }

    return this.traducao.getTraducao([
      'Não foi possível registar o pedido de visita. Tente novamente dentro de alguns instantes.',
      'Could not register the visit request. Please try again in a few moments.',
    ]);
  });

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Agende sua Visita', 'Schedule your Visit']),
    subtitulo: this.traducao.getTraducao([
      'Preencha o formulário abaixo para solicitar o agendamento de uma visita aos nossos centros de excelência e laboratórios avançados.',
      'Fill in the form below to request a visit to our centres of excellence and advanced laboratories.',
    ]),
    submeter: this.traducao.getTraducao(['Solicitar Agendamento', 'Request Appointment']),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
    sucessoTitulo: this.traducao.getTraducao(['Pedido enviado', 'Request sent']),
    sucessoMensagem: this.traducao.getTraducao([
      'Recebemos o seu pedido de visita. A equipa confirma por e-mail a data e a hora dentro de dois dias úteis.',
      'We have received your visit request. Our team will confirm the date and time by e-mail within two working days.',
    ]),
  }));

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_AGENDAR_VISITA);
  }

  protected submeter(): void {
    if (this.enviar.isPending()) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    this.enviar.mutate(
      {
        unidade_id: valores.unidade,
        nome: valores.nome,
        instituicao: valores.instituicao,
        email: valores.email,
        telefone: valores.telefone,
        data: valores.data,
        hora: valores.hora,
        motivo: valores.motivo,
        participantes: Number(valores.participantes),
      },
      {
        // O modal fecha primeiro: o de sucesso ocupa o lugar dele, não se empilha por cima.
        onSuccess: () => {
          this.fechar();
          void this.modais.sucesso(this.textos().sucessoMensagem, this.textos().sucessoTitulo);
        },
      },
    );
  }

  /** Ao menos um participante. A mensagem vai no próprio erro, que o `getErro` mostra tal e qual. */
  private validarParticipantes(control: AbstractControl): ValidationErrors | null {
    const numero = Number(control.value);
    if (Number.isFinite(numero) && numero >= 1) {
      return null;
    }

    return {
      participantesInvalido: this.traducao.getTraducao([
        'Indique pelo menos 1 participante',
        'Enter at least 1 participant',
      ]),
    };
  }
}
