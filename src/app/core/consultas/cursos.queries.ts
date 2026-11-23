import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Curso } from '../modelos/curso.model';
import { CursosService } from '../servicos/cursos.service';

/**
 * Chaves e consultas dos cursos de graduação. O serviço entra **por
 * argumento**: o adaptador não corre o `queryFn` em contexto de injecção, e um
 * `inject()` cá dentro rebentava com `NG0203` no primeiro fetch.
 */
export const cursosQueries = {
  /** Prefixo de todas as chaves de cursos — invalida a lista e os detalhes de uma vez. */
  raiz: ['cursos'] as const,

  lista: (servico: CursosService) =>
    queryOptions<Curso[], ErroApi>({
      queryKey: [...cursosQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: CursosService, id: number) =>
    queryOptions<Curso, ErroApi>({
      queryKey: [...cursosQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
