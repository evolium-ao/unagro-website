import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { faculdadesQueries } from '../../../core/consultas/faculdades.queries';
import { traducaoQueries } from '../../../core/consultas/traducao.queries';
import { FaculdadesService } from '../../../core/servicos/faculdades.service';
import { TraducaoAutomaticaService } from '../../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { aplicarTraducao, aplicarTraducaoTextos, camposParaTraduzir } from '../../../core/traducao/traduzir-campos';
import { CartaoFaculdadeEsqueletoComponent } from '../../../shared/componentes/cartao-faculdade-esqueleto/cartao-faculdade-esqueleto.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Ícones atribuídos por posição na lista de faculdades. A API não classifica
 * faculdades por área nem lhes dá ícone; a atribuição é estável pela ordem em
 * que `GET /faculdades` as devolve — muda a ordem do lado da API, muda o
 * ícone, e nada quebra.
 */
const ICONES_FACULDADE = ['sprout', 'stethoscope', 'trending-up', 'trees', 'drafting-compass'];

/** Campos de texto da faculdade traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_FACULDADE = ['nome', 'descricao'] as const;

/** Aspecto do cartão, atribuído por posição — o mesmo padrão de "atribuído, não guardado" do ícone. */
interface EstiloCartaoFaculdade {
  fundo: string;
  titulo: string;
  descricao: string;
  iconeFundo: string;
  icone: string;
  separador: string;
  rotuloCursos: string;
  linkCurso: string;
}

const ESTILOS_CARTAO_FACULDADE: EstiloCartaoFaculdade[] = [
  {
    fundo: 'bg-primary-deep',
    titulo: 'text-white',
    descricao: 'text-white/70',
    iconeFundo: 'bg-white/15',
    icone: 'text-white',
    separador: 'border-white/15',
    rotuloCursos: 'text-white/55',
    linkCurso: 'text-white hover:text-secondary',
  },
  {
    fundo: 'bg-accent',
    titulo: 'text-white',
    descricao: 'text-white/80',
    iconeFundo: 'bg-white/20',
    icone: 'text-white',
    separador: 'border-white/20',
    rotuloCursos: 'text-white/65',
    linkCurso: 'text-white hover:text-primary-deep',
  },
  {
    fundo: 'bg-white ring-1 ring-gray-100',
    titulo: 'text-text-primary',
    descricao: 'text-text-secondary',
    iconeFundo: 'bg-bg-light',
    icone: 'text-primary-deep',
    separador: 'border-gray-100',
    rotuloCursos: 'text-text-secondary',
    linkCurso: 'text-primary hover:text-primary-dark',
  },
];

/**
 * Aba "Faculdades e departamentos" de `/sobre`.
 *
 * **Não** havia modal para este item — é conteúdo novo. Antes derivava a lista de
 * faculdades dos cursos de grau do `CursosService` (agrupando `curso.faculdade`, uma
 * string); agora lê `GET /faculdades`, que já traz os cursos de cada faculdade
 * embutidos (`FaculdadeResource.cursos`) — não é preciso cruzar com o `CursosService`.
 *
 * O rótulo "Departamentos" do mockup ficou como "Cursos de Grau": a API não tem
 * conceito de departamento, só faculdade → cursos, e a ligação de cada item vai
 * mesmo para `/cursos/:id` — chamar-lhe "departamento" enganaria quem clica.
 */
