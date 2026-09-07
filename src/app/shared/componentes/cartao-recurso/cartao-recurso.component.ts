import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconeComponent } from '../icone/icone.component';

/** Cor do ícone do cartão. `primario` é o verde de sempre; `dourado` usa o `text-secondary`. */
export type CorIconeCartaoRecurso = 'primario' | 'dourado';

/**
 * `vertical` é o cartão de sempre (ícone solto acima do título, fundo branco);
 * `iconeInline` põe o ícone pequeno na mesma linha do título e assenta num fundo
 * claro suave, para grelhas dentro de uma secção escura.
 */
export type FormatoCartaoRecurso = 'vertical' | 'iconeInline';

/**
 * Casca do cartão no formato `vertical`. `branca` é o cartão de sempre; `suave`
 * assenta em cinzento muito claro, para grelhas sobre um fundo quase branco;
 * `sombra` é o cartão branco sem moldura, de cantos maiores e sombra leve, para
 * faixas de pilares assentes num fundo cinzento claro.
 */
export type SuperficieCartaoRecurso = 'branca' | 'suave' | 'sombra';

/**
 * Aspecto da caixa do ícone quando `caixaIcone` está ligado. `solida` é o
 * quadrado verde escuro de sempre com o traço a branco; `suave` dá o quadrado
 * menor de fundo verde muito claro com o ícone em verde escuro.
 */
export type EstiloCaixaIconeCartaoRecurso = 'solida' | 'suave';

const CLASSES_ICONE: Record<CorIconeCartaoRecurso, string> = {
  primario: 'text-primary',
  dourado: 'text-secondary',
};

const CLASSES_ARTIGO: Record<FormatoCartaoRecurso, string> = {
  vertical: 'flex h-full flex-col rounded-xl bg-white p-6  sm:p-7 border border-gray-200',
  iconeInline: 'flex h-full flex-col rounded-2xl bg-bg-light p-4 sm:p-7 border border-gray-200/70',
};

/** Só conta no formato `vertical`; a `branca` é, letra por letra, a casca de sempre. */
const CLASSES_SUPERFICIE: Record<SuperficieCartaoRecurso, string> = {
  branca: CLASSES_ARTIGO.vertical,
  suave: 'flex h-full flex-col rounded-xl bg-bg-light p-6 sm:p-7 border border-gray-100',
  sombra: 'flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm',
};

/**
 * Cartão vertical de vantagem: ícone em destaque, título e descrição curta.
 * Usado na grelha "Por que a UNAGRO?" do recrutamento docente, nos objectivos
 * específicos e na solução implementada do detalhe de projecto, e nas formas de
 * apoio do Hub.
 */
@Component({
  selector: 'app-cartao-recurso',
  imports: [IconeComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    <article [class]="classeArtigo()" class="">
      @if (formato() === 'iconeInline') {
        <div class="flex items-center gap-2.5">
          <app-icone [nome]="icone()" [tamanho]="16" class="shrink-0 text-primary-deep" />
          <h3 class="text-base font-semibold text-primary-deep">{{ titulo() }}</h3>
        </div>
        <p class="mt-6 text-sm leading-relaxed text-text-secondary">{{ descricao() }}</p>
      } @else {
        @if (caixaIcone()) {
          @if (estiloCaixaIcone() === 'suave') {
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <app-icone [nome]="icone()" [tamanho]="20" class="text-primary-deep" />
            </div>
          } @else {
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-deep">
              <app-icone [nome]="icone()" [tamanho]="22" class="text-white" />
            </div>
          }
        } @else {
          <app-icone [nome]="icone()" [tamanho]="26" [class]="classeIcone()" />
        }
        <h3 class="mt-5 text-lg font-bold text-primary-dark">{{ titulo() }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ descricao() }}</p>
      }
      @if (textoAcao(); as rotuloAcao) {
        <a
          [routerLink]="rotaBaseAcao()"
          [fragment]="fragmentoAcao()"
          class="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-bold text-primary-deep hover:text-primary"
        >
          {{ rotuloAcao }}
          <app-icone [nome]="iconeAcao()" [tamanho]="14" />
        </a>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoRecursoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  /** Cor do ícone — `primario` mantém o aspecto anterior. */
  readonly corIcone = input<CorIconeCartaoRecurso>('primario');
  /**
   * Desenho do cartão. `vertical` (omissão) é o cartão branco de sempre; com
   * `iconeInline` o ícone (16px, verde escuro) fica ao lado do título e a casca
   * passa a fundo claro suave de cantos maiores, para secções escuras.
   */
  readonly formato = input<FormatoCartaoRecurso>('vertical');
  /**
   * Põe o ícone dentro de um quadrado verde escuro de 48px com o traço a branco.
   * Por omissão `false`, isto é, o ícone solto de 26px de sempre (e é só nesse
   * caso que o `corIcone` conta).
   */
  readonly caixaIcone = input(false);
  /**
   * Aspecto dessa caixa. `solida` (omissão) é o quadrado verde escuro de 48px de
   * sempre; `suave` dá o quadrado de 44px em `bg-primary/10` com o ícone em
   * `text-primary-deep`. Só conta com `caixaIcone` ligado.
   */
  readonly estiloCaixaIcone = input<EstiloCaixaIconeCartaoRecurso>('solida');
  /**
   * Casca do cartão no formato `vertical`. `branca` (omissão) é o cartão branco de
   * moldura `border-gray-200` de sempre; `suave` troca-o pelo cinzento muito claro
   * `bg-bg-light`, para grelhas assentes num fundo quase branco; `sombra` deixa-o
   * branco mas sem moldura, com `rounded-2xl` e sombra leve.
   */
  readonly superficie = input<SuperficieCartaoRecurso>('branca');
  /**
   * Ligação de acção encostada ao fundo do cartão. Sem `textoAcao` não se
   * desenha rodapé nenhum e o cartão fica exactamente como sempre foi.
   */
  readonly textoAcao = input<string | undefined>();
  readonly linkAcao = input<string>('');
  readonly iconeAcao = input('arrow-right');

  protected readonly classeIcone = computed(() => CLASSES_ICONE[this.corIcone()]);
  protected readonly classeArtigo = computed(() =>
    this.formato() === 'iconeInline'
      ? CLASSES_ARTIGO.iconeInline
      : CLASSES_SUPERFICIE[this.superficie()],
  );

  // O fragmento vai separado da rota, como no `app-botao` e no `app-cabecalho-secao`.
  protected readonly rotaBaseAcao = computed(() => this.linkAcao().split('#')[0] || '.');
  protected readonly fragmentoAcao = computed(() => {
    const indice = this.linkAcao().indexOf('#');
    return indice >= 0 ? this.linkAcao().slice(indice + 1) : undefined;
  });
}
