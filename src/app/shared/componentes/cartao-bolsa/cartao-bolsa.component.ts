import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Cartão simples de programa de apoio financeiro: nome e resumo. */
@Component({
  selector: 'app-cartao-bolsa',
  template: `
    <article class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 class="font-semibold text-text-primary">{{ nome() }}</h3>
      <p class="mt-1.5 text-xs leading-relaxed text-text-secondary">{{ descricao() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoBolsaComponent {
  readonly nome = input.required<string>();
  readonly descricao = input.required<string>();
}
