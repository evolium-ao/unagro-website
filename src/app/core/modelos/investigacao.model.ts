import { TextoBilingue } from '../traducao/texto-bilingue';

/**
 * Centro, laboratório ou unidade — os cartões de "Centros e Laboratórios".
 * Nomes em snake_case por espelharem a linha que a API devolve, como o `Projecto`.
 */
export interface UnidadeInvestigacao {
  id: string;
  /** Área que aparece no selo sobre a fotografia, ex.: "Biotecnologia". */
  area: TextoBilingue;
  nome: TextoBilingue;
  imagem_url: string;
  link: string;
  /**
   * Nome de um ícone de `dados-icones.ts`, usado onde a unidade aparece sem
   * fotografia (ex.: os cartões de escolha do modal de agendamento de visita).
   */
  icone?: string;
}

/**
 * Forma do cartão na grelha das linhas de investigação: `destaque` é o cartão
 * escuro grande, `simples` os cartões claros pequenos e `faixa` a barra escura a
 * toda a largura, a única com botão.
 */
export type FormatoLinhaInvestigacao = 'destaque' | 'simples' | 'faixa';

export interface LinhaInvestigacao {
  id: string;
  formato: FormatoLinhaInvestigacao;
  /** Nome de um ícone de `dados-icones.ts`. */
  icone: string;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
  /** Pílulas de contexto; só o cartão em destaque as mostra. */
  metricas?: TextoBilingue[];
  /** Só a faixa tem acção. */
  cta?: { texto: TextoBilingue; link: string };
}

/**
 * Passo do ciclo de trabalho apresentado na secção da metodologia. O `numero`
 * vem nos dados, e não do índice da grelha, porque faz parte do título ("01.").
 */
export interface PassoMetodologia {
  id: string;
  /** Já formatado como aparece no título, ex.: "01". */
  numero: string;
  /** Nome de um ícone de `dados-icones.ts`. */
  icone: string;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
}

/** Investigador principal — um cartão da fila da equipa científica. */
export interface Investigador {
  id: string;
  /** Nome próprio, igual nos dois idiomas, logo sem `TextoBilingue`. */
  nome: string;
  cargo: TextoBilingue;
  foto_url: string;
  /** Áreas de especialidade; o cartão mostra-as como pílulas em maiúsculas. */
  especialidades: TextoBilingue[];
}
