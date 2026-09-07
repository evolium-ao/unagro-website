import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { IconeComponent } from '../icone/icone.component';

/** Identificador usado para abrir e fechar o modal a partir de qualquer ponto da app. */
export const ID_MODAL_ESTRUTURA_ORGANIZACIONAL = 'modal-estrutura-organizacional';

/** Um nó do organograma, com os textos ainda por traduzir (`[pt, en]`). */
export interface NoOrganograma {
  id: string;
  /** Nome de um ícone de `dados-icones.ts`. Os níveis intermédios não levam ícone. */
  icone?: string;
  titulo: [string, string];
  /** Linha por baixo do título: nível hierárquico ou âmbito da unidade. */
  legenda: [string, string];
}

/** Os quatro níveis do organograma, de cima para baixo. */
export interface EstruturaOrganizacional {
  conselho: NoOrganograma;
  reitoria: NoOrganograma;
  viceReitorias: readonly NoOrganograma[];
  unidades: NoOrganograma;
}

/**
 * Organograma da UNAGRO. Fica no componente (e não em `data`) porque quem abre o modal é
 * um item de menu, que não tem contexto nenhum para passar.
 */
const ESTRUTURA: EstruturaOrganizacional = {
  conselho: {
    id: 'conselho-universitario',
    icone: 'landmark',
    titulo: ['Conselho Universitário', 'University Council'],
    legenda: ['Nível Deliberativo Superior', 'Highest Deliberative Level'],
  },
  reitoria: {
    id: 'reitoria',
    icone: 'trees',
    titulo: ['Reitoria', 'Rectorate'],
    legenda: ['Direção Executiva', 'Executive Management'],
  },
  viceReitorias: [
    {
      id: 'vice-reitoria-academica',
      titulo: ['Vice-Reitoria Académica', 'Academic Vice-Rectorate'],
      legenda: ['Ensino e Graduação', 'Teaching and Undergraduate Studies'],
    },
    {
      id: 'vice-reitoria-investigacao',
      titulo: ['Vice-Reitoria de Investigação', 'Research Vice-Rectorate'],
      legenda: ['I&D e Pós-Graduação', 'R&D and Postgraduate Studies'],
    },
    {
      id: 'vice-reitoria-administrativa',
      titulo: ['Vice-Reitoria Administrativa', 'Administrative Vice-Rectorate'],
      legenda: ['Gestão e Finanças', 'Management and Finance'],
    },
  ],
  unidades: {
    id: 'faculdades-departamentos',
    // Não há ícone de edifício no catálogo: o barrete académico é o mais próximo das
    // faculdades de que o bloco fala.
    icone: 'graduation-cap',
    titulo: ['Faculdades e Departamentos', 'Faculties and Departments'],
    legenda: [
      'Unidades operacionais responsáveis pela execução direta das atividades de ensino, pesquisa e extensão em nossas diversas áreas do saber.',
      'Operational units responsible for directly delivering teaching, research and outreach across our various fields of knowledge.',
    ],
  },
};

/**
 * Conteúdo do modal "Estrutura Organizacional" — renderizado como template do
 * `AlertModalService` (sem header nem botões: o fecho é feito pelo X da barra do topo).
 */
