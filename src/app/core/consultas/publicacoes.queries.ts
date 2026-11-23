import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Publicacao } from '../modelos/publicacao.model';
import { PublicacoesService } from '../servicos/publicacoes.service';

/**
 * Chaves e consultas das publicações. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 *
 * Só há `lista` — a API não tem `GET /publicacoes/{id}` nem filtro por
 * projecto; quem precisa só das publicações de um projecto filtra a mesma
 * lista do lado do cliente (ver `ProjetosService`).
 */
export const publicacoesQueries = {
  /** Prefixo de todas as chaves de publicações. */
  raiz: ['publicacoes'] as const,

  lista: (servico: PublicacoesService) =>
    queryOptions<Publicacao[], ErroApi>({
      queryKey: [...publicacoesQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),
};
