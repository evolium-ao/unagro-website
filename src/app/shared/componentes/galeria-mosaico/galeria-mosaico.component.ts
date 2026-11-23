import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ItemGaleria } from '../../../core/modelos/galeria.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { RevelarAoScrollDirective } from '../../diretivas/revelar-ao-scroll.directive';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';

/**
 * Classes de cada célula do mosaico, **por posição na lista** — é a ordem dos
 * dados que decide a disposição, não um campo de layout no conteúdo.
 *
 * Só valem de `sm` para cima, porque em telemóvel as fotografias não formam
 * grelha nenhuma: correm numa tira horizontal, e aí a largura e a altura são as
 * mesmas para todas (ver `CLASSES_CELULA_TIRA`). Em `lg` a grelha é de 4 colunas
 * por 2 linhas, a primeira mais baixa do que a segunda: a fotografia 1 ocupa as
 * colunas 1–2 e as duas linhas, a 2 e a 3 ficam lado a lado na linha 1 e a 4
 * ocupa as colunas 3–4 da linha 2.
 */
const CLASSES_CELULA_MOSAICO: readonly string[] = [
  'sm:col-span-2 sm:h-96 lg:col-span-2 lg:row-span-2 lg:h-full',
  'sm:h-52 lg:h-full',
  'sm:h-52 lg:h-full',
  'sm:col-span-2 sm:h-64 lg:col-span-2 lg:h-full',
];

/** Quantas fotografias entram no mosaico; as restantes seguem em células iguais. */
const ITENS_DO_MOSAICO = CLASSES_CELULA_MOSAICO.length;

/** Altura de cada célula fora do mosaico e da galeria que não chega a formá-lo. */
const CLASSES_CELULA_SIMPLES = 'sm:h-52 lg:h-64';

/**
 * Em telemóvel cada fotografia é um cartão da tira: pouco menos de um ecrã de
 * largura, para se ver o rebordo da seguinte e ficar claro que a tira continua.
 */
const CLASSES_CELULA_TIRA = 'h-60 w-4/5 shrink-0 snap-start sm:w-auto sm:shrink';

/** Margem de erro do fim da tira: os navegadores arredondam o `scrollLeft`. */
const TOLERANCIA_FIM_PX = 8;

/**
 * Mosaico de fotografias de uma galeria: uma imagem grande e alta à esquerda,
 * duas pequenas em cima à direita e uma larga em baixo à direita.
 *
 * **Em telemóvel o mosaico dá lugar a uma tira horizontal**: as fotografias
 * correm todas na mesma linha, com scroll por arrasto e encaixe (`snap`), a
 * barra de scroll escondida, um gradiente em cada extremo a indicar que há mais
 * fotografias para aquele lado e dois botões de seta — tudo isso desaparece a
 * partir de `sm`, onde volta a grelha.
 *
 * O desenho da grelha só se sustenta com as quatro primeiras fotografias — com
 * menos do que isso a galeria cai numa grelha uniforme, e os itens a partir do
 * quinto seguem em células normais nas linhas seguintes da mesma grelha. Assim
 * uma galeria que a API devolva com duas, seis ou dez fotografias não quebra o
 * enquadramento.
 *
 * Um item sem `url` fica no marcador cinzento do `app-espaco-imagem` em vez de
 * pedir um ficheiro que não existe. A legenda é opcional e, quando existe, sai
 * sobreposta ao canto inferior esquerdo, sobre um gradiente escuro.
 */
@Component({
  selector: 'app-galeria-mosaico',
  imports: [EspacoImagemComponent, IconeComponent, RevelarAoScrollDirective],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div
        #tira
        class="tira-galeria flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:snap-none sm:gap-6 sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4"
        [class]="classesGrelha()"
        (scroll)="aoRolar()"
      >
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
          <p class="col-span-full py-12 text-center text-sm text-text-secondary">
            {{ mensagemVazia() }}
          </p>
        }
      </div>

      <!-- Sombras dos extremos e setas: só em telemóvel, onde há tira para rolar.
           Ficam fora do elemento com scroll para não andarem com ele. -->
      @if (temTira()) {
        @if (podeRecuar()) {
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 left-0 w-12 rounded-l-xl bg-gradient-to-r to-transparent sm:hidden"
            [class]="classeGradiente()"
          ></div>
        }
        @if (podeAvancar()) {
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-xl bg-gradient-to-l to-transparent sm:hidden"
            [class]="classeGradiente()"
          ></div>
        }

        <button
          type="button"
          class="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-text-secondary shadow-md hover:border-primary-deep hover:text-primary-deep disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep sm:hidden"
          [disabled]="!podeRecuar()"
          [attr.aria-label]="rotuloAnterior()"
          (click)="rolar(-1)"
        >
          <app-icone nome="chevron-left" [tamanho]="16" />
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary-deep text-white shadow-md hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep sm:hidden"
          [disabled]="!podeAvancar()"
          [attr.aria-label]="rotuloSeguinte()"
          (click)="rolar(1)"
        >
          <app-icone nome="chevron-right" [tamanho]="16" />
        </button>
      }
    </div>
  `,
  styles: `
    /* A tira rola mas sem barra à vista: quem indica que há mais são os
       gradientes e as setas. De sm para cima o elemento deixa de ter scroll. */
    .tira-galeria {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tira-galeria::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class GaleriaMosaicoComponent {
  private readonly traducao = inject(TraducaoService);

  readonly itens = input.required<ItemGaleria[]>();
  /** `alt` de recurso para os itens sem legenda — tipicamente o título da página. */
  readonly textoAlternativo = input<string>('');
  /**
   * Cor de onde partem os gradientes dos extremos da tira — tem de ser a do
   * fundo da secção, senão a sombra lê-se como uma faixa. `from-white` por
   * omissão, que é o fundo da secção da galeria no detalhe de projecto.
   */
  readonly classeGradiente = input<string>('from-white');

  private readonly tira = viewChild<ElementRef<HTMLElement>>('tira');

  /** Só há tira a rolar com mais do que uma fotografia; com uma, ela enche o ecrã. */
  protected readonly temTira = computed(() => this.itens().length > 1);

  private readonly temMosaico = computed(() => this.itens().length >= ITENS_DO_MOSAICO);

  /**
   * No prerender não há medidas: assume-se o início da tira — nada para trás,
   * tudo para a frente — que é onde ela de facto começa. O `afterNextRender`
   * corrige-o com as medidas reais.
   */
  protected readonly podeRecuar = signal(false);
  protected readonly podeAvancar = signal(true);

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

  protected readonly rotuloAnterior = computed(() =>
    this.traducao.getTraducao(['Fotografias anteriores', 'Previous photographs']),
  );

  protected readonly rotuloSeguinte = computed(() =>
    this.traducao.getTraducao(['Fotografias seguintes', 'Next photographs']),
  );

  constructor() {
    afterNextRender(() => this.aoRolar());
  }

  protected classesCelula(indice: number): string {
    const classesGrelha =
      !this.temMosaico() || indice >= ITENS_DO_MOSAICO
        ? CLASSES_CELULA_SIMPLES
        : CLASSES_CELULA_MOSAICO[indice];
    return `${CLASSES_CELULA_TIRA} ${classesGrelha}`;
  }

  /**
   * Recalcula os extremos a partir das medidas do elemento. De `sm` para cima o
   * elemento não tem scroll, logo `scrollWidth` iguala o `clientWidth` e ambos
   * os lados ficam desligados — o que também esconde os gradientes que já lá
   * não aparecem.
   */
  protected aoRolar(): void {
    const elemento = this.tira()?.nativeElement;
    if (!elemento) {
      return;
    }
    const restaAvancar = elemento.scrollWidth - elemento.clientWidth - elemento.scrollLeft;
    this.podeRecuar.set(elemento.scrollLeft > TOLERANCIA_FIM_PX);
    this.podeAvancar.set(restaAvancar > TOLERANCIA_FIM_PX);
  }

  /** Avança ou recua uma fotografia — o `snap` encaixa-a depois no lugar. */
  protected rolar(sentido: 1 | -1): void {
    const elemento = this.tira()?.nativeElement;
    if (!elemento) {
      return;
    }
    const primeira = elemento.firstElementChild as HTMLElement | null;
    const passo = primeira ? primeira.offsetWidth + 16 : elemento.clientWidth * 0.85;
    elemento.scrollBy({ left: sentido * passo, behavior: 'smooth' });
  }
}
