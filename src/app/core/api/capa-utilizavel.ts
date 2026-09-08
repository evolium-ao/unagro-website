import { environment } from '../../../environments/environment';

/**
 * Raiz dos ficheiros do `storage` do Laravel: a `apiUrl` sem o `/api` do fim,
 * mais `/storage`. A API não expõe isto como campo nenhum — é sempre o mesmo
 * host da API, só que a servir o disco público em vez das rotas.
 */
const RAIZ_STORAGE = `${environment.apiUrl.replace(/\/api\/?$/, '')}/storage`;

/**
 * A API às vezes devolve as capas como caminho relativo ao `storage`
 * (`eventos/xxx.jpg`, sem host nem `/storage/`) e às vezes como URL absoluto —
 * e esse absoluto pode vir com o host `localhost` (quando o `APP_URL` do
 * Laravel não está corrigido — ver `.claude/README.md`), que não carrega em
 * navegador nenhum fora da máquina da API. Em vez de deixar a imagem partida
 * no cartão, um `localhost` é descartado e o cartão cai no espaço reservado
 * cinzento do `app-espaco-imagem`; um caminho relativo ganha o prefixo do
 * `storage` para virar um URL utilizável.
 *
 * Vive em `core/api/` e não dentro de um serviço porque o problema é da API, não
 * de um recurso: as notícias, os laboratórios e os eventos sofrem dele da
 * mesma maneira.
 */
export function capaUtilizavel(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) {
    return /^https?:\/\/(localhost|127\.0\.0\.1)\b/i.test(url) ? undefined : url;
  }
  return `${RAIZ_STORAGE}/${url.replace(/^\//, '')}`;
}
