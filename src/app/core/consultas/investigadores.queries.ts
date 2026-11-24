import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Investigador } from '../modelos/investigacao.model';
import { InvestigadoresService } from '../servicos/investigadores.service';

/**
 * Chaves e consultas dos investigadores. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 *
 * Só há `lista` porque só há uma consumidora — a secção "Investigadores
 * Principais" de `desenvolvimento`. Não existe página de detalhe de
 * investigador, logo não se cria aqui um `porId` que ninguém chama.
 */
export const investigadoresQueries = {
  /** Prefixo de todas as chaves de investigadores. */
  raiz: ['investigadores'] as const,

  lista: (servico: InvestigadoresService) =>
    queryOptions<Investigador[], ErroApi>({
      queryKey: [...investigadoresQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),
};
