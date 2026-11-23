import { mergeApplicationConfig, ApplicationConfig, provideEnvironmentInitializer } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { notifyManager } from '@tanstack/angular-query-experimental';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * **Porque o servidor mexe no `notifyManager` do TanStack Query.**
 *
 * O query-core avisa os subscritores (e portanto actualiza os sinais do
 * `injectQuery`) através do `notifyManager`, que por omissão agenda esse aviso
 * num `setTimeout(cb, 0)` — um macrotask. No servidor isso perde uma corrida:
 * quando um `GET` termina, a tarefa pendente que o `HttpClient` tinha registado
 * é libertada no mesmo instante, e se não houver outro pedido em voo o Angular
 * dá a aplicação por estável e serializa o HTML **antes** de o `setTimeout`
 * correr — ou seja, com a query ainda em `isPending()`. É por isso que, numa
 * página com várias queries, só a última a responder saltava do prerender: as
 * outras foram avisadas enquanto ainda havia pedidos pendentes a segurar a
 * estabilidade.
 *
 * Passar o aviso para um microtask resolve-o sem estado nenhum por pedido (o
 * `notifyManager` é global ao processo, logo não pode guardar nada de um
 * visitante): o sinal é escrito antes de o Angular avaliar a estabilidade, a
 * vista fica suja, o agendador de detecção de mudanças registra a sua própria
 * tarefa pendente e o render espera pelo ciclo que põe os dados no HTML.
 *
 * Só no servidor: no navegador o `setTimeout` por omissão não incomoda ninguém
 * e agrupa melhor os avisos.
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideEnvironmentInitializer(() => {
      notifyManager.setScheduler((avisar) => queueMicrotask(avisar));
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
