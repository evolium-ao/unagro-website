import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { faculdadesQueries } from '../../../core/consultas/faculdades.queries';
import { traducaoQueries } from '../../../core/consultas/traducao.queries';
import { FaculdadesService } from '../../../core/servicos/faculdades.service';
import { TraducaoAutomaticaService } from '../../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { aplicarTraducao, aplicarTraducaoTextos, camposParaTraduzir } from '../../../core/traducao/traduzir-campos';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
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

/** Campo de texto da faculdade traduzido automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_FACULDADE = ['nome'] as const;

/**
 * Aba "Faculdades e departamentos" de `/sobre`.
 *
 * **Não** havia modal para este item — é conteúdo novo. Antes derivava a lista de
 * faculdades dos cursos de grau do `CursosService` (agrupando `curso.faculdade`, uma
 * string); agora lê `GET /faculdades`, que já traz os cursos de cada faculdade
 * embutidos (`FaculdadeResource.cursos`) — não é preciso cruzar com o `CursosService`.
 */
@Component({
  selector: 'app-sobre-faculdades-departamentos',
  imports: [
    CabecalhoSecaoComponent,
    CartaoFaculdadeEsqueletoComponent,
    IconeComponent,
    RouterLink,
    RevelarAoScrollDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cabecalho-secao
      [titulo]="textos().titulo"
      [descricao]="textos().subtitulo"
      posicaoTracos="abaixo"
      tamanhoDescricao="pequeno"
    />

    <div class="mt-12 grid gap-6 lg:grid-cols-2">
      @if (consultaFaculdades.isPending()) {
        @for (_ of [1, 2, 3, 4]; track $index) {
          <app-cartao-faculdade-esqueleto />
        }
      } @else if (consultaFaculdades.isError()) {
        <p class="col-span-full py-12 text-center text-sm text-text-secondary">
          {{ textos().erro }}
        </p>
      } @else {
        @for (faculdade of faculdades(); track faculdade.id) {
          <article
            class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
            [appRevelarAoScroll]="$index"
          >
            <div class="flex items-start gap-4">
              <span
                class="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-bg-light text-primary-deep"
              >
                <app-icone [nome]="faculdade.icone" [tamanho]="24" />
              </span>

              <div>
                <h3 class="text-base font-bold text-text-primary">{{ faculdade.nome }}</h3>
                <p class="mt-1 text-xs uppercase tracking-[0.12em] text-text-secondary">
                  {{ faculdade.contagem }}
                </p>
              </div>
            </div>

            <ul class="mt-6 space-y-2 border-t border-gray-100 pt-5">
              @for (curso of faculdade.cursos; track curso.id) {
                <li>
                  <a
                    [routerLink]="curso.link"
                    class="group flex items-start gap-2 text-sm leading-relaxed text-text-secondary transition-colors hover:text-primary"
                  >
                    <app-icone
                      nome="chevron-right"
                      [tamanho]="16"
                      class="mt-0.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span class="group-hover:underline">{{ curso.titulo }}</span>
                  </a>
                </li>
              }
            </ul>
          </article>
        } @empty {
          <p class="col-span-full py-12 text-center text-sm text-text-secondary">
            {{ textos().vazio }}
          </p>
        }
      }
    </div>
  `,
})
export class SobreFaculdadesDepartamentosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly faculdadesService = inject(FaculdadesService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Faculdades e Departamentos', 'Faculties and Departments']),
    subtitulo: this.traducao.getTraducao([
      'As unidades operacionais que executam o ensino, a investigação e a extensão da UNAGRO, com os cursos de grau que cada uma oferece.',
      "The operational units that deliver UNAGRO's teaching, research and outreach, with the degree courses each one offers.",
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

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês, o `nome`
   * da faculdade passa pela tradução automática. Enquanto carrega, ou se
   * falhar, fica o texto original em português.
   */
  private readonly consultaTraducaoNomes = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaFaculdades.data() ?? [], CAMPOS_TRADUZIVEIS_FACULDADE),
      this.traducao.idioma(),
    ),
  );

  private readonly faculdadesComNomeTraduzido = computed(() =>
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
   * Junta o `nome` traduzido de cada faculdade aos títulos de curso traduzidos
   * (na mesma ordem do achatamento acima) e monta o que o cartão mostra:
   * ícone por posição, contagem de cursos e o link de cada curso para o
   * respectivo detalhe.
   */
  protected readonly faculdades = computed(() => {
    const titulosTraduzidos = this.titulosCursosTraduzidos();
    let indice = 0;

    return this.faculdadesComNomeTraduzido().map((faculdade, posicao) => {
      const cursos = faculdade.cursos.map((curso) => ({
        id: curso.id,
        titulo: titulosTraduzidos[indice++] ?? curso.titulo,
        link: `/cursos/${curso.id}`,
      }));

      return {
        id: faculdade.id,
        nome: faculdade.nome,
        cursos,
        icone: ICONES_FACULDADE[posicao % ICONES_FACULDADE.length],
        contagem:
          cursos.length === 1
            ? this.traducao.getTraducao(['1 curso de grau', '1 degree course'])
            : `${cursos.length} ${this.traducao.getTraducao(['cursos de grau', 'degree courses'])}`,
      };
    });
  });
}
