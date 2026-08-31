import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface ItemAba {
  id: string;
  rotulo: string;
}

/**
 * Barra de abas com sublinhado na aba ativa. O conteúdo de cada aba é da
 * responsabilidade de quem usa o componente — aqui só se controla a seleção.
 */
@Component({
  selector: 'app-abas',
  template: `
    <div class="flex gap-6 border-b border-gray-200" role="tablist">
      @for (aba of abas(); track aba.id) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="aba.id === ativa()"
          class="-mb-px cursor-pointer border-b-2 pb-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          [class]="
            aba.id === ativa()
              ? 'border-primary font-semibold text-primary'
              : 'border-transparent font-medium text-text-secondary hover:text-text-primary'
          "
          (click)="ativa.set(aba.id)"
        >
          {{ aba.rotulo }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbasComponent {
  readonly abas = input<ItemAba[]>([]);
  readonly ativa = model<string>('');
}
