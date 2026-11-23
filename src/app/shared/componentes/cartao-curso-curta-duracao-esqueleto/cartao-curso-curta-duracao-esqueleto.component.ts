import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-curso-curta-duracao`: mesma moldura e mesmo ritmo
 * vertical, com barras em pulsação no lugar da fotografia (e do selo sobre
 * ela), da carga horária, do título, do resumo e do rodapé com preço e botão.
 * Sem texto nem foco — é decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-curso-curta-duracao-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
      aria-hidden="true"
    >
      <div class="relative">
        <div class="aspect-video w-full animate-pulse bg-gray-200"></div>
        <div class="absolute right-3 top-3 h-5 w-28 animate-pulse rounded-full bg-gray-300"></div>
      </div>

      <div class="flex flex-1 flex-col p-5">
        <div class="h-3 w-20 animate-pulse rounded bg-gray-100"></div>

        <div class="mt-3 h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>

        <div class="mt-2 flex flex-col gap-2">
          <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
        </div>

        <div class="mt-auto flex items-center justify-between gap-3 pt-5">
          <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div class="h-9 w-24 animate-pulse rounded-lg bg-gray-100"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoCursoCurtaDuracaoEsqueletoComponent {}
