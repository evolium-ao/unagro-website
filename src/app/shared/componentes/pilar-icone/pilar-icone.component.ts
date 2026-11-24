import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

export type TemaPilarIcone = 'escuro' | 'claro';

const CLASSES_CAIXA: Record<TemaPilarIcone, string> = {
  escuro: 'bg-white/10 text-white',
  claro: 'bg-primary/10 text-primary',
};

const CLASSES_TITULO: Record<TemaPilarIcone, string> = {
  escuro: 'text-white',
  claro: 'text-primary-dark',
};

const CLASSES_DESCRICAO: Record<TemaPilarIcone, string> = {
  escuro: 'text-white/60',
  claro: 'text-text-secondary',
};

/**
 * Pilar com ícone: quadrado arredondado com o ícone, título e descrição, tudo
 * centrado. Sem moldura nem sombra — assenta directamente no fundo da secção, ao
 * contrário do `cartao-recurso`, que é um cartão branco alinhado à esquerda.
 */
@Component({
  selector: 'app-pilar-icone',
  imports: [IconeComponent],
  host: { class: 'block h-full' },
  template: `
    <div class="flex h-full flex-col items-center text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-xl" [class]="classesCaixa()">
        <app-icone [nome]="icone()" [tamanho]="24" />
      </div>

      <h3 class="mt-6 text-sm font-bold" [class]="classesTitulo()">{{ titulo() }}</h3>
      <p class="mt-3 max-w-xs text-sm leading-relaxed" [class]="classesDescricao()">
        {{ descricao() }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PilarIconeComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  /** `escuro` para secções de fundo verde; `claro` para fundo claro. */
  readonly tema = input<TemaPilarIcone>('escuro');

  protected readonly classesCaixa = computed(() => CLASSES_CAIXA[this.tema()]);
  protected readonly classesTitulo = computed(() => CLASSES_TITULO[this.tema()]);
  protected readonly classesDescricao = computed(() => CLASSES_DESCRICAO[this.tema()]);
}
