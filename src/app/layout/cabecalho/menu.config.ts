import { CaminhoDicionario } from '../../core/traducao/dicionario';

/** Modais que podem ser abertos directamente a partir do menu. */
export type ModalMenu = 'nossaHistoria';

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
      { label: 'nav.sobreMenu.pilares', path: '/sobre' },
      { label: 'nav.sobreMenu.orgaosGestao', path: '/sobre' },
      { label: 'nav.sobreMenu.estruturaOrganizacional', path: '/sobre' },
      { label: 'nav.sobreMenu.faculdadesDepartamentos', path: '/sobre' },
      { label: 'nav.sobreMenu.abaUnagro', path: '/sobre' },
      { label: 'nav.sobreMenu.governanca', path: '/sobre' },
    ],
  },
  {
    label: 'nav.candidaturas',
    path: '/candidaturas/admissao-candidatura',
    // A secretaria académica e o gabinete de investigação ainda não têm página
    // dedicada: por agora apontam para as admissões.
    children: [
      { label: 'nav.candidaturasMenu.secretariaAcademica', path: '/candidaturas/admissao-candidatura' },
      { label: 'nav.candidaturasMenu.gabineteInvestigacao', path: '/candidaturas/admissao-candidatura' },
      { label: 'nav.candidaturasMenu.admissaoCandidatura', path: '/candidaturas/admissao-candidatura' },
      { label: 'nav.candidaturasMenu.docentes', path: '/candidaturas/docentes' },
    ],
  },
  { label: 'nav.estudantes', path: '/estudantes' },
  { label: 'nav.desenvolvimento', path: '/desenvolvimento' },
  { label: 'nav.eventos', path: '/eventos' },
  { label: 'nav.formacoes', path: '/formacoes' },
  { label: 'nav.hub', path: '/hub-unagro' },
  { label: 'nav.contactos', path: '/contactos' },
];
