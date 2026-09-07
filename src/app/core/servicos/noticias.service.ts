import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Noticia } from '../modelos/noticia.model';

/**
 * Espelha o `NoticiaResource` do OpenAPI — a forma crua, antes do mapeamento.
 *
 * O esquema declara `id` e `destaque` como `string`, mas a resposta real manda
 * `number` e `boolean`; os tipos aqui seguem a **resposta**, e o mapeamento
 * abaixo normaliza os dois casos.
 */
interface NoticiaApi {
  id: number;
  destaque: boolean;
  titulo: string;
  capa_url: string | null;
  data_publicacao: string;
  tipo_noticia: string;
  descricao: string | null;
  conteudo: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Um método por endpoint de `GET /noticias`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/noticias.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Noticia[]> {
    return this.api
      .get<NoticiaApi[]>('noticias', { signal })
      .then((linhas) => linhas.map(paraNoticia));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Noticia> {
    return this.api.get<NoticiaApi>(`noticias/${id}`, { signal }).then(paraNoticia);
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraNoticia(linha: NoticiaApi): Noticia {
  return {
    id: String(linha.id),
    categoria: linha.tipo_noticia,
    data: linha.data_publicacao,
    titulo: linha.titulo,
    resumo: linha.descricao ?? '',
    conteudo: linha.conteudo ?? undefined,
    imagem: capaUtilizavel(linha.capa_url),
    destaque: Boolean(linha.destaque),
  };
}

/**
 * A API devolve as capas com o host `localhost` (o `APP_URL` do Laravel ainda
 * não está corrigido — ver `.claude/README.md`), e esse URL não carrega em
 * navegador nenhum fora da máquina da API. Em vez de deixar a imagem partida no
 * cartão, descarta-se o URL e o cartão cai no espaço reservado cinzento.
 *
 * Assim que o `APP_URL` for corrigido, o URL deixa de apontar para `localhost` e
 * passa a ser usado sem ser preciso mexer aqui.
 */
function capaUtilizavel(url: string | null): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\/(localhost|127\.0\.0\.1)\b/i.test(url) ? undefined : url;
}