@Component({
  selector: 'app-modal-estrutura-organizacional',
  imports: [IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-white">
      <!-- Barra de topo: acompanha o scroll do painel para o X estar sempre à mão. -->
      <div class="sticky top-0 right-4 z-10 h-12 border-b border-gray-200 bg-white">
        <button
          type="button"
          class="absolute right-4 top-2 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary hover:text-primary"
          [attr.aria-label]="textos().fechar"
          (click)="fechar()"
        >
          <app-icone nome="x" [tamanho]="16" />
        </button>
      </div>

      <div class="px-6 py-12 sm:px-10 sm:py-16">
        <h2 class="text-center text-3xl font-semibold text-text-primary sm:text-4xl">
          {{ textos().titulo }}
        </h2>

        <p class="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-text-secondary">
          {{ textos().subtitulo }}
        </p>

        <div class="mx-auto mt-12 max-w-3xl">
          <!-- Nível 1: órgão deliberativo -->
          <article
            class="mx-auto max-w-xs rounded-2xl bg-primary-deep px-6 py-5 text-center text-white shadow-lg sm:max-w-sm"
          >
            @if (conselho().icone; as icone) {
              <app-icone [nome]="icone" [tamanho]="20" class="text-white" />
            }
            <h3 class="mt-2 text-base font-semibold">{{ conselho().titulo }}</h3>
            <p class="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
              {{ conselho().legenda }}
            </p>
          </article>

          <span aria-hidden="true" class="mx-auto block h-10 w-px bg-gray-200"></span>

          <!-- Nível 2: direção executiva -->
          <article
            class="mx-auto max-w-xs rounded-2xl bg-white px-6 py-5 text-center shadow-lg ring-1 ring-gray-100 sm:max-w-sm"
          >
            @if (reitoria().icone; as icone) {
              <app-icone [nome]="icone" [tamanho]="20" class="text-primary" />
            }
            <h3 class="mt-2 text-base font-semibold text-text-primary">{{ reitoria().titulo }}</h3>
            <p class="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-secondary">
              {{ reitoria().legenda }}
            </p>
          </article>

          <span aria-hidden="true" class="mx-auto block h-10 w-px bg-gray-200"></span>

          <!-- Nível 3: vice-reitorias -->
          <div class="grid gap-4 sm:grid-cols-3">
            @for (vice of viceReitorias(); track vice.id) {
              <article class="rounded-2xl bg-bg-light px-4 py-5 text-center">
                <h3 class="text-sm font-semibold text-text-primary">{{ vice.titulo }}</h3>
                <p class="mt-1 text-[11px] leading-relaxed text-text-secondary">
                  {{ vice.legenda }}
                </p>
              </article>
            }
          </div>

          <!-- Nível 4: unidades operacionais -->
          <article class="mt-10 rounded-3xl bg-secondary/15 px-6 py-8 text-center sm:px-10">
            @if (unidades().icone; as icone) {
              <app-icone [nome]="icone" [tamanho]="22" class="text-primary" />
            }
            <h3 class="mt-3 text-lg font-semibold text-primary sm:text-xl">
              {{ unidades().titulo }}
            </h3>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              {{ unidades().legenda }}
            </p>
          </article>
        </div>
      </div>
    </div>
  `,
})
export class ModalEstruturaOrganizacionalComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);

  /** Aberto para o dia em que o organograma vier da API; por omissão é a estrutura local. */
  readonly estrutura = input<EstruturaOrganizacional>(ESTRUTURA);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Estrutura Organizacional', 'Organisational Structure']),
    subtitulo: this.traducao.getTraducao([
      'Nossa organização é estruturada para garantir a excelência académica e a eficiência administrativa em todos os níveis da instituição.',
      'Our organisation is structured to ensure academic excellence and administrative efficiency at every level of the institution.',
    ]),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
  }));

  protected readonly conselho = computed(() => this.traduzirNo(this.estrutura().conselho));
  protected readonly reitoria = computed(() => this.traduzirNo(this.estrutura().reitoria));
  protected readonly unidades = computed(() => this.traduzirNo(this.estrutura().unidades));

  protected readonly viceReitorias = computed(() =>
    this.estrutura().viceReitorias.map((vice) => this.traduzirNo(vice)),
  );

  private traduzirNo(no: NoOrganograma) {
    return {
      id: no.id,
      icone: no.icone,
      titulo: this.traducao.getTraducao(no.titulo),
      legenda: this.traducao.getTraducao(no.legenda),
    };
  }

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_ESTRUTURA_ORGANIZACIONAL);
  }
}
