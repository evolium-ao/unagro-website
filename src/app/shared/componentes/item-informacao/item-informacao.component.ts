import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * `etiqueta` = emblema circular de 48px e título em maiúsculas miúdas (o de sempre);
 * `simples` = emblema quadrado arredondado de 40px e título escrito normalmente, para
 * pares de notas curtas lado a lado numa coluna estreita.
 */
export type FormatoItemInformacao = 'etiqueta' | 'simples';

const CLASSES_FILA: Record<FormatoItemInformacao, string> = {
  etiqueta: 'gap-4',
  simples: 'gap-3',
};

const CLASSES_EMBLEMA: Record<FormatoItemInformacao, string> = {
  etiqueta: 'h-12 w-12 rounded-full',
  simples: 'h-10 w-10 rounded-xl',
};

const TAMANHO_ICONE: Record<FormatoItemInformacao, number> = {
  etiqueta: 20,
  simples: 18,
};

const CLASSES_TITULO: Record<FormatoItemInformacao, string> = {
  etiqueta: 'text-xs font-bold uppercase tracking-[0.12em]',
  simples: 'text-sm font-bold',
};

const CLASSES_DESCRICAO: Record<FormatoItemInformacao, string> = {
  etiqueta: 'mt-2 text-sm',
  simples: 'mt-1.5 text-xs',
};

/**
 * Item de informação de um bloco de texto: emblema com o ícone centrado à esquerda e,
 * à direita, um título curto verde escuro com uma descrição cinzenta por baixo.
 *
 * No formato `etiqueta` o título vai em maiúsculas — isso é apresentação, os dados
 * guardam o texto escrito normalmente. Ao contrário do `app-item-contacto` (caixa
 * quadrada de 36px e três linhas: rótulo, valor em destaque e detalhe), aqui só há
 * título e descrição.
 */
@Component({
  selector: 'app-item-informacao',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    <div class="flex items-start" [class]="classesFila()">
      <div
        class="flex shrink-0 items-center justify-center bg-gray-100 text-primary-deep"
        [class]="classesEmblema()"
      >
        <app-icone [nome]="icone()" [tamanho]="tamanhoIcone()" />
      </div>
      <div class="pt-1">
        <h3 class="text-primary-deep" [class]="classesTitulo()">
          {{ titulo() }}
        </h3>
        <p class="leading-relaxed text-text-secondary" [class]="classesDescricao()">
          {{ descricao() }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemInformacaoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  /** `etiqueta` (omissão) mantém o item de sempre; `simples` é a variante compacta. */
  readonly formato = input<FormatoItemInformacao>('etiqueta');

  protected readonly classesFila = computed(() => CLASSES_FILA[this.formato()]);
  protected readonly classesEmblema = computed(() => CLASSES_EMBLEMA[this.formato()]);
  protected readonly tamanhoIcone = computed(() => TAMANHO_ICONE[this.formato()]);
  protected readonly classesTitulo = computed(() => CLASSES_TITULO[this.formato()]);
  protected readonly classesDescricao = computed(() => CLASSES_DESCRICAO[this.formato()]);
}
