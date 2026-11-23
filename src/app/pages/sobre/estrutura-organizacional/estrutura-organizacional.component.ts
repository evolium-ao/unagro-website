import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import {
  ESTRUTURA,
  EstruturaOrganizacional,
  NoOrganograma,
} from '../../../shared/componentes/modal-estrutura-organizacional/modal-estrutura-organizacional.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Aba "Estrutura organizacional" de `/sobre`.
 *
 * É o organograma do `app-modal-estrutura-organizacional` sem a barra de topo nem o X
 * de fecho, e reusa a **mesma** `ESTRUTURA` exportada por esse componente.
 */
@Component({
  selector: 'app-sobre-estrutura-organizacional',
  imports: [IconeComponent, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
        appRevelarAoScroll
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
        [appRevelarAoScroll]="1"
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
          <article
            class="rounded-2xl bg-bg-light px-4 py-5 text-center"
            [appRevelarAoScroll]="$index + 2"
          >
            <h3 class="text-sm font-semibold text-text-primary">{{ vice.titulo }}</h3>
            <p class="mt-1 text-[11px] leading-relaxed text-text-secondary">
              {{ vice.legenda }}
            </p>
          </article>
        }
      </div>

      <!-- Nível 4: unidades operacionais -->
      <article
        class="mt-10 rounded-3xl bg-secondary/15 px-6 py-8 text-center sm:px-10"
        [appRevelarAoScroll]="5"
      >
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
  `,
})
export class SobreEstruturaOrganizacionalComponent {
  private readonly traducao = inject(TraducaoService);

  /** Aberto para o dia em que o organograma vier da API; por omissão é a estrutura local. */
  readonly estrutura = input<EstruturaOrganizacional>(ESTRUTURA);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Estrutura Organizacional', 'Organisational Structure']),
    subtitulo: this.traducao.getTraducao([
      'Nossa organização é estruturada para garantir a excelência académica e a eficiência administrativa em todos os níveis da instituição.',
      'Our organisation is structured to ensure academic excellence and administrative efficiency at every level of the institution.',
    ]),
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
}
