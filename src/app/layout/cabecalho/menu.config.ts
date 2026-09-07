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

export const MENU_PRINCIPAL: ItemMenu[] = [
  {
    label: 'nav.sobreUnagro',
    path: '/sobre',
    // As páginas dedicadas ainda não existem: por agora todos os itens abrem `/sobre`.
    children: [
      { label: 'nav.sobreMenu.nossaHistoria', modal: 'nossaHistoria' },
      { label: 'nav.sobreMenu.pilares', modal: 'pilares' },
      { label: 'nav.sobreMenu.orgaosGestao', modal: 'orgaosGestao' },
      { label: 'nav.sobreMenu.estruturaOrganizacional', modal: 'estruturaOrganizacional' },
      { label: 'nav.sobreMenu.faculdadesDepartamentos', path: '/sobre' },
      { label: 'nav.sobreMenu.abaUnagro', path: '/sobre' },
      { label: 'nav.sobreMenu.governanca', path: '/sobre' },
    ],
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
