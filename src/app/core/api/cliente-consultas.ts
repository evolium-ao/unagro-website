import { InjectionToken } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

/**
 * O `QueryClient` da aplicação — a cache onde vivem os dados da API.
 *
 * **Porque é um `InjectionToken` e não um `new QueryClient()` no `app.config.ts`:**
 * o `appConfig` é um objecto de módulo, avaliado **uma vez** quando o ficheiro é
 * importado. Em SSR o mesmo processo Node serve todos os visitantes, por isso um
 * `new QueryClient()` escrito directamente no `provideTanStackQuery` seria uma
 * cache única partilhada por todos os pedidos — os dados de um visitante a
 * aparecerem na página do seguinte. Com um token, a fábrica corre uma vez por
 * injector, e o Angular cria um injector novo em cada pedido renderizado no
 * servidor: cada visitante fica com a sua cache.
 *
 * Os valores por omissão abaixo aplicam-se a todas as queries; qualquer um deles
 * pode ser sobreposto no `queryOptions` de um recurso concreto.
 */
export const CLIENTE_CONSULTAS = new InjectionToken<QueryClient>('CLIENTE_CONSULTAS', {
  factory: () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          /**
           * Cinco minutos até os dados serem considerados velhos. O conteúdo do
           * site (notícias, cursos, eventos) muda a um ritmo de dias, não de
           * segundos — não vale a pena refazer o pedido a cada navegação.
           */
          staleTime: 5 * 60 * 1000,
          /** Meia hora na cache depois de nenhum componente os usar. */
          gcTime: 30 * 60 * 1000,
          /** Uma segunda tentativa cobre a falha de rede passageira; mais do que isso só atrasa o erro. */
          retry: 1,
          /**
           * Site público, não painel de dados: voltar ao separador não é motivo
           * para refazer todos os pedidos.
           */
          refetchOnWindowFocus: false,
        },
      },
    }),
});
