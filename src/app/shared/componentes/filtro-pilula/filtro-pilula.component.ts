import { Component, computed, inject, input, model } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';

export interface OpcaoFiltroPilula {
  valor: string;
  rotulo: string;
}

/**
 * Filtro em formato de pílula (select nativo com aparência de botão arredondado).
 * Usado em barras de filtros de listagens, ex.: oferta académica.
 *
 * O valor `''` é "sem filtro". Com um filtro activo, a primeira opção passa a
 * dizer "Mostrar todos" (em vez do rótulo, que só serve de título) e o chevron
 * dá lugar a um X que limpa o filtro — voltar a todas as opções fica evidente.
 */
@Component({
  selector: 'app-filtro-pilula',
  imports: [IconeComponent],
  template: `
    <div class="relative inline-block">
      <select
        class="cursor-pointer appearance-none rounded-full border bg-white py-2 pl-4 pr-9 text-sm text-text-primary transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        [class.border-gray-300]="!ativo()"
        [class.border-primary]="ativo()"
        [attr.aria-label]="rotulo()"
        [value]="valor()"
        (change)="valor.set($any($event.target).value)"
      >
        <option value="">{{ ativo() ? textoTodos() : rotulo() }}</option>
        @for (opcao of opcoes(); track opcao.valor) {
          <option [value]="opcao.valor" [selected]="opcao.valor === valor()">{{ opcao.rotulo }}</option>
        }
      </select>

      @if (ativo()) {
        <button
          type="button"
          class="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-gray-100 hover:text-primary"
          [attr.aria-label]="textoLimpar()"
          (click)="valor.set('')"
        >
          <app-icone nome="x" [tamanho]="14" />
        </button>
      } @else {
        <app-icone
          nome="chevron-down"
          [tamanho]="14"
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      }
    </div>
  `,
})
export class FiltroPilulaComponent {
  private readonly traducao = inject(TraducaoService);

  readonly rotulo = input.required<string>();
  readonly opcoes = input<OpcaoFiltroPilula[]>([]);
  readonly valor = model<string>('');

  protected readonly ativo = computed(() => this.valor() !== '');

  protected readonly textoTodos = computed(() =>
    this.traducao.getTraducao(['Mostrar todos', 'Show all']),
  );

  protected readonly textoLimpar = computed(
    () => `${this.traducao.getTraducao(['Limpar filtro', 'Clear filter'])}: ${this.rotulo()}`,
  );
}
