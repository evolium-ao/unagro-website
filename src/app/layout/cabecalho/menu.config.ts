import { CaminhoDicionario } from '../../core/traducao/dicionario';

export interface ItemMenuFilho {
  label: CaminhoDicionario;
  path: string;
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
  { label: 'nav.sobreUnagro', path: '/sobre' },
  { label: 'nav.candidaturas', path: '/candidaturas' },
  { label: 'nav.estudantes', path: '/estudantes' },
  { label: 'nav.desenvolvimento', path: '/desenvolvimento' },
  { label: 'nav.eventos', path: '/eventos' },
  { label: 'nav.formacoes', path: '/formacoes' },
  { label: 'nav.hub', path: '/hub-unagro' },
  { label: 'nav.contactos', path: '/contactos' },
];
