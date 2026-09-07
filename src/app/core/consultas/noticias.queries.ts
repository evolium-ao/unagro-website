import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Noticia } from '../modelos/noticia.model';
import { NoticiasService } from '../servicos/noticias.service';

/**
 * Chaves e consultas das notícias. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 */
export const noticiasQueries = {
  /** Prefixo de todas as chaves — invalida a lista e os detalhes de uma vez. */
  raiz: ['noticias'] as const,

  lista: (servico: NoticiasService) =>
    queryOptions<Noticia[], ErroApi>({
      queryKey: [...noticiasQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: NoticiasService, id: number) =>
    queryOptions<Noticia, ErroApi>({
      queryKey: [...noticiasQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