@Component({
  selector: 'app-sobre-faculdades-departamentos',
  imports: [CartaoFaculdadeEsqueletoComponent, IconeComponent, RouterLink, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <!-- Texto: kicker, título e o total de cursos de grau, real e somado das faculdades -->
      <div class="lg:col-span-2" appRevelarAoScroll>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {{ textos().kicker }}
        </p>
        <h2 class="mt-3 text-2xl font-bold text-primary-deep sm:text-3xl">{{ textos().titulo }}</h2>
        <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ textos().subtitulo }}</p>

        @if (consultaFaculdades.isPending()) {
          <div class="mt-8 h-24 w-full animate-pulse rounded-2xl bg-bg-light" aria-hidden="true"></div>
        } @else if (totalCursos(); as total) {
          <div class="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-bg-light p-5">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-primary-deep shadow-sm"
            >
              <app-icone nome="graduation-cap" [tamanho]="20" />
            </span>
            <div>
              <p class="text-base font-bold text-text-primary">
                {{ total }} {{ textos().totalCursosRotulo }}
              </p>
              <p class="mt-1 text-xs leading-relaxed text-text-secondary">
                {{ textos().totalCursosDescricao }}
              </p>
            </div>
          </div>
        }
      </div>

      <!-- Cartões: um por faculdade, com os cursos de grau que oferece -->
      <div class="lg:col-span-3">
        @if (consultaFaculdades.isPending()) {
          <div class="grid gap-6 sm:grid-cols-2">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <app-cartao-faculdade-esqueleto />
            }
          </div>
        } @else if (consultaFaculdades.isError()) {
          <p class="py-12 text-center text-sm text-text-secondary">{{ textos().erro }}</p>
        } @else {
          <div class="grid gap-6 sm:grid-cols-2">
            @for (faculdade of faculdades(); track faculdade.id) {
              <article
                class="flex h-full flex-col rounded-2xl p-6 sm:p-7"
                [class]="faculdade.estilo.fundo"
                [appRevelarAoScroll]="$index"
              >
                <span
                  class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  [class]="faculdade.estilo.iconeFundo"
                >
                  <app-icone [nome]="faculdade.icone" [tamanho]="22" [class]="faculdade.estilo.icone" />
                </span>

                <h3 class="mt-4 text-lg font-bold" [class]="faculdade.estilo.titulo">
                  {{ faculdade.nome }}
                </h3>
                @if (faculdade.descricao) {
                  <p class="mt-2 text-sm leading-relaxed" [class]="faculdade.estilo.descricao">
                    {{ faculdade.descricao }}
                  </p>
                }

                <div class="mt-5 flex-1 border-t pt-4" [class]="faculdade.estilo.separador">
                  <p
                    class="text-[11px] font-semibold uppercase leading-relaxed tracking-[0.06em]"
                    [class]="faculdade.estilo.rotuloCursos"
                  >
                    <span>{{ textos().cursosRotulo }}: </span>
                    @for (curso of faculdade.cursos; track curso.id) {
                      <a
                        [routerLink]="curso.link"
                        class="hover:underline"
                        [class]="faculdade.estilo.linkCurso"
                        >{{ curso.titulo }}</a
                      ><span>{{ $last ? '' : ', ' }}</span>
                    }
                  </p>
                </div>
              </article>
            } @empty {
              <p class="col-span-full py-12 text-center text-sm text-text-secondary">
                {{ textos().vazio }}
              </p>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class SobreFaculdadesDepartamentosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly faculdadesService = inject(FaculdadesService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  protected readonly textos = computed(() => ({
    kicker: this.traducao.getTraducao(['Formação de Excelência', 'Excellence in Education']),
    titulo: this.traducao.getTraducao(['Faculdades e Departamentos', 'Faculties and Departments']),
    subtitulo: this.traducao.getTraducao([
      'A nossa estrutura académica está organizada em faculdades, cada uma focada em pilares estratégicos do agronegócio.',
      'Our academic structure is organised into faculties, each focused on strategic pillars of agribusiness.',
    ]),
    cursosRotulo: this.traducao.getTraducao(['Cursos de Grau', 'Degree Courses']),
    totalCursosRotulo: this.traducao.getTraducao(['Cursos de Graduação', 'Degree Courses']),
    totalCursosDescricao: this.traducao.getTraducao([
      'Currículos alinhados às melhores práticas internacionais e às necessidades do mercado nacional.',
      'Curricula aligned with international best practices and the needs of the national market.',
    ]),
    vazio: this.traducao.getTraducao([
      'Ainda não há faculdades para mostrar.',
      'No faculties to show yet.',
    ]),
    erro: this.traducao.getTraducao([
      'Não foi possível carregar as faculdades.',
      'Could not load the faculties.',
    ]),
  }));

  /** `GET /faculdades` — a lista vem inteira, com os cursos de cada faculdade já embutidos. */
  protected readonly consultaFaculdades = injectQuery(() =>
    faculdadesQueries.lista(this.faculdadesService),
  );

  /** Soma real dos cursos de todas as faculdades — substitui um número fixo no bloco de destaque. */
  protected readonly totalCursos = computed(() =>
    (this.consultaFaculdades.data() ?? []).reduce((total, faculdade) => total + faculdade.cursos.length, 0),
  );

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês, o `nome`
   * e a `descricao` da faculdade passam pela tradução automática. Enquanto
   * carrega, ou se falhar, fica o texto original em português.
   */
  private readonly consultaTraducaoNomes = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaFaculdades.data() ?? [], CAMPOS_TRADUZIVEIS_FACULDADE),
      this.traducao.idioma(),
    ),
  );

  private readonly faculdadesComTextoTraduzido = computed(() =>
    aplicarTraducao(
      this.consultaFaculdades.data() ?? [],
      CAMPOS_TRADUZIVEIS_FACULDADE,
      this.consultaTraducaoNomes.data(),
    ),
  );

  /**
   * Os títulos dos cursos embutidos (`faculdade.cursos[].titulo`) não são um
   * campo de topo do item — `camposParaTraduzir`/`aplicarTraducao` só tratam
   * esses —, por isso traduzem-se à parte, como uma lista de textos soltos
   * (mesma técnica do corpo do artigo em `detalhe-noticia`), achatada na
   * mesma ordem em que aparecem em `consultaFaculdades.data()`.
   */
  private readonly titulosCursosOriginais = computed(() =>
    (this.consultaFaculdades.data() ?? []).flatMap((faculdade) =>
      faculdade.cursos.map((curso) => curso.titulo),
    ),
  );

  private readonly consultaTraducaoCursos = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      this.titulosCursosOriginais(),
      this.traducao.idioma(),
    ),
  );

  private readonly titulosCursosTraduzidos = computed(() =>
    aplicarTraducaoTextos(this.titulosCursosOriginais(), this.consultaTraducaoCursos.data()),
  );

  /**
   * Junta o `nome`/`descricao` traduzidos de cada faculdade aos títulos de
   * curso traduzidos (na mesma ordem do achatamento acima) e monta o que o
   * cartão mostra: ícone e estilo por posição, e o link de cada curso para o
   * respectivo detalhe.
   */
  protected readonly faculdades = computed(() => {
    const titulosTraduzidos = this.titulosCursosTraduzidos();
    let indice = 0;

    return this.faculdadesComTextoTraduzido().map((faculdade, posicao) => {
      const cursos = faculdade.cursos.map((curso) => ({
        id: curso.id,
        titulo: titulosTraduzidos[indice++] ?? curso.titulo,
        link: `/cursos/${curso.id}`,
      }));

      return {
        id: faculdade.id,
        nome: faculdade.nome,
        descricao: faculdade.descricao,
        cursos,
        icone: ICONES_FACULDADE[posicao % ICONES_FACULDADE.length],
        estilo: ESTILOS_CARTAO_FACULDADE[posicao % ESTILOS_CARTAO_FACULDADE.length],
      };
    });
  });
}
