import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Título de um bloco dentro de um cartão, fechado por uma linha fina. */
@Component({
  selector: 'app-titulo-bloco',
  host: { class: 'block' },
  template: `
    <h3 class="border-b border-gray-200 pb-4 text-xl font-bold text-primary-dark sm:text-2xl">
      {{ titulo() }}
    </h3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TituloBlocoComponent {
  readonly titulo = input.required<string>();
}
