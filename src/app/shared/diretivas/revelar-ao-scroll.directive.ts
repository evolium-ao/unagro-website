import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** Distância, em px, que o elemento sobe ao entrar. */
const DESLOCAMENTO_PX = 24;
/** Atraso acumulado por posição, para os cartões de uma grelha entrarem em cascata. */
const ATRASO_POR_POSICAO_S = 0.09;
const DURACAO_S = 0.5;
/** Curva de saída suave — o movimento trava no fim em vez de parar a seco. */
const CURVA: [number, number, number, number] = [0.22, 1, 0.36, 1];
/**
 * Se o Motion falhar a carregar ou o `inView` nunca disparar (captura automática,
 * página restaurada já com scroll), o conteúdo não pode ficar invisível para sempre.
 */
const TEMPO_LIMITE_MS = 2000;

/**
 * Revela o elemento de baixo para cima quando ele entra no ecrã, com o Motion.
 *
 * O valor passado é a posição do elemento no seu lote e multiplica o atraso, o
 * que produz a cascata numa grelha: `[appRevelarAoScroll]="$index"`. Sem valor,
 * revela sem atraso. Elementos criados depois — uma página seguinte de
 * resultados, por exemplo — animam à medida que aparecem, porque cada um traz a
 * sua própria instância da diretiva.
 */
@Directive({
  selector: '[appRevelarAoScroll]',
})
export class RevelarAoScrollDirective {
  readonly posicao = input<number, unknown>(0, {
    alias: 'appRevelarAoScroll',
    transform: (valor) => Number(valor) || 0,
  });

  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private pararObservacao?: VoidFunction;
  private idTempoLimite?: ReturnType<typeof setTimeout>;
  private revelado = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.limpar());

    if (!this.ehNavegador || this.movimentoReduzido()) {
      return;
    }

    // Esconder aqui, e não em `afterNextRender`, evita o elemento aparecer
    // durante um fotograma antes de a animação começar.
    this.elemento.style.opacity = '0';
    this.elemento.style.transform = `translateY(${DESLOCAMENTO_PX}px)`;

    afterNextRender(() => void this.observar());
  }

  private movimentoReduzido(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private async observar(): Promise<void> {
    this.idTempoLimite = setTimeout(() => this.mostrarSemAnimacao(), TEMPO_LIMITE_MS);

    try {
      const { animate, inView } = await import('motion');

      this.pararObservacao = inView(
        this.elemento,
        () => {
          if (this.revelado) {
            return;
          }
          this.revelado = true;
          this.limpar();

          animate(
            this.elemento,
            { opacity: [0, 1], y: [DESLOCAMENTO_PX, 0] },
            { duration: DURACAO_S, delay: this.posicao() * ATRASO_POR_POSICAO_S, ease: CURVA },
          );
        },
        { amount: 0.15 },
      );
    } catch {
      this.mostrarSemAnimacao();
    }
  }

  private mostrarSemAnimacao(): void {
    if (this.revelado) {
      return;
    }
    this.revelado = true;
    this.limpar();
    this.elemento.style.opacity = '';
    this.elemento.style.transform = '';
  }

  private limpar(): void {
    this.pararObservacao?.();
    this.pararObservacao = undefined;
    clearTimeout(this.idTempoLimite);
  }
}
