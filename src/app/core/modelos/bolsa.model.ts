import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface Bolsa {
  id: string;
  nome: TextoTraduzido;
  /** Resumo apresentado no cartão da secção de bolsas. */
  descricao: TextoTraduzido;
  cobertura: TextoTraduzido;
  requisitos: TextoTraduzido;
}
