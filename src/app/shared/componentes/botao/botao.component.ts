import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconeComponent } from '../icone/icone.component';

export type VarianteBotao = 'primario' | 'secundario' | 'contorno' | 'branco' | 'glass' | 'suave';
export type TamanhoBotao = 'sm' | 'md' | 'lg';
/** `completo` é a pílula usada em toda a navegação; `medio` serve cartões e formulários. */
export type RaioBotao = 'completo' | 'medio';

const CLASSES_VARIANTE: Record<VarianteBotao, string> = {
  primario: 'bg-primary text-white hover:bg-primary-hover',
  secundario: 'bg-accent text-primary hover:opacity-90',
  contorno: 'border border-primary text-primary hover:bg-primary/5',
  branco: 'bg-white text-primary hover:bg-gray-50',
  glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all',
  suave: 'bg-primary/10 text-primary hover:bg-primary/15',
};

/**
 * O `tamanho` define espaçamento e corpo de letra em conjunto, mas os dois lados
 * estão separados para os inputs `paddingX`/`paddingY` poderem substituir só o
 * espaçamento sem tocar no texto.
 */
const CLASSES_PADDING: Record<TamanhoBotao, { x: string; y: string }> = {
  sm: { x: 'px-3', y: 'py-1.5' },
  md: { x: 'px-6', y: 'py-2' },
  lg: { x: 'px-8', y: 'py-3' },
};

const CLASSES_TEXTO: Record<TamanhoBotao, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const CLASSES_RAIO: Record<RaioBotao, string> = {
  completo: 'rounded-full',
  medio: 'rounded-lg',
};
export type PosicaoIcone = 'esquerda' | 'direita'
const CLASSES_BASE =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';

@Component({
  selector: 'app-botao',
  imports: [RouterLink, IconeComponent, NgTemplateOutlet],
  host: { '[class.block]': 'larguraTotal()', '[class.w-full]': 'larguraTotal()' },
  template: `
    @if (link(); as destino) {
      <a [routerLink]="rotaBase()" [fragment]="fragmento()" [class]="classes()">
        <ng-container [ngTemplateOutlet]="conteudo" />
      </a>
    } @else {
      <button
        [type]="tipo()"
        [disabled]="desativado() || aCarregar()"
        [class]="classes()"
        (click)="clicado.emit()"
      >
        <ng-container [ngTemplateOutlet]="conteudo" />
      </button>
    }

    <ng-template #conteudo>
      @if (aCarregar()) {
        <app-icone nome="loader-circle" [tamanho]="tamanhoIcone()" class="animate-spin" />
      } @else if (icone() && posicaoIcone() === 'esquerda') {
        <app-icone [nome]="icone()!" [tamanho]="tamanhoIcone()" />
      }
      <ng-content />
      @if (!aCarregar() && icone() && posicaoIcone() === 'direita') {
        <app-icone [nome]="icone()!" [tamanho]="tamanhoIcone()" />
      }
    </ng-template>
  `,
})
export class BotaoComponent {
  readonly variante = input<VarianteBotao>('primario');
  readonly tamanho = input<TamanhoBotao>('md');
  readonly icone = input<string>();
  readonly posicaoIcone = input<PosicaoIcone | undefined>('esquerda');
  readonly aCarregar = input(false);
  readonly desativado = input(false);
  readonly tipo = input<'button' | 'submit'>('button');
  readonly link = input<string>();
  readonly raio = input<RaioBotao>('completo');
  /** Faz o botão ocupar toda a largura disponível (o host passa a bloco). */
  readonly larguraTotal = input(false);
  /**
   * Substituem o espaçamento que vem do `tamanho`. Recebem a classe inteira
   * (`paddingX="px-8"`), e não só o valor, para o Tailwind a encontrar ao
   * varrer o template — uma classe montada em código não é gerada.
   * Sem valor, o `tamanho` manda, como antes.
   */
  readonly paddingX = input<string>();
  readonly paddingY = input<string>();

  readonly clicado = output<void>();

  protected readonly tamanhoIcone = computed(() => (this.tamanho() === 'lg' ? 20 : 16));
  protected readonly rotaBase = computed(() => this.link()?.split('#')[0] ?? '');
  protected readonly fragmento = computed(() => {
    const destino = this.link();
    const indice = destino?.indexOf('#') ?? -1;
    return indice >= 0 ? destino!.slice(indice + 1) : undefined;
  });
  protected readonly classes = computed(() => {
    const padrao = CLASSES_PADDING[this.tamanho()];
    const espacamento = `${this.paddingX() ?? padrao.x} ${this.paddingY() ?? padrao.y}`;

    return (
      `${CLASSES_BASE} ${CLASSES_VARIANTE[this.variante()]} ` +
      `${espacamento} ${CLASSES_TEXTO[this.tamanho()]} ` +
      `${CLASSES_RAIO[this.raio()]}${this.larguraTotal() ? ' w-full' : ''}`
    );
  });
}
