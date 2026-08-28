import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface EntradaCalendario {
  id: string;
  data: TextoTraduzido;
  evento: TextoTraduzido;
}
