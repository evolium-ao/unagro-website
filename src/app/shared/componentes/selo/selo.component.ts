import { Component, computed, input } from '@angular/core';

/** `pequeno` é a pílula miúda das especialidades dos cartões de investigador. */
export type TamanhoSelo = 'normal' | 'pequeno';

const CLASSES_TAMANHO: Record<TamanhoSelo, string> = {
  normal: 'px-2.5 py-2 text-xs',
  pequeno: 'px-2 py-1 text-[10px]',
};

export type VarianteSelo =
  | 'primario'
  | 'acento'
  | 'neutro'
  | 'segondary'
  | 'sobreEscuro'
  | 'sobreFoto'
  | 'sobreFotoEscuro';

const CLASSES_VARIANTE: Record<VarianteSelo, string> = {
  primario: 'bg-primary/10 text-primary',
  acento: 'bg-accent/20 text-[#8c6d43]',
  neutro: 'bg-gray-100 text-text-secondary',
  segondary: 'text-primary bg-secondary',
  /** Sólido, para o selo assentar sobre uma fotografia — ver cartão de evento com foto. */
  sobreFoto: 'bg-primary text-white',
  /** Cinzento escuro sólido, para estados neutros sobre fotografia — ver cursos de curta duração. */
  sobreFotoEscuro: 'bg-gray-700 text-white',
  /** Para fundos verdes escuros — ver secção do calendário académico. */
  sobreEscuro: 'bg-white/10 text-white/70',
};

@Component({
  selector: 'app-selo',
  template: `
    <span
      class="inline-flex items-center whitespace-nowrap rounded-full font-medium"
      [class]="classes()"
    >
      <ng-content />
    </span>
  `,
})
export class SeloComponent {
  readonly variante = input<VarianteSelo>('primario');
  readonly tamanho = input<TamanhoSelo>('normal');

  protected readonly classes = computed(
    () => `${CLASSES_VARIANTE[this.variante()]} ${CLASSES_TAMANHO[this.tamanho()]}`,
  );
}
