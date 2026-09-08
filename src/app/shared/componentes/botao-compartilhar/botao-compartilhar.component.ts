import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';

/**
 * `icone` = botão redondo só com o ícone, para cartões sobre fundo claro;
 * `claro` = o mesmo, mas em vidro branco para cartões sobre fotografia escura;
 * `rotulo` = pílula com ícone e a palavra "Compartilhar", para a página do artigo.
 */
export type VarianteBotaoCompartilhar = 'icone' | 'claro' | 'rotulo';

const CLASSES_GATILHO: Record<VarianteBotaoCompartilhar, string> = {
  icone:
    'h-8 w-8 rounded-full border border-gray-200 bg-white text-text-secondary hover:border-primary hover:text-primary',
  claro:
    'h-8 w-8 rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30',
  rotulo:
    'gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-primary-dark hover:border-primary hover:text-primary',
};

/** Rede social de destino: o rótulo é a marca, logo não passa pelo dicionário. */
interface RedeCompartilhar {
  id: string;
  rotulo: string;
  icone: string;
  /** Monta o endereço de partilha a partir do URL absoluto e do título da notícia. */
  endereco: (url: string, titulo: string) => string;
}

const REDES: readonly RedeCompartilhar[] = [
  {
    id: 'facebook',
    rotulo: 'Facebook',
    icone: 'facebook',
    endereco: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'x',
    rotulo: 'X (Twitter)',
    icone: 'twitter',
    endereco: (url, titulo) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
  },
  {
    id: 'linkedin',
    rotulo: 'LinkedIn',
    icone: 'linkedin',
    endereco: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'whatsapp',
    rotulo: 'WhatsApp',
    icone: 'message-circle',
    endereco: (url, titulo) => `https://wa.me/?text=${encodeURIComponent(titulo + ' ' + url)}`,
  },
];

/** Quanto tempo o painel fica a dizer "Link copiado" antes de se fechar. */
const DURACAO_AVISO_COPIA = 2000;

/** Largura do painel (`w-52`), usada para o encostar à direita do gatilho. */
const LARGURA_PAINEL = 208;

/** Folga entre o painel e o gatilho, e entre o painel e os limites da janela. */
const MARGEM_PAINEL = 8;

/**
 * Botão de compartilhar de uma notícia (ou de qualquer página com título e
 * endereço próprios).
 *
 * O painel de opções é posicionado em `fixed`, e não em `absolute` dentro do
 * gatilho: os cartões de notícia têm `overflow-hidden` para arredondar a
 * fotografia, e um painel em fluxo normal saía cortado pela moldura do cartão.
 *
 * O URL absoluto só é montado no momento do clique, a partir de
 * `window.location`: durante o SSR não há origem conhecida, e pré-calcular o
 * endereço no servidor deixaria links errados no HTML servido.
 */
