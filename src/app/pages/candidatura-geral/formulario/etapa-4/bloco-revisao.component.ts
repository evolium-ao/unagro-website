import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';

/**
 * Cartão de uma secção da revisão: ícone, título e descrição à esquerda, botão
 * "Editar" à direita (leva à etapa onde os dados foram preenchidos) e o
 * conteúdo projectado por baixo da linha.
 */
@Component({
  selector: 'app-etapa-4-bloco-revisao',
  imports: [RouterLink, IconeComponent],
  host: { class: 'block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8' },
  template: `
    <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
      <div class="flex items-start gap-3">
        <app-icone [nome]="icone()" [tamanho]="22" class="mt-1.5 shrink-0 text-primary" />
        <div>
          <h3 class="text-xl font-bold text-primary-dark sm:text-2xl">{{ titulo() }}</h3>
          <p class="mt-1 text-sm text-text-secondary">{{ descricao() }}</p>
        </div>
      </div>
      <a
        [routerLink]="rotaEditar()"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-1.5 text-sm font-medium text-primary-deep transition-colors hover:border-primary hover:text-primary"
      >
        <app-icone nome="pencil" [tamanho]="14" />
        {{ textoEditar() }}
      </a>
    </div>

    <div class="mt-6">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocoRevisaoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input<string>('');
  readonly rotaEditar = input.required<string[]>();
  readonly textoEditar = input.required<string>();
}
