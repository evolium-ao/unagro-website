import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-evento-destaque`: a mesma moldura (`rounded-xl`,
 * `border-l-6`) e o mesmo par de colunas — bloco de texto à esquerda, painel
 * do contador à direita —, com barras em pulsação no lugar do selo, da data,
 * do título, da descrição e das unidades da contagem. Sem texto nem foco — é
 * decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-evento-destaque-esqueleto',
  host: { class: 'block' },
  template: `
    <div
      class="relative w-full overflow-hidden rounded-xl border-l-6 border-gray-300 bg-gray-200"
      aria-hidden="true"
    >
      <div
        class="flex flex-col gap-8 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
            <div class="h-3 w-28 animate-pulse rounded bg-gray-300"></div>
          </div>

          <div class="mt-6 h-6 w-4/5 max-w-xl animate-pulse rounded bg-gray-300"></div>
          <div class="mt-3 h-6 w-3/5 max-w-xl animate-pulse rounded bg-gray-300"></div>

          <div class="mt-4 flex flex-col gap-2">
            <div class="h-3 w-full max-w-md animate-pulse rounded bg-gray-300"></div>
            <div class="h-3 w-2/3 max-w-md animate-pulse rounded bg-gray-300"></div>
          </div>

          <div class="mt-6 h-11 w-40 animate-pulse rounded-full bg-gray-300"></div>
        </div>

        <div class="w-full shrink-0 rounded-xl bg-gray-300/60 px-8 py-7 lg:w-72">
          <div class="mx-auto h-2.5 w-24 animate-pulse rounded bg-gray-300"></div>
          <div class="mt-6 flex items-start justify-center gap-4">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div class="flex flex-col items-center gap-2">
                <div class="h-9 w-9 animate-pulse rounded bg-gray-300"></div>
                <div class="h-2 w-6 animate-pulse rounded bg-gray-300"></div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoEventoDestaqueEsqueletoComponent {}
