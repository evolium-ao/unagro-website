import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';

import { CLIENTE_CONSULTAS } from './core/api/cliente-consultas';
import { tokenInterceptor } from './core/api/token.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // `withFetch` usa a Fetch API em vez do XHR — é o que o Angular recomenda com SSR.
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    /**
     * A cache de transferência do `provideClientHydration` está ligada por
     * omissão: os GET feitos durante o render no servidor viajam no HTML e o
     * navegador serve-se deles, em vez de repetir o pedido logo na hidratação.
     */
    provideClientHydration(withEventReplay()),
    /**
     * `withDevtools()` só carrega o painel no navegador e em modo de
     * desenvolvimento. Vem do sub-caminho `/devtools`, que em build de produção
     * resolve para um `stub` vazio (condição `development` do `exports`) — por
     * isso não entra no bundle de produção nem no do servidor.
     */
    provideTanStackQuery(CLIENTE_CONSULTAS, withDevtools()),
  ],
};
