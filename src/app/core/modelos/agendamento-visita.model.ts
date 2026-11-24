/**
 * Pedido de visita a um centro ou laboratório, na forma que o **site** preenche
 * — os nomes dos campos do formulário do `app-modal-agendar-visita`. Quem o
 * traduz para o `AgendamentoVisitaRequest` da API é o `AgendamentoVisitasService`.
 */
export interface NovoAgendamentoVisita {
  /** `id` da unidade escolhida; vira o `laboratorio_id` da API. */
  unidade_id: string;
  nome: string;
  /** Instituição ou organização de quem pede; opcional do lado da API. */
  instituicao: string;
  email: string;
  telefone: string;
  /** Data preferencial em ISO (`AAAA-MM-DD`), como o `input[type=date]` a dá. */
  data: string;
  /** Hora preferencial em `HH:MM`. */
  hora: string;
  motivo: string;
  participantes: number;
}
