import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-unidade`: a mesma moldura alta e arredondada do
 * cartão real, com os blocos do selo, do nome e do botão no sítio onde eles
 * ficam, para a grelha não saltar quando os laboratórios chegam da API.
 * `aria-hidden`, sem texto nem foco — é decoração.
 */
@Component({
  selector: 'app-cartao-unidade-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full min-h-80 animate-pulse flex-col justify-end overflow-hidden rounded-xl bg-gray-200"
      aria-hidden="true"
    >
      <div class="flex flex-col items-start p-5">
        <div class="h-5 w-24 rounded-md bg-gray-300"></div>
        <div class="mt-3 h-5 w-4/5 rounded bg-gray-300"></div>
        <div class="mt-2 h-5 w-3/5 rounded bg-gray-300"></div>
        <div class="mt-4 h-10 w-full rounded-full bg-gray-300"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoUnidadeEsqueletoComponent {}
