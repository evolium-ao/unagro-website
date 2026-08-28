import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface AnoCurricular {
  ano: number;
  titulo: TextoTraduzido;
  disciplinas: TextoTraduzido[];
}

export interface Curso {
  id: string;
  tipo: 'grau' | 'curta-duracao';
  faculdade: TextoTraduzido;
  titulo: TextoTraduzido;
  grau: TextoTraduzido;
  duracao: TextoTraduzido;
  resumo: TextoTraduzido;
  objetivos: TextoTraduzido[];
  planoCurricular: AnoCurricular[];
  saidasProfissionais: TextoTraduzido[];
  proximaData?: TextoTraduzido;
}
