import { TextoBilingue } from '../traducao/texto-bilingue';

/**
 * Centro, laboratório ou unidade — os cartões de "Centros e Laboratórios".
 *
 * Segue a regra dos modelos vindos da API (`.claude/README.md`): campos de texto
 * simples (`string`), porque a API devolve o texto já resolvido e não um par
 * bilingue. Quem traduz do `LaboratorioResource` para esta forma é o
 * `LaboratoriosService`.
 */
export interface UnidadeInvestigacao {
  id: string;
  /**
   * Área que aparece no selo sobre a fotografia. Vem do nome da faculdade a que
   * o laboratório pertence — é o que a API tem mais perto de uma área.
   */
  area: string;
  nome: string;
  /** Sem capa, o cartão fica no espaço reservado do `app-espaco-imagem`. */
  imagem_url?: string;
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

/**
 * Investigador principal — um cartão da fila da equipa científica.
 *
 * Segue a regra dos modelos vindos da API (`.claude/README.md`): campos de texto
 * simples (`string`), não pares bilingues. Quem traduz do
 * `InvestigadorResource` para esta forma é o `InvestigadoresService`; o inglês
 * do `cargo` e das especialidades vem da tradução automática do conteúdo da
 * API, no componente que consome.
 */
export interface Investigador {
  id: string;
  nome: string;
  /** Ausente (a API dá-o `null`), a linha do cargo não aparece no cartão. */
  cargo?: string;
  /** Sem fotografia, o cartão cai no espaço reservado do `app-espaco-imagem`. */
  foto_url?: string;
  /**
   * Áreas de especialidade; o cartão mostra-as como pílulas em maiúsculas.
   * Ausente ou vazia, o bloco das pílulas não aparece.
   */
  especialidades?: string[];
}
