/**
 * Mensagem de contacto enviada por `POST /contatos`, na forma que o **site**
 * preenche. É o `ContatosService` que a traduz para o `ContatoRequest` da API.
 * Usada pela página `/contactos`. O canal de dúvidas da candidatura geral tem o
 * seu próprio `POST /duvidas` — ver `NovaDuvida`.
 */
export interface NovoContacto {
  nome: string;
  email: string;
  /** Um dos `id` do select "Assunto": `geral`, `candidaturas`, `cursos`, `imprensa`. */
  assunto: string;
  mensagem: string;
}
