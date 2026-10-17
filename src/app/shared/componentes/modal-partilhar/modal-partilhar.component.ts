import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { ConteudoPartilha, RedePartilha, redesPartilha } from '../../partilha/redes-partilha';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { IconeComponent } from '../icone/icone.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_PARTILHAR = 'modal-partilhar';

/** O que quem abre passa em `data`: título e descrição do modal, e o que se partilha (sem o `rotuloEmail`). */
export interface DadosPartilhar extends Omit<ConteudoPartilha, 'rotuloEmail'> {
  titulo: string;
  descricao: string;
}

const DURACAO_COPIADO_MS = 2000;

/**
 * Partilha para os browsers sem folha de partilha nativa (`navigator.share`),
 * como o Firefox de computador ou o Chrome em Linux: o link com «Copiar Link» e
 * os botões de WhatsApp, LinkedIn, Telegram e Email. Template do `AlertModalService`.
 */
@Component({
  selector: 'app-modal-partilhar',
  imports: [IconeComponent],
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
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <app-icone nome="share-2" [tamanho]="20" />
          </span>
          <div class="min-w-0">
            <h2 class="text-lg font-bold leading-tight text-primary-deep sm:text-xl">{{ titulo }}</h2>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">{{ descricao }}</p>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row">
          <label class="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <app-icone nome="link" [tamanho]="15" class="shrink-0 text-text-secondary" />
            <span class="sr-only">{{ textos().endereco }}</span>
            <input
              #campoLink
              type="text"
              readonly
              class="min-w-0 flex-1 truncate bg-transparent font-mono text-xs text-text-primary outline-none"
              [value]="url"
              (focus)="campoLink.select()"
            />
          </label>
          <button
            type="button"
            class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            (click)="copiarLink(campoLink)"
          >
            <app-icone [nome]="linkCopiado() ? 'check' : 'copy'" [tamanho]="14" />
            <span aria-live="polite">{{ linkCopiado() ? textos().linkCopiado : textos().copiarLink }}</span>
          </button>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          @for (rede of redes(); track rede.id) {
            <a
              [href]="rede.endereco"
              [attr.target]="rede.id === 'email' ? null : '_blank'"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:border-primary hover:text-primary-deep"
              [attr.aria-label]="textos().partilharEm + ' ' + rede.rotulo"
            >
              <app-icone [nome]="rede.icone" [tamanho]="16" [class]="rede.cor" />
              {{ rede.rotulo }}
            </a>
          }
        </div>
      </div>
    </div>
  `,
})
export class ModalPartilharComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly dados = inject(ModalDataService).obterDados<DadosPartilhar>();

  protected readonly titulo = this.dados?.titulo ?? '';
  protected readonly descricao = this.dados?.descricao ?? '';
  private readonly mensagem = this.dados?.mensagem ?? '';
  protected readonly url = this.dados?.url ?? '';
  private readonly assunto = this.dados?.assunto ?? '';

  protected readonly linkCopiado = signal(false);
  private temporizadorLink: ReturnType<typeof setTimeout> | undefined;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      fechar: t('Fechar', 'Close'),
      endereco: t('Endereço a partilhar', 'Address to share'),
      copiarLink: t('Copiar Link', 'Copy Link'),
      linkCopiado: t('Link copiado', 'Link copied'),
      partilharEm: t('Partilhar no', 'Share on'),
      email: t('Email', 'Email'),
    };
  });

  protected readonly redes = computed<RedePartilha[]>(() =>
    redesPartilha({ url: this.url, mensagem: this.mensagem, assunto: this.assunto, rotuloEmail: this.textos().email }),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.temporizadorLink));
  }

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_PARTILHAR);
  }

  /** Copia o endereço; sem acesso à área de transferência, deixa-o seleccionado no campo para Ctrl+C. */
  protected async copiarLink(campo: HTMLInputElement): Promise<void> {
    if (!this.ehBrowser) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.url);
    } catch {
      campo.focus();
      campo.select();
      return;
    }
    this.linkCopiado.set(true);
    clearTimeout(this.temporizadorLink);
    this.temporizadorLink = setTimeout(() => this.linkCopiado.set(false), DURACAO_COPIADO_MS);
  }
}
