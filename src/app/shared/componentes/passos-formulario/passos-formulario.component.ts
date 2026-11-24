import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** Forma do distintivo numerado: `arredondado` (por omissão) ou `circulo`. */
export type FormaDistintivoPassos = 'arredondado' | 'circulo';

/**
 * `coluna` (por omissão) põe o rótulo por baixo do distintivo, como sempre foi;
 * `linha` põe-no à direita, com o "ETAPA N" em cima e o nome do passo por baixo,
 * dentro de um cartão branco — o stepper da candidatura docente.
 */
export type DisposicaoPassos = 'coluna' | 'linha';

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
  imports: [IconeComponent],
  template: `
    @if (disposicao() === 'linha') {
      <!-- Telemóvel: os passos lado a lado, em colunas, só com o nome por baixo do
           distintivo; em sm empilham com o "ETAPA N", e em lg voltam a ficar em linha. -->
      <ol
        class="grid grid-cols-4 gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex sm:flex-col sm:gap-4 sm:p-6 lg:flex-row lg:items-center lg:gap-4"
        [attr.aria-label]="rotuloLista()"
      >
        @for (rotulo of passos(); track rotulo; let i = $index, ultimo = $last) {
          @let concluido = mostrarConcluidos() && i < ativo();
          @let atual = i === ativo();
          <li class="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-left" [class.lg:flex-1]="!ultimo">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-colors sm:h-11 sm:w-11"
              [class]="
                atual
                  ? 'border-primary-deep bg-primary-deep text-secondary'
                  : concluido
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-gray-200 bg-gray-50 text-text-secondary'
              "
              [attr.aria-current]="atual ? 'step' : null"
            >
              @if (concluido) {
                <app-icone nome="check" [tamanho]="18" />
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="flex min-w-0 flex-col">
              <span
                class="hidden text-[11px] font-semibold uppercase tracking-[0.08em] sm:block"
                [class]="atual || concluido ? 'text-primary-deep' : 'text-text-secondary'"
              >
                {{ prefixoPasso() }} {{ i + 1 }}@if (atual && sufixoAtivo()) {
                  {{ ' ' + sufixoAtivo() }}
                }
              </span>
              <span
                class="text-[11px] leading-tight sm:text-sm sm:leading-normal"
                [class]="(atual || concluido ? 'text-primary-deep' : 'text-text-secondary') + (atual ? ' font-semibold sm:font-normal' : '')"
              >
                {{ rotulo }}
              </span>
            </span>
            @if (!ultimo) {
              <span
                class="hidden h-px flex-1 lg:block"
                [class]="concluido ? 'bg-primary' : 'bg-gray-200'"
                aria-hidden="true"
              ></span>
            }
          </li>
        }
      </ol>
    } @else {
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
                @if (mostrarConcluidos() && i < ativo()) {
                  <app-icone nome="check" [tamanho]="16" />
                } @else {
                  {{ i + 1 }}
                }
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
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassosFormularioComponent {
  readonly passos = input<string[]>([]);
  /** Índice do passo actual (base 0). */
  readonly ativo = input<number>(0);
  readonly rotuloLista = input<string>('Progresso do formulário');
  readonly formaDistintivo = input<FormaDistintivoPassos>('arredondado');
  /** Ver `DisposicaoPassos`. `coluna` mantém o stepper de sempre. */
  readonly disposicao = input<DisposicaoPassos>('coluna');
  /** Troca o número dos passos já feitos por um check. Por omissão `false`. */
  readonly mostrarConcluidos = input(false);
  /** Só na disposição `linha`: texto antes do número ("Etapa") e depois dele no passo actual ("(activa)"). */
  readonly prefixoPasso = input('Etapa');
  readonly sufixoAtivo = input('');

  protected readonly classeForma = computed(() => CLASSES_FORMA[this.formaDistintivo()]);
  protected readonly classeLinha = computed(() => CLASSES_LINHA[this.formaDistintivo()]);
}
