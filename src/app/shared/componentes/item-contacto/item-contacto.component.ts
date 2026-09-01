import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** Canal de contacto: ícone, rótulo, valor em destaque e uma linha de apoio. */
@Component({
  selector: 'app-item-contacto',
  imports: [IconeComponent],
  template: `
    <div class="flex items-start gap-3">
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
      >
        <app-icone [nome]="icone()" [tamanho]="16" />
      </div>
      <div>
        <p class="text-sm font-semibold text-text-primary">{{ rotulo() }}</p>
        <p class="mt-0.5 text-sm text-text-primary">{{ valor() }}</p>
        <p class="mt-0.5 text-xs text-text-secondary">{{ detalhe() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemContactoComponent {
  readonly icone = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string>();
  readonly detalhe = input.required<string>();
}
