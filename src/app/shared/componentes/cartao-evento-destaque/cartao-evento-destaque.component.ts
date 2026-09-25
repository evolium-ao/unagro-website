import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
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
    <article
      class="relative w-full overflow-hidden rounded-xl bg-primary-deep text-white border-l-6 border-secondary"
    >
      @if (imagemFundo(); as fundo) {
        <img
          [src]="fundo"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <!-- O verde tem de continuar legível por cima da fotografia: quase opaco à
             esquerda, onde assenta o texto, e mais aberto à direita. -->
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-gradient-to-r from-primary-deep via-primary-deep/95 to-primary-deep/70"
        ></div>
      }

      <div
        class="relative flex flex-col gap-8 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div>
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
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-primary-dark transition-colors duration-200 hover:bg-white/90"
            >
              {{ traducao.t('comum.saberMais') }}
              <app-icone nome="arrow-right" [tamanho]="16" />
            </a>
          } @else {
            <button
              type="button"
              class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-primary-dark transition-colors duration-200 hover:bg-white/90"
              (click)="detalhesSolicitados.emit()"
            >
              {{ traducao.t('comum.saberMais') }}
              <app-icone nome="arrow-right" [tamanho]="16" />
            </button>
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
  /**
   * Destino do botão "Saber mais". Sem destino, o botão emite
   * `detalhesSolicitados` e deixa a acção a quem usa o cartão — é assim que a
   * página inicial abre o modal de detalhes do evento.
   */
  readonly link = input<string>();

  /** Pedido dos detalhes do evento. Só emite quando não há `link`. */
  readonly detalhesSolicitados = output<void>();
  /**
   * Fotografia de fundo, escurecida pelo verde. Sem ela o cartão fica com o
   * `bg-primary-deep` sólido de sempre.
   */
  readonly imagemFundo = input<string>();

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
