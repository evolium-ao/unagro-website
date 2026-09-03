import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconeComponent } from '../icone/icone.component';

/**
 * `claro` = fundo claro (texto escuro); `escuro` = fundo verde (título dourado);
 * `branco` = fundo verde com título branco (plano curricular do detalhe de curso);
 * `verde` = fundo claro com o título em verde escuro (equipa de investigadores).
 */
export type TemaCabecalhoSecao = 'claro' | 'escuro' | 'branco' | 'verde';
export type AlinhamentoCabecalhoSecao = 'centro' | 'esquerda';
/** `pequeno` reduz a descrição a `text-sm`; `normal` mantém o corpo de sempre. */
export type TamanhoDescricaoCabecalhoSecao = 'normal' | 'pequeno';

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

const CLASSES_TAMANHO_DESCRICAO: Record<TamanhoDescricaoCabecalhoSecao, string> = {
  normal: '',
  pequeno: 'text-sm leading-relaxed',
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
  imports: [NgTemplateOutlet, RouterLink, IconeComponent],
  template: `
    @if (textoAcao(); as rotuloAcao) {
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div class="min-w-0 sm:max-w-2xl">
          <ng-container [ngTemplateOutlet]="bloco" />
        </div>
        <a
          [routerLink]="rotaBaseAcao()"
          [fragment]="fragmentoAcao()"
          class="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          {{ rotuloAcao }}
          <app-icone [nome]="iconeAcao()" [tamanho]="16" />
        </a>
      </div>
    } @else {
      <ng-container [ngTemplateOutlet]="bloco" />
    }

    <ng-template #bloco>
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
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoSecaoComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string | undefined>();
  readonly tema = input<TemaCabecalhoSecao>('claro');
  readonly alinhamento = input<AlinhamentoCabecalhoSecao>('centro');
  readonly mostrarTracos = input(true);
  /**
   * Ligação de acção à direita do bloco de texto ("Ver todas →"). Sem
   * `textoAcao` o cabeçalho fica exactamente como sempre foi — sem a fila.
   */
  readonly textoAcao = input<string | undefined>();
  readonly linkAcao = input<string>('');
  readonly iconeAcao = input('arrow-right');
  readonly tamanhoDescricao = input<TamanhoDescricaoCabecalhoSecao>('normal');

  protected readonly classeTitulo = computed(() => CLASSES_TITULO[this.tema()]);
  // As classes vão juntas numa só cadeia e sem espaços a mais: um `[class]` com
  // um troço vazio faz o `classList` rejeitar a cadeia inteira ao renderizar.
  protected readonly classeDescricao = computed(() =>
    `${CLASSES_DESCRICAO[this.tema()]} ${CLASSES_TAMANHO_DESCRICAO[this.tamanhoDescricao()]}`.trim(),
  );
  protected readonly classeAlinhamento = computed(() => CLASSES_ALINHAMENTO[this.alinhamento()]);

  protected readonly rotaBaseAcao = computed(() => this.linkAcao().split('#')[0] || '.');
  protected readonly fragmentoAcao = computed(() => {
    const indice = this.linkAcao().indexOf('#');
    return indice >= 0 ? this.linkAcao().slice(indice + 1) : undefined;
  });
}
