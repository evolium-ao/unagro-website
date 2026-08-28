import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface HistoriaAlumni {
  id: string;
  nome: string;
  curso: TextoTraduzido;
  anoConclusao: number;
  cargoAtual: TextoTraduzido;
  testemunho: TextoTraduzido;
}
