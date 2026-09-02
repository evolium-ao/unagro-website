import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
    <div class="rounded-xl border border-white/30 bg-white/20 p-5 shadow-xl backdrop-blur-md">
      <h3 class="text-base font-semibold text-white sm:text-lg">{{ titulo() }}</h3>
      @if (texto()) {
        <p class="mt-1 text-xs leading-relaxed text-white/80 sm:text-sm">{{ texto() }}</p>
      }
    </div>
  `,
})
export class CartaoVidroComponent {
  readonly titulo = input.required<string>();
  readonly texto = input<string | undefined>();
}
