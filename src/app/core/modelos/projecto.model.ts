import { TextoBilingue } from '../traducao/texto-bilingue';

export type { TextoBilingue };

export type CategoriaProjecto = 'agricultura' | 'meio_ambiente' | 'tecnologia' | 'infraestrutura';

/**
 * Espelha a linha que a API de projectos de desenvolvimento devolve — daí os
 * nomes em snake_case. Os cartões consomem esta forma directamente, por isso
 * passar do mock à API é trocar apenas a origem do sinal que alimenta a lista.
 */
export interface Projecto {
  id: string;
  categoria: CategoriaProjecto;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
  /** O número ou marco que o cartão destaca no rodapé, ex.: "+40% Produtividade". */
  resultado_principal: TextoBilingue;
  imagem_url: string;
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
