import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface Bolsa {
  id: string;
  nome: TextoTraduzido;
  cobertura: TextoTraduzido;
  requisitos: TextoTraduzido;
}
