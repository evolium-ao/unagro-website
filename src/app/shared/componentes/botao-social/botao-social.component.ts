import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Botão de entrada por provedor externo (Google, Office 365): moldura clara,
 * logótipo do provedor à esquerda e o nome ao lado. O logótipo entra por
 * caminho de imagem porque são marcas de terceiros, que não pertencem ao
 * conjunto de ícones do site.
 */
@Component({
  selector: 'app-botao-social',
  host: { class: 'block' },
  template: `
    <button
      type="button"
      [disabled]="desativado()"
      class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-text-primary transition-colors duration-200 hover:bg-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
      (click)="clicado.emit()"
    >
      <img [src]="icone()" alt="" aria-hidden="true" class="size-4 shrink-0" />
      {{ rotulo() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotaoSocialComponent {
  readonly icone = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly desativado = input(false);

  readonly clicado = output<void>();
}
