import { AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, QueryList, ViewChild, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropdownMenuItemDirective } from './dropdown-menu-item.directive';
import { DropdownMenuTriggerDirective } from './dropdown-menu-trigger.directive';

export type DropdownMenuIconName = 'home' | 'user' | 'logout' | 'settings' | 'check' | 'arrowRight' | 'chevronRight' | 'info';

/**
 * `padrao` mantém o painel claro descrito no README; `escuro` reproduz o menu de
 * navegação institucional — painel verde, texto branco e itens separados por linhas.
 */
export type DropdownMenuVariante = 'padrao' | 'escuro';

const CLASSES_PAINEL: Record<DropdownMenuVariante, string> = {
  padrao: 'bg-white text-[#282727] rounded-md shadow-2xl ring-1 ring-black/5',
  escuro: 'bg-primary text-white rounded-sm shadow-2xl divide-y divide-white/15',
};

const CLASSES_ITEM: Record<DropdownMenuVariante, string> = {
  padrao: 'px-4 py-3 text-[#282727] text-sm hover:bg-[#F8F3EE]',
  escuro: 'px-5 py-3.5 text-white text-sm font-medium hover:bg-white/10',
};

/** A cor dos ícones acompanha o painel: laranja no claro, branco no escuro. */
const CLASSES_ICONE: Record<DropdownMenuVariante, string> = {
  padrao: 'text-[#E47202]',
  escuro: 'text-white',
};

export interface DropdownMenuItemConfig {
  label: string;
  iconLeft?: DropdownMenuIconName;
  iconRight?: DropdownMenuIconName;
  routeUrl?: string | any[];
  click?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  order?: number;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-w-max relative inline-block">
      @if (customTrigger) {
        <ng-container *ngTemplateOutlet="customTrigger.templateRef; context: { toggleMenu: toggleMenu.bind(this), menuOpen: menuOpen(), ariaLabel: ariaLabel() }"></ng-container>
      } @else {
        <button
          type="button"
          class="flex items-center gap-2 rounded-xs h-10 px-4 bg-[#F18700] text-white font-bold text-sm leading-none transition-all hover:bg-[#D96100] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E47202]"
          aria-haspopup="true"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="ariaLabel()"
          (click)="toggleMenu()"
        >
          @if (buttonIcon()) {
            <span class="flex items-center justify-center">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
          }

          <span>{{ buttonLabel() }}</span>

          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      }

