import { queryOptions } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../api/erro-api';
import { Idioma } from '../traducao/idioma';
import { TraducaoAutomaticaService } from '../traducao/traducao-automatica.service';

export const traducaoQueries = {
  /** Prefixo de todas as chaves de tradução automática de conteúdo da API. */
  raiz: ['traducao-automatica'] as const,

  /**
   * `textos` deve vir de `camposParaTraduzir(itens, campos)` — a `queryKey`
   * inclui os próprios textos (não só o idioma) para a cache não devolver a
   * tradução de uma lista antiga quando o conteúdo da API muda mas o idioma
   * não. `staleTime`/`gcTime` em `Infinity`: uma tradução não fica
   * desactualizada sozinha, só quando o texto de origem muda — e nesse caso
   * é outra chave.
   */
  lista: (servico: TraducaoAutomaticaService, textos: readonly string[], idioma: Idioma) =>
    queryOptions<string[], ErroApi>({
      queryKey: [...traducaoQueries.raiz, idioma, ...textos],
      queryFn: ({ signal }) => servico.traduzirLista(textos, idioma, signal),
      enabled: idioma !== 'pt' && textos.length > 0,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
