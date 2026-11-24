import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Faculdade } from '../modelos/faculdade.model';
import { FaculdadesService } from '../servicos/faculdades.service';

/**
 * Chaves e consultas das faculdades. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 *
 * Só há `lista` porque só há uma consumidora — a aba "Faculdades e
 * departamentos" de `/sobre`. Não existe página de detalhe de faculdade, logo
 * não se cria aqui um `porId` que ninguém chama.
 */
export const faculdadesQueries = {
  /** Prefixo de todas as chaves de faculdades. */
  raiz: ['faculdades'] as const,

  lista: (servico: FaculdadesService) =>
    queryOptions<Faculdade[], ErroApi>({
      queryKey: [...faculdadesQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),
};
