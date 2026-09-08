import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-investigador`: a mesma moldura branca de bordo
 * arredondado, a mesma fotografia de bordo a bordo em `aspect-[4/5]` (sem
 * margem entre ela e o cartão, recortada pelo `overflow-hidden`) e o mesmo
 * bloco de texto com `p-4` — nome, cargo e duas pílulas de especialidade —,
 * para a grelha não saltar quando os investigadores chegam da API.
 * `aria-hidden`, sem texto nem foco: é decoração.
 */
@Component({
  selector: 'app-cartao-investigador-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
      aria-hidden="true"
    >
      <!-- A fotografia do cartão real: mesma proporção, sem margem nenhuma. -->
      <div class="aspect-[4/5] w-full bg-gray-200"></div>

      <div class="flex flex-1 flex-col p-4">
        <!-- Nome (h3, text-base) -->
        <div class="h-5 w-3/4 rounded bg-gray-200"></div>
        <!-- Cargo (text-xs, mt-1) -->
        <div class="mt-2 h-3 w-full rounded bg-gray-200"></div>
        <div class="mt-1.5 h-3 w-2/3 rounded bg-gray-200"></div>
        <!-- Pílulas das especialidades (mt-4, selo pequeno) -->
        <div class="mt-4 flex flex-wrap gap-2">
          <div class="h-5 w-20 rounded-full bg-gray-200"></div>
          <div class="h-5 w-16 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoInvestigadorEsqueletoComponent {}
