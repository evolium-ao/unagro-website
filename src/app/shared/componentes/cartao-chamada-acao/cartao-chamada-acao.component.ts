import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Cartão de chamada à ação centrado, pensado para assentar sobre uma imagem de
 * fundo. As ações são projetadas com o atributo `acoes`; qualquer outro
 * conteúdo (por exemplo uma hiperligação secundária) fica por baixo.
 */
@Component({
  selector: 'app-cartao-chamada-acao',
  template: `
    <div class="mx-auto max-w-2xl rounded-2xl bg-white/95 p-8 text-center shadow-xl backdrop-blur-sm sm:p-10">
      <h2 class="text-xl font-bold text-primary sm:text-2xl">{{ titulo() }}</h2>
      @if (descricao()) {
        <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
          {{ descricao() }}
        </p>
      }
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <ng-content select="[acoes]" />
      </div>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoChamadaAcaoComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string | undefined>();
}
