import { TextoTraduzido } from '../traducao/texto-traduzido';

/**
 * Projecto inovador do Hub — iniciativa em estágio de pesquisa à procura de apoio
 * técnico ou financeiro. Tal como a API o serviria: textos em par `pt`/`en` e
 * valores **crus** (a meta é um número e a percentagem um inteiro de 0 a 100); a
 * formatação — "Buscando $120k", "85% Meta atingida", a largura da barra — é
 * decisão do cartão que o mostra.
 *
 * Não confundir com o `Projeto` de `projeto.model.ts`: esse é o projecto de
 * investigação com cronograma, galeria e objectivos, servido pelo `ProjetosService`.
 */
export interface ProjectoInovador {
  id: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  /** O destacado da grelha: leva fotografia e barra de financiamento. */
  destaque?: boolean;
  /** Nome de `dados-icones.ts`; só os cartões simples o usam. */
  icone?: string;
  /** Caminho a partir de `public/` (sem o `public/`); sem ele fica o marcador cinzento. */
  imagem_url?: string;
  /** Fase do projecto ("Protótipo", "Pesquisa"), sem o rótulo "Estágio:". */
  estagio?: TextoTraduzido;
  /** Valor a angariar, cru: `120000`, não `'$120k'`. */
  metaFinanciamento?: number;
  /** Código ISO 4217 da `metaFinanciamento` (`'USD'`, `'AOA'`). */
  moeda?: string;
  /** Parte da meta já atingida, de 0 a 100. */
  percentagemMeta?: number;
  /** Destino do "Apoiar Projeto". */
  link?: string;
}
