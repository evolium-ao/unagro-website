import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LinhaInvestigacao } from '../../../core/modelos/investigacao.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';

/**
 * Cartão de uma linha de investigação, nos três formatos que a grelha usa:
 * `destaque` (escuro e grande, com pílulas de contexto), `simples` (claro, com o
 * conteúdo centrado) e `faixa` (barra escura a toda a largura, com botão `glass`).
 */
@Component({
  selector: 'app-cartao-linha-investigacao',
  imports: [IconeComponent, BotaoComponent],
  host: { class: 'block h-full' },
  template: `
    @switch (linha().formato) {
      @case ('destaque') {
        <article class="relative flex h-full flex-col rounded-xl bg-primary-deep p-6 sm:p-7">
          <div class="absolute bottom-0 right-0">
                      <svg width="111" height="120" viewBox="0 0 111 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 200V157C20.5 148.333 13.125 138.208 7.875 126.625C2.625 115.042 0 102.833 0 90C0 65 8.75 43.75 26.25 26.25C43.75 8.75 65 0 90 0C110.833 0 129.292 6.125 145.375 18.375C161.458 30.625 171.917 46.5833 176.75 66.25L189.75 117.5C190.583 120.667 190 123.542 188 126.125C186 128.708 183.333 130 180 130H160V160C160 165.5 158.042 170.208 154.125 174.125C150.208 178.042 145.5 180 140 180H120V200H100V160H140V110H167L157.5 71.25C153.667 56.0833 145.5 43.75 133 34.25C120.5 24.75 106.167 20 90 20C70.6667 20 54.1667 26.75 40.5 40.25C26.8333 53.75 20 70.1667 20 89.5C20 99.5 22.0417 109 26.125 118C30.2083 127 36 135 43.5 142L50 148V200H30ZM80 130H100L101.5 117.5C102.833 117 104.042 116.417 105.125 115.75C106.208 115.083 107.167 114.333 108 113.5L119.5 118.5L129.5 101.5L119.5 94C119.833 92.6667 120 91.3333 120 90C120 88.6667 119.833 87.3333 119.5 86L129.5 78.5L119.5 61.5L108 66.5C107.167 65.6667 106.208 64.9167 105.125 64.25C104.042 63.5833 102.833 63 101.5 62.5L100 50H80L78.5 62.5C77.1667 63 75.9583 63.5833 74.875 64.25C73.7917 64.9167 72.8333 65.6667 72 66.5L60.5 61.5L50.5 78.5L60.5 86C60.1667 87.3333 60 88.6667 60 90C60 91.3333 60.1667 92.6667 60.5 94L50.5 101.5L60.5 118.5L72 113.5C72.8333 114.333 73.7917 115.083 74.875 115.75C75.9583 116.417 77.1667 117 78.5 117.5L80 130ZM90 105C85.8333 105 82.2917 103.542 79.375 100.625C76.4583 97.7083 75 94.1667 75 90C75 85.8333 76.4583 82.2917 79.375 79.375C82.2917 76.4583 85.8333 75 90 75C94.1667 75 97.7083 76.4583 100.625 79.375C103.542 82.2917 105 85.8333 105 90C105 94.1667 103.542 97.7083 100.625 100.625C97.7083 103.542 94.1667 105 90 105Z" fill="#BE986E22"/>
          </svg>

          </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-secondary"
          >
            <app-icone [nome]="linha().icone" [tamanho]="20" />
          </div>

          <h3 class="mt-6 text-xl font-bold text-white sm:text-2xl">{{ titulo() }}</h3>
          <p class="mt-3 max-w-sm text-xs leading-relaxed text-white/60">{{ descricao() }}</p>

          @if (metricas().length) {
            <div class="mt-auto flex flex-wrap gap-2 pt-8">
              @for (metrica of metricas(); track metrica) {
                <span
                  class="rounded-md bg-white/10 px-2.5 py-1.5 text-[10px] font-medium text-white/80"
                >
                  {{ metrica }}
                </span>
              }
            </div>
          }
        </article>
      }

      @case ('faixa') {
        <article
          class="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-primary-deep p-5 sm:p-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-secondary"
            >
              <app-icone [nome]="linha().icone" [tamanho]="20" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">{{ titulo() }}</h3>
              <p class="mt-1 max-w-xl text-xs leading-relaxed text-white/60">{{ descricao() }}</p>
            </div>
          </div>

          @if (linha().cta; as cta) {
            <app-botao variante="contorno" tamanho="sm" [link]="cta.link">
              {{ traducao.getTraducao(cta.texto) }}
            </app-botao>
          }
        </article>
      }

      @default {
        <article
          class="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center "
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-light text-primary">
            <app-icone [nome]="linha().icone" [tamanho]="20" />
          </div>

          <h3 class="mt-5 text-base font-semibold leading-snug text-text-primary">{{ titulo() }}</h3>
          <p class="mt-2 text-xs leading-relaxed text-text-secondary">{{ descricao() }}</p>
        </article>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoLinhaInvestigacaoComponent {
  readonly linha = input.required<LinhaInvestigacao>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly titulo = computed(() => this.traducao.getTraducao(this.linha().titulo));
  protected readonly descricao = computed(() => this.traducao.getTraducao(this.linha().descricao));
  protected readonly metricas = computed(() =>
    (this.linha().metricas ?? []).map((metrica) => this.traducao.getTraducao(metrica)),
  );
}
