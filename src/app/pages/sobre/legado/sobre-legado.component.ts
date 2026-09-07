import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { localizarProfundo } from '../../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';

/**
 * A página `/sobre` **como era antes das abas** — hero simples, Missão/Visão, os quatro
 * valores em cartões e o parágrafo da história, todos vindos de `paginas.sobre.*`.
 *
 * Guardado aqui inteiro, e fora do routing, para a proposta anterior não se perder: o
 * conteúdo novo vive nas abas (`../nossa-historia`, `../pilares-institucionais`, …) e
 * este componente é a referência de reversão. Para voltar atrás, o
 * `sobre.component.html` só tem de render `<app-sobre-legado />` — ou recuperar-se o
 * ficheiro original com `git show <commit>:src/app/pages/sobre/sobre.component.html`.
 */

interface ValorBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const VALORES_BRUTOS: ValorBruto[] = [
  {
    icone: 'sprout',
    titulo: { pt: 'Sustentabilidade', en: 'Sustainability' },
    descricao: {
      pt: 'Práticas agrícolas e de gestão que respeitam o ambiente e as gerações futuras.',
      en: 'Agricultural and management practices that respect the environment and future generations.',
    },
  },
  {
    icone: 'flask-conical',
    titulo: { pt: 'Rigor Científico', en: 'Scientific Rigor' },
    descricao: {
      pt: 'Investigação aplicada com metodologia sólida e resultados verificáveis.',
      en: 'Applied research with solid methodology and verifiable results.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Compromisso Comunitário', en: 'Community Commitment' },
    descricao: {
      pt: 'Trabalho lado a lado com produtores e cooperativas locais.',
      en: 'Working side by side with local farmers and cooperatives.',
    },
  },
  {
    icone: 'award',
    titulo: { pt: 'Excelência Académica', en: 'Academic Excellence' },
    descricao: {
      pt: 'Formação exigente que prepara profissionais para os desafios reais do sector.',
      en: "Demanding training that prepares professionals for the sector's real challenges.",
    },
  },
];

@Component({
  selector: 'app-sobre-legado',
  imports: [IconeComponent, EspacoImagemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-bg-light">
      <div
        class="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"
      >
        <div>
          <h1 class="text-3xl font-bold text-text-primary sm:text-4xl">
            {{ traducao.t('paginas.sobre.titulo') }}
          </h1>
          <p class="mt-3 max-w-xl text-text-secondary">
            {{ traducao.t('paginas.sobre.subtitulo') }}
          </p>
        </div>
        <app-espaco-imagem proporcao="video" alturaMinima="280px" />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 class="text-xl font-semibold text-text-primary">
            {{ traducao.t('paginas.sobre.missaoTitulo') }}
          </h2>
          <p class="mt-3 text-text-secondary">{{ traducao.t('paginas.sobre.missaoTexto') }}</p>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">
            {{ traducao.t('paginas.sobre.visaoTitulo') }}
          </h2>
          <p class="mt-3 text-text-secondary">{{ traducao.t('paginas.sobre.visaoTexto') }}</p>
        </div>
      </div>
    </section>

    <section class="bg-bg-light">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <h2 class="text-xl font-semibold text-text-primary">
          {{ traducao.t('paginas.sobre.valoresTitulo') }}
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (valor of valores(); track valor.titulo) {
            <div class="flex flex-col items-start gap-2 rounded-lg bg-white p-5 shadow-sm">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <app-icone [nome]="valor.icone" [tamanho]="20" />
              </div>
              <h3 class="font-semibold text-text-primary">{{ valor.titulo }}</h3>
              <p class="text-sm text-text-secondary">{{ valor.descricao }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <h2 class="text-xl font-semibold text-text-primary">
        {{ traducao.t('paginas.sobre.historiaTitulo') }}
      </h2>
      <p class="mt-3 max-w-3xl text-text-secondary">
        {{ traducao.t('paginas.sobre.historiaTexto') }}
      </p>
    </section>
  `,
})
export class SobreLegadoComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly valores = computed(() =>
    localizarProfundo(VALORES_BRUTOS, this.traducao.idioma()),
  );
}
