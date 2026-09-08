/**
 * Mensagem de contacto enviada pelo formulário da página `/contactos`, na forma
 * que o **site** preenche. É o `ContatosService` que a traduz para o
 * `ContatoRequest` da API.
 */
export interface NovoContacto {
  nome: string;
  email: string;
  /** Um dos `id` do select "Assunto" (`geral`, `candidaturas`, `cursos`, `imprensa`). */
  assunto: string;
  mensagem: string;
}
