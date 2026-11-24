import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { IconeComponent } from '../icone/icone.component';

/** Identificador usado para abrir e fechar o modal a partir de qualquer ponto da app. */
export const ID_MODAL_PILARES = 'modal-pilares-institucionais';

/** Um pilar institucional, com os textos ainda por traduzir (`[pt, en]`). */
export interface PilarInstitucional {
  id: string;
  /** Nome de um ícone de `dados-icones.ts`. */
  icone: string;
  titulo: [string, string];
  /** Corpo em parágrafo. Exclusivo com `itens`. */
  texto?: [string, string];
  /** Corpo em lista de vistos (ex: os Valores). Exclusivo com `texto`. */
  itens?: [string, string][];
}

/**
 * Os três pilares da UNAGRO. Ficam no componente (e não em `data`) porque quem abre o
 * modal é um item de menu, que não tem contexto nenhum para passar.
 */
export const PILARES: readonly PilarInstitucional[] = [
  {
    id: 'missao',
    icone: 'target',
    titulo: ['Missão', 'Mission'],
    texto: [
      'Promover o desenvolvimento do agronegócio através de ensino superior de alta qualidade, pesquisa aplicada e transferência de tecnologia para a sociedade.',
      'To promote the development of agribusiness through high-quality higher education, applied research and technology transfer to society.',
    ],
  },
  {
    id: 'visao',
    // Não existe ícone de "olho" no catálogo: o globo é o mais próximo do
    // reconhecimento mundial de que a visão fala.
    icone: 'globe',
    titulo: ['Visão', 'Vision'],
    texto: [
      'Ser a instituição de referência em Agribusiness na África Subsariana até 2030, reconhecida mundialmente pela sustentabilidade e inovação.',
      'To be the leading Agribusiness institution in Sub-Saharan Africa by 2030, globally recognised for sustainability and innovation.',
    ],
  },
  {
    id: 'valores',
    icone: 'shield-check',
    titulo: ['Valores', 'Values'],
    itens: [
      ['Integridade Académica', 'Academic Integrity'],
      ['Responsabilidade Social', 'Social Responsibility'],
      ['Sustentabilidade', 'Sustainability'],
      ['Excelência Técnica', 'Technical Excellence'],
    ],
  },
];

/**
 * Conteúdo do modal "Pilares Institucionais" — renderizado como template do
 * `AlertModalService` (sem header nem botões: o fecho é feito pelo X do canto).
 */
@Component({
  selector: 'app-modal-pilares-institucionais',
  imports: [IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-white">
      <!-- Fechar -->
      <button
        type="button"
        class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary hover:text-primary"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="16" />
      </button>

      <div class="px-6 py-12 sm:px-10 sm:py-16">
        <h2 class="text-center text-3xl font-semibold text-text-primary sm:text-4xl">
          {{ textos().titulo }}
        </h2>

        <!-- Separador: três traços dourados -->
        <div aria-hidden="true" class="mt-5 flex items-center justify-center gap-1.5">
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
          <span class="h-1 w-6 rounded-full bg-secondary"></span>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          @for (pilar of pilares(); track pilar.id) {
            <article class="h-full rounded-2xl bg-white p-6 border border-gray-200">
              <span
                class="inline-flex h-13 w-13 items-center justify-center rounded-xl bg-bg-light text-primary-deep"
              >
                <app-icone [nome]="pilar.icone" [tamanho]="24" />
              </span>

              <h3 class="mt-6 text-base font-bold text-text-primary">{{ pilar.titulo }}</h3>

              @if (pilar.itens.length) {
                <ul class="mt-3 space-y-2">
                  @for (item of pilar.itens; track item) {
                    <li class="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                      <app-icone
                        nome="check"
                        [tamanho]="16"
                        class="mt-0.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              } @else {
                <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ pilar.texto }}</p>
              }
            </article>
          }
        </div>
      </div>
    </div>
  `,
})
export class ModalPilaresInstitucionaisComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);

  /** Aberto para o dia em que os pilares vierem da API; por omissão é a lista local. */
  readonly pilaresInstitucionais = input<readonly PilarInstitucional[]>(PILARES);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Pilares Institucionais', 'Institutional Pillars']),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
  }));

  protected readonly pilares = computed(() =>
    this.pilaresInstitucionais().map((pilar) => ({
      id: pilar.id,
      icone: pilar.icone,
      titulo: this.traducao.getTraducao(pilar.titulo),
      texto: pilar.texto ? this.traducao.getTraducao(pilar.texto) : '',
      itens: (pilar.itens ?? []).map((item) => this.traducao.getTraducao(item)),
    })),
  );

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_PILARES);
  }
}
