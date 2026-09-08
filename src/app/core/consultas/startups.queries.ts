import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Startup } from '../modelos/startup.model';
import { StartupsService } from '../servicos/startups.service';

/**
 * Chaves e consultas das startups. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 */
export const startupsQueries = {
  /** Prefixo de todas as chaves — invalida a lista e os detalhes de uma vez. */
  raiz: ['startups'] as const,

  lista: (servico: StartupsService) =>
    queryOptions<Startup[], ErroApi>({
      queryKey: [...startupsQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: StartupsService, id: number) =>
    queryOptions<Startup, ErroApi>({
      queryKey: [...startupsQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
