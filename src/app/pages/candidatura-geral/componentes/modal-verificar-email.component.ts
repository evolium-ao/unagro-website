import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ErroApi } from '../../../core/api/erro-api';
import { VerificacaoEmailService } from '../../../core/servicos/verificacao-email.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { AlertOptions } from '../../../shared/componentes/alert-modal/alert-modal.types';
import { ModalDataService } from '../../../shared/componentes/alert-modal/modal-data.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { CandidaturaGeralEstadoService } from '../estado/candidatura-geral-estado.service';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_VERIFICAR_EMAIL = 'modal-verificar-email';

/** Um pouco mais do que a animação de saída do `AlertModalService` (300 ms). */
const ESPERA_FECHO_MODAL_MS = 320;
const DIGITOS_CODIGO = 6;

/** O que quem abre passa em `data`. */
export interface DadosVerificarEmail {
  email: string;
  /** Corre depois de o código ser confirmado e o modal fechar — p. ex. seguir com a submissão. */
  aoConfirmar?: () => void;
}

/** Opções do `AlertModalService.modal()` para este modal. */
export function opcoesModalVerificarEmail(data: DadosVerificarEmail): AlertOptions {
  return {
    id: ID_MODAL_VERIFICAR_EMAIL,
    template: ModalVerificarEmailComponent,
    tamanho: 'medio',
    temHeader: false,
    semBotoes: true,
    data,
  };
}

/**
 * "Validar e-mail" da etapa 4: ao abrir, a API envia um código de 6 dígitos
 * para o e-mail da etapa 1; o candidato escreve-o e o site confirma-o. Só com o
 * código confirmado a candidatura pode ser submetida — fechar o modal sem ele
 * deixa a submissão bloqueada. Template do `AlertModalService`.
 */
