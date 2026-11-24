import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Alumni } from '../modelos/alumni.model';
import { AlumniService } from '../servicos/alumni.service';

/**
 * Chaves e consultas dos alumni. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 */
export const alumniQueries = {
  /** Prefixo de todas as chaves — invalida a lista e os detalhes de uma vez. */
  raiz: ['alumni'] as const,

  lista: (servico: AlumniService) =>
    queryOptions<Alumni[], ErroApi>({
      queryKey: [...alumniQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: AlumniService, id: number) =>
    queryOptions<Alumni, ErroApi>({
      queryKey: [...alumniQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
