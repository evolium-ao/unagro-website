import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * `normal` é a caixa de sempre (`p-5`, título `text-base sm:text-lg`); `compacto`
 * é a faixa miúda que se encosta ao fundo de um retrato — menos altura, nome a
 * negrito em `text-sm` e a linha de baixo em `text-[11px]`.
 */
export type TamanhoCartaoVidro = 'normal' | 'compacto';

// Cada cadeia vai inteira num só `[class]` e nunca vem vazia: um troço vazio faz
// o `classList` rejeitar a cadeia toda ao renderizar no servidor.
const CLASSES_CAIXA: Record<TamanhoCartaoVidro, string> = {
  normal: 'rounded-xl border border-white/30 bg-white/20 p-5 shadow-xl backdrop-blur-md',
  compacto: 'rounded-xl border border-white/20 bg-white/20 px-4 py-3 shadow-lg backdrop-blur-md',
};

const CLASSES_TITULO: Record<TamanhoCartaoVidro, string> = {
  normal: 'text-base font-semibold text-white sm:text-lg',
  compacto: 'text-sm font-bold text-white',
};

const CLASSES_TEXTO: Record<TamanhoCartaoVidro, string> = {
  normal: 'mt-1 text-xs leading-relaxed text-white/80 sm:text-sm',
  compacto: 'mt-0.5 text-[11px] leading-relaxed text-white/75',
};

/**
 * Cartão translúcido (vidro fosco) com título e texto curto, feito para ficar
 * sobreposto a uma fotografia ou banner. Quem o usa é que o posiciona — o
 * componente só trata do aspecto.
 */
@Component({
  selector: 'app-cartao-vidro',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="classeCaixa()">
      <h3 [class]="classeTitulo()">{{ titulo() }}</h3>
      @if (texto()) {
        <p [class]="classeTexto()">{{ texto() }}</p>
      }
    </div>
  `,
})
export class CartaoVidroComponent {
  readonly titulo = input.required<string>();
  readonly texto = input<string | undefined>();
  /** `normal` (omissão) mantém a caixa de sempre; `compacto` dá a faixa miúda. */
  readonly tamanho = input<TamanhoCartaoVidro>('normal');

  protected readonly classeCaixa = computed(() => CLASSES_CAIXA[this.tamanho()]);
  protected readonly classeTitulo = computed(() => CLASSES_TITULO[this.tamanho()]);
  protected readonly classeTexto = computed(() => CLASSES_TEXTO[this.tamanho()]);
}
