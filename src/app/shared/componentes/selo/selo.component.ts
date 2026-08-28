import { Component, computed, input } from '@angular/core';

export type VarianteSelo = 'primario' | 'acento' | 'neutro';

const CLASSES_VARIANTE: Record<VarianteSelo, string> = {
  primario: 'bg-primary/10 text-primary',
  acento: 'bg-accent/20 text-[#8c6d43]',
  neutro: 'bg-gray-100 text-text-secondary',
};

@Component({
  selector: 'app-selo',
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      [class]="classeVariante()"
    >
      <ng-content />
    </span>
  `,
})
export class SeloComponent {
  readonly variante = input<VarianteSelo>('primario');

  protected readonly classeVariante = computed(() => CLASSES_VARIANTE[this.variante()]);
}
