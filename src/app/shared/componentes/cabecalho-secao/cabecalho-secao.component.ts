import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Cabeçalho de secção reutilizável: 3 traços decorativos, título e descrição
 * centrados. Usado para introduzir secções da página de candidaturas.
 */
@Component({
  selector: 'app-cabecalho-secao',
  template: `
    <div class="mx-auto flex max-w-2xl flex-col items-center text-center">
      <div class="mb-4 flex items-center gap-1.5" aria-hidden="true">
        <span class="h-1 w-6 rounded-full bg-secondary"></span>
        <span class="h-1 w-6 rounded-full bg-secondary"></span>
        <span class="h-1 w-6 rounded-full bg-secondary"></span>
      </div>
      <h2 class="text-2xl font-bold text-text-primary sm:text-3xl">{{ titulo() }}</h2>
      @if (descricao()) {
        <p class="mt-3 text-text-secondary">{{ descricao() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoSecaoComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string | undefined>();
}
