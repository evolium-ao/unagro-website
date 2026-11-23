import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-projecto`: mesma moldura e mesmo ritmo vertical, com
 * barras em pulsação no lugar da fotografia, do título, da descrição e do
 * resultado. Sem texto nem foco — é decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-projecto-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
      aria-hidden="true"
    >
      <div class="aspect-video w-full animate-pulse rounded-lg bg-gray-200"></div>

      <div class="flex flex-1 flex-col px-2 pt-5">
        <div class="h-5 w-4/5 animate-pulse rounded bg-gray-200"></div>

        <div class="mt-4 flex flex-col gap-2">
          <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
        </div>

        <div class="mt-auto flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
          <div class="flex-1">
            <div class="h-2.5 w-24 animate-pulse rounded bg-gray-100"></div>
            <div class="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div class="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-gray-100"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoProjectoEsqueletoComponent {}
