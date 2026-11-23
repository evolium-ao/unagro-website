import { Component, computed, input } from '@angular/core';

export interface EstatisticaExibida {
  id: string;
  valor: string;
  rotulo: string;
}

/** Segundos que cada item leva a atravessar a faixa — define a velocidade da rolagem. */
const SEGUNDOS_POR_ITEM = 6;

/** Máximo de colunas visíveis (ecrãs lg); ver `--colunas` nos estilos. */
const COLUNAS_MAX = 4;

@Component({
  selector: 'app-faixa-estatisticas',
  template: `
    @if (estatisticas().length) {
      <section class="overflow-hidden bg-primary-deep text-white">
        <div
          class="faixa-rolagem grid w-full grid-flow-col py-6"
          [style.--total]="estatisticas().length"
          [style.animation-duration]="duracao()"
        >
          @for (estatistica of itensEmCiclo(); track $index) {
            <div
              class="flex items-center "
              [attr.aria-hidden]="$index >= estatisticas().length ? 'true' : null"
            >
              <div class="flex flex-1 items-center justify-center gap-3 px-4 inter-500 ">
                <span class="text-4xl font-bold leading-none lg:text-5xl">{{
                  estatistica.valor
                }}</span>
                <span class="max-w-[7.5rem] text-xs leading-snug text-white/90 lg:text-sm">
                  {{ estatistica.rotulo }}
                </span>
              </div>

              <!-- Folha decorativa que separa os itens -->
              <svg
                class="mr-4 h-3.5 w-3.5 shrink-0 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
                />
              </svg>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: `
    /* Colunas de largura fixa: são elas que garantem quantos itens ficam visíveis de cada vez. */
    .faixa-rolagem {
      --colunas: 2;
      grid-auto-columns: calc(100% / var(--colunas));
      animation-name: rolagem-faixa;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    @media (min-width: 768px) {
      .faixa-rolagem {
        --colunas: 3;
      }
    }

    @media (min-width: 1024px) {
      .faixa-rolagem {
        --colunas: 4;
      }
    }

    .faixa-rolagem:hover {
      animation-play-state: paused;
    }

    /* Desloca exatamente uma série completa de itens, ligando o fim ao início da cópia. */
    @keyframes rolagem-faixa {
      to {
        transform: translateX(calc(var(--total) * -100% / var(--colunas)));
      }
    }
  `,
})
export class FaixaEstatisticasComponent {
  readonly estatisticas = input<EstatisticaExibida[]>([]);

  /**
   * A série é repetida para que a rolagem volte ao início sem salto visível: a animação
   * desloca exatamente uma série, pelo que as restantes cópias têm de cobrir o ecrã todo.
   */
  protected readonly itensEmCiclo = computed(() => {
    const itens = this.estatisticas();
    if (!itens.length) {
      return [];
    }
    const copias = Math.max(2, Math.ceil(1 + COLUNAS_MAX / itens.length));
    return Array.from({ length: copias }, () => itens).flat();
  });

  protected readonly duracao = computed(() => `${this.estatisticas().length * SEGUNDOS_POR_ITEM}s`);
}
