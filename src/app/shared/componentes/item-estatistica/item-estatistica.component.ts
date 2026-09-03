import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * `escuro` = sobre fundo verde (valor dourado, rótulo dourado esbatido);
 * `claro` = sobre fundo claro (valor verde escuro, rótulo cinzento);
 * `verde` = sobre fundo claro com o valor em `primary-deep`, o par do tema
 * homónimo do `app-cabecalho-secao`.
 */
export type TemaItemEstatistica = 'escuro' | 'claro' | 'verde';

/**
 * `bloco` = número grande solto numa grelha de indicadores (o desenho original);
 * `barra` = indicador miúdo com uma barra vertical verde à esquerda, para
 * acompanhar um bloco de texto;
 * `centrado` = número muito grande e tudo alinhado ao centro, para a faixa de
 * números de impacto que ocupa uma secção inteira sem cartões nem separadores.
 */
export type FormatoItemEstatistica = 'bloco' | 'barra' | 'centrado';

const CLASSES_VALOR: Record<TemaItemEstatistica, string> = {
  escuro: 'text-secondary',
  claro: 'text-primary-dark',
  verde: 'text-primary-deep',
};

const CLASSES_ROTULO: Record<TemaItemEstatistica, string> = {
  escuro: 'text-secondary/75',
  claro: 'text-text-secondary',
  verde: 'text-text-secondary',
};

const CLASSES_RAIZ: Record<FormatoItemEstatistica, string> = {
  bloco: '',
  barra: 'border-l-2 border-primary pl-4',
  centrado: 'text-center',
};

const CLASSES_TAMANHO_VALOR: Record<FormatoItemEstatistica, string> = {
  bloco: 'text-3xl sm:text-4xl',
  barra: 'text-xl sm:text-2xl',
  centrado: 'text-4xl sm:text-5xl',
};

const CLASSES_TAMANHO_ROTULO: Record<FormatoItemEstatistica, string> = {
  bloco: 'mt-2 text-[11px] tracking-wide',
  barra: 'mt-1 text-[10px] tracking-wider',
  centrado: 'mt-3 text-[11px] tracking-wide',
};

/**
 * Número em destaque com o rótulo em maiúsculas por baixo, para grelhas de
 * indicadores. Ao contrário da `app-faixa-estatisticas`, fica parado — é para
 * blocos de estatísticas dentro de uma secção, não para a faixa rolante.
 */
@Component({
  selector: 'app-item-estatistica',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="classeRaiz()">
      <p class="font-bold leading-none" [class]="classeValor()">{{ valor() }}</p>
      <p class="font-semibold uppercase leading-snug" [class]="classeRotulo()">{{ rotulo() }}</p>
    </div>
  `,
})
export class ItemEstatisticaComponent {
  readonly valor = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly tema = input<TemaItemEstatistica>('escuro');
  readonly formato = input<FormatoItemEstatistica>('bloco');

  protected readonly classeRaiz = computed(() => CLASSES_RAIZ[this.formato()]);
  protected readonly classeValor = computed(
    () => `${CLASSES_TAMANHO_VALOR[this.formato()]} ${CLASSES_VALOR[this.tema()]}`,
  );
  protected readonly classeRotulo = computed(
    () => `${CLASSES_TAMANHO_ROTULO[this.formato()]} ${CLASSES_ROTULO[this.tema()]}`,
  );
}
