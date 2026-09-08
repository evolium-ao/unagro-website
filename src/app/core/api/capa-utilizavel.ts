/**
 * A API devolve por vezes as capas com o host `localhost` (quando o `APP_URL` do
 * Laravel não está corrigido — ver `.claude/README.md`), e esse URL não carrega
 * em navegador nenhum fora da máquina da API. Em vez de deixar a imagem partida
 * no cartão, descarta-se o URL e o cartão cai no espaço reservado cinzento do
 * `app-espaco-imagem`.
 *
 * Assim que o `APP_URL` for corrigido, o URL deixa de apontar para `localhost` e
 * passa a ser usado sem ser preciso mexer aqui.
 *
 * Vive em `core/api/` e não dentro de um serviço porque o problema é da API, não
 * de um recurso: as notícias e os laboratórios sofrem dele da mesma maneira.
 */
export function capaUtilizavel(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\/(localhost|127\.0\.0\.1)\b/i.test(url) ? undefined : url;
}
