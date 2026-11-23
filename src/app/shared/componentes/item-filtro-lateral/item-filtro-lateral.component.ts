import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * Item de uma lista vertical de filtros, com ícone à esquerda. Activo fica em
 * verde escuro com texto branco; inactivo é transparente. Quem guarda o filtro
 * escolhido é a página — este componente só mostra o estado e avisa do clique.
 */
@Component({
  selector: 'app-item-filtro-lateral',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    <button
      type="button"
      [attr.aria-pressed]="ativo()"
      class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      [class]="classesEstado()"
      (click)="selecionado.emit()"
    >
      <app-icone [nome]="icone()" [tamanho]="16" />
      {{ rotulo() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFiltroLateralComponent {
  readonly rotulo = input.required<string>();
  readonly icone = input.required<string>();
  readonly ativo = input(false);

  readonly selecionado = output<void>();

  protected readonly classesEstado = computed(() =>
    this.ativo()
      ? 'bg-primary-deep font-semibold text-white'
      : 'font-medium text-text-secondary hover:bg-bg-light hover:text-text-primary',
  );
}
