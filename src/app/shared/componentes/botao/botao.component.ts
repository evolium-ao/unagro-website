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
  secundario: 'bg-accent text-white hover:opacity-90',
  contorno: 'border border-primary text-primary hover:bg-primary/5',
  branco: 'bg-white text-primary hover:bg-gray-50',
  glass: 'bg-white text-primary hover:bg-gray-50',
  suave: 'bg-primary/10 text-primary hover:bg-primary/15',
};

const CLASSES_TAMANHO: Record<TamanhoBotao, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const CLASSES_RAIO: Record<RaioBotao, string> = {
  completo: 'rounded-full',
  medio: 'rounded-lg',
};

const CLASSES_BASE =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';

@Component({
  selector: 'app-botao',
  imports: [RouterLink, IconeComponent, NgTemplateOutlet],
  host: { '[class.block]': 'larguraTotal()', '[class.w-full]': 'larguraTotal()' },
  template: `
    @if (link(); as destino) {
      <a [routerLink]="destino" [class]="classes()">
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
  readonly posicaoIcone = input<'esquerda' | 'direita'>('esquerda');
  readonly aCarregar = input(false);
  readonly desativado = input(false);
  readonly tipo = input<'button' | 'submit'>('button');
  readonly link = input<string>();
  readonly raio = input<RaioBotao>('completo');
  /** Faz o botão ocupar toda a largura disponível (o host passa a bloco). */
  readonly larguraTotal = input(false);

  readonly clicado = output<void>();

  protected readonly tamanhoIcone = computed(() => (this.tamanho() === 'lg' ? 20 : 16));
  protected readonly classes = computed(
    () =>
      `${CLASSES_BASE} ${CLASSES_VARIANTE[this.variante()]} ${CLASSES_TAMANHO[this.tamanho()]} ` +
      `${CLASSES_RAIO[this.raio()]}${this.larguraTotal() ? ' w-full' : ''}`,
  );
}
