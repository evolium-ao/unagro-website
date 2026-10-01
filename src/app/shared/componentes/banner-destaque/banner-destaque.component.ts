import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { BotaoComponent, PosicaoIcone, TamanhoBotao, VarianteBotao } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';
import { ContainerPaginaComponent } from '../container-pagina/container-pagina.component';
import { IconeComponent } from '../icone/icone.component';

export interface CtaBannerDestaque {
  texto: string;
  variante: VarianteBotao;
  link: string;
  icone?: string;
  posicaoIcone?: PosicaoIcone;
}
/** Item da linha de metadados do banner — ver hero do detalhe de projecto. */
export interface MetadadoBanner {
  /** Nome de um ícone de `dados-icones.ts`. */
  icone: string;
  texto: string;
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
/**
 * Com o recorte do estudante o conteúdo recua 400px (`ml-100`), logo tem de
 * perder essa mesma largura — senão os 90% do contentor passam a margem direita
 * e o `overflow-hidden` corta o título em vez de o deixar quebrar.
 */
const DESVIO_HERO_IMAGEM = ' lg:ml-100 lg:w-[calc(90%-25rem)]';

/**
 * Entrada em cascata do banner: cada linha sobe, ganha nitidez e assenta com
 * mola, enquanto o fundo desamplia. O atraso de cada bloco vive aqui e é lido do
 * `data-animar` do elemento, para o template não ter de saber números.
 */
const ATRASOS_S = {
  fundo: 0,
  imagem: 0.15,
  selos: 0.05,
  titulo: 0.12,
  subtitulo: 0.2,
  metadados: 0.26,
  ctas: 0.32,
} as const;
type BlocoAnimado = keyof typeof ATRASOS_S;

/** Distância que os blocos de texto sobem ao entrar. */
const DESLOCAMENTO_TEXTO_PX = 16;
/** O recorte entra da esquerda, de onde a coluna de texto o empurra. */
const DESLOCAMENTO_IMAGEM_PX = -40;
/** O desfoque a resolver é o que dá ao texto a leitura de foco a acertar. */
const DESFOQUE_TEXTO = 'blur(8px)';
const SEM_DESFOQUE = 'blur(0px)';
/** O fundo entra ligeiramente ampliado e assenta — o `overflow-hidden` corta o excesso. */
const ESCALA_FUNDO = 1.06;
/** Mola curta: chega com um ressalto pequeno, sem parecer elástico. */
const MOLA = { type: 'spring', bounce: 0.25, duration: 0.8 } as const;
/** O fundo é grande e move-se pouco: precisa de mais tempo e de travagem suave. */
const DURACAO_FUNDO_S = 1.2;
const CURVA_FUNDO: [number, number, number, number] = [0.22, 1, 0.36, 1];
/**
 * Se o Motion falhar a carregar ou o `inView` nunca disparar, o banner não pode
 * ficar invisível para sempre — é o conteúdo mais visível da página.
 */
const TEMPO_LIMITE_MS = 2000;

@Component({
  selector: 'app-banner-destaque',
  imports: [BotaoComponent, EspacoImagemComponent, SeloComponent, ContainerPaginaComponent, IconeComponent],
  template: `
    <section [class]="classesSecao()">
      <app-espaco-imagem
        proporcao="cover"
        alturaMinima="100%"
        class="absolute inset-0"
        data-animar="fundo"
        [style]="estiloFundo()"
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
            data-animar="imagem"
            [style]="estiloImagem()"
            [style.bottom]="objectoImage.y"
            [style.left]="objectoImage.x" />
        }
        <div [class]="classesConteudo()">
          @if (selos().length) {
            <div
              class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start"
              data-animar="selos"
              [style]="estiloTexto()">
              @for (selo of selos(); track selo) {
                <app-selo variante="segondary">{{ selo }}</app-selo>
              }
            </div>
          }

          @if (titulo()) {
            @if (cartao()) {
              <h2 [class]="classesTitulo()" data-animar="titulo" [style]="estiloTexto()">{{ titulo()
                }}<span class="text-secondary">{{ destaqueComEspaco() }}</span>{{ fimComEspaco() }}</h2>
            } @else {
              <h1 [class]="classesTitulo()" data-animar="titulo" [style]="estiloTexto()">{{ titulo()
                }}<span class="text-secondary">{{ destaqueComEspaco() }}</span>{{ fimComEspaco() }}</h1>
            }
          }
          @if (subtitulo()) {
            <p [class]="classesSubtitulo()" data-animar="subtitulo" [style]="estiloTexto()">{{ subtitulo() }}</p>
          }
          @if (metadados().length) {
            <div
              class="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-start"
              data-animar="metadados"
              [style]="estiloTexto()">
              @for (metadado of metadados(); track metadado.texto) {
                <span class="inline-flex items-center gap-2 text-sm text-white/90">
                  <app-icone [nome]="metadado.icone" [tamanho]="16" class="text-white/70" />
                  {{ metadado.texto }}
                </span>
              }
            </div>
          }
          @if (ctas().length) {
            <div
              class="mt-8 flex flex-wrap justify-center gap-4 md:justify-start"
              data-animar="ctas"
              [style]="estiloTexto()">
              @for (cta of ctas(); track cta.texto) {
                <app-botao [variante]="cta.variante" [link]="cta.link" [icone]="cta.icone" [posicaoIcone]="cta.posicaoIcone"  [tamanho]="tamanhoCtas()">
                  {{ cta.texto }}
                </app-botao>
              }
            </div>
          }
          <!-- Conteúdo extra abaixo dos CTAs (ex.: campo de e-mail do hero da
               candidatura docente). Sem nada projectado não gera DOM nenhum, por
               isso os banners que já existem ficam iguais. Para entrar na cascata,
               o elemento projectado pode trazer data-animar="ctas". -->
          <ng-content />
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
  /**
   * Linha de metadados (local, período, categoria) abaixo do título. Vazia por
   * omissão para não alterar os banners que já existem.
   */
  readonly metadados = input<MetadadoBanner[]>([]);
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

  private readonly hospedeiro = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * Esconde os blocos animados. Fica `false` no servidor, para o HTML
   * prerenderizado continuar a sair com o texto todo, e é ligado no construtor —
   * antes da primeira pintura — quando há navegador e movimento permitido.
   */
  private readonly oculto = signal(false);
  private readonly controles: { finished: Promise<unknown>; stop: () => void }[] = [];
  private pararObservacao?: VoidFunction;
  private idTempoLimite?: ReturnType<typeof setTimeout>;
  private animado = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.limpar());

    if (!this.ehNavegador || this.movimentoReduzido()) {
      return;
    }
    this.oculto.set(true);
    afterNextRender(() => void this.animar());
  }

  /** Estado inicial dos blocos de texto: em baixo, transparentes e desfocados. */
  protected readonly estiloTexto = computed(() =>
    this.oculto()
      ? {
        opacity: '0',
        transform: `translateY(${DESLOCAMENTO_TEXTO_PX}px)`,
        filter: DESFOQUE_TEXTO,
      }
      : null,
  );

  protected readonly estiloImagem = computed(() =>
    this.oculto() ? { opacity: '0', transform: `translateX(${DESLOCAMENTO_IMAGEM_PX}px)` } : null,
  );

  protected readonly estiloFundo = computed(() =>
    this.oculto() ? { transform: `scale(${ESCALA_FUNDO})` } : null,
  );

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
    const desvioHeroImage = this.heroImage() ? DESVIO_HERO_IMAGEM : '';
    return `${CLASSES_CONTEUDO_BASE} ${molde}${desvioHeroImage}`;
  });

  protected readonly classesTitulo = computed(() =>
    this.cartao()
      ? 'text-2xl inter-700 text-balance break-words text-white sm:text-3xl lg:text-4xl'
      : 'text-3xl inter-700 text-balance break-words text-white sm:text-4xl lg:text-5xl',
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

  private movimentoReduzido(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Espera que a secção entre no ecrã antes de animar. No hero isso acontece no
   * primeiro fotograma; no molde de cartão — que vive a meio da página — é o que
   * evita a cascata correr sem ninguém a ver.
   */
  private async animar(): Promise<void> {
    this.idTempoLimite = setTimeout(() => this.mostrarSemAnimacao(), TEMPO_LIMITE_MS);

    try {
      const { animate, inView } = await import('motion');
      const secao = this.hospedeiro.querySelector('section') ?? this.hospedeiro;

      this.pararObservacao = inView(
        secao,
        () => {
          if (this.animado) {
            return;
          }
          this.animado = true;
          this.limpar();

          const alvos = Array.from(
            this.hospedeiro.querySelectorAll<HTMLElement>('[data-animar]'),
          );

          for (const alvo of alvos) {
            const bloco = alvo.dataset['animar'] as BlocoAnimado | undefined;
            if (!bloco) {
              continue;
            }

            if (bloco === 'fundo') {
              this.controles.push(
                animate(
                  alvo,
                  { scale: [ESCALA_FUNDO, 1] },
                  { duration: DURACAO_FUNDO_S, ease: CURVA_FUNDO },
                ),
              );
            } else if (bloco === 'imagem') {
              this.controles.push(
                animate(
                  alvo,
                  { opacity: [0, 1], x: [DESLOCAMENTO_IMAGEM_PX, 0] },
                  { ...MOLA, delay: ATRASOS_S[bloco] },
                ),
              );
            } else {
              this.controles.push(
                animate(
                  alvo,
                  {
                    opacity: [0, 1],
                    y: [DESLOCAMENTO_TEXTO_PX, 0],
                    filter: [DESFOQUE_TEXTO, SEM_DESFOQUE],
                  },
                  { ...MOLA, delay: ATRASOS_S[bloco] },
                ),
              );
            }
          }

          // No fim retira-se o estado inicial: o destino da animação é o estado
          // natural dos elementos, e assim o banner não fica com estilos em linha.
          void Promise.allSettled(this.controles.map((controle) => controle.finished)).then(() =>
            this.oculto.set(false),
          );
        },
        { amount: 0.15 },
      );
    } catch {
      this.mostrarSemAnimacao();
    }
  }

  private mostrarSemAnimacao(): void {
    if (this.animado) {
      return;
    }
    this.animado = true;
    this.limpar();
    this.oculto.set(false);
  }

  private limpar(): void {
    this.pararObservacao?.();
    this.pararObservacao = undefined;
    clearTimeout(this.idTempoLimite);
  }
}
