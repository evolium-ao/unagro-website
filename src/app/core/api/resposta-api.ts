/**
 * Envelope que a API da Unagro põe à volta de **toda** a resposta bem-sucedida.
 * O que interessa ao site está sempre em `data`; o `message` é texto para
 * humanos, em português, e não se mostra na interface.
 *
 * ```json
 * { "status": true, "message": "Lista de Notícia carregada com sucesso.", "data": [ … ] }
 * ```
 *
 * É o `ApiService` que desembrulha isto — os serviços de recurso e os
 * componentes nunca vêem o envelope.
 */
export interface RespostaApi<T> {
  status: boolean;
  message: string;
  data: T;
}
