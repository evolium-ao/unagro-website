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
  /**
   * A API ainda não guarda a data do evento — só `created_at`/`updated_at`,
   * que são datas de registo, não do acontecimento. Fica ausente até o
   * back-end a dar; onde a página mostra a data ou a contagem decrescente, a
   * secção desaparece. Ver "A API não dá" em `.claude/memory/integrar-recurso.md`.
   */
  dataInicio?: string;
  /** Só para eventos de vários dias; sem ela mostra-se apenas a data de início. */
  dataFim?: string;
}

/** Ordem em que os âmbitos aparecem na barra de filtros. */
export const AMBITOS_EVENTO: AmbitoEvento[] = ['nacional', 'internacional', 'unagro'];

/** Rótulos dos âmbitos, partilhados pelos filtros e pelo selo do cartão. */
export const ROTULOS_AMBITO_EVENTO: Record<AmbitoEvento, TextoBilingue> = {
  nacional: ['Nacional', 'National'],
  internacional: ['Internacional', 'International'],
  unagro: ['Promovido pela UNAGRO', 'UNAGRO Promoted'],
};
