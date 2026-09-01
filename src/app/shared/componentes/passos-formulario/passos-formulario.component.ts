import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
              class="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-colors"
              [class]="i <= ativo() ? 'bg-primary-dark text-white' : 'bg-gray-200 text-text-secondary'"
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
              class="mt-4.5 h-px flex-1 transition-colors"
              [class]="i < ativo() ? 'bg-primary' : 'bg-gray-300'"
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
}
