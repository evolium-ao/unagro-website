import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { faculdadesQueries } from '../../../core/consultas/faculdades.queries';
import { ofertaCurricularQueries } from '../../../core/consultas/oferta-curricular.queries';
import { traducaoQueries } from '../../../core/consultas/traducao.queries';
import {
  CursoCandidaturaGeral,
  DisciplinaCandidaturaGeral,
} from '../../../core/modelos/candidatura-geral.model';
import { FaculdadesService } from '../../../core/servicos/faculdades.service';
import { OfertaCurricularService } from '../../../core/servicos/oferta-curricular.service';
import { TraducaoAutomaticaService } from '../../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { aplicarTraducaoTextos } from '../../../core/traducao/traduzir-campos';
import { AcordeaoComponent } from '../../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../../shared/componentes/acordeao/item-acordeao.component';
import {
  FiltroPilulaComponent,
  OpcaoFiltroPilula,
} from '../../../shared/componentes/filtro-pilula/filtro-pilula.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/** Faculdade como a aba a mostra: os cursos reais e as disciplinas comuns a todos eles. */
interface FaculdadePlano {
  id: string;
  nome: string;
  cursos: CursoCandidaturaGeral[];
  comuns: DisciplinaCandidaturaGeral[];
}

/**
 * Aba "Cursos" de `/sobre`: cada curso com o seu plano curricular (as disciplinas
 * que se leccionam), agrupado por faculdade.
 *
 * Os dados são os mesmos da candidatura geral — `GET /candidaturas-docentes/areas`
 * (faculdade → cursos → disciplinas), pela mesma `ofertaCurricularQueries.lista`,
 * por isso a cache é partilhada com `/candidatura-geral`. As disciplinas já vêm
 * ordenadas pela `ordem` do plano (ver `OfertaCurricularService`).
 *
 * Mesma disposição da aba "Faculdades e departamentos": texto à esquerda, conteúdo
 * à direita; o plano de cada curso usa o acordeão, como em `/cursos/:id`.
 */
