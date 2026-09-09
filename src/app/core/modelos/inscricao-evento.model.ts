/**
 * Pedido de inscrição num evento, na forma que o **site** preenche — os nomes dos
 * campos do formulário do `app-modal-inscricao-evento`. Quem a traduz para o
 * `InscricaoEventoRequest` da API é o `InscricoesService`.
 */
export interface NovaInscricaoEvento {
  /** `id` do evento escolhido no select; vira o `evento_id` (número) da API. */
  eventoId: string;
  nome: string;
  email: string;
  /** Opcional do lado da API; o formulário já o valida como obrigatório. */
  telefone: string;
}
