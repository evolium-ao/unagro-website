import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface Estatistica {
  id: string;
  valor: string;
  rotulo: TextoTraduzido;
  icone?: string;
}
