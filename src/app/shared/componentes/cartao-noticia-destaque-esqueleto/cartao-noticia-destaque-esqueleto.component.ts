import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-noticia-destaque`: mesma moldura, mesma altura
 * mínima e o mesmo bloco de texto encostado ao fundo, com barras em pulsação no
 * lugar da data, do título, do resumo e do botão. Sem texto nem foco — é
 * decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-noticia-destaque-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-lg bg-gray-200"
      aria-hidden="true"
    >
      <div class="absolute inset-0 animate-pulse bg-gray-300"></div>

      <div class="relative flex flex-col items-start p-6 sm:p-8">
        <div class="h-2.5 w-32 animate-pulse rounded bg-gray-200"></div>
        <div class="mt-4 h-6 w-4/5 animate-pulse rounded bg-gray-200"></div>
        <div class="mt-2 h-6 w-3/5 animate-pulse rounded bg-gray-200"></div>

        <div class="mt-5 flex w-full flex-col gap-2">
          <div class="h-3 w-full animate-pulse rounded bg-gray-200"></div>
          <div class="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div class="mt-6 h-9 w-28 animate-pulse rounded-md bg-gray-200"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaDestaqueEsqueletoComponent {}
