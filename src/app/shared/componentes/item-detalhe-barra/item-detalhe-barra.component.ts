import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * `escuro` = sobre painel verde escuro (barra e rótulo dourados, valor quase branco);
 * `claro` = sobre fundo claro (barra e rótulo verdes, valor em texto normal).
 */
export type TemaItemDetalheBarra = 'escuro' | 'claro';

const CLASSES_BARRA: Record<TemaItemDetalheBarra, string> = {
  escuro: 'border-secondary',
  claro: 'border-primary',
};

const CLASSES_ROTULO: Record<TemaItemDetalheBarra, string> = {
  escuro: 'text-secondary',
  claro: 'text-primary',
};

const CLASSES_VALOR: Record<TemaItemDetalheBarra, string> = {
  escuro: 'text-white/90',
  claro: 'text-text-primary',
};

/**
 * Bloco de detalhe com uma barra vertical fina à esquerda: rótulo curto em maiúsculas
 * pequenas **por cima** e o valor em texto normal por baixo (morada, coordenadas,
 * horário). Sem cartão, moldura nem sombra — assenta direito no painel da secção.
 *
 * Não é o `app-item-estatistica` `formato="barra"`: esse põe o **número em destaque
 * primeiro** e o rótulo por baixo, e a barra é verde. Também não é o
 * `app-item-informacao`, que tem emblema circular com ícone e não tem barra.
 */
@Component({
  selector: 'app-item-detalhe-barra',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-l-2 pl-4" [class]="classeBarra()">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em]" [class]="classeRotulo()">
        {{ rotulo() }}
      </p>
      <p class="mt-2 text-sm leading-relaxed sm:text-base" [class]="classeValor()">{{ valor() }}</p>
    </div>
  `,
})
export class ItemDetalheBarraComponent {
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string>();
  readonly tema = input<TemaItemDetalheBarra>('escuro');

  protected readonly classeBarra = computed(() => CLASSES_BARRA[this.tema()]);
  protected readonly classeRotulo = computed(() => CLASSES_ROTULO[this.tema()]);
  protected readonly classeValor = computed(() => CLASSES_VALOR[this.tema()]);
}