      @if (menuOpen()) {
        <div class="inset-0 fixed w-full h-full bg-black/0 z-9998" (click)="closeMenu()"></div>
        <div #menuPanel class="fixed z-9999 overflow-hidden" [class]="classesPainel()" [ngStyle]="menuPanelStyles()">
          @if (customItemsList().length > 0 && customItemsPosition() === 'before') {
            @for (custom of customItemsList(); track $index) {
              <ng-container *ngTemplateOutlet="custom.templateRef; context: { closeMenu: closeMenu.bind(this) }"></ng-container>
            }
          }

          @for (item of sortedItems(); track $index) {
            <button
              type="button"
              class="flex items-center justify-between w-full gap-2 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              [class]="classesItem()"
              [disabled]="item.disabled"
              [attr.aria-label]="item.ariaLabel || item.label"
              (click)="selectConfigItem(item)"
            >
              <span class="flex items-center gap-2">
                @if (item.iconLeft) {
                  <span class="flex items-center justify-center" [class]="classesIcone()">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                  </span>
                }
                <span>{{ item.label }}</span>
              </span>
              @if (item.iconRight) {
                <span class="flex items-center justify-center shrink-0" [class]="classesIcone()">
                  @if (item.iconRight === 'arrowRight') {
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
                  } @else if (item.iconRight === 'chevronRight') {
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
                  } @else {
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                  }
                </span>
              }
            </button>
          }

          @if (customItemsList().length > 0 && customItemsPosition() === 'after') {
            @for (custom of customItemsList(); track $index) {
              <ng-container *ngTemplateOutlet="custom.templateRef; context: { closeMenu: closeMenu.bind(this) }"></ng-container>
            }
          }
        </div>
      }
    </div>
  `,
})
export class DropdownMenuComponent implements AfterContentInit {
  private router = inject(Router);
  private host = inject(ElementRef<HTMLElement>);

  @ContentChildren(DropdownMenuItemDirective, { descendants: true, read: DropdownMenuItemDirective })
  customItems?: QueryList<DropdownMenuItemDirective>;

  @ContentChild(DropdownMenuTriggerDirective, { static: false })
  customTrigger?: DropdownMenuTriggerDirective;

  @ViewChild('menuPanel', { read: ElementRef, static: false })
  menuPanel?: ElementRef<HTMLElement>;

  ariaLabel = input('Abrir menu');
  buttonLabel = input('Menu');
  buttonIcon = input<DropdownMenuIconName | null>(null);
  itemListDropdown = input<DropdownMenuItemConfig[]>([]);
  customItemsPosition = input<'before' | 'after'>('before');
  closeOnSelect = input(true);
  menuMaxWidth = input('320px');
  menuMinWidth = input('220px');
  variante = input<DropdownMenuVariante>('padrao');

  readonly classesPainel = computed(() => CLASSES_PAINEL[this.variante()]);
  readonly classesItem = computed(() => CLASSES_ITEM[this.variante()]);
  readonly classesIcone = computed(() => CLASSES_ICONE[this.variante()]);

  menuOpen = signal(false);
  customItemsList = signal<DropdownMenuItemDirective[]>([]);
  menuPanelStyles = signal<Record<string, string>>({
    minWidth: '220px',
    position: 'fixed',
    zIndex: '9999',
  });

  selected = output<{ item: DropdownMenuItemConfig; index: number }>();

  readonly sortedItems = computed(() =>
    [...this.itemListDropdown()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );

  ngAfterContentInit() {
    this.updateCustomItems();
    this.customItems?.changes?.subscribe(() => this.updateCustomItems());
  }

  updateCustomItems() {
    this.customItemsList.set(
      (this.customItems?.toArray() ?? []).sort((a, b) => a.order - b.order)
    );
  }

  toggleMenu() {
    const next = !this.menuOpen();
    this.menuOpen.set(next);

    if (next) {
      setTimeout(() => this.updatePosition(), 0);
    }
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  updatePosition() {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuHeightEstimate = 260;

    const panelRect = this.menuPanel?.nativeElement.getBoundingClientRect();
    const menuWidth = panelRect?.width ?? this.parseMenuWidth(this.menuMaxWidth()) ?? 240;
    const menuHeight = panelRect?.height ?? menuHeightEstimate;

    const canOpenBelow = viewportHeight - rect.bottom > menuHeight + 8;
    const canOpenAbove = rect.top > menuHeight + 8;
    const openTop = !canOpenBelow && canOpenAbove;

    const fitsRight = rect.left + menuWidth + 16 <= viewportWidth;
    const fitsLeft = rect.right - menuWidth - 16 >= 0;

    const styles: Record<string, string> = {
      position: 'fixed',
      minWidth: this.menuMinWidth(),
      maxWidth: this.menuMaxWidth(),
      zIndex: '9999',
    };

    if (openTop) {
      styles['bottom'] = `${Math.max(8, viewportHeight - rect.top + 8)}px`;
      styles['top'] = 'auto';
    } else {
      styles['top'] = `${Math.min(viewportHeight - 8, rect.bottom + 8)}px`;
      styles['bottom'] = 'auto';
    }

    if (fitsRight) {
      styles['left'] = `${Math.max(8, rect.left)}px`;
      styles['right'] = 'auto';
    } else if (fitsLeft) {
      styles['left'] = 'auto';
      styles['right'] = `${Math.max(8, viewportWidth - rect.right)}px`;
    } else {
      styles['left'] = '8px';
      styles['right'] = '8px';
    }

    this.menuPanelStyles.set(styles);
  }

  private parseMenuWidth(width: string): number | null {
    const match = /^([0-9]+)px$/.exec(width.trim());
    return match ? Number(match[1]) : null;
  }

  selectConfigItem(item: DropdownMenuItemConfig) {
    if (item.disabled) {
      return;
    }

    item.click?.();

    if (item.routeUrl) {
      const route = Array.isArray(item.routeUrl) ? item.routeUrl : [item.routeUrl];
      this.router.navigate(route).catch(() => undefined);
    }

    const index = this.sortedItems().findIndex(current => current === item);
    this.selected.emit({ item, index });

    if (this.closeOnSelect()) {
      this.closeMenu();
    }
  }
}
