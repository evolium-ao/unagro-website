import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';

/** Startup com os textos já localizados por quem usa o cartão. */
export interface StartupCartao {
  id: string;
  categoria: string;
  nome: string;
  descricao: string;
  link: string;
  imagem_url?: string;
}

/**
 * Cartão de uma startup incubada: fotografia embutida no topo (com inset em
 * volta e cantos arredondados), etiqueta de categoria em maiúsculas miúdas, nome
 * em verde escuro, descrição curta e a ligação "Saiba Mais" com seta no fim.
 * Cartão branco de moldura `border-gray-200`, `rounded-lg`, **sem sombra** —
 * feito para assentar num fundo `bg-bg-lighter`.
 *
 * Sem `imagem_url` cai no marcador cinzento do `app-espaco-imagem`.
 */
@Component({
  selector: 'app-cartao-startup',
  imports: [EspacoImagemComponent, IconeComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    <article class="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
      <div class="overflow-hidden">
        @if (startup().imagem_url) {
          <img
            [src]="startup().imagem_url"
            [alt]="startup().nome"
            class="aspect-[16/10] w-full object-cover"
          />
        } @else {
          <!-- TODO: falta a fotografia definitiva desta startup. -->
          <app-espaco-imagem proporcao="video" [arredondado]="true" />
        }
      </div>

      <div class="flex flex-1 flex-col px-2 pb-2 pt-4 p-3">
        <p class="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {{ startup().categoria }}
        </p>
        <h3 class="mt-2 text-lg font-bold leading-snug text-primary-dark">{{ startup().nome }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ startup().descricao }}</p>

        <a
          [routerLink]="rotaBase()"
          [fragment]="fragmento()"
          class="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary hover:text-primary-dark"
        >
          {{ textoAcao() }}
          <app-icone nome="arrow-up-right" [tamanho]="14" />
        </a>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoStartupComponent {
  readonly startup = input.required<StartupCartao>();

  private readonly traducao = inject(TraducaoService);

  protected readonly textoAcao = computed(() =>
    this.traducao.getTraducao(['Saiba Mais', 'Learn More']),
  );

  protected readonly rotaBase = computed(() => this.startup().link.split('#')[0] || '.');
  protected readonly fragmento = computed(() => {
    const indice = this.startup().link.indexOf('#');
    return indice >= 0 ? this.startup().link.slice(indice + 1) : undefined;
  });
}