@Component({
  selector: 'app-botao-compartilhar',
  imports: [IconeComponent],
  host: {
    class: 'relative inline-flex',
    '(document:keydown.escape)': 'fechar()',
    '(window:resize)': 'fechar()',
  },
  template: `
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      [class]="classesGatilho()"
      [attr.aria-label]="traducao.t('comum.compartilhar')"
      [attr.aria-expanded]="aberto()"
      aria-haspopup="menu"
      (click)="alternar($event)"
    >
      <app-icone nome="share-2" [tamanho]="variante() === 'rotulo' ? 14 : 15" />
      @if (variante() === 'rotulo') {
        <span>{{ traducao.t('comum.compartilhar') }}</span>
      }
    </button>

    @if (aberto()) {
      <!-- Camada de fundo: fecha o painel a qualquer clique fora dele. -->
      <div class="fixed inset-0 z-9998" (click)="fechar()"></div>

      <div
        class="fixed z-9999 w-52 overflow-hidden rounded-lg bg-white py-1 text-left shadow-2xl ring-1 ring-black/5"
        [style.top.px]="posicao().top"
        [style.left.px]="posicao().left"
        role="menu"
      >
        @for (rede of redes; track rede.id) {
          <button
            type="button"
            role="menuitem"
            class="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-text-primary transition-colors duration-200 hover:bg-bg-lighter"
            (click)="abrirRede(rede)"
          >
            <app-icone [nome]="rede.icone" [tamanho]="15" class="text-primary-dark" />
            {{ rede.rotulo }}
          </button>
        }

        <button
          type="button"
          role="menuitem"
          class="flex w-full cursor-pointer items-center gap-2.5 border-t border-gray-100 px-4 py-2.5 text-xs font-medium text-text-primary transition-colors duration-200 hover:bg-bg-lighter"
          (click)="copiarLink()"
        >
          <app-icone
            [nome]="copiado() ? 'check' : 'link'"
            [tamanho]="15"
            [class]="copiado() ? 'text-primary' : 'text-primary-dark'"
          />
          {{ copiado() ? traducao.t('comum.linkCopiado') : traducao.t('comum.copiarLink') }}
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotaoCompartilharComponent {
  /** Título da notícia: acompanha a partilha no X e no WhatsApp. */
  readonly titulo = input.required<string>();
  /**
   * Endereço a compartilhar. Aceita um caminho do site (`/noticias/3`), que é
   * resolvido para absoluto no clique, ou já um URL completo. Sem valor, usa o
   * endereço da página onde o botão está.
   */
  readonly link = input<string>();
  readonly variante = input<VarianteBotaoCompartilhar>('icone');

  protected readonly traducao = inject(TraducaoService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly redes = REDES;
  protected readonly aberto = signal(false);
  protected readonly copiado = signal(false);
  protected readonly posicao = signal({ top: 0, left: 0 });

  protected readonly classesGatilho = computed(() => CLASSES_GATILHO[this.variante()]);

  protected alternar(evento: Event): void {
    // Os cartões de notícia têm uma ligação sobreposta que cobre a área toda: sem
    // travar a propagação, o clique no botão abria também a notícia.
    evento.stopPropagation();
    evento.preventDefault();

    if (this.aberto()) {
      this.fechar();
      return;
    }

    this.posicionar();
    this.aberto.set(true);
  }

  protected fechar(): void {
    if (this.aberto()) {
      this.aberto.set(false);
      this.copiado.set(false);
    }
  }

  protected abrirRede(rede: RedeCompartilhar): void {
    if (this.ehNavegador) {
      window.open(
        rede.endereco(this.urlAbsoluta(), this.titulo()),
        '_blank',
        'noopener,noreferrer',
      );
    }
    this.fechar();
  }

  protected async copiarLink(): Promise<void> {
    if (!this.ehNavegador) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.urlAbsoluta());
      this.copiado.set(true);
      // O painel fica aberto o tempo do aviso, para se ver que o link foi copiado.
      setTimeout(() => this.fechar(), DURACAO_AVISO_COPIA);
    } catch {
      // Sem acesso à área de transferência (contexto não seguro, permissão negada):
      // resta fechar o painel sem confirmar a cópia.
      this.fechar();
    }
  }

  /** Coloca o painel debaixo do gatilho, alinhado à direita e dentro da janela. */
  private posicionar(): void {
    if (!this.ehNavegador) {
      return;
    }

    const caixa = this.host.nativeElement.getBoundingClientRect();
    const left = Math.min(
      Math.max(MARGEM_PAINEL, caixa.right - LARGURA_PAINEL),
      window.innerWidth - LARGURA_PAINEL - MARGEM_PAINEL,
    );

    this.posicao.set({ top: caixa.bottom + MARGEM_PAINEL, left });
  }

  private urlAbsoluta(): string {
    const destino = this.link();

    if (!this.ehNavegador) {
      return destino ?? '';
    }
    if (destino && /^https?:\/\//i.test(destino)) {
      return destino;
    }
    return new URL(destino ?? window.location.pathname, window.location.origin).href;
  }
}
