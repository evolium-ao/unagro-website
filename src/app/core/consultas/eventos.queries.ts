import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Evento } from '../modelos/evento.model';
import { EventosService } from '../servicos/eventos.service';

/**
 * Chaves e consultas dos eventos. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 */
export const eventosQueries = {
  /** Prefixo de todas as chaves — invalida a lista e os detalhes de uma vez. */
  raiz: ['eventos'] as const,

  lista: (servico: EventosService) =>
    queryOptions<Evento[], ErroApi>({
      queryKey: [...eventosQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: EventosService, id: number) =>
    queryOptions<Evento, ErroApi>({
      queryKey: [...eventosQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
