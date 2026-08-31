import { Component, computed, input } from '@angular/core';

export interface PatrocinadorExibido {
  id: string;
  nome: string;
  logoUrl?: string;
}

/** Segundos que cada item leva a atravessar a faixa — define a velocidade da rolagem. */
const SEGUNDOS_POR_ITEM = 4;

/** Máximo de colunas visíveis (ecrãs lg); ver `--colunas` nos estilos. */
const COLUNAS_MAX = 6;

@Component({
  selector: 'app-faixa-patrocinadores',
  template: `
    @if (patrocinadores().length) {
      <section class="flex h-[145px] items-center overflow-hidden bg-white">
        <div
          class="faixa-rolagem grid w-full grid-flow-col items-center"
          [style.--total]="patrocinadores().length"
          [style.animation-duration]="duracao()"
        >
          @for (patrocinador of itensEmCiclo(); track $index) {
            <div
              class="flex items-center justify-center px-6"
              [attr.aria-hidden]="$index >= patrocinadores().length ? 'true' : null"
            >
              @if (patrocinador.logoUrl) {
                <img
                  [src]="patrocinador.logoUrl"
                  [alt]="patrocinador.nome"
                  class="max-h-16 w-full max-w-[140px] object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              } @else {
                <div
                  class="flex h-16 w-full max-w-[140px] items-center justify-center rounded-md border border-dashed border-gray-300 px-3 text-center text-xs font-medium text-gray-400"
                >
                  {{ patrocinador.nome }}
                </div>
              }
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: `
    /* Colunas de largura fixa: são elas que garantem quantos logos ficam visíveis de cada vez. */
    .faixa-rolagem {
      --colunas: 3;
      grid-auto-columns: calc(100% / var(--colunas));
      animation-name: rolagem-faixa;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    @media (min-width: 768px) {
      .faixa-rolagem {
        --colunas: 4;
      }
    }

    @media (min-width: 1024px) {
      .faixa-rolagem {
        --colunas: 6;
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
export class FaixaPatrocinadoresComponent {
  readonly patrocinadores = input<PatrocinadorExibido[]>([]);

  /**
   * A série é repetida para que a rolagem volte ao início sem salto visível: a animação
   * desloca exatamente uma série, pelo que as restantes cópias têm de cobrir o ecrã todo.
   */
  protected readonly itensEmCiclo = computed(() => {
    const itens = this.patrocinadores();
    if (!itens.length) {
      return [];
    }
    const copias = Math.max(2, Math.ceil(1 + COLUNAS_MAX / itens.length));
    return Array.from({ length: copias }, () => itens).flat();
  });

  protected readonly duracao = computed(
    () => `${this.patrocinadores().length * SEGUNDOS_POR_ITEM}s`,
  );
}
