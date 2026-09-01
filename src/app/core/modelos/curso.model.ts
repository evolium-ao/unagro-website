import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface AnoCurricular {
  ano: number;
  titulo: TextoTraduzido;
  /** Tema do ano, anexado ao título no acordeão do plano curricular ("1º Ano: Fundamentos Científicos"). */
  tema?: TextoTraduzido;
  disciplinas: TextoTraduzido[];
}

/** Um objetivo do curso, apresentado num cartão próprio com ícone e categoria. */
export interface ObjetivoCurso {
  rotulo: TextoTraduzido;
  icone: string;
  texto: TextoTraduzido;
}

export interface Curso {
  id: string;
  tipo: 'grau' | 'curta-duracao';
  imagem: string;
  faculdade: TextoTraduzido;
  titulo: TextoTraduzido;
  grau: TextoTraduzido;
  duracao: TextoTraduzido;
  regime: TextoTraduzido;
  resumo: TextoTraduzido;
  objetivos: ObjetivoCurso[];
  planoCurricular: AnoCurricular[];
  saidasProfissionais: TextoTraduzido[];
  proximaData?: TextoTraduzido;
}
