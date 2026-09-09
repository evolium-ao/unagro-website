import { TextoBilingue } from '../traducao/texto-bilingue';

/**
 * Abrangência do evento, tal como a API a classifica (`abrangencia` do
 * `EventoResource`). A API também devolve `unagro_prometed` (erro tipográfico
 * de "promovido"); o serviço normaliza-o para `unagro`.
 */
export type AmbitoEvento = 'nacional' | 'internacional' | 'unagro';

/**
 * Evento na forma do **site** — espelha o `EventoResource`, já em texto
 * simples (`.claude/README.md`, "Modelos de dados vindos da API"). Quem
 * traduz do `EventoResource` para esta forma é o `EventosService`.
 */
export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  /** `localizacao` da API. */
  local: string;
  /** Abrangência usada nos filtros da listagem e no selo do cartão. */
  ambito: AmbitoEvento;
  /** URL da fotografia de capa; sem ela o cartão mostra o espaço reservado. */
  imagem_url?: string;
  /** Data/hora de início do evento (`data_inicio` da API, sempre presente no `EventoResource`). */
  dataInicio: string;
  /** Só relevante para eventos de vários dias; a API devolve sempre um valor, mas nem toda a UI o usa. */
  dataFim: string;
}

/** Ordem em que os âmbitos aparecem na barra de filtros. */
export const AMBITOS_EVENTO: AmbitoEvento[] = ['nacional', 'internacional', 'unagro'];

/** Rótulos dos âmbitos, partilhados pelos filtros e pelo selo do cartão. */
export const ROTULOS_AMBITO_EVENTO: Record<AmbitoEvento, TextoBilingue> = {
  nacional: ['Nacional', 'National'],
  internacional: ['Internacional', 'International'],
  unagro: ['Promovido pela UNAGRO', 'UNAGRO Promoted'],
};
