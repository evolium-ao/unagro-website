import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoProximaData } from '../../../core/modelos/proxima-data.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';

/** Linha do calendário, com os textos já localizados por quem a usa. */
export interface ProximaDataCartao {
  id: string;
  /** Data em ISO (`'2026-05-15'`); o mês e o dia são formatados aqui. */
  data: string;
  categoria: string;
  titulo: string;
  detalhe: string;
  estado: EstadoProximaData;
  link?: string;
}

const CLASSES_BLOCO_DATA: Record<EstadoProximaData, string> = {
  confirmada: 'bg-primary-deep text-white',
  prevista: 'bg-gray-100 text-text-primary',
};

/**
 * Linha de uma lista **vertical** de datas de formação: bloco de data quadrado à
 * esquerda (mês em maiúsculas pequeno em cima, dia grande por baixo), categoria,
 * título e detalhe no meio, e um chevron encostado à direita. Cartão branco de
 * moldura fina, sem sombra — feito para assentar num fundo `bg-bg-lighter`. O
 * bloco de data é verde nas datas `confirmada` e cinzento claro nas `prevista`.
 *
 * Com `link` a linha inteira passa a ligação; sem ele fica estática.
 */
@Component({
  selector: 'app-cartao-proxima-data',
  imports: [IconeComponent, RouterLink, NgTemplateOutlet],
  host: { class: 'block' },
  template: `
    @if (link(); as destino) {
      <a
        [routerLink]="rotaBase()"
        [fragment]="fragmento()"
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/40 sm:gap-5 sm:p-5"
      >
        <ng-container [ngTemplateOutlet]="conteudo" />
      </a>
    } @else {
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:gap-5 sm:p-5">
        <ng-container [ngTemplateOutlet]="conteudo" />
      </div>
    }

    <ng-template #conteudo>
      <span
        class="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl"
        [class]="classesBlocoData()"
      >
        <span class="text-[10px] font-semibold uppercase tracking-wider">{{ mes() }}</span>
        <span class="text-xl font-bold leading-none">{{ dia() }}</span>
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          {{ dados().categoria }}
        </p>
        <h3 class="mt-1 text-base font-semibold leading-snug text-primary-deep">
          {{ dados().titulo }}
        </h3>
        <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ dados().detalhe }}</p>
      </div>

      <app-icone nome="chevron-right" [tamanho]="20" class="shrink-0 text-gray-400" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoProximaDataComponent {
  readonly dados = input.required<ProximaDataCartao>();

  private readonly traducao = inject(TraducaoService);

  protected readonly link = computed(() => this.dados().link);
  protected readonly rotaBase = computed(() => this.link()?.split('#')[0] ?? '');
  protected readonly fragmento = computed(() => {
    const destino = this.link();
    const indice = destino?.indexOf('#') ?? -1;
    return indice >= 0 ? destino!.slice(indice + 1) : undefined;
  });

  protected readonly classesBlocoData = computed(() => CLASSES_BLOCO_DATA[this.dados().estado]);

  /**
   * Uma data ISO sem hora é lida em UTC: acrescenta-se a meia-noite local para o
   * dia não recuar em fusos negativos.
   */
  private readonly dataLocal = computed(() => {
    const iso = this.dados().data;
    return new Date(iso.includes('T') ? iso : `${iso}T00:00:00`);
  });

  private readonly local = computed(() => (this.traducao.idioma() === 'pt' ? 'pt-PT' : 'en-GB'));

  protected readonly mes = computed(() =>
    this.dataLocal().toLocaleDateString(this.local(), { month: 'long' }).toUpperCase(),
  );
  protected readonly dia = computed(() => this.dataLocal().getDate().toString().padStart(2, '0'));
}
