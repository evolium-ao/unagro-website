import { Component, computed, input } from '@angular/core';

/**
 * `lista` = itens separados por linhas (predefinição);
 * `cartoes` = cada item num cartão branco autónomo, com espaço entre eles;
 * `cartoesEscuros` = a mesma disposição sobre fundo verde escuro (plano curricular).
 */
export type VarianteAcordeao = 'lista' | 'cartoes' | 'cartoesEscuros';

const CLASSES_VARIANTE: Record<VarianteAcordeao, string> = {
  lista: 'divide-y divide-gray-200 border-y border-gray-200',
  cartoes: 'flex flex-col gap-3',
  cartoesEscuros: 'flex flex-col gap-3',
};

@Component({
  selector: 'app-acordeao',
  template: `
    <div [class]="classeVariante()">
      <ng-content />
    </div>
  `,
})
export class AcordeaoComponent {
  readonly variante = input<VarianteAcordeao>('lista');

  protected readonly classeVariante = computed(() => CLASSES_VARIANTE[this.variante()]);
}
