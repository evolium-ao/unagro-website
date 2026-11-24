import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import {
  MEMBROS_GESTAO,
  MembroGestao,
} from '../../../shared/componentes/modal-orgaos-gestao/modal-orgaos-gestao.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Aba "Orgãos de gestão" de `/sobre`.
 *
 * É o conteúdo do `app-modal-orgaos-gestao` sem a barra de topo nem o X de fecho, e
 * reusa a **mesma** lista `MEMBROS_GESTAO` exportada por esse componente.
 */
@Component({
  selector: 'app-sobre-orgaos-gestao',
  imports: [RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">
      {{ textos().sobrerotulo }}
    </p>

    <h2 class="mt-4 text-center text-3xl font-semibold text-text-primary sm:text-4xl">
      {{ textos().titulo }}
    </h2>

    <p class="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-text-secondary">
      {{ textos().subtitulo }}
    </p>

    <div class="relative mt-12">
      <!-- Canto decorativo em "L" -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute -left-3 -top-6 h-20 w-20 border-l border-t border-secondary/50 sm:-left-5 sm:-top-8 sm:h-28 sm:w-28"
      ></span>

      <div class="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        @for (membro of membros(); track membro.id) {
          <article class="rounded-2xl bg-white shadow-md" [appRevelarAoScroll]="$index">
            <div class="relative">
              <img
                [src]="membro.imagem"
                [alt]="membro.alt"
                width="272"
                height="340"
                class="aspect-[3/4] w-full rounded-t-2xl object-cover object-top"
              />
              <span
                class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full bg-primary-deep px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
              >
                {{ membro.etiqueta }}
              </span>
            </div>

            <div class="px-4 pb-6 pt-8 text-center">
              <h3 class="text-sm font-bold text-text-primary">{{ membro.nome }}</h3>
              <p class="mt-1 text-xs text-text-secondary">{{ membro.cargo }}</p>
            </div>
          </article>
        }
      </div>
    </div>
  `,
})
export class SobreOrgaosGestaoComponent {
  private readonly traducao = inject(TraducaoService);

  /** Aberto para o dia em que a estrutura directiva vier da API; por omissão é a lista local. */
  readonly membrosGestao = input<readonly MembroGestao[]>(MEMBROS_GESTAO);

  protected readonly textos = computed(() => ({
    sobrerotulo: this.traducao.getTraducao(['Liderança Executiva', 'Executive Leadership']),
    titulo: this.traducao.getTraducao(['Órgãos de Gestão', 'Governing Bodies']),
    subtitulo: this.traducao.getTraducao([
      'Nossa estrutura directiva é composta por académicos e gestores comprometidos com a visão estratégica e a governança transparente da UNAGRO.',
      "Our leadership structure is made up of academics and managers committed to UNAGRO's strategic vision and transparent governance.",
    ]),
  }));

  protected readonly membros = computed(() =>
    this.membrosGestao().map((membro) => ({
      id: membro.id,
      nome: membro.nome,
      imagem: membro.imagem,
      etiqueta: this.traducao.getTraducao(membro.etiqueta),
      cargo: this.traducao.getTraducao(membro.cargo),
      alt: `${this.traducao.getTraducao(['Retrato de', 'Portrait of'])} ${membro.nome}`,
    })),
  );
}
