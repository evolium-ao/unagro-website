/**
 * Dúvida que um candidato deixa no canal de `candidatura-geral/inicio`, na forma
 * que o **site** preenche. É o `DuvidasService` que a envia ao `POST /duvidas`.
 */
export interface NovaDuvida {
  nome: string;
  email: string;
  /** Um dos `valor` de `GET /duvidas/assuntos`: `enquadramento`, `documentacao`, `submissao`, `prazos` ou `outro`. */
  assunto: string;
  pergunta: string;
}
