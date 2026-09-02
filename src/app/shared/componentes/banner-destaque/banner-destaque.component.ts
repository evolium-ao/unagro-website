import { Component, computed, input } from '@angular/core';
import { BotaoComponent, PosicaoIcone, TamanhoBotao, VarianteBotao } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';
import { ContainerPaginaComponent } from '../container-pagina/container-pagina.component';

export interface CtaBannerDestaque {
  texto: string;
  variante: VarianteBotao;
  link: string;
  icone?: string;
  posicaoIcone?: PosicaoIcone;
}
export interface HeroImage {
  url: string
  x: string
  y: string
}

/**
 * Em telemóvel o conteúdo fica centrado e a altura acompanha o texto; a partir de
 * `md` regressa ao alinhamento à esquerda e à altura fixa de 500px.
 */
const CLASSES_CONTEUDO_BASE =
  'flex w-full flex-col items-center py-14 text-center md:block md:w-[90%] md:py-0 md:text-left';

/** No hero o conteúdo é empurrado para baixo; no cartão fica centrado e recuado das margens. */
const DESVIO_HERO = 'md:mt-35';
const RECUO_CARTAO = 'sm:px-8 lg:px-14';

@Component({
  selector: 'app-banner-destaque',
  imports: [BotaoComponent, EspacoImagemComponent, SeloComponent, ContainerPaginaComponent],
  template: `
    <section [class]="classesSecao()">
      <app-espaco-imagem
        proporcao="cover"
        alturaMinima="100%"
        class="absolute inset-0"
        [imagem]="bg() ? bg() : '/imagens/campus-hero.png'" />
        @if (temBackdrop()) {

          <div class="absolute inset-0" [class]="classeBackdrop()"></div>
        }

      <app-container-pagina [class]="classesContainer()">
        @if (heroImage(); as objectoImage) {
          <img
            [src]="objectoImage.url"
            alt="Estudante"
            class="pointer-events-none absolute hidden h-[90%] object-contain lg:block"
            [style.bottom]="objectoImage.y"
            [style.left]="objectoImage.x" />
        }
        <div [class]="classesConteudo()">
          @if (selos().length) {
            <div class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
              @for (selo of selos(); track selo) {
                <app-selo variante="segondary">{{ selo }}</app-selo>
              }
            </div>
          }

          @if (titulo()) {
            @if (cartao()) {
              <h2 [class]="classesTitulo()">{{ titulo()
                }}<span class="text-secondary">{{ destaqueComEspaco() }}</span>{{ fimComEspaco() }}</h2>
            } @else {
              <h1 [class]="classesTitulo()">{{ titulo()
                }}<span class="text-secondary">{{ destaqueComEspaco() }}</span>{{ fimComEspaco() }}</h1>
            }
          }
          @if (subtitulo()) {
            <p [class]="classesSubtitulo()">{{ subtitulo() }}</p>
          }
          @if (ctas().length) {
            <div class="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              @for (cta of ctas(); track cta.texto) {
                <app-botao [variante]="cta.variante" [link]="cta.link" [icone]="cta.icone" [posicaoIcone]="cta.posicaoIcone"  [tamanho]="tamanhoCtas()">
                  {{ cta.texto }}
                </app-botao>
              }
            </div>
          }
        </div>
      </app-container-pagina>
    </section>
  `,
})
export class BannerDestaqueComponent {
  readonly titulo = input<string>();
  /** Parte final do título realçada a dourado — ver hero do detalhe de curso. */
  readonly tituloDestaque = input<string>();
  /**
   * Texto que continua depois do realce dourado, para títulos em que a parte
   * realçada fica no meio — ver hero dos eventos. Vazio mantém o realce no fim.
   */
  readonly tituloFim = input<string>();
  readonly subtitulo = input<string>();
  readonly selos = input<string[]>([]);
  readonly ctas = input<CtaBannerDestaque[]>([]);
  readonly tipo = input<'HOME' | 'PAGINA'>();
  readonly temImagen = input(false)
  readonly heroImage = input<HeroImage>()
  readonly temBackdrop = input<boolean>(false)
  readonly bg = input<string>()
  /**
   * Molde de cartão: o mesmo banner encaixado dentro de uma secção — cantos
   * arredondados, mais baixo e com tipografia de subsecção (h2 em vez de h1).
   */
  readonly cartao = input(false)
  /** Camada que escurece a fotografia — preta nos heros, verde nos cartões de secção. */
  readonly classeBackdrop = input('bg-black/50')

  protected readonly classesSecao = computed(() =>
    this.cartao()
      ? 'relative min-h-100 w-full overflow-hidden rounded-2xl bg-bg-light md:h-112'
      : 'relative min-h-100 w-full overflow-hidden bg-bg-light md:h-125',
  );

  protected readonly classesContainer = computed(() =>
    this.cartao()
      ? 'relative z-10 flex h-full flex-col justify-center'
      : 'relative z-10 flex h-full flex-col',
  );

  /** O desvio de 400px só entra em `lg`, onde o recorte do estudante é visível. */
  protected readonly classesConteudo = computed(() => {
    const molde = this.cartao() ? RECUO_CARTAO : DESVIO_HERO;
    const desvioHeroImage = this.heroImage() ? ' lg:ml-100' : '';
    return `${CLASSES_CONTEUDO_BASE} ${molde}${desvioHeroImage}`;
  });

  protected readonly classesTitulo = computed(() =>
    this.cartao()
      ? 'text-2xl inter-900 text-white sm:text-3xl lg:text-4xl'
      : 'text-3xl inter-900 text-white sm:text-4xl lg:text-5xl',
  );

  protected readonly classesSubtitulo = computed(() =>
    this.cartao()
      ? 'mx-auto mt-4 max-w-xl text-base text-white/85 md:mx-0'
      : 'mx-auto mt-4 max-w-xl text-lg text-white/90 md:mx-0',
  );

  protected readonly tamanhoCtas = computed<TamanhoBotao>(() => (this.cartao() ? 'md' : 'lg'));

  /**
   * O espaço que separa o título do realce vem do próprio valor interpolado: no
   * template seria um nó só de espaços e o Angular removê-lo-ia.
   */
  protected readonly destaqueComEspaco = computed(() => {
    const destaque = this.tituloDestaque();
    return destaque ? ` ${destaque}` : '';
  });

  /** Mesma razão do espaço em `destaqueComEspaco`, agora depois do realce. */
  protected readonly fimComEspaco = computed(() => {
    const fim = this.tituloFim();
    return fim ? ` ${fim}` : '';
  });
}
