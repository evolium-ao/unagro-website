import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Forma do distintivo numerado: `arredondado` (por omissão) ou `circulo`. */
export type FormaDistintivoPassos = 'arredondado' | 'circulo';

const CLASSES_FORMA: Record<FormaDistintivoPassos, string> = {
  arredondado: 'h-9 w-9 rounded-xl',
  circulo: 'h-10 w-10 rounded-full',
};

/** A linha de ligação alinha-se ao meio do distintivo, que muda de altura com a forma. */
const CLASSES_LINHA: Record<FormaDistintivoPassos, string> = {
  arredondado: 'mt-4.5',
  circulo: 'mt-5',
};

/**
 * Barra horizontal de progresso de um formulário multi-passos: distintivo numerado,
 * rótulo em maiúsculas e um traço a ligar cada passo ao seguinte.
 */
@Component({
  selector: 'app-passos-formulario',
  template: `
    <ol class="flex items-start justify-between" [attr.aria-label]="rotuloLista()">
      @for (rotulo of passos(); track rotulo; let i = $index, ultimo = $last) {
        <li class="flex items-start" [class.flex-1]="!ultimo">
          <div class="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-28 lg:w-32">
            <span
              class="flex items-center justify-center text-sm font-bold transition-colors"
              [class]="
                classeForma() +
                (i <= ativo() ? ' bg-primary-dark text-white' : ' bg-gray-200 text-text-secondary')
              "
              [attr.aria-current]="i === ativo() ? 'step' : null"
            >
              {{ i + 1 }}
            </span>
            <span
              class="text-center text-[11px] font-bold uppercase leading-tight tracking-[0.06em]"
              [class]="i <= ativo() ? 'text-primary-dark' : 'text-text-secondary'"
            >
              {{ rotulo }}
            </span>
          </div>

          @if (!ultimo) {
            <span
              class="h-px flex-1 transition-colors"
              [class]="classeLinha() + (i < ativo() ? ' bg-primary' : ' bg-gray-300')"
              aria-hidden="true"
            ></span>
          }
        </li>
      }
    </ol>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassosFormularioComponent {
  readonly passos = input<string[]>([]);
  /** Índice do passo actual (base 0). */
  readonly ativo = input<number>(0);
  readonly rotuloLista = input<string>('Progresso do formulário');
  readonly formaDistintivo = input<FormaDistintivoPassos>('arredondado');

  protected readonly classeForma = computed(() => CLASSES_FORMA[this.formaDistintivo()]);
  protected readonly classeLinha = computed(() => CLASSES_LINHA[this.formaDistintivo()]);
}
