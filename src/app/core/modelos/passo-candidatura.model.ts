import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface PassoCandidatura {
  numero: number;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  icone: string;
}
