import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CursosService } from '../../core/servicos/cursos.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { BarraTopoComponent } from '../../shared/componentes/barra-topo/barra-topo.component';
import { CHAVE_SUBMENU_CURSOS, MENU_PRINCIPAL } from './menu.config';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import {
  DropdownMenuComponent,
  DropdownMenuItemConfig,
} from '../../shared/componentes/dropdown-menu/dropdown-menu.component';
import { DropdownMenuTriggerDirective } from '../../shared/componentes/dropdown-menu/dropdown-menu-trigger.directive';

/** Entrada de submenu já pronta para o template, venha ela da config ou de dados dinâmicos. */
interface ItemSubmenu {
  texto: string;
  path: string;
}

@Component({
  selector: 'app-cabecalho',
  imports: [
    RouterLink,
    RouterLinkActive,
    IconeComponent,
    BarraTopoComponent,
    ContainerPaginaComponent,
    DropdownMenuComponent,
    DropdownMenuTriggerDirective,
  ],
  templateUrl: './cabecalho.component.html',
})
export class CabecalhoComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);

  protected readonly menuPrincipal = MENU_PRINCIPAL;

  /**
   * Submenus indexados pelo label do item pai. Um item ganha submenu ao declarar
   * `children` na config ou uma `chaveDinamica` alimentada por dados (ex: cursos).
   */
  protected readonly submenus = computed(() => {
    const mapa = new Map<string, ItemSubmenu[]>();

    for (const item of MENU_PRINCIPAL) {
      if (item.chaveDinamica === CHAVE_SUBMENU_CURSOS) {
        mapa.set(
          item.label,
          this.cursosService
            .cursosGrau()
            .map((curso) => ({ texto: curso.titulo, path: `/cursos/${curso.id}` })),
        );
      } else if (item.children?.length) {
        mapa.set(
          item.label,
          item.children.map((filho) => ({ texto: this.traducao.t(filho.label), path: filho.path })),
        );
      }
    }

    return mapa;
  });

  /**
   * Os mesmos submenus no formato que o `app-dropdown-menu` consome — usado apenas
   * na navegação desktop; o menu móvel continua a render os `submenus()` em acordeão.
   */
  protected readonly submenusDropdown = computed(() => {
    const mapa = new Map<string, DropdownMenuItemConfig[]>();

    for (const [label, filhos] of this.submenus()) {
      mapa.set(
        label,
        filhos.map((filho) => ({
          label: filho.texto,
          routeUrl: filho.path,
          iconRight: 'chevronRight' as const,
        })),
      );
    }

    return mapa;
  });

  protected readonly menuAberto = signal(false);
  protected readonly submenuMobileAberto = signal<string | null>(null);

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
    this.submenuMobileAberto.set(null);
  }

  protected alternarSubmenuMobile(label: string): void {
    this.submenuMobileAberto.update((aberto) => (aberto === label ? null : label));
  }
}
