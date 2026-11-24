import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Estado de uma fase de candidaturas — define o selo apresentado no cartão. */
export type EstadoFase = 'a-decorrer' | 'brevemente' | 'encerrada';

/** Linha "prazo → data" dentro do cartão de uma fase. */
export interface PrazoFase {
  rotulo: TextoTraduzido;
  valor: TextoTraduzido;
}

export interface FaseCandidatura {
  id: string;
  titulo: TextoTraduzido;
  estado: EstadoFase;
  estadoRotulo: TextoTraduzido;
  prazos: PrazoFase[];
}
