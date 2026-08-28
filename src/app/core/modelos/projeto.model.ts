import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface EtapaCronograma {
  data: TextoTraduzido;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

export interface Projeto {
  id: string;
  titulo: TextoTraduzido;
  faculdade: TextoTraduzido;
  resumo: TextoTraduzido;
  desafio: TextoTraduzido;
  solucoes: TextoTraduzido[];
  cronograma: EtapaCronograma[];
  numeroImagensGaleria: number;
}
