import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CursosService } from '../../core/servicos/cursos.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { BarraTopoComponent } from '../../shared/componentes/barra-topo/barra-topo.component';
import { CHAVE_SUBMENU_CURSOS, MENU_PRINCIPAL, ModalMenu } from './menu.config';
import { AlertModalService } from '../../shared/componentes/alert-modal/alert-modal.service';
import {
  ID_MODAL_NOSSA_HISTORIA,
  ModalNossaHistoriaComponent,
} from '../../shared/componentes/modal-nossa-historia/modal-nossa-historia.component';
import {
  ID_MODAL_ORGAOS_GESTAO,
  ModalOrgaosGestaoComponent,
} from '../../shared/componentes/modal-orgaos-gestao/modal-orgaos-gestao.component';
import {
  ID_MODAL_PILARES,
  ModalPilaresInstitucionaisComponent,
} from '../../shared/componentes/modal-pilares-institucionais/modal-pilares-institucionais.component';
import {
  ID_MODAL_ESTRUTURA_ORGANIZACIONAL,
  ModalEstruturaOrganizacionalComponent,
} from '../../shared/componentes/modal-estrutura-organizacional/modal-estrutura-organizacional.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import {
  DropdownMenuComponent,
  DropdownMenuItemConfig,
} from '../../shared/componentes/dropdown-menu/dropdown-menu.component';
import { DropdownMenuTriggerDirective } from '../../shared/componentes/dropdown-menu/dropdown-menu-trigger.directive';

/** Entrada de submenu já pronta para o template, venha ela da config ou de dados dinâmicos. */
interface ItemSubmenu {
  texto: string;
  path?: string;
  /** Quando presente, o item abre um modal em vez de navegar. */
  modal?: ModalMenu;
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
  private readonly modais = inject(AlertModalService);

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
          item.children.map((filho) => ({
            texto: this.traducao.t(filho.label),
            path: filho.path,
            modal: filho.modal,
          })),
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
          routeUrl: filho.modal ? undefined : filho.path,
          click: filho.modal ? () => this.abrirModal(filho.modal!) : undefined,
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

  /** Abre o modal associado a um item de menu (ex: "Nossa História"). */
  protected abrirModal(modal: ModalMenu): void {
    this.fecharMenu();

    if (modal === 'nossaHistoria') {
      void this.modais.open({
        id: ID_MODAL_NOSSA_HISTORIA,
        template: ModalNossaHistoriaComponent,
        tamanho: 'xlgrande',
        temHeader: false,
        semBotoes: true,
        fecharAoClicarFundo: true,
      });
      return;
    }

    if (modal === 'pilares') {
      void this.modais.open({
        id: ID_MODAL_PILARES,
        template: ModalPilaresInstitucionaisComponent,
        // Só três colunas de texto: `xgrande` chega, sem a largura do Órgãos de Gestão.
        tamanho: 'xlgrande',
        temHeader: false,
        semBotoes: true,
        fecharAoClicarFundo: true,
      });
      return;
    }

    if (modal === 'orgaosGestao') {
      void this.modais.open({
        id: ID_MODAL_ORGAOS_GESTAO,
        template: ModalOrgaosGestaoComponent,
        tamanho: 'xlgrande',
        temHeader: false,
        semBotoes: true,
      });
      return;
    }

    if (modal === 'estruturaOrganizacional') {
      void this.modais.open({
        id: ID_MODAL_ESTRUTURA_ORGANIZACIONAL,
        template: ModalEstruturaOrganizacionalComponent,
        // Organograma em coluna: o painel largo do Órgãos de Gestão seria espaço vazio.
        tamanho: 'xgrande',
        temHeader: false,
        semBotoes: true,
        fecharAoClicarFundo: true,
      });
    }
  }

  protected alternarSubmenuMobile(label: string): void {
    this.submenuMobileAberto.update((aberto) => (aberto === label ? null : label));
  }
}
