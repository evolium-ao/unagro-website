import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { AcordeaoComponent, VarianteAcordeao } from './acordeao.component';
import { IconeComponent } from '../icone/icone.component';

let contadorIds = 0;

interface EstiloItemAcordeao {
  caixa: string;
  botao: string;
  conteudo: string;
}

/** A cor do texto vive aqui (e não no template) para a variante escura a poder trocar. */
const ESTILOS: Record<VarianteAcordeao, EstiloItemAcordeao> = {
  lista: {
    caixa: '',
    botao: 'py-4 text-text-primary',
    conteudo: 'pb-4 text-text-secondary',
  },
  cartoes: {
    caixa: 'rounded-lg border border-gray-100 bg-white shadow-sm',
    botao: 'px-5 py-4 text-sm text-text-primary',
    conteudo: 'px-5 pb-4 text-sm leading-relaxed text-text-secondary',
  },
  cartoesEscuros: {
    caixa: 'rounded-lg bg-primary',
    botao: 'px-5 py-4 text-sm text-white',
    conteudo: 'px-5 pb-4 text-sm leading-relaxed text-white/75',
  },
};

@Component({
  selector: 'app-item-acordeao',
  imports: [IconeComponent],
  template: `
    <div [class]="classeCaixa()">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium"
        [class]="classeBotao()"
        [attr.aria-expanded]="aberto()"
        [attr.aria-controls]="idConteudo"
        (click)="alternar()"
      >
        <span>{{ titulo() }}</span>
        <app-icone
          nome="chevron-down"
          [tamanho]="20"
          class="shrink-0 transition-transform duration-300"
          [class.rotate-180]="aberto()"
        />
      </button>
      <div
        [id]="idConteudo"
        class="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out"
        [class]="aberto() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="min-h-0">
          <div [class]="classeConteudo()">
            <ng-content />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ItemAcordeaoComponent {
  readonly titulo = input.required<string>();
  /** Abre o item no primeiro render — útil para destacar a primeira pergunta. */
  readonly inicialmenteAberto = input(false);

  /** A variante vem do `app-acordeao` que envolve este item. */
  private readonly acordeao = inject(AcordeaoComponent, { optional: true });

  protected readonly aberto = linkedSignal(() => this.inicialmenteAberto());
  protected readonly idConteudo = `acordeao-conteudo-${++contadorIds}`;

  private readonly estilo = computed(() => ESTILOS[this.acordeao?.variante() ?? 'lista']);

  protected readonly classeCaixa = computed(() => this.estilo().caixa);
  protected readonly classeBotao = computed(() => this.estilo().botao);
  protected readonly classeConteudo = computed(() => this.estilo().conteudo);

  protected alternar(): void {
    this.aberto.update((valor) => !valor);
  }
}
