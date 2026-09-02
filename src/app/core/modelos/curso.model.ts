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

/** Estado das inscrições de um curso de curta duração. */
export type EstadoInscricao = 'abertas' | 'proxima-turma';

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

  /*
   * Campos dos cursos de curta duração. São opcionais porque os cursos de grau
   * não os têm, e chegam crus como uma API os devolveria — a formatação
   * ("40 Horas", "Kz 80.250,00") é do cartão.
   */

  /** Número de horas do módulo (ex.: `40`). */
  cargaHoraria?: number;
  /** Valor da inscrição em kwanzas (ex.: `80250`). */
  preco?: number;
  estadoInscricao?: EstadoInscricao;
  /** Rótulo curto do mês da próxima turma, para o selo (ex.: `{ pt: 'Maio', en: 'May' }`). */
  proximaTurma?: TextoTraduzido;
}
