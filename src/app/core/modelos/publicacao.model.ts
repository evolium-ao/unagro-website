import { TextoBilingue } from '../traducao/texto-bilingue';

/**
 * Artigo científico da lista de publicações recentes. Nomes em snake_case por
 * espelharem a linha que a API devolve, como o `Projecto`.
 */
export interface Publicacao {
  id: string;
  /** Revista ou categoria; sai em maiúsculas no cartão. */
  revista: TextoBilingue;
  /** Data já escrita para leitura, ex.: `['JAN 2024', 'JAN 2024']`. */
  data: TextoBilingue;
  titulo: TextoBilingue;
  /** Lista de autores num só texto, como vem da citação. */
  autores: TextoBilingue;
  /** Nome de um ícone de `dados-icones.ts`; sem valor, o cartão usa `file-text`. */
  icone?: string;
  /** Destino do resumo do artigo. */
  link_abstract: string;
  /** Destino do ficheiro para descarregar. */
  link_download: string;
}
