import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { DropdownMenuItemDirective } from '../dropdown-menu/dropdown-menu-item.directive';
import { DropdownMenuTriggerDirective } from '../dropdown-menu/dropdown-menu-trigger.directive';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
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

/**
 * Os itens do painel repetem à mão o aspecto da variante `padrao` do
 * `app-dropdown-menu` (`CLASSES_ITEM.padrao` e `CLASSES_ICONE.padrao`): entram
 * por `dropdownMenuItem`, e não por `itemListDropdown`, porque o `iconLeft` da
 * configuração desenha sempre o mesmo círculo — não sabe mostrar os logótipos
 * das redes.
 */
const CLASSES_ITEM =
  'flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-[#282727] transition-colors hover:bg-[#F8F3EE]';

const CLASSES_ICONE_ITEM = 'text-[#E47202]';

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

/**
 * Botão de compartilhar de uma notícia (ou de qualquer página com título e
 * endereço próprios).
 *
 * O painel é o `app-dropdown-menu` do projecto: o gatilho entra por
 * `dropdownMenuTrigger` (para manter as três variantes de aspecto) e as opções
 * por `dropdownMenuItem` (para cada uma poder trazer o logótipo da sua rede).
 * O posicionamento, a camada de fundo e o fecho ficam a cargo do menu padrão.
 *
 * O URL absoluto só é montado no momento do clique, a partir de
 * `window.location`: durante o SSR não há origem conhecida, e pré-calculá-lo no
 * servidor deixaria links errados no HTML servido.
 */
@Component({
  selector: 'app-botao-compartilhar',
  imports: [
    DropdownMenuComponent,
    DropdownMenuTriggerDirective,
    DropdownMenuItemDirective,
    IconeComponent,
  ],
  host: { class: 'inline-flex' },
  template: `
    <app-dropdown-menu
      [ariaLabel]="traducao.t('comum.compartilhar')"
      menuMinWidth="208px"
      menuMaxWidth="260px"
    >
      <ng-template
        dropdownMenuTrigger
        let-alternar="toggleMenu"
        let-aberto="menuOpen"
        let-rotulo="ariaLabel"
      >
        <button
          type="button"
          class="inline-flex cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          [class]="classesGatilho()"
          [attr.aria-label]="rotulo"
          [attr.aria-expanded]="aberto"
          aria-haspopup="menu"
          (click)="alternarPainel($event, alternar)"
        >
          <app-icone nome="share-2" [tamanho]="variante() === 'rotulo' ? 14 : 15" />
          @if (variante() === 'rotulo') {
            <span>{{ traducao.t('comum.compartilhar') }}</span>
          }
        </button>
      </ng-template>

      @for (rede of redes; track rede.id) {
        <ng-template dropdownMenuItem [dropdownMenuItemOrder]="$index" let-fechar="closeMenu">
          <button type="button" [class]="classesItem" (click)="abrirRede(rede); fechar()">
            <span class="flex items-center justify-center" [class]="classesIconeItem">
              <app-icone [nome]="rede.icone" [tamanho]="16" />
            </span>
            <span>{{ rede.rotulo }}</span>
          </button>
        </ng-template>
      }

      <ng-template
        dropdownMenuItem
        [dropdownMenuItemOrder]="redes.length"
        let-fechar="closeMenu"
      >
        <button type="button" [class]="classesItem" (click)="copiarLink(fechar)">
          <span class="flex items-center justify-center" [class]="classesIconeItem">
            <app-icone [nome]="copiado() ? 'check' : 'link'" [tamanho]="16" />
          </span>
          <span>{{
            copiado() ? traducao.t('comum.linkCopiado') : traducao.t('comum.copiarLink')
          }}</span>
        </button>
      </ng-template>
    </app-dropdown-menu>
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
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly redes = REDES;
  protected readonly classesItem = CLASSES_ITEM;
  protected readonly classesIconeItem = CLASSES_ICONE_ITEM;
  protected readonly copiado = signal(false);

  protected readonly classesGatilho = computed(() => CLASSES_GATILHO[this.variante()]);

  protected alternarPainel(evento: Event, alternar: () => void): void {
    // Os cartões de notícia têm uma ligação sobreposta que cobre a área toda: sem
    // travar a propagação, o clique no botão abria também a notícia.
    evento.stopPropagation();
    evento.preventDefault();

    this.copiado.set(false);
    alternar();
  }

  protected abrirRede(rede: RedeCompartilhar): void {
    if (this.ehNavegador) {
      window.open(
        rede.endereco(this.urlAbsoluta(), this.titulo()),
        '_blank',
        'noopener,noreferrer',
      );
    }
  }

  /**
   * Recebe o `closeMenu` do menu padrão em vez de fechar logo: o painel fica
   * aberto o tempo do aviso, para se ver que o link foi copiado.
   */
  protected async copiarLink(fechar: () => void): Promise<void> {
    if (!this.ehNavegador) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.urlAbsoluta());
      this.copiado.set(true);
      setTimeout(() => {
        this.copiado.set(false);
        fechar();
      }, DURACAO_AVISO_COPIA);
    } catch {
      // Sem acesso à área de transferência (contexto não seguro, permissão negada):
      // resta fechar o painel sem confirmar a cópia.
      fechar();
    }
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
