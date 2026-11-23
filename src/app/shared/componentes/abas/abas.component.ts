import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

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

    <div [class]="classesLista()" role="tablist">
      @for (aba of abas(); track aba.id) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="aba.id === ativa()"
          class="-mb-px cursor-pointer border-b-2 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
          [class]="classesBotao(aba.id)"
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

  /**
   * Com muitas abas (ver `/sobre`) a fila não cabe em telemóvel: `rolavel` deixa-a
   * deslizar na horizontal e impede os rótulos de quebrarem a linha. Por omissão
   * `false` — a barra é exactamente a de sempre.
   */
  readonly rolavel = input(false);

  protected readonly classesLista = computed(
    () =>
      `flex gap-6 border-b border-gray-200${this.rolavel() ? ' overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''}`,
  );

  protected classesBotao(id: string): string {
    const estado =
      id === this.ativa()
        ? 'border-primary font-semibold text-primary'
        : 'border-transparent font-medium text-text-secondary hover:text-text-primary';

    return this.rolavel() ? `${estado} shrink-0 whitespace-nowrap` : estado;
  }
}
