import { Component, model, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

export interface OpcaoFiltroPilula {
  valor: string;
  rotulo: string;
}

/**
 * Filtro em formato de pílula (select nativo com aparência de botão arredondado).
 * Usado em barras de filtros de listagens, ex.: oferta académica.
 */
@Component({
  selector: 'app-filtro-pilula',
  imports: [IconeComponent],
  template: `
    <div class="relative inline-block">
      <select
        class="cursor-pointer appearance-none rounded-full border border-gray-300 bg-white py-2 pl-4 pr-9 text-sm text-text-primary transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        [value]="valor()"
        (change)="valor.set($any($event.target).value)"
      >
        <option value="">{{ rotulo() }}</option>
        @for (opcao of opcoes(); track opcao.valor) {
          <option [value]="opcao.valor">{{ opcao.rotulo }}</option>
        }
      </select>
      <app-icone
        nome="chevron-down"
        [tamanho]="14"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
    </div>
  `,
})
export class FiltroPilulaComponent {
  readonly rotulo = input.required<string>();
  readonly opcoes = input<OpcaoFiltroPilula[]>([]);
  readonly valor = model<string>('');
}
