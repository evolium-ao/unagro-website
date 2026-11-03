import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { FuncaoCandidaturaGeral } from '../modelos/candidatura-geral.model';
import { FuncoesCandidaturaService } from '../servicos/funcoes-candidatura.service';

/** As funções mudam pouco durante uma candidatura: meia hora antes de voltar a pedir. */
const VALIDADE_FUNCOES_MS = 30 * 60 * 1000;

/**
 * Funções da candidatura administrativa. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção.
 */
export const funcoesCandidaturaQueries = {
  raiz: ['funcoes-candidatura'] as const,

  lista: (servico: FuncoesCandidaturaService) =>
    queryOptions<FuncaoCandidaturaGeral[], ErroApi>({
      queryKey: [...funcoesCandidaturaQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
      staleTime: VALIDADE_FUNCOES_MS,
    }),
};
