import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

export interface RotulosContadorRegressivo {
  dias: string;
  horas: string;
  minutos: string;
  segundos: string;
}

/**
 * `caixas`: cada unidade numa caixa própria. `painel`: um único painel com as
 * unidades separadas por dois pontos. `caixasGrandes`: caixas largas com o
 * número a dourado, para o prazo da candidatura docente. Todas assumem um fundo escuro.
 */
export type VarianteContador = 'caixas' | 'painel' | 'caixasGrandes';

function comZero(valor: number): string {
  return valor.toString().padStart(2, '0');
}

@Component({
  selector: 'app-contador-regressivo',
  template: `
    @if (variante() === 'painel') {
      <div class="rounded-xl border border-white/10 bg-black/20 px-8 py-7 text-center">
        @if (titulo(); as textoTitulo) {
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            {{ textoTitulo }}
          </p>
        }
        <div class="mt-6 flex items-start justify-center">
          @for (unidade of unidades(); track unidade.rotulo; let ultimo = $last) {
            <div class="flex flex-col items-center">
              <span class="text-[36px] font-bold leading-none tabular-nums text-white">{{
                unidade.valor
              }}</span>
              <span class="mt-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                {{ unidade.rotulo }}
              </span>
            </div>
            @if (!ultimo) {
              <span class="px-6 text-[36px] font-bold leading-none text-white/40" aria-hidden="true"
                >:</span
              >
            }
          }
        </div>
      </div>
    } @else if (variante() === 'caixasGrandes') {
      <div class="flex flex-wrap justify-center gap-3 sm:gap-5">
        @for (unidade of unidades(); track unidade.rotulo) {
          <div
            class="flex h-24 w-20 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 sm:w-32"
          >
            <span class="text-3xl font-bold tabular-nums text-secondary sm:text-4xl">{{
              unidade.valor
            }}</span>
            <span class="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              {{ unidade.rotulo }}
            </span>
          </div>
        }
      </div>
    } @else {
      <div class="flex gap-3">
        @for (unidade of unidades(); track unidade.rotulo) {
          <div
            class="flex min-w-16 flex-col items-center rounded-lg bg-white/10 px-3 py-2 text-white"
          >
            <span class="text-2xl font-bold tabular-nums">{{ unidade.valor }}</span>
            <span class="text-xs uppercase tracking-wide text-white/70">{{ unidade.rotulo }}</span>
          </div>
        }
      </div>
    }
  `,
})
export class ContadorRegressivoComponent {
  readonly dataAlvo = input.required<string>();
  readonly rotulos = input<RotulosContadorRegressivo>({
    dias: 'dias',
    horas: 'horas',
    minutos: 'min',
    segundos: 'seg',
  });
  readonly variante = input<VarianteContador>('caixas');
  readonly mostrarSegundos = input(true);
  /** Título apresentado acima das unidades; apenas na variante `painel`. */
  readonly titulo = input<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly agora = signal(Date.now());

  protected readonly unidades = computed(() => {
    const alvo = new Date(this.dataAlvo()).getTime();
    const restante = Math.max(0, alvo - this.agora());
    const dias = Math.floor(restante / 86_400_000);
    const horas = Math.floor((restante % 86_400_000) / 3_600_000);
    const minutos = Math.floor((restante % 3_600_000) / 60_000);
    const segundos = Math.floor((restante % 60_000) / 1000);
    const r = this.rotulos();

    const unidades = [
      { valor: comZero(dias), rotulo: r.dias },
      { valor: comZero(horas), rotulo: r.horas },
      { valor: comZero(minutos), rotulo: r.minutos },
    ];

    return this.mostrarSegundos()
      ? [...unidades, { valor: comZero(segundos), rotulo: r.segundos }]
      : unidades;
  });

  constructor() {
    afterNextRender(() => {
      const id = setInterval(() => this.agora.set(Date.now()), 1000);
      this.destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}
