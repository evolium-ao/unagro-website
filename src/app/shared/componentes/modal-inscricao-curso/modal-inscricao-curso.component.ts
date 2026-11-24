import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../../core/api/erro-api';
import { NovaInscricaoCurso } from '../../../core/modelos/inscricao-curso.model';
import { InscricoesService } from '../../../core/servicos/inscricoes.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { validarTelefoneComIndicativo } from '../../formulario/validadores';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { BotaoComponent } from '../botao/botao.component';
import { CursoCurtaDuracaoCartao } from '../cartao-curso-curta-duracao/cartao-curso-curta-duracao.component';
import { IconeComponent } from '../icone/icone.component';
import { CamposInscricaoCursoComponent } from './campos-inscricao-curso.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_INSCRICAO_CURSO = 'modal-inscricao-curso';

/** O que a página passa em `data` ao abrir o modal. */
export interface DadosInscricaoCurso {
  /** Curso cujo "Inscrever-se" foi clicado no cartão — o modal já abre para este curso. */
  cursoSelecionado: CursoCurtaDuracaoCartao;
}

/**
 * Formulário de inscrição num curso de curta duração, renderizado como template do
 * `AlertModalService` (sem header nem botões próprios: o fecho é o X do canto e o
 * rodapé é desenhado aqui com o `app-botao`).
 */
@Component({
  selector: 'app-modal-inscricao-curso',
  imports: [ReactiveFormsModule, BotaoComponent, IconeComponent, CamposInscricaoCursoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <!-- Fechar -->
      <button
        type="button"
        class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary-deep hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="16" />
      </button>

      <div class="border-b border-gray-200 px-6 pb-6 pt-9 sm:px-9">
        <h2 class="max-w-sm text-2xl font-bold leading-tight text-primary-deep sm:text-3xl">
          {{ textos().titulo }}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-text-secondary">
          {{ textos().subtitulo }}
        </p>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="submeter()">
        <div class="px-6 py-7 sm:px-9">
          <!--
            O @if não é decoração: os campos têm de nascer numa vista embebida, criada
            no passe de actualização, depois de o [formGroup] acima já estar ligado.
            Postos aqui directamente, eram construídos no passe de criação — antes do
            binding — e o criarErrosFormulario deles encontrava o form do
            FormGroupDirective a null.
          -->
          @if (tituloCurso) {
            <app-campos-inscricao-curso [tituloCurso]="tituloCurso" />
          }

          <!-- A falha do POST fica aqui, e não num segundo modal por cima deste:
               o formulário continua preenchido e o pedido repete-se com um clique. -->
          @if (enviar.isError()) {
            <p
              role="alert"
              class="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700"
            >
              {{ mensagemErro() }}
            </p>
          }
        </div>

        <div
          class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 px-6 py-5 sm:px-9"
        >
          <app-botao variante="contorno" (clicado)="fechar()">
            {{ textos().cancelar }}
          </app-botao>
          <app-botao
            tipo="submit"
            variante="profundo"
            icone="arrow-right"
            posicaoIcone="direita"
            paddingX="px-6"
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
export class ModalInscricaoCursoComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);
  private readonly modais = inject(AlertModalService);
  private readonly dadosModal = inject(ModalDataService);
  private readonly inscricoes = inject(InscricoesService);

  private readonly dados = this.dadosModal.obterDados<DadosInscricaoCurso>();

  /** O curso já vem escolhido do cartão clicado — sem select, sem hipótese de trocar. */
  protected readonly tituloCurso = this.dados?.cursoSelecionado.titulo ?? '';

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarTelefoneComIndicativo],
    }),
  });

  /**
   * `POST /inscricoes` — endpoint público, sem `Authorization`. Não há nada
   * para invalidar a seguir: a lista de inscrições da API pede autenticação e
   * o site nunca a lê.
   */
  protected readonly enviar = injectMutation<void, ErroApi, NovaInscricaoCurso>(() => ({
    mutationFn: (dados) => this.inscricoes.criar(dados),
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
      'Não foi possível registar a inscrição. Tente novamente dentro de alguns instantes.',
      'Could not register the enrolment. Please try again in a few moments.',
    ]);
  });

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao([
      'Inscrição em Curso de Curta Duração',
      'Short Course Enrolment',
    ]),
    subtitulo: this.traducao.getTraducao([
      'Preencha os dados abaixo para garantir sua vaga no módulo seleccionado.',
      'Fill in the details below to secure your place in the selected module.',
    ]),
    cancelar: this.traducao.getTraducao(['Cancelar', 'Cancel']),
    submeter: this.traducao.getTraducao(['Confirmar Inscrição', 'Confirm Enrolment']),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
    sucessoTitulo: this.traducao.getTraducao(['Inscrição enviada', 'Enrolment submitted']),
    sucessoMensagem: this.traducao.getTraducao([
      'Recebemos a sua inscrição. A equipa de formação confirma a vaga e envia as instruções de pagamento por e-mail dentro de dois dias úteis.',
      'We have received your enrolment. Our training team will confirm your place and send the payment instructions by e-mail within two working days.',
    ]),
  }));

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_INSCRICAO_CURSO);
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
        cursoId: this.dados?.cursoSelecionado.id ?? '',
        nome: valores.nome,
        email: valores.email,
        telefone: valores.telefone,
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
}
