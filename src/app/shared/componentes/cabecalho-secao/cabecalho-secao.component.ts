import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * `claro` = fundo claro (texto escuro); `escuro` = fundo verde (título dourado);
 * `branco` = fundo verde com título branco (plano curricular do detalhe de curso);
 * `verde` = fundo claro com o título em verde escuro (equipa de investigadores).
 */
export type TemaCabecalhoSecao = 'claro' | 'escuro' | 'branco' | 'verde';
export type AlinhamentoCabecalhoSecao = 'centro' | 'esquerda';

const CLASSES_ALINHAMENTO: Record<AlinhamentoCabecalhoSecao, string> = {
  centro: 'mx-auto max-w-2xl items-center text-center',
  esquerda: 'items-start text-left',
};

const CLASSES_TITULO: Record<TemaCabecalhoSecao, string> = {
  claro: 'text-text-primary',
  escuro: 'text-secondary',
  branco: 'text-white',
  verde: 'text-primary-deep',
};

const CLASSES_DESCRICAO: Record<TemaCabecalhoSecao, string> = {
  claro: 'text-text-secondary',
  escuro: 'text-white/70',
  branco: 'text-white/70',
  verde: 'text-text-secondary',
};

/**
 * Cabeçalho de secção reutilizável: 3 traços decorativos, título e descrição
 * centrados. Usado para introduzir secções da página de candidaturas.
 */
@Component({
  selector: 'app-cabecalho-secao',
  template: `
    <div class="flex flex-col" [class]="classeAlinhamento()">
      @if (mostrarTracos()) {
        <div class="mb-4 flex items-center gap-1.5" aria-hidden="true">
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
        </div>
      }
      <h2 class="text-2xl font-bold sm:text-3xl" [class]="classeTitulo()">{{ titulo() }}</h2>
      @if (descricao()) {
        <p class="mt-3" [class]="classeDescricao()">{{ descricao() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoSecaoComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string | undefined>();
  readonly tema = input<TemaCabecalhoSecao>('claro');
  readonly alinhamento = input<AlinhamentoCabecalhoSecao>('centro');
  readonly mostrarTracos = input(true);

  protected readonly classeTitulo = computed(() => CLASSES_TITULO[this.tema()]);
  protected readonly classeDescricao = computed(() => CLASSES_DESCRICAO[this.tema()]);
  protected readonly classeAlinhamento = computed(() => CLASSES_ALINHAMENTO[this.alinhamento()]);
}
