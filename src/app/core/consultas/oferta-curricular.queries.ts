import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { FaculdadeCandidaturaGeral } from '../modelos/candidatura-geral.model';
import { OfertaCurricularService } from '../servicos/oferta-curricular.service';

/** A oferta muda pouco durante uma candidatura: meia hora antes de voltar a pedir. */
const VALIDADE_OFERTA_MS = 30 * 60 * 1000;

/**
 * Faculdades → cursos → disciplinas da candidatura docente. O serviço entra
 * **por argumento**: o adaptador não corre o `queryFn` em contexto de injecção.
 */
export const ofertaCurricularQueries = {
  raiz: ['oferta-curricular'] as const,

  lista: (servico: OfertaCurricularService) =>
    queryOptions<FaculdadeCandidaturaGeral[], ErroApi>({
      queryKey: [...ofertaCurricularQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
      staleTime: VALIDADE_OFERTA_MS,
    }),
};
