import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UnidadeInvestigacao } from '../../../core/modelos/investigacao.model';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { BotaoComponent } from '../botao/botao.component';
import { OpcaoCartaoSelecao } from '../grupo-cartoes-selecao/grupo-cartoes-selecao.component';
import { IconeComponent } from '../icone/icone.component';
import { validarTelefoneComIndicativo } from '../../formulario/validadores';
import { CamposAgendarVisitaComponent } from './campos-agendar-visita.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_AGENDAR_VISITA = 'modal-agendar-visita';

/** O que a página passa em `data` ao abrir o modal. */
export interface DadosAgendarVisita {
  /** Unidade cujo "Visitar Unidade" foi clicado — chega já seleccionada. */
  unidadeSelecionada: UnidadeInvestigacao;
  /** Todas as unidades, para desenhar a fila de cartões seleccionáveis. */
  unidades: UnidadeInvestigacao[];
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
          docentes vivem dentro de um @switch. A condição também vale por si: sem as
          unidades vindas do modal não há formulário que faça sentido mostrar.
        -->
        @if (opcoesUnidades().length) {
          <app-campos-agendar-visita [unidades]="opcoesUnidades()" />
        }

        <div class="mt-10 flex justify-end">
          <app-botao
            tipo="submit"
            variante="profundo"
            icone="arrow-right"
            posicaoIcone="direita"
            paddingX="px-7"
            paddingY="py-3"
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
    // A unidade clicada no cartão chega já escolhida; o utilizador pode trocar.
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

  protected readonly opcoesUnidades = computed<OpcaoCartaoSelecao[]>(() =>
    (this.dados?.unidades ?? []).map((unidade) => ({
      valor: unidade.id,
      rotulo: this.traducao.getTraducao(unidade.nome),
      icone: unidade.icone ?? ICONE_UNIDADE_PADRAO,
    })),
  );

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
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // TODO: enviar o pedido ao endpoint de agendamento de visitas quando existir.
    this.fechar();
    void this.modais.sucesso(this.textos().sucessoMensagem, this.textos().sucessoTitulo);
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
