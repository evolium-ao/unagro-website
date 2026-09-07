import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CartaoVidroComponent } from '../cartao-vidro/cartao-vidro.component';

/**
 * Dados já localizados de uma história de antigo aluno. Interface própria para o
 * cartão não depender do modelo de domínio (`HistoriaAlumni`, que ainda traz o
 * curso e o ano de conclusão em `TextoTraduzido`).
 */
export interface HistoriaAlumniCartao {
  id: string;
  nome: string;
  cargoAtual: string;
  testemunho: string;
  foto?: string;
}

/**
 * Uma história de antigo aluno numa grelha sobre fundo escuro: retrato em pé
 * (4/5, cantos arredondados) com uma faixa de vidro fosco encostada ao fundo —
 * nome e cargo — e, **fora do cartão**, o testemunho em itálico. As duas partes
 * vivem no mesmo componente porque andam sempre juntas e formam a célula da
 * grelha; a página só monta a grelha.
 *
 * Sem `foto` fica um fundo neutro translúcido em vez do retrato — nunca um
 * caminho de imagem inventado.
 */
@Component({
  selector: 'app-cartao-historia-alumni',
  imports: [CartaoVidroComponent],
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="flex h-full flex-col">
      <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10">
        @if (historia().foto) {
          <img
            [src]="historia().foto"
            [alt]="historia().nome"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        }

        <app-cartao-vidro
          class="absolute inset-x-3 bottom-3"
          tamanho="compacto"
          [titulo]="historia().nome"
          [texto]="historia().cargoAtual" />
      </div>

      <figcaption class="mt-5 text-sm italic leading-relaxed text-white/70">
        “{{ historia().testemunho }}”
      </figcaption>
    </figure>
  `,
})
export class CartaoHistoriaAlumniComponent {
  readonly historia = input.required<HistoriaAlumniCartao>();
}
