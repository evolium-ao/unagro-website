import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Projeto } from '../modelos/projeto.model';
import { ProjetosService } from '../servicos/projetos.service';
import { Idioma } from '../traducao/idioma';

/**
 * Chaves e consultas dos projectos. O serviço entra **por argumento**: o
 * adaptador não corre o `queryFn` em contexto de injecção, e um `inject()` cá
 * dentro rebentava com `NG0203` no primeiro fetch.
 *
 * **O `idioma` entra na `queryKey`.** O `ProjetosService` continua a resolver
 * do lado do serviço os campos que a API não dá (emprestados ao mock, que é
 * bilingue) — sem o idioma na chave, trocar de idioma não repetiria o pedido e
 * esses campos ficariam presos na língua da primeira visita.
 */
export const projetosQueries = {
  /** Prefixo de todas as chaves de projectos — invalida a lista e os detalhes de uma vez. */
  raiz: ['projetos'] as const,

  lista: (servico: ProjetosService, idioma: Idioma) =>
    queryOptions<Projeto[], ErroApi>({
      queryKey: [...projetosQueries.raiz, 'lista', idioma],
      queryFn: ({ signal }) => servico.listar(idioma, signal),
    }),

  porId: (servico: ProjetosService, id: number, idioma: Idioma) =>
    queryOptions<Projeto, ErroApi>({
      queryKey: [...projetosQueries.raiz, 'detalhe', id, idioma],
      queryFn: ({ signal }) => servico.obterPorId(id, idioma, signal),
    }),
};
