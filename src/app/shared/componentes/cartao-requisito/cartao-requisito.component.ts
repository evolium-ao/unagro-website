import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * Cartão horizontal com ícone, título e descrição curta. Usado para listar
 * documentos exigidos na candidatura.
 */
@Component({
  selector: 'app-cartao-requisito',
  imports: [IconeComponent],
  template: `
    <div class="flex items-center gap-4 rounded-lg bg-white p-4 border border-gray-200">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-light text-primary"
      >
        <app-icone [nome]="icone()" [tamanho]="18" />
      </div>
      <div>
        <h3 class="text-sm font-semibold text-text-primary">{{ titulo() }}</h3>
        <p class="mt-0.5 text-xs text-text-secondary">{{ descricao() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoRequisitoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
}
