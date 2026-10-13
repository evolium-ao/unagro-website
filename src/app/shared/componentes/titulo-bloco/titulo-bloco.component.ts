import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * Título de um bloco dentro de um cartão, fechado por uma linha fina.
 *
 * Com `icone` e/ou `descricao` (ambos opcionais) passa ao cabeçalho de secção do
 * formulário da candidatura docente: ícone à esquerda, título e descrição curta.
 * Sem eles o bloco fica exactamente como sempre foi. Nesse cabeçalho, o que vier
 * em `<ng-content>` fica à direita do título (no telemóvel, por baixo).
 */
@Component({
  selector: 'app-titulo-bloco',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    @if (icone() || descricao()) {
      <div class="flex items-start gap-3 border-b border-gray-200 pb-5">
        @if (icone(); as nomeIcone) {
          <app-icone [nome]="nomeIcone" [tamanho]="22" class="mt-1.5 shrink-0 text-primary" />
        }
        <div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-xl font-bold text-primary-dark sm:text-2xl">{{ titulo() }}</h3>
            @if (descricao(); as textoDescricao) {
              <p class="mt-1 text-sm text-text-secondary">{{ textoDescricao }}</p>
            }
          </div>
          <!-- Acções opcionais à direita (p. ex. «Adicionar»). -->
          <ng-content />
        </div>
      </div>
    } @else {
      <h3 class="border-b border-gray-200 pb-4 text-xl font-bold text-primary-dark sm:text-2xl">
        {{ titulo() }}
      </h3>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TituloBlocoComponent {
  readonly titulo = input.required<string>();
  readonly icone = input<string>();
  readonly descricao = input<string>();
}
