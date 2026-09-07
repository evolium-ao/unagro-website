import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ModoCartaoNoticiaResumo } from '../cartao-noticia-resumo/cartao-noticia-resumo.component';

/**
 * Espera de um `app-cartao-noticia-resumo`, com os dois modos do cartão: em
 * `vertical` a moldura branca com a imagem em cima a absorver a altura sobrante;
 * em `horizontal` a moldura clara com a miniatura à esquerda, das listas
 * laterais. O ritmo vertical é o do cartão real, para a grelha não saltar quando
 * as notícias chegam. `aria-hidden`, sem texto nem foco — é decoração.
 */
@Component({
  selector: 'app-cartao-noticia-resumo-esqueleto',
  host: { class: 'block h-full' },
  template: `
    @if (modo() === 'horizontal') {
      <div
        class="flex h-full gap-4 overflow-hidden rounded-lg border border-gray-200 bg-[#EBEFED] p-4"
        aria-hidden="true"
      >
        <div class="w-2/5 max-w-52 shrink-0 animate-pulse self-stretch rounded-lg bg-gray-200"></div>

        <div class="flex min-w-0 flex-1 flex-col justify-center">
          <div class="h-2 w-20 animate-pulse rounded bg-gray-300"></div>
          <div class="mt-2.5 h-3.5 w-full animate-pulse rounded bg-gray-300"></div>
          <div class="mt-1.5 h-3.5 w-3/5 animate-pulse rounded bg-gray-300"></div>
          <div class="mt-3 h-2.5 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    } @else {
      <div
        class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
        aria-hidden="true"
      >
        <div
          class="aspect-video w-full shrink-0 animate-pulse bg-gray-200 lg:aspect-auto lg:min-h-20 lg:flex-1"
        ></div>

        <div class="flex shrink-0 flex-col p-5">
          <div class="h-2.5 w-28 animate-pulse rounded bg-gray-100"></div>
          <div class="mt-3 h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-2 h-4 w-3/5 animate-pulse rounded bg-gray-200"></div>

          <div class="mt-4 flex flex-col gap-2">
            <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
            <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaResumoEsqueletoComponent {
  /** Acompanha o `modo` do cartão que substitui. Por omissão `vertical`, como sempre foi. */
  readonly modo = input<ModoCartaoNoticiaResumo>('vertical');
}
