import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Treinamento } from '../modelos/treinamento.model';
import { TreinamentosService } from '../servicos/treinamentos.service';

/**
 * Chaves e consultas dos treinamentos (cursos de curta duração). O serviço
 * entra **por argumento**: o adaptador não corre o `queryFn` em contexto de
 * injecção, e um `inject()` cá dentro rebentava com `NG0203` no primeiro fetch.
 */
export const treinamentosQueries = {
  /** Prefixo de todas as chaves — invalida a lista (e os detalhes, se um dia existirem). */
  raiz: ['treinamentos'] as const,

  lista: (servico: TreinamentosService) =>
    queryOptions<Treinamento[], ErroApi>({
      queryKey: [...treinamentosQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),
};
