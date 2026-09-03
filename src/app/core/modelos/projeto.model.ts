import { TextoBilingue } from '../traducao/texto-bilingue';
import { ItemGaleria } from './galeria.model';

export type CategoriaProjecto = 'agricultura' | 'meio_ambiente' | 'tecnologia' | 'infraestrutura';

/** Em que ponto do cronograma a etapa está — a aparência do passo sai daqui. */
export type EstadoEtapaCronograma = 'concluida' | 'atual' | 'futura';

/**
 * Etapa da linha temporal "Cronograma do Projecto". O número da bola sai da
 * ordem em que a etapa aparece na lista e a cor sai do `estado`, por isso
 * nenhum dos dois se guarda aqui.
 */
export interface EtapaCronograma {
  id: string;
  titulo: string;
  /**
   * Trimestre ou ano da etapa, ex.: `Q1 2025`. Na etapa `atual` costuma faltar —
   * nesse caso é o rótulo do estado que toma o lugar, já traduzido no componente.
   */
  periodo?: string;
  descricao: string;
  estado: EstadoEtapaCronograma;
}

/** Indicador curto que acompanha o contexto do projecto, ex.: "45%" / "Erosão do solo". */
export interface EstatisticaProjeto {
  id: string;
  /** Valor já formatado como se lê, ex.: `45%` ou `12 Anos` — vem assim da API. */
  valor: string;
  rotulo: string;
}

/** Objectivo específico do projecto — um cartão da grelha "Objetivos do Projecto". */
export interface ObjetivoProjeto {
  id: string;
  /** Nome do ícone em `dados-icones.ts`. */
  icone: string;
  titulo: string;
  descricao: string;
}

/**
 * Componente da solução implementada — um cartão da grelha "Solução Implementada".
 * Tem exactamente a forma de um objectivo (ícone, título e descrição curta), por
 * isso é uma irmã do `ObjetivoProjeto` e não uma interface duplicada.
 */
export type SolucaoProjeto = ObjetivoProjeto;

/**
 * Espelha a linha que a API de projectos devolve — já no idioma do pedido, por
 * isso só texto simples. O mock guarda os dois idiomas (`TextoBilingue`) num
 * tipo à parte e é o `ProjetosService` que resolve com `getTraducao`, tal como
 * a API resolveria antes de responder.
 */
export interface Projeto {
  id: string;
  /** Categoria usada nos filtros da listagem e no selo do cartão. */
  categoria: CategoriaProjecto;
  titulo: string;
  faculdade: string;
  /** Estado do projecto, em maiúsculas — é o selo do hero do detalhe. */
  estado: string;
  /** Localidade onde o projecto decorre. */
  local: string;
  /** Intervalo de execução, ex.: `Janeiro 2025 – Dezembro 2026`. */
  periodo: string;
  /** Área temática específica do projecto, mostrada como metadado no hero do detalhe. */
  areaTematica: string;
  /** Resumo curto — serve tanto de descrição do cartão como de introdução do detalhe. */
  resumo: string;
  /** O número ou marco que o cartão destaca no rodapé, ex.: "+40% Produtividade". */
  resultado_principal: string;
  imagem_url: string;
  /** Enquadramento do projecto — o primeiro parágrafo do bloco "Contexto e Desafio". */
  contexto?: string;
  desafio: string;
  /** Indicadores do bloco "Contexto e Desafio"; ausente, o bloco fica só com o texto. */
  estatisticasContexto?: EstatisticaProjeto[];
  /** Fotografia que acompanha o bloco "Contexto e Desafio"; ausente, fica o marcador cinzento. */
  imagem_contexto_url?: string;
  /** Objectivo geral — o cartão escuro do bloco "Objetivos do Projecto". */
  objetivoGeral?: string;
  /** Objectivos específicos; sem eles a secção "Objetivos do Projecto" não aparece. */
  objetivosEspecificos?: ObjetivoProjeto[];
  /** Introdução da secção "Solução Implementada"; ausente, fica só o título. */
  descricaoSolucao?: string;
  /** Componentes da solução implementada; sem eles a secção não aparece. */
  solucoes?: SolucaoProjeto[];
  /** Indicadores da faixa "Impacto do Projecto"; ausente, a faixa não aparece. */
  estatisticasImpacto?: EstatisticaProjeto[];
  /** Etapas da linha temporal "Cronograma do Projecto"; sem elas a secção não aparece. */
  cronograma?: EtapaCronograma[];
  /**
   * Fotografias da secção "Galeria Multimédia"; sem elas a secção não aparece.
   * Substituiu o antigo `numeroImagensGaleria`, que só contava marcadores
   * cinzentos. Os quatro primeiros itens formam o mosaico e os restantes
   * seguem numa fila normal — a disposição é do componente, não dos dados.
   */
  galeria?: ItemGaleria[];
}

/** Ordem em que as categorias aparecem na barra de filtros. */
export const CATEGORIAS_PROJECTO: CategoriaProjecto[] = [
  'agricultura',
  'meio_ambiente',
  'tecnologia',
  'infraestrutura',
];

/** Rótulos das categorias, partilhados pelos filtros e pelo selo do cartão. */
export const ROTULOS_CATEGORIA_PROJECTO: Record<CategoriaProjecto, TextoBilingue> = {
  agricultura: ['Agricultura', 'Agriculture'],
  meio_ambiente: ['Meio Ambiente', 'Environment'],
  tecnologia: ['Tecnologia', 'Technology'],
  infraestrutura: ['Infraestrutura', 'Infrastructure'],
};