@Component({
  selector: 'app-modal-verificar-email',
  imports: [BotaoComponent, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div class="h-2 bg-secondary" aria-hidden="true"></div>

      <button
        type="button"
        class="absolute right-4 top-6 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-text-primary transition-colors hover:bg-gray-200 hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="18" />
      </button>

      <div class="px-5 pb-6 pt-10 sm:px-8">
        <div class="flex items-start gap-3 pr-12">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-deep text-secondary" aria-hidden="true">
            <app-icone nome="mail" [tamanho]="20" />
          </span>
          <div class="min-w-0">
            <h2 class="text-lg font-bold leading-tight text-primary-deep sm:text-xl">{{ textos().titulo }}</h2>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm" aria-live="polite">
              @if (aEnviar()) {
                {{ textos().aEnviar }}
              } @else if (enviado()) {
                {{ textos().enviadoPara }} <strong class="break-all text-primary-deep">{{ email }}</strong>.
                {{ textos().verifique }}
              } @else {
                {{ textos().naoEnviado }}
              }
            </p>
          </div>
        </div>

        <form class="mt-6" (submit)="confirmar($event)" novalidate>
          <label for="codigo-otp" class="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
            {{ textos().campo }}
          </label>
          <input
            id="codigo-otp"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            [attr.maxlength]="digitos"
            [placeholder]="'0'.repeat(digitos)"
            class="mt-1 w-full rounded-lg border bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-primary-deep outline-none transition-colors focus:border-primary"
            [class]="erro() ? 'border-red-400' : 'border-gray-300'"
            [value]="codigo()"
            [disabled]="!enviado()"
            [attr.aria-invalid]="!!erro()"
            [attr.aria-describedby]="erro() ? 'codigo-otp-erro' : null"
            (input)="escrever($event)"
          />
          @if (erro(); as mensagem) {
            <p id="codigo-otp-erro" class="mt-2 text-xs text-red-600" role="alert">{{ mensagem }}</p>
          }

          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              class="cursor-pointer self-start text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary-dark disabled:cursor-not-allowed disabled:text-text-secondary disabled:no-underline"
              [disabled]="aEnviar() || segundosReenvio() > 0"
              (click)="enviar()"
            >
              {{ segundosReenvio() > 0 ? textos().reenviarEm : textos().reenviar }}
            </button>
            <app-botao
              tipo="submit"
              variante="profundo"
              tamanho="sm"
              icone="badge-check"
              paddingX="px-5"
              [aCarregar]="aConfirmar()"
              [desativado]="!enviado() || codigo().length !== digitos"
            >
              {{ textos().confirmar }}
            </app-botao>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ModalVerificarEmailComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly servico = inject(VerificacaoEmailService);
  private readonly estado = inject(CandidaturaGeralEstadoService);
  private readonly dados = inject(ModalDataService).obterDados<DadosVerificarEmail>();

  protected readonly email = this.dados?.email ?? '';
  protected readonly digitos = DIGITOS_CODIGO;

  protected readonly codigo = signal('');
  protected readonly aEnviar = signal(false);
  protected readonly enviado = signal(false);
  protected readonly aConfirmar = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly segundosReenvio = signal(0);
  private pedido: AbortController | null = null;
  private contagem: ReturnType<typeof setInterval> | null = null;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const s = this.segundosReenvio();
    return {
      fechar: t('Fechar', 'Close'),
      titulo: t('Validar E-mail', 'Verify E-mail'),
      aEnviar: t('A enviar o código de verificação…', 'Sending the verification code…'),
      enviadoPara: t('Enviámos um código de 6 dígitos para', 'We sent a 6-digit code to'),
      verifique: t(
        'Escreva-o abaixo para confirmar o e-mail. Veja também a pasta de spam.',
        'Enter it below to confirm the e-mail. Please also check your spam folder.',
      ),
      naoEnviado: t(
        'Não foi possível enviar o código. Tente reenviar dentro de instantes.',
        'The code could not be sent. Try resending in a moment.',
      ),
      campo: t('Código de verificação', 'Verification code'),
      confirmar: t('Confirmar código', 'Confirm code'),
      reenviar: t('Reenviar código', 'Resend code'),
      reenviarEm: t(`Reenviar código em ${s}s`, `Resend code in ${s}s`),
      incompleto: t(`Indique os ${DIGITOS_CODIGO} dígitos do código.`, `Enter the ${DIGITOS_CODIGO}-digit code.`),
      invalido: t(
        'Código inválido ou expirado. Confirme o que escreveu ou peça um novo código.',
        'Invalid or expired code. Check what you typed or request a new code.',
      ),
      limite: t(
        'Demasiadas tentativas. Aguarde um pouco antes de tentar de novo.',
        'Too many attempts. Please wait a moment before trying again.',
      ),
      erroRede: t(
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ),
      erroGenerico: t(
        'Não foi possível concluir o pedido. Tente novamente dentro de alguns instantes.',
        'The request could not be completed. Please try again in a few moments.',
      ),
    };
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.pedido?.abort();
      this.pararContagem();
    });
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      void this.enviar();
    }
  }

  protected async enviar(): Promise<void> {
    if (this.aEnviar() || this.segundosReenvio() > 0) {
      return;
    }
    const pedido = this.novoPedido();
    this.aEnviar.set(true);
    this.erro.set(null);
    try {
      const { reenviarEm } = await this.servico.enviarCodigo(this.email, pedido.signal);
      this.enviado.set(true);
      this.codigo.set('');
      this.iniciarContagem(reenviarEm);
    } catch (falha) {
      if (!pedido.signal.aborted) {
        this.erro.set(this.mensagemErro(ErroApi.aPartirDe(falha)));
      }
    } finally {
      if (this.pedido === pedido) {
        this.aEnviar.set(false);
        this.pedido = null;
      }
    }
  }

  /** Só dígitos, até ao tamanho do código (colar "123 456" também serve). */
  protected escrever(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const limpo = entrada.value.replace(/\D/g, '').slice(0, DIGITOS_CODIGO);
    entrada.value = limpo;
    this.codigo.set(limpo);
    this.erro.set(null);
  }

  protected async confirmar(evento?: Event): Promise<void> {
    evento?.preventDefault();
    if (this.aConfirmar()) {
      return;
    }
    const codigo = this.codigo();
    if (codigo.length !== DIGITOS_CODIGO) {
      this.erro.set(this.textos().incompleto);
      return;
    }
    const pedido = this.novoPedido();
    this.aConfirmar.set(true);
    this.erro.set(null);
    try {
      await this.servico.verificarCodigo(this.email, codigo, pedido.signal);
      this.estado.confirmarEmail(this.email, codigo);
      this.fechar();
      const aoConfirmar = this.dados?.aoConfirmar;
      if (aoConfirmar) {
        // Depois de o modal sair: a submissão pode abrir outro modal (sucesso ou erro).
        setTimeout(aoConfirmar, ESPERA_FECHO_MODAL_MS);
      }
    } catch (falha) {
      if (!pedido.signal.aborted) {
        this.erro.set(this.mensagemErro(ErroApi.aPartirDe(falha)));
      }
    } finally {
      if (this.pedido === pedido) {
        this.aConfirmar.set(false);
        this.pedido = null;
      }
    }
  }

  protected fechar(): void {
    this.pedido?.abort();
    this.modais.fechar(ID_MODAL_VERIFICAR_EMAIL);
  }

  private novoPedido(): AbortController {
    this.pedido?.abort();
    this.pedido = new AbortController();
    return this.pedido;
  }

  private iniciarContagem(segundos: number): void {
    this.pararContagem();
    this.segundosReenvio.set(Math.max(0, Math.round(segundos)));
    this.contagem = setInterval(() => {
      const restantes = this.segundosReenvio() - 1;
      this.segundosReenvio.set(Math.max(0, restantes));
      if (restantes <= 0) {
        this.pararContagem();
      }
    }, 1000);
  }

  private pararContagem(): void {
    if (this.contagem) {
      clearInterval(this.contagem);
      this.contagem = null;
    }
  }

  /** 422 é código errado/expirado (ou e-mail recusado, com a frase da API); 429 é o limite de pedidos. */
  private mensagemErro(erro: ErroApi): string {
    const t = this.textos();
    if (erro.estado === 429) {
      return t.limite;
    }
    if (erro.estado === 422) {
      const erros = erro.errosValidacao;
      // A frase do `codigo_otp` vem só em português: a nossa diz o mesmo nos dois idiomas.
      return erros['codigo_otp'] ? t.invalido : Object.values(erros).flat().join(' ') || t.invalido;
    }
    return erro.estado === 0 ? t.erroRede : t.erroGenerico;
  }
}
