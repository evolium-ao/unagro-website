import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

const CLASSES_OCULTAS = ['opacity-0', 'translate-y-4'];
const CLASSES_TRANSICAO = ['transition-all', 'duration-700', 'ease-out'];
const TEMPO_LIMITE_REVELACAO_MS = 2000;

@Directive({
  selector: '[appRevelarAoScroll]',
})
export class RevelarAoScrollDirective implements OnInit, OnDestroy {
  private readonly elementoRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observador?: IntersectionObserver;
  private idTempoLimite?: ReturnType<typeof setTimeout>;
  private revelado = false;

  ngOnInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elemento = this.elementoRef.nativeElement;
    for (const classe of [...CLASSES_OCULTAS, ...CLASSES_TRANSICAO]) {
      this.renderer.addClass(elemento, classe);
    }

    this.observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            this.revelar();
          }
        }
      },
      { threshold: 0.15 },
    );
    this.observador.observe(elemento);

    // Salvaguarda: garante que o conteúdo nunca fica permanentemente invisível
    // caso o IntersectionObserver não dispare (ex.: ferramentas de captura automática,
    // páginas restauradas já com scroll, ou qualquer condição de layout inesperada).
    this.idTempoLimite = setTimeout(() => this.revelar(), TEMPO_LIMITE_REVELACAO_MS);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    clearTimeout(this.idTempoLimite);
  }

  private revelar(): void {
    if (this.revelado) {
      return;
    }
    this.revelado = true;
    const elemento = this.elementoRef.nativeElement;
    for (const classe of CLASSES_OCULTAS) {
      this.renderer.removeClass(elemento, classe);
    }
    this.observador?.unobserve(elemento);
    clearTimeout(this.idTempoLimite);
  }
}
