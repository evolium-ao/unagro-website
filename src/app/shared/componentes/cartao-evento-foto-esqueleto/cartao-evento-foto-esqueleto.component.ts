import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormatoCartaoEventoFoto } from '../cartao-evento-foto/cartao-evento-foto.component';

/**
 * Espera de um `app-cartao-evento-foto`, com os dois formatos do cartão: em
 * `destaque` a fotografia à esquerda e o texto à direita, ocupando as duas
 * colunas; em `vertical` a fotografia em cima e o texto por baixo. A mesma
 * moldura e o mesmo ritmo vertical do cartão real, para a grelha não saltar
 * quando os eventos chegam da API. `aria-hidden`, sem texto nem foco — é
 * decoração.
 */
@Component({
  selector: 'app-cartao-evento-foto-esqueleto',
  host: { class: 'block h-full' },
  template: `
    @if (formato() === 'destaque') {
      <div
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:flex-row"
        aria-hidden="true"
      >
        <div class="h-52 shrink-0 animate-pulse bg-gray-200 sm:h-auto sm:w-2/5"></div>

        <div class="flex flex-1 flex-col p-6">
          <div class="flex flex-wrap items-center gap-3">
            <div class="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
            <div class="h-3 w-24 animate-pulse rounded bg-gray-100"></div>
          </div>

          <div class="mt-4 h-5 w-4/5 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-2 h-5 w-3/5 animate-pulse rounded bg-gray-200"></div>

          <div class="mt-3 flex flex-col gap-2">
            <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
            <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
          </div>

          <div class="mt-auto flex items-center justify-between gap-3 pt-6">
            <div class="h-3 w-28 animate-pulse rounded bg-gray-100"></div>
            <div class="h-9 w-28 animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    } @else {
      <div
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
        aria-hidden="true"
      >
        <div class="aspect-video w-full shrink-0 animate-pulse bg-gray-200"></div>

        <div class="flex flex-1 flex-col p-5">
          <div class="flex items-center gap-x-4">
            <div class="h-3 w-20 animate-pulse rounded bg-gray-100"></div>
            <div class="h-3 w-16 animate-pulse rounded bg-gray-100"></div>
          </div>

          <div class="mt-3 h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-2 h-4 w-3/5 animate-pulse rounded bg-gray-200"></div>

          <div class="mt-4 flex flex-col gap-2">
            <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
            <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
          </div>

          <div class="mt-auto pt-5">
            <div class="h-10 w-full animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoEventoFotoEsqueletoComponent {
  /** Acompanha o `formato` do cartão que substitui. Por omissão `vertical`, como o cartão real. */
  readonly formato = input<FormatoCartaoEventoFoto>('vertical');
}
