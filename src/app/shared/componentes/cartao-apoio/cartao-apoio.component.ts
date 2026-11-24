import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * `lateral` = cartão de apoio da coluna do formulário (título branco, acção em baixo);
 * `destaque` = painel alto de uma grelha, com o título a dourado e o texto maior.
 */
export type FormatoCartaoApoio = 'lateral' | 'destaque';

const CLASSES_CAIXA: Record<FormatoCartaoApoio, string> = {
  lateral: 'p-6 sm:p-7',
  destaque: 'h-full p-7 sm:p-9',
};

const CLASSES_TITULO: Record<FormatoCartaoApoio, string> = {
  lateral: 'text-base font-bold text-white',
  destaque: 'text-lg font-bold text-secondary sm:text-xl',
};

const CLASSES_DESCRICAO: Record<FormatoCartaoApoio, string> = {
  lateral: 'mt-3 text-sm text-white/75',
  destaque: 'mt-4 text-sm text-white/90 sm:text-base',
};

/**
 * Cartão de apoio em verde escuro: título, um parágrafo curto e a acção projectada
 * por baixo (normalmente um `app-botao` a toda a largura). Ao contrário do
 * `app-cartao-chamada-acao` — branco, centrado e feito para assentar sobre uma
 * fotografia — este é sólido e alinhado à esquerda. No formato `destaque` serve de
 * painel alto de uma coluna da grelha (objectivo geral do detalhe de projecto).
 */
@Component({
  selector: 'app-cartao-apoio',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    <aside class="rounded-xl bg-primary-deep text-white" [class]="classesCaixa()">
      <header class="flex items-center gap-2.5">
        @if (icone(); as nome) {
          <app-icone [nome]="nome" [tamanho]="20" class="text-secondary" />
        }
        <h3 [class]="classesTitulo()">{{ titulo() }}</h3>
      </header>

      @if (descricao(); as texto) {
        <p class="leading-relaxed" [class]="classesDescricao()">{{ texto }}</p>
      }

      <div class="mt-6 empty:hidden">
        <ng-content />
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoApoioComponent {
  readonly titulo = input.required<string>();
  readonly descricao = input<string | undefined>();
  readonly icone = input<string>();
  /** `lateral` mantém o cartão de apoio antigo; `destaque` é o painel alto da grelha. */
  readonly formato = input<FormatoCartaoApoio>('lateral');

  protected readonly classesCaixa = computed(() => CLASSES_CAIXA[this.formato()]);
  protected readonly classesTitulo = computed(() => CLASSES_TITULO[this.formato()]);
  protected readonly classesDescricao = computed(() => CLASSES_DESCRICAO[this.formato()]);
}
