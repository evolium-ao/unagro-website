import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Espera do cartão de faculdade de `app-sobre-faculdades-departamentos`:
 * mesma moldura e mesmo ritmo vertical, com barras em pulsação no lugar do
 * ícone, do nome, da contagem de cursos e da lista de cursos. Sem texto nem
 * foco — é decoração, por isso fica fora do leitor de ecrã.
 */
@Component({
  selector: 'app-cartao-faculdade-esqueleto',
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      aria-hidden="true"
    >
      <div class="flex items-start gap-4">
        <span class="h-13 w-13 shrink-0 animate-pulse rounded-xl bg-gray-200"></span>

        <div class="flex-1">
          <div class="h-4 w-3/5 animate-pulse rounded bg-gray-200"></div>
          <div class="mt-2 h-2.5 w-24 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5">
        <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
        <div class="h-3 w-5/6 animate-pulse rounded bg-gray-100"></div>
        <div class="h-3 w-4/6 animate-pulse rounded bg-gray-100"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoFaculdadeEsqueletoComponent {}
