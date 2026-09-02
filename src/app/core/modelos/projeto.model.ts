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
  /** Estado do projecto, em maiúsculas — é o selo do hero do detalhe. */
  estado: TextoTraduzido;
  /** Localidade onde o projecto decorre. */
  local: TextoTraduzido;
  /** Intervalo de execução, ex.: `Janeiro 2025 – Dezembro 2026`. */
  periodo: TextoTraduzido;
  /** Área temática do projecto. */
  categoria: TextoTraduzido;
  resumo: TextoTraduzido;
  desafio: TextoTraduzido;
  solucoes: TextoTraduzido[];
  cronograma: EtapaCronograma[];
  numeroImagensGaleria: number;
}
