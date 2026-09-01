import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * Cartão vertical de vantagem: ícone em destaque, título e descrição curta.
 * Usado na grelha "Por que a UNAGRO?" do recrutamento docente.
 */
@Component({
  selector: 'app-cartao-recurso',
  imports: [IconeComponent],
  host: { class: 'block h-full' },
  template: `
    <article class="flex h-full flex-col rounded-xl bg-white p-6  sm:p-7 border border-gray-200">
      <app-icone [nome]="icone()" [tamanho]="26" class="text-primary" />
      <h3 class="mt-5 text-lg font-bold text-primary-dark">{{ titulo() }}</h3>
      <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ descricao() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoRecursoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
}
