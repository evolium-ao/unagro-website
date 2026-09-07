import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { IconeComponent } from '../icone/icone.component';

/** Identificador usado para abrir e fechar o modal a partir de qualquer ponto da app. */
export const ID_MODAL_ORGAOS_GESTAO = 'modal-orgaos-gestao';

/** Um membro da estrutura directiva, com os textos ainda por traduzir (`[pt, en]`). */
export interface MembroGestao {
  id: string;
  /** Etiqueta do órgão, sobreposta à fotografia. */
  etiqueta: [string, string];
  /** Nome próprio — não se traduz. */
  nome: string;
  cargo: [string, string];
  imagem: string;
}

/**
 * Estrutura directiva da UNAGRO. Fica no componente (e não em `data`) porque quem abre
 * o modal é um item de menu, que não tem contexto nenhum para passar.
 */
export const MEMBROS_GESTAO: readonly MembroGestao[] = [
  {
    id: 'reitoria',
    etiqueta: ['Reitoria', 'Rectorate'],
    nome: 'Professor Doutor Augusto Caetano João',
    cargo: ['Magnífico Reitor', 'Rector'],
    imagem: '/imagens/professor-doutor-augusto.png',
  },
  {
    id: 'vice-reitoria',
    etiqueta: ['Vice-Reitoria', 'Vice-Rectorate'],
    nome: 'Dr. Abel van Dunem',
    cargo: ['Vice-Reitor de Investigação', 'Vice-Rector for Research'],
    imagem: '/imagens/Dr-abel-van--dunem.png',
  },
  {
    id: 'coordenacao',
    etiqueta: ['Coordenação', 'Coordination'],
    nome: 'Dr. Mendes Adão',
    cargo: ['Coordenador Administrativo', 'Administrative Coordinator'],
    imagem: '/imagens/Dr-menddes-adao.png',
  },
  {
    id: 'conselho',
    etiqueta: ['Conselho', 'Council'],
    nome: 'Francisco Kalenga',
    cargo: ['Técnico Administrativo', 'Administrative Officer'],
    imagem: '/imagens/francisco-calenga.png',
  },
];

/**
 * Conteúdo do modal "Órgãos de Gestão" — renderizado como template do
 * `AlertModalService` (sem header nem botões: o fecho é feito pelo X do canto).
 */
@Component({
  selector: 'app-modal-orgaos-gestao',
  imports: [IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-white">
      <div class="sticky top-0 right-4 bg-white border-b border-gray-200 h-12">
        <button
          type="button"
          class="absolute right-4 top-2 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary hover:text-primary"
          [attr.aria-label]="textos().fechar"
          (click)="fechar()"
        >
          <app-icone nome="x" [tamanho]="16" />
        </button>

      </div>
      <!-- Fechar -->

      <div class="px-6 py-12 sm:px-10 sm:py-16">
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
              <article class="rounded-2xl bg-white shadow-md">
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
      </div>
    </div>
  `,
})
export class ModalOrgaosGestaoComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);

  /** Aberto para o dia em que a estrutura directiva vier da API; por omissão é a lista local. */
  readonly membrosGestao = input<readonly MembroGestao[]>(MEMBROS_GESTAO);

  protected readonly textos = computed(() => ({
    sobrerotulo: this.traducao.getTraducao(['Liderança Executiva', 'Executive Leadership']),
    titulo: this.traducao.getTraducao(['Órgãos de Gestão', 'Governing Bodies']),
    subtitulo: this.traducao.getTraducao([
      'Nossa estrutura diretiva é composta por académicos e gestores comprometidos com a visão estratégica e a governança transparente da UNAGRO.',
      "Our leadership structure is made up of academics and managers committed to UNAGRO's strategic vision and transparent governance.",
    ]),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
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

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_ORGAOS_GESTAO);
  }
}