@Component({
  selector: 'app-sobre-cursos',
  imports: [
    AcordeaoComponent,
    ItemAcordeaoComponent,
    FiltroPilulaComponent,
    IconeComponent,
    NgTemplateOutlet,
    RevelarAoScrollDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <!-- Texto, filtro por faculdade e totais reais da oferta -->
      <div class="lg:col-span-2" appRevelarAoScroll>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{{ textos().kicker }}</p>
        <h2 class="mt-3 text-2xl font-bold text-primary-deep sm:text-3xl">{{ textos().titulo }}</h2>
        <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ textos().subtitulo }}</p>

        @if (aCarregar()) {
          <div class="mt-8 h-24 w-full animate-pulse rounded-2xl bg-bg-light" aria-hidden="true"></div>
        } @else if (faculdadesOriginais().length) {
          @if (opcoesFaculdade().length > 1) {
            <div class="mt-8">
              <app-filtro-pilula [rotulo]="textos().filtroFaculdade" [opcoes]="opcoesFaculdade()"
                [(valor)]="faculdadeFiltro" />
            </div>
          }

          <div class="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-bg-light p-5">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-primary-deep shadow-sm">
              <app-icone nome="square-check-list" [tamanho]="20" />
            </span>
            <div>
              <p class="text-base font-bold text-text-primary">
                {{ totais().cursos }} {{ textos().cursosRotulo }} · {{ totais().disciplinas }}
                {{ textos().disciplinasRotulo }}
              </p>
              <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ textos().totaisDescricao }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Cursos: um acordeão por faculdade, um item por curso com o plano curricular -->
      <div class="lg:col-span-3">
        @if (aCarregar()) {
          <div class="flex flex-col gap-3" aria-hidden="true">
            @for (_ of [1, 2, 3, 4, 5]; track $index) {
              <div class="h-14 w-full animate-pulse rounded-lg bg-bg-light"></div>
            }
          </div>
        } @else if (consultaOferta.isError() && !consultaOferta.data()) {
          <p class="flex flex-wrap items-center justify-center gap-2 py-12 text-center text-sm text-text-secondary"
            role="alert">
            {{ textos().erro }}
            <button type="button" class="cursor-pointer font-semibold text-primary underline hover:text-primary-dark"
              (click)="recarregar()">{{ textos().tentarNovamente }}</button>
          </p>
        } @else {
          <div class="flex flex-col gap-10">
            @for (faculdade of faculdadesVisiveis(); track faculdade.id; let iFaculdade = $index) {
              <div [appRevelarAoScroll]="iFaculdade">
                <h3 class="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-deep">
                  <app-icone nome="landmark" [tamanho]="16" class="text-secondary" />
                  {{ faculdade.nome }}
                </h3>

                <app-acordeao variante="cartoes" class="block">
                  @for (curso of faculdade.cursos; track curso.id; let iCurso = $index) {
                    <app-item-acordeao [titulo]="curso.nome" [inicialmenteAberto]="iFaculdade === 0 && iCurso === 0">
                      <ng-container
                        *ngTemplateOutlet="listaDisciplinas; context: { $implicit: curso.disciplinas, rotulo: textos().planoCurricular }" />
                    </app-item-acordeao>
                  }
                  @if (faculdade.comuns.length) {
                    <app-item-acordeao [titulo]="textos().disciplinasComuns">
                      <ng-container
                        *ngTemplateOutlet="listaDisciplinas; context: { $implicit: faculdade.comuns, rotulo: textos().disciplinasComunsDescricao }" />
                    </app-item-acordeao>
                  }
                </app-acordeao>
              </div>
            } @empty {
              <p class="py-12 text-center text-sm text-text-secondary">{{ textos().vazio }}</p>
            }
          </div>
        }
      </div>
    </div>

    <!-- Lista de disciplinas, partilhada pelos cursos e pelas disciplinas comuns da faculdade -->
    <ng-template #listaDisciplinas let-disciplinas let-rotulo="rotulo">
      <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-secondary">
        {{ rotulo }} · {{ disciplinas.length }}
        {{ disciplinas.length === 1 ? textos().disciplinaRotulo : textos().disciplinasRotulo }}
      </p>

      @if (disciplinas.length) {
        <ol class="flex flex-col gap-2.5">
          @for (disciplina of disciplinas; track disciplina.id; let i = $index) {
            <li class="flex items-start gap-3">
              <span
                class="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md border border-gray-200 px-1 text-[10px] font-bold text-text-primary">
                {{ disciplina.codigo || (i + 1).toString().padStart(2, '0') }}
              </span>
              <div class="min-w-0">
                <p class="font-medium text-text-primary">{{ disciplina.nome }}</p>
                @if (disciplina.descricao) {
                  <p class="mt-0.5 text-xs leading-relaxed text-text-secondary">{{ disciplina.descricao }}</p>
                }
              </div>
            </li>
          }
        </ol>
      } @else {
        <p class="text-sm text-text-secondary">{{ textos().semDisciplinas }}</p>
      }
    </ng-template>
  `,
})
export class SobreCursosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly ofertaCurricular = inject(OfertaCurricularService);
  private readonly faculdadesService = inject(FaculdadesService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  /** `id` da faculdade escolhida no filtro; `''` mostra todas. */
  protected readonly faculdadeFiltro = signal('');

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      kicker: t('Oferta Formativa', 'Academic Offer'),
      titulo: t('Cursos e Planos Curriculares', 'Degree Programmes and Curricula'),
      subtitulo: t(
        'Conheça os cursos de cada faculdade e as disciplinas que compõem o respectivo plano curricular.',
        'Explore the programmes of each faculty and the courses that make up their curriculum.',
      ),
      filtroFaculdade: t('Faculdade', 'Faculty'),
      cursosRotulo: t('Cursos', 'Programmes'),
      disciplinaRotulo: t('Disciplina', 'Course'),
      disciplinasRotulo: t('Disciplinas', 'Courses'),
      totaisDescricao: t(
        'Abra um curso para ver as disciplinas leccionadas, pela ordem do plano.',
        'Open a programme to see the courses taught, in curriculum order.',
      ),
      planoCurricular: t('Plano curricular', 'Curriculum'),
      disciplinasComuns: t('Disciplinas comuns da faculdade', 'Faculty common courses'),
      disciplinasComunsDescricao: t('Comuns aos cursos da faculdade', 'Shared by the faculty programmes'),
      semDisciplinas: t('Plano curricular ainda por publicar.', 'Curriculum not yet published.'),
      vazio: t('Ainda não há cursos para mostrar.', 'No programmes to show yet.'),
      erro: t('Não foi possível carregar os cursos.', 'Could not load the programmes.'),
      tentarNovamente: t('Tentar novamente', 'Try again'),
    };
  });

  /** `GET /candidaturas-docentes/areas` — a mesma consulta (e cache) da candidatura geral. */
  protected readonly consultaOferta = injectQuery(() => ofertaCurricularQueries.lista(this.ofertaCurricular));

  /**
   * `GET /faculdades` — a mesma consulta da aba "Faculdades e departamentos". Serve
   * de referência do que é faculdade e curso de verdade (ver `faculdadesOriginais`).
   */
  private readonly consultaFaculdades = injectQuery(() => faculdadesQueries.lista(this.faculdadesService));

  protected readonly aCarregar = computed(
    () => this.consultaOferta.isPending() || this.consultaFaculdades.isPending(),
  );

  /**
   * Nomes e `id`s das faculdades e dos cursos de `GET /faculdades`. Ficam `null` se
   * esse pedido falhar — então mostra-se a oferta tal como vem, sem separar nada.
   */
  private readonly referencia = computed(() => {
    const faculdades = this.consultaFaculdades.data();
    if (!faculdades) return null;
    const cursos = faculdades.flatMap((faculdade) => faculdade.cursos);
    return {
      faculdades: new Set(faculdades.map((faculdade) => faculdade.nome)),
      cursos: new Set([...cursos.map((curso) => curso.id), ...cursos.map((curso) => curso.titulo)]),
    };
  });

  /**
   * A oferta da candidatura docente não é só faculdade → cursos: traz também
   * agrupamentos de disciplinas que **não** são cursos (confirmado na API em
   * 2026-11-20) —
   * - uma pseudo-faculdade "Disciplinas Diversas de Engenharia", que não existe em
   *   `GET /faculdades`, e por isso fica de fora;
   * - em cada faculdade, um "curso" com o nome da própria faculdade (p. ex.
   *   "Economia e Gestão"), que não está entre os cursos de `GET /faculdades`. As
   *   disciplinas destes passam a "Disciplinas comuns" da faculdade e não contam
   *   como curso.
   * Assim o total de cursos desta aba bate com o da aba "Faculdades e departamentos".
   */
  protected readonly faculdadesOriginais = computed<FaculdadePlano[]>(() => {
    const referencia = this.referencia();
    const eCurso = (curso: CursoCandidaturaGeral) =>
      !referencia || referencia.cursos.has(curso.id) || referencia.cursos.has(curso.nome);

    return (this.consultaOferta.data() ?? [])
      .filter((faculdade) => !referencia || referencia.faculdades.has(faculdade.nome))
      .map((faculdade) => ({
        id: faculdade.id,
        nome: faculdade.nome,
        cursos: faculdade.cursos.filter(eCurso),
        comuns: faculdade.cursos.filter((curso) => !eCurso(curso)).flatMap((curso) => curso.disciplinas),
      }))
      .filter((faculdade) => faculdade.cursos.length > 0 || faculdade.comuns.length > 0);
  });

  /**
   * A API só devolve português: em inglês, os nomes da faculdade, do curso e da
   * disciplina, e a descrição da disciplina, passam pela tradução automática.
   * Achatam-se numa lista de textos soltos (mesma técnica do
   * `faculdades-departamentos`) e voltam a montar-se pela mesma ordem.
   */
  private readonly textosOriginais = computed(() => {
    const textosDisciplinas = (disciplinas: DisciplinaCandidaturaGeral[]) =>
      disciplinas.flatMap((disciplina) => [disciplina.nome, disciplina.descricao]);

    return this.faculdadesOriginais().flatMap((faculdade) => [
      faculdade.nome,
      ...faculdade.cursos.flatMap((curso) => [curso.nome, ...textosDisciplinas(curso.disciplinas)]),
      ...textosDisciplinas(faculdade.comuns),
    ]);
  });

  private readonly consultaTraducao = injectQuery(() =>
    traducaoQueries.lista(this.servicoTraducaoAutomatica, this.textosOriginais(), this.traducao.idioma()),
  );

  private readonly faculdades = computed<FaculdadePlano[]>(() => {
    const traduzidos = aplicarTraducaoTextos(this.textosOriginais(), this.consultaTraducao.data());
    let indice = 0;
    const proximo = () => traduzidos[indice++];
    const traduzirDisciplinas = (disciplinas: DisciplinaCandidaturaGeral[]) =>
      disciplinas.map((disciplina) => ({ ...disciplina, nome: proximo(), descricao: proximo() }));

    // A ordem das chamadas a `proximo()` tem de seguir a de `textosOriginais`.
    return this.faculdadesOriginais().map((faculdade) => {
      const nome = proximo();
      const cursos = faculdade.cursos.map((curso) => {
        const nomeCurso = proximo();
        return { id: curso.id, nome: nomeCurso, disciplinas: traduzirDisciplinas(curso.disciplinas) };
      });
      return { id: faculdade.id, nome, cursos, comuns: traduzirDisciplinas(faculdade.comuns) };
    });
  });

  protected readonly opcoesFaculdade = computed<OpcaoFiltroPilula[]>(() =>
    this.faculdades().map((faculdade) => ({ valor: faculdade.id, rotulo: faculdade.nome })),
  );

  protected readonly faculdadesVisiveis = computed(() => {
    const filtro = this.faculdadeFiltro();
    return filtro ? this.faculdades().filter((faculdade) => faculdade.id === filtro) : this.faculdades();
  });

  /**
   * Totais do que está à vista — acompanham o filtro de faculdade. As disciplinas
   * contam todas as que a aba mostra: as dos cursos e as comuns da faculdade.
   */
  protected readonly totais = computed(() => {
    const visiveis = this.faculdadesVisiveis();
    const cursos = visiveis.flatMap((faculdade) => faculdade.cursos);
    const disciplinasCursos = cursos.reduce((total, curso) => total + curso.disciplinas.length, 0);
    const disciplinasComuns = visiveis.reduce((total, faculdade) => total + faculdade.comuns.length, 0);
    return { cursos: cursos.length, disciplinas: disciplinasCursos + disciplinasComuns };
  });

  protected recarregar(): void {
    void this.consultaOferta.refetch();
  }
}
