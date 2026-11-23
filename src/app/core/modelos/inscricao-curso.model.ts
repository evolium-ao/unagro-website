/**
 * Pedido de inscrição num curso, na forma que o **site** preenche — os nomes dos
 * campos do formulário do `app-modal-inscricao-curso`. Quem a traduz para o
 * `InscricaoRequest` da API é o `InscricoesService`.
 */
export interface NovaInscricaoCurso {
  /** `id` do curso escolhido no select; vira o `curso_id` (número) da API. */
  cursoId: string;
  nome: string;
  email: string;
  /** Opcional do lado da API; o formulário já o valida como obrigatório. */
  telefone: string;
}
