import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-startup`: mesma moldura e mesmo ritmo vertical, com
 * barras em pulsação no lugar da fotografia, da categoria, do nome, da
 * descrição e da ligação "Saiba Mais". Sem texto nem foco — é decoração, por
 * isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-startup-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col rounded-lg border border-gray-200 bg-white"
      aria-hidden="true"
    >
      <div class="aspect-[16/10] w-full animate-pulse bg-gray-200"></div>

      <div class="flex flex-1 flex-col px-2 pb-2 pt-4 p-3">
        <div class="h-2.5 w-24 animate-pulse rounded bg-gray-100"></div>

        <div class="mt-3 h-5 w-3/5 animate-pulse rounded bg-gray-200"></div>

        <div class="mt-3 flex flex-col gap-2">
          <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-4/5 animate-pulse rounded bg-gray-100"></div>
        </div>

        <div class="mt-5 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoStartupEsqueletoComponent {}
