import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosService } from '../../../core/servicos/cursos.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Ícones atribuídos por posição na lista de faculdades. Não há como inferir o ícone do
 * nome (que em inglês vem traduzido), por isso a atribuição é estável pela ordem em que
 * as faculdades aparecem no `cursos.mock` — muda a ordem, muda o ícone, e nada quebra.
 */
const ICONES_FACULDADE = ['sprout', 'stethoscope', 'trending-up', 'trees', 'drafting-compass'];

/**
 * Aba "Faculdades e departamentos" de `/sobre`.
 *
 * **Não** havia modal para este item — é conteúdo novo. Em vez de duplicar uma lista de
 * faculdades à mão, deriva-a dos cursos de grau do `CursosService`: cada faculdade
 * aparece uma vez, com os cursos que lhe pertencem a ligar para o respectivo detalhe.
 * Assim a aba acompanha sozinha o dia em que os cursos passarem a vir da API.
 */
@Component({
  selector: 'app-sobre-faculdades-departamentos',
  imports: [CabecalhoSecaoComponent, IconeComponent, RouterLink, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cabecalho-secao
      [titulo]="textos().titulo"
      [descricao]="textos().subtitulo"
      posicaoTracos="abaixo"
      tamanhoDescricao="pequeno"
    />

    <div class="mt-12 grid gap-6 lg:grid-cols-2">
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
    </div>
  `,
})
export class SobreFaculdadesDepartamentosComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Faculdades e Departamentos', 'Faculties and Departments']),
    subtitulo: this.traducao.getTraducao([
      'As unidades operacionais que executam o ensino, a investigação e a extensão da UNAGRO, com os cursos de grau que cada uma oferece.',
      "The operational units that deliver UNAGRO's teaching, research and outreach, with the degree courses each one offers.",
    ]),
    vazio: this.traducao.getTraducao([
      'Ainda não há cursos de grau associados a faculdades.',
      'No degree courses are associated with faculties yet.',
    ]),
  }));

  /**
   * Uma entrada por faculdade, na ordem em que a primeira aparece na lista de cursos.
   * O `Map` é o que garante que cada faculdade só entra uma vez.
   */
  protected readonly faculdades = computed(() => {
    const porFaculdade = new Map<string, { titulo: string; id: string; link: string }[]>();

    for (const curso of this.cursosService.cursosGrau()) {
      const cursos = porFaculdade.get(curso.faculdade) ?? [];
      cursos.push({ id: curso.id, titulo: curso.titulo, link: `/cursos/${curso.id}` });
      porFaculdade.set(curso.faculdade, cursos);
    }

    return [...porFaculdade].map(([nome, cursos], indice) => ({
      id: nome,
      nome,
      cursos,
      icone: ICONES_FACULDADE[indice % ICONES_FACULDADE.length],
      contagem:
        cursos.length === 1
          ? this.traducao.getTraducao(['1 curso de grau', '1 degree course'])
          : `${cursos.length} ${this.traducao.getTraducao(['cursos de grau', 'degree courses'])}`,
    }));
  });
}
