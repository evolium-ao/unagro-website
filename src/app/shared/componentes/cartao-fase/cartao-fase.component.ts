import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EstadoFase } from '../../../core/modelos/fase-candidatura.model';
import { SeloComponent, VarianteSelo } from '../selo/selo.component';

/** Linha "prazo → data" já traduzida. */
export interface PrazoExibido {
  rotulo: string;
  valor: string;
}

const VARIANTE_POR_ESTADO: Record<EstadoFase, VarianteSelo> = {
  'a-decorrer': 'segondary',
  brevemente: 'sobreEscuro',
  encerrada: 'sobreEscuro',
};

/**
 * Cartão de uma fase de candidaturas, desenhado para fundos verdes escuros:
 * título, selo de estado e lista de prazos separados por linhas subtis.
 */
@Component({
  selector: 'app-cartao-fase',
  imports: [SeloComponent],
  template: `
    <article class="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-7">
      <header class="flex items-center justify-between gap-4">
        <h3 class="text-lg font-semibold text-white">{{ titulo() }}</h3>
        <app-selo [variante]="varianteSelo()">{{ estadoRotulo() }}</app-selo>
      </header>

      <dl class="mt-5">
        @for (prazo of prazos(); track prazo.rotulo) {
          <div
            class="flex items-center justify-between gap-4 border-t border-white/10 py-3.5 text-sm"
          >
            <dt class="text-white/70">{{ prazo.rotulo }}</dt>
            <dd class="font-semibold text-white">{{ prazo.valor }}</dd>
          </div>
        }
      </dl>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoFaseComponent {
  readonly titulo = input.required<string>();
  readonly estado = input.required<EstadoFase>();
  readonly estadoRotulo = input.required<string>();
  readonly prazos = input<PrazoExibido[]>([]);

  protected readonly varianteSelo = computed(() => VARIANTE_POR_ESTADO[this.estado()]);
}
