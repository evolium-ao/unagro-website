import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

/** Margem de erro dos extremos: os navegadores arredondam o `scrollLeft`. */
const TOLERANCIA_FIM_PX = 8;

/** Recurso para o passo quando a tira ainda não tem filhos medíveis. */
const FRACCAO_ECRA = 0.85;

/**
 * Estado de uma tira que rola na horizontal: diz se ainda há conteúdo para cada
 * lado e sabe avançar e recuar um cartão.
 *
 * Põe-se no elemento com `overflow-x-auto` e lê-se de fora — tipicamente pelos
 * dois botões de seta no canto superior direito da secção, que ficam noutro
 * ponto do template e por isso não podem viver dentro dela:
 *
 * ```html
 * <button [disabled]="!tira()?.podeRecuar()" (click)="tira()?.rolar(-1)">…</button>
 * <div appTiraHorizontal class="flex snap-x snap-mandatory gap-6 overflow-x-auto">…</div>
 * ```
 *
 * O passo é a largura do primeiro cartão mais o intervalo entre cartões, o que
 * faz o `snap` encaixar o seguinte no lugar em vez de o deixar a meio.
 */
@Directive({
  selector: '[appTiraHorizontal]',
  host: { '(scroll)': 'medir()' },
})
export class TiraHorizontalDirective {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * No prerender não há medidas: assume-se o início da tira — nada para trás,
   * tudo para a frente —, que é onde ela de facto começa. As medidas reais
   * corrigem-no no primeiro render do navegador.
   */
  readonly podeRecuar = signal(false);
  readonly podeAvancar = signal(true);

  constructor() {
    if (!this.ehNavegador) {
      return;
    }

    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.medir();

      /**
       * Duas coisas mudam o que há para rolar depois do primeiro render: os
       * cartões, que só chegam quando a query resolve, e a largura da janela.
       * Sem observar as duas, as setas ficavam presas ao estado do primeiro
       * fotograma — desligadas numa tira que afinal tem dez cartões.
       */
      const observadorFilhos = new MutationObserver(() => this.medir());
      observadorFilhos.observe(this.elemento, { childList: true });

      const observadorTamanho = new ResizeObserver(() => this.medir());
      observadorTamanho.observe(this.elemento);

      destroyRef.onDestroy(() => {
        observadorFilhos.disconnect();
        observadorTamanho.disconnect();
      });
    });
  }

  /**
   * Recalcula os extremos a partir das medidas do elemento. Numa tira que não
   * chega a ter scroll — poucos cartões, ecrã largo — o `scrollWidth` iguala o
   * `clientWidth` e os dois lados ficam desligados.
   */
  medir(): void {
    const restaAvancar =
      this.elemento.scrollWidth - this.elemento.clientWidth - this.elemento.scrollLeft;
    this.podeRecuar.set(this.elemento.scrollLeft > TOLERANCIA_FIM_PX);
    this.podeAvancar.set(restaAvancar > TOLERANCIA_FIM_PX);
  }

  /** Avança (`1`) ou recua (`-1`) um cartão; o `snap` encaixa-o depois no lugar. */
  rolar(sentido: 1 | -1): void {
    const primeiro = this.elemento.firstElementChild as HTMLElement | null;
    const intervalo = Number.parseFloat(getComputedStyle(this.elemento).columnGap) || 0;
    const passo = primeiro
      ? primeiro.offsetWidth + intervalo
      : this.elemento.clientWidth * FRACCAO_ECRA;

    this.elemento.scrollBy({ left: sentido * passo, behavior: 'smooth' });
  }
}
