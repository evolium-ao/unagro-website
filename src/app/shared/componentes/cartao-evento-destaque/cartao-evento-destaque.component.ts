import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatarIntervaloDatas } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import {
  ContadorRegressivoComponent,
  RotulosContadorRegressivo,
} from '../contador-regressivo/contador-regressivo.component';
import { IconeComponent } from '../icone/icone.component';

export interface EventoDestaqueCartao {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string;
}

/**
 * Faixa do evento em destaque: bloco de texto à esquerda e contagem decrescente
 * à direita, que passa para baixo do texto em ecrãs estreitos.
 */
@Component({
  selector: 'app-cartao-evento-destaque',
  imports: [IconeComponent, ContadorRegressivoComponent, RouterLink],
  host: { class: 'block' },
  template: `
    <article class="overflow-hidden rounded-xl bg-primary-deep text-white border-l-6 border-secondary">
      <div
        class="flex flex-col gap-8 p-10 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div class="max-w-xl">
          <div class="flex flex-wrap items-center gap-2.5">
            <span
              class="rounded bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-dark"
            >
              {{ traducao.t('comum.emDestaque') }}
            </span>
            <span
              class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80"
            >
              <app-icone nome="calendar" [tamanho]="13" />
              {{ intervaloDatas() }}
            </span>
          </div>

          <h3 class="mt-6 text-xl font-medium leading-tight lg:text-2xl max-w-xl">{{ evento().titulo }}</h3>
          <p class="mt-4 text-xs leading-normal text-white/70">{{ evento().descricao }}</p>

          @if (link(); as destino) {
            <a
              [routerLink]="destino"
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-dark transition-colors duration-200 hover:bg-white/90"
            >
              {{ traducao.t('comum.saberMais') }}
              <app-icone nome="arrow-right" [tamanho]="14" />
            </a>
          }
        </div>

        <app-contador-regressivo
          class="lg:shrink-0"
          variante="painel"
          [mostrarSegundos]="false"
          [dataAlvo]="evento().dataInicio"
          [rotulos]="rotulosContador()"
          [titulo]="traducao.t('comum.eventoComecaEm')"
        />
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoEventoDestaqueComponent {
  readonly evento = input.required<EventoDestaqueCartao>();
  /** Destino do botão "Saber mais"; sem destino, o botão não é apresentado. */
  readonly link = input<string>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly intervaloDatas = computed(() =>
    formatarIntervaloDatas(this.evento().dataInicio, this.evento().dataFim, this.traducao.idioma()),
  );

  protected readonly rotulosContador = computed<RotulosContadorRegressivo>(() => ({
    dias: this.traducao.t('paginas.eventos.contadorDias'),
    horas: this.traducao.t('paginas.eventos.contadorHoras'),
    minutos: this.traducao.t('paginas.eventos.contadorMinutos'),
    segundos: this.traducao.t('paginas.eventos.contadorSegundos'),
  }));
}
