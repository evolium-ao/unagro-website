import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-historia-alumni`: o mesmo retrato em pé (4/5,
 * cantos arredondados) com a faixa de vidro fosco encostada ao fundo, e o
 * testemunho por baixo — a mesma moldura e o mesmo ritmo vertical do cartão
 * real, para a grelha não saltar quando as histórias chegam da API.
 * `aria-hidden`, sem texto nem foco — é decoração.
 */
@Component({
  selector: 'app-cartao-historia-alumni-esqueleto',
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full flex-col" aria-hidden="true">
      <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10">
        <div
          class="absolute inset-x-3 bottom-3 rounded-xl border border-white/20 bg-white/20 px-4 py-3 shadow-lg"
        >
          <div class="h-4 w-2/3 animate-pulse rounded bg-white/30"></div>
          <div class="mt-2 h-3 w-1/2 animate-pulse rounded bg-white/30"></div>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-2">
        <div class="h-3 w-full animate-pulse rounded bg-white/15"></div>
        <div class="h-3 w-4/5 animate-pulse rounded bg-white/15"></div>
      </div>
    </div>
  `,
})
export class CartaoHistoriaAlumniEsqueletoComponent {}
