import { CaminhoDicionario } from '../../core/traducao/dicionario';

/** Modais que podem ser abertos directamente a partir do menu. */
export type ModalMenu =
  | 'nossaHistoria'
  | 'orgaosGestao'
  | 'pilares'
  | 'estruturaOrganizacional';

export interface ItemMenuFilho {
  label: CaminhoDicionario;
  /** Rota a navegar. Omitida quando o item apenas abre um modal. */
  path?: string;
  /** Quando definido, o item abre este modal em vez de navegar. */
  modal?: ModalMenu;
}

export interface ItemMenu {
  label: CaminhoDicionario;
  path?: string;
  /** Identifica um item cujos filhos são carregados dinamicamente (ex: lista de cursos) */
  chaveDinamica?: string;
  children?: ItemMenuFilho[];
}

export const CHAVE_SUBMENU_CURSOS = 'cursos';

/**
 * Interruptor entre as duas propostas para o "Sobre UNAGRO":
 *
 * - `false` (proposta nova, em vigor) — "Sobre UNAGRO" é uma entrada simples que leva a
 *   `/sobre`; os antigos itens do submenu passaram a **abas** dessa página
 *   (`src/app/pages/sobre/`). Os modais continuam todos em `shared/componentes/modal-*`
 *   e o `CabecalhoComponent` continua a saber abri-los.
 * - `true` (proposta do cliente) — devolve o submenu ao menu, com os itens a abrirem os
 *   modais exactamente como antes.
 *
 * Mudar este valor é tudo o que é preciso para trocar de proposta.
 */
export const SOBRE_COM_SUBMENU_MODAIS: boolean = false;

/**
 * O submenu do "Sobre UNAGRO" da proposta do cliente. Fica aqui, intacto, para
 * `SOBRE_COM_SUBMENU_MODAIS` o poder voltar a ligar sem se reescrever nada.
 */
export const SUBMENU_SOBRE_MODAIS: ItemMenuFilho[] = [
  { label: 'nav.sobreMenu.nossaHistoria', modal: 'nossaHistoria' },
  { label: 'nav.sobreMenu.pilares', modal: 'pilares' },
  { label: 'nav.sobreMenu.orgaosGestao', modal: 'orgaosGestao' },
  { label: 'nav.sobreMenu.estruturaOrganizacional', modal: 'estruturaOrganizacional' },
  { label: 'nav.sobreMenu.faculdadesDepartamentos', path: '/sobre' },
  { label: 'nav.sobreMenu.abaUnagro', path: '/sobre' },
  { label: 'nav.sobreMenu.governanca', path: '/sobre' },
];

export const MENU_PRINCIPAL: ItemMenu[] = [
  {
    label: 'nav.sobreUnagro',
    path: '/sobre',
    // Sem `children` o cabeçalho trata-o como ligação simples — é o que a proposta nova quer.
    ...(SOBRE_COM_SUBMENU_MODAIS ? { children: SUBMENU_SOBRE_MODAIS } : {}),
  },
  {
    label: 'nav.candidaturas',
    path: '/candidaturas',
    children: [
      { label: 'nav.candidaturasMenu.estudantes', path: '/candidaturas/estudantes' },
      { label: 'nav.candidaturasMenu.docentes', path: '/candidaturas/docentes' },
      { label: 'nav.candidaturasMenu.maisInformacoes', path: '/candidaturas' },
    ],
  },
  { label: 'nav.estudantes', path: '/estudantes' },
  { label: 'nav.desenvolvimento', path: '/desenvolvimento' },
  { label: 'nav.eventos', path: '/eventos' },
  { label: 'nav.formacoes', path: '/formacoes' },
  { label: 'nav.hub', path: '/hub-unagro' },
  { label: 'nav.alumni', path: '/alumni' },
  { label: 'nav.contactos', path: '/contactos' },
];
