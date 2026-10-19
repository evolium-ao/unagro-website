import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * Cartão de aviso ao candidato: ícone, selo em maiúsculas, título a negrito e um
 * texto de apoio. Usado onde se precisa de chamar a atenção para uma regra do
 * concurso — a escolha da disciplina na página inicial e a Agregação Pedagógica
 * da etapa 3 são o mesmo cartão, por isso ficou aqui em vez de repetido.
 */
@Component({
  selector: 'app-cartao-aviso',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    <div class="flex items-start gap-3 rounded-2xl border-2 border-gray-300 bg-white p-4 sm:gap-4 sm:p-6">
      <span
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-primary-deep"
        aria-hidden="true"
      >
        <app-icone [nome]="icone()" [tamanho]="20" />
      </span>
      <div>
        <span
          class="inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-primary"
        >
          {{ selo() }}
        </span>
        <p class="mt-1.5 font-bold text-text-primary">{{ titulo() }}</p>
        <p class="mt-1 text-sm text-text-secondary">{{ descricao() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoAvisoComponent {
  readonly icone = input.required<string>();
  /** Selo em maiúsculas, ex.: "Atenção ao candidato". */
  readonly selo = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
}
