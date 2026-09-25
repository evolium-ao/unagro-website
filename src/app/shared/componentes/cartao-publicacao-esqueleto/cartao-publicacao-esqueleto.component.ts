import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-publicacao`: a mesma linha horizontal com o
 * quadrado do ícone à esquerda, o bloco de texto (data, título, resumo) no
 * meio e o espaço das acções à direita, para a lista não saltar quando as
 * publicações chegam da API. `aria-hidden`, sem texto nem foco: é decoração.
 */
@Component({
  selector: 'app-cartao-publicacao-esqueleto',
  host: { class: 'block' },
  template: `
    <div
      class="flex animate-pulse flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
      aria-hidden="true"
    >
      <div class="h-10 w-10 shrink-0 rounded-lg bg-gray-200"></div>

      <div class="min-w-0 flex-1">
        <div class="h-3 w-20 rounded bg-gray-200"></div>
        <div class="mt-2 h-4 w-3/4 rounded bg-gray-200"></div>
        <div class="mt-2 h-3 w-full rounded bg-gray-200"></div>
      </div>

      <div class="flex shrink-0 gap-2">
        <div class="h-8 w-24 rounded-lg bg-gray-200"></div>
        <div class="h-8 w-20 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoPublicacaoEsqueletoComponent {}
