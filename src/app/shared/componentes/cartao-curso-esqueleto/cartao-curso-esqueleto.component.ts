import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera de um `app-cartao-curso` (variante `academica`, a única usada com
 * dados assíncronos — a secção "Oferta Académica" de `/candidaturas`): mesma
 * moldura sem padding à volta da fotografia, e barras em pulsação no lugar do
 * selo do grau, do título, da duração/regime e do botão. Sem texto nem foco —
 * é decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-curso-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      aria-hidden="true"
    >
      <div class="aspect-video w-full animate-pulse bg-gray-200"></div>

      <div class="flex flex-1 flex-col items-start gap-2 p-4">
        <div class="h-5 w-24 animate-pulse rounded-full bg-gray-200"></div>
        <div class="mt-1 h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
        <div class="mt-1 flex items-center gap-4">
          <div class="h-3 w-16 animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-20 animate-pulse rounded bg-gray-100"></div>
        </div>
        <div class="mt-4 h-9 w-full animate-pulse rounded-lg bg-gray-100"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoCursoEsqueletoComponent {}
