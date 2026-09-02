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
        <article class="flex h-full flex-col rounded-xl bg-primary-dark p-6 sm:p-7">
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
          class="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-primary-dark p-5 sm:p-6"
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
            <app-botao variante="glass" tamanho="sm" [link]="cta.link">
              {{ traducao.getTraducao(cta.texto) }}
            </app-botao>
          }
        </article>
      }

      @default {
        <article
          class="flex h-full flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
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
