/**
 * Um curso de curta duração, na forma que a sessão "Cursos de curta duração" de
 * `formacoes` mostra — espelha o `TreinamentoResource` da API, já mapeado
 * (ver `core/servicos/treinamentos.service.ts`).
 */
export interface Treinamento {
  id: string;
  titulo: string;
  resumo: string;
  /** Sem capa utilizável (ver `capaUtilizavel`), o cartão cai no espaço reservado. */
  imagem?: string;
  /** Número de horas do módulo, extraído do texto "48 horas" que a API devolve. */
  cargaHoraria?: number;
  /** Valor da inscrição em kwanzas. */
  preco?: number;

  /*
   * A API não tem um estado de inscrição nem uma "próxima turma" — só
   * `data_inicio`/`data_fim` (datas da edição registada, não uma promessa de
   * turma futura), que o site não mostra neste cartão. Os dois campos abaixo
   * ficam opcionais e, ausentes, o cartão assume "abertas" sem selo de
   * próxima turma — exactamente como já acontecia quando o mock não os tinha.
   */
  estadoInscricao?: 'abertas' | 'proxima-turma';
  proximaTurma?: string;
}
