import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * `escuro` = sobre fundo verde (valor dourado, rótulo dourado esbatido);
 * `claro` = sobre fundo claro (valor verde escuro, rótulo cinzento).
 */
export type TemaItemEstatistica = 'escuro' | 'claro';

const CLASSES_VALOR: Record<TemaItemEstatistica, string> = {
  escuro: 'text-secondary',
  claro: 'text-primary-dark',
};

const CLASSES_ROTULO: Record<TemaItemEstatistica, string> = {
  escuro: 'text-secondary/75',
  claro: 'text-text-secondary',
};

/**
 * Número em destaque com o rótulo em maiúsculas por baixo, para grelhas de
 * indicadores. Ao contrário da `app-faixa-estatisticas`, fica parado — é para
 * blocos de estatísticas dentro de uma secção, não para a faixa rolante.
 */
@Component({
  selector: 'app-item-estatistica',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="text-3xl font-bold leading-none sm:text-4xl" [class]="classeValor()">{{ valor() }}</p>
    <p
      class="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-wide"
      [class]="classeRotulo()"
    >
      {{ rotulo() }}
    </p>
  `,
})
export class ItemEstatisticaComponent {
  readonly valor = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly tema = input<TemaItemEstatistica>('escuro');

  protected readonly classeValor = computed(() => CLASSES_VALOR[this.tema()]);
  protected readonly classeRotulo = computed(() => CLASSES_ROTULO[this.tema()]);
}
