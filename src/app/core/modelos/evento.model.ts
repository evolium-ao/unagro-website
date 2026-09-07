import { TextoTraduzido } from '../traducao/texto-traduzido';

export type AmbitoEvento = 'nacional' | 'internacional';

export interface Evento {
  id: string;
  titulo: TextoTraduzido;
  categoria: TextoTraduzido;
  ambito: AmbitoEvento;
  local: TextoTraduzido;
  dataInicio: string;
  /** Só para eventos de vários dias; sem ela mostra-se apenas a data de início. */
  dataFim?: string;
  descricao: TextoTraduzido;
  destaque?: boolean;
  /** Fotografia de fundo do evento; sem ela o cartão de destaque fica só com o verde sólido. */
  imagem_url?: string;
}
