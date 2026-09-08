import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { UnidadeInvestigacao } from '../modelos/investigacao.model';
import { LaboratoriosService } from '../servicos/laboratorios.service';

/**
 * Chaves e consultas dos laboratórios. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 *
 * Só há `lista` porque só há uma consumidora — a secção "Centros e Laboratórios"
 * de `desenvolvimento`. Não existe página de detalhe de laboratório, logo não se
 * cria aqui um `porId` que ninguém chama.
 */
export const laboratoriosQueries = {
  /** Prefixo de todas as chaves de laboratórios. */
  raiz: ['laboratorios'] as const,

  lista: (servico: LaboratoriosService) =>
    queryOptions<UnidadeInvestigacao[], ErroApi>({
      queryKey: [...laboratoriosQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),
};
