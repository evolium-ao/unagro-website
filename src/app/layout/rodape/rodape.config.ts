import { CaminhoDicionario } from '../../core/traducao/dicionario';

export interface ItemRodape {
  label: CaminhoDicionario;
  /** Sem destino o item aparece como texto — evita ligações para páginas que ainda não existem. */
  path?: string;
}

export interface ColunaRodape {
  titulo: CaminhoDicionario;
  itens: ItemRodape[];
}

export interface ContactoRodape {
  icone: string;
  valor: string;
  /** `tel:` ou `mailto:`; sem href o contacto aparece como texto. */
  href?: string;
}

export interface RedeSocialRodape {
  icone: string;
  nome: string;
  /** Sem URL o ícone aparece sem ser clicável. */
  url?: string;
}

export const COLUNAS_RODAPE: ColunaRodape[] = [
  {
    titulo: 'rodape.universidadeTitulo',
    itens: [
      { label: 'rodape.reitoria', path: '/sobre' },
      { label: 'rodape.departamentos', path: '/desenvolvimento' },
      { label: 'nav.hub', path: '/hub-unagro' },
      { label: 'nav.alumni', path: '/alumni' },
      { label: 'nav.eventos', path: '/eventos' },
    ],
  },
  {
    titulo: 'rodape.servicosTitulo',
    itens: [
      { label: 'rodape.portalEstudante', path: '/estudantes' },
      { label: 'rodape.processoAdmissao', path: '/candidaturas' },
      { label: 'rodape.apoioEstudante', path: '/estudantes' },
      { label: 'nav.formacoes', path: '/formacoes' },
      { label: 'rodape.bolsasEstudo', path: '/candidaturas' },
    ],
  },
];

export const CONTACTOS_RODAPE: ContactoRodape[] = [
  { icone: 'map-pin', valor: 'Estrada Nacional 230, Huambo, Angola' },
  { icone: 'phone', valor: '+244 923 000 000', href: 'tel:+244923000000' },
  { icone: 'mail', valor: 'geral@unagro.ao', href: 'mailto:geral@unagro.ao' },
];

export const REDES_SOCIAIS_RODAPE: RedeSocialRodape[] = [
  { icone: 'facebook', nome: 'Facebook' },
  { icone: 'instagram', nome: 'Instagram' },
  { icone: 'youtube', nome: 'YouTube' },
];

export const LEGAIS_RODAPE: ItemRodape[] = [
  { label: 'rodape.termosUso' },
  { label: 'rodape.privacidade' },
  { label: 'rodape.cookies' },
  { label: 'rodape.acessibilidade' },
];
