import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ItemGaleria } from '../../../core/modelos/galeria.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { RevelarAoScrollDirective } from '../../diretivas/revelar-ao-scroll.directive';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Classes de cada célula do mosaico, **por posição na lista** — é a ordem dos
 * dados que decide a disposição, não um campo de layout no conteúdo.
 *
 * Em `lg` a grelha é de 4 colunas por 2 linhas, a primeira mais baixa do que a
 * segunda: a fotografia 1 ocupa as colunas 1–2 e as duas linhas, a 2 e a 3
 * ficam lado a lado na linha 1 e a 4 ocupa as colunas 3–4 da linha 2. Abaixo de
 * `lg` são as alturas fixas de cada célula que mantêm o ritmo, porque as linhas
 * da grelha deixam de existir.
 */
const CLASSES_CELULA_MOSAICO: readonly string[] = [
  'h-72 sm:col-span-2 sm:h-96 lg:col-span-2 lg:row-span-2 lg:h-full',
  'h-44 sm:h-52 lg:h-full',
  'h-44 sm:h-52 lg:h-full',
  'h-56 sm:col-span-2 sm:h-64 lg:col-span-2 lg:h-full',
];

/** Quantas fotografias entram no mosaico; as restantes seguem em células iguais. */
const ITENS_DO_MOSAICO = CLASSES_CELULA_MOSAICO.length;

/** Altura de cada célula fora do mosaico e da galeria que não chega a formá-lo. */
const CLASSES_CELULA_SIMPLES = 'h-44 sm:h-52 lg:h-64';

/**
 * Mosaico de fotografias de uma galeria: uma imagem grande e alta à esquerda,
 * duas pequenas em cima à direita e uma larga em baixo à direita.
 *
 * O desenho só se sustenta com as quatro primeiras fotografias — com menos do
 * que isso a galeria cai numa grelha uniforme, e os itens a partir do quinto
 * seguem em células normais nas linhas seguintes da mesma grelha. Assim uma
 * galeria que a API devolva com duas, seis ou dez fotografias não quebra o
 * enquadramento.
 *
 * Um item sem `url` fica no marcador cinzento do `app-espaco-imagem` em vez de
 * pedir um ficheiro que não existe. A legenda é opcional e, quando existe, sai
 * sobreposta ao canto inferior esquerdo, sobre um gradiente escuro.
 */
@Component({
  selector: 'app-galeria-mosaico',
  imports: [EspacoImagemComponent, RevelarAoScrollDirective],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" [class]="classesGrelha()">
      @for (item of itens(); track item.id) {
        <figure
          class="relative overflow-hidden rounded-xl bg-bg-light"
          [class]="classesCelula($index)"
          [appRevelarAoScroll]="$index"
        >
          @if (item.url) {
            <img
              [src]="item.url"
              [alt]="item.legenda || textoAlternativo()"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          } @else {
            <!-- TODO: item de galeria sem fotografia — fica o marcador cinzento. -->
            <app-espaco-imagem class="block h-full" proporcao="cover" alturaMinima="100%" />
          }

          @if (item.legenda) {
            <figcaption
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-xs font-medium text-white sm:text-sm"
            >
              {{ item.legenda }}
            </figcaption>
          }
        </figure>
      } @empty {
        <p class="col-span-full py-12 text-center text-sm text-text-secondary">{{ mensagemVazia() }}</p>
      }
    </div>
  `,
})
export class GaleriaMosaicoComponent {
  private readonly traducao = inject(TraducaoService);

  readonly itens = input.required<ItemGaleria[]>();
  /** `alt` de recurso para os itens sem legenda — tipicamente o título da página. */
  readonly textoAlternativo = input<string>('');

  private readonly temMosaico = computed(() => this.itens().length >= ITENS_DO_MOSAICO);

  /**
   * As linhas explícitas só entram quando há mosaico. Em altura absoluta em vez
   * de `fr` para que os itens a partir do quinto caiam em linhas implícitas
   * automáticas sem espremer as duas primeiras.
   */
  protected readonly classesGrelha = computed(() =>
    this.temMosaico() ? 'lg:grid-rows-[11rem_23rem]' : 'lg:grid-cols-4',
  );

  protected readonly mensagemVazia = computed(() =>
    this.traducao.getTraducao(['Ainda não há fotografias publicadas.', 'No photographs published yet.']),
  );

  protected classesCelula(indice: number): string {
    if (!this.temMosaico() || indice >= ITENS_DO_MOSAICO) {
      return CLASSES_CELULA_SIMPLES;
    }
    return CLASSES_CELULA_MOSAICO[indice];
  }
}
