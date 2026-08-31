import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CandidaturasService } from '../../core/servicos/candidaturas.service';
import { PerguntasFrequentesService } from '../../core/servicos/perguntas-frequentes.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AcordeaoComponent } from '../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../shared/componentes/acordeao/item-acordeao.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { IndicadorPassosComponent } from '../../shared/componentes/indicador-passos/indicador-passos.component';
import { ContainerPaginaComponent } from "../../shared/componentes/container-pagina/container-pagina.component";
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { BannerDestaqueComponent, CtaBannerDestaque } from "../../shared/componentes/banner-destaque/banner-destaque.component";
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CursosService } from '../../core/servicos/cursos.service';
import { CartaoCursoComponent } from '../../shared/componentes/cartao-curso/cartao-curso.component';
import { FiltroPilulaComponent, OpcaoFiltroPilula } from '../../shared/componentes/filtro-pilula/filtro-pilula.component';
import { AbasComponent } from '../../shared/componentes/abas/abas.component';
import { CartaoRequisitoComponent } from '../../shared/componentes/cartao-requisito/cartao-requisito.component';
import { ListaVerificacaoComponent } from '../../shared/componentes/lista-verificacao/lista-verificacao.component';

type CursoOferta = ReturnType<CursosService['cursosGrau']> extends (infer U)[] ? U : never;

@Component({
  selector: 'app-candidaturas',
  imports: [
    BannerDestaqueComponent,
    FaixaEstatisticasComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    IndicadorPassosComponent,
    CartaoCursoComponent,
    FiltroPilulaComponent,
    AbasComponent,
    CartaoRequisitoComponent,
    ListaVerificacaoComponent,
  ],
  templateUrl: './candidaturas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidaturasComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly candidaturasService = inject(CandidaturasService);
  private readonly faqService = inject(PerguntasFrequentesService);
  private readonly estatisticasService = inject(EstatisticasService);
  private readonly cursosService = inject(CursosService);
  protected readonly estatisticas = this.estatisticasService.institucionais;
  protected readonly passos = this.candidaturasService.passos;
  protected readonly bolsas = this.candidaturasService.bolsas;
  protected readonly calendario = this.candidaturasService.calendario;
  protected readonly perguntas = this.faqService.perguntas;
  protected readonly ctaBannerDestaque = computed<CtaBannerDestaque[]>(() => {
    this.traducao.idioma()
    return [
      { link: '/candidaturas', texto: this.traducao.getTraducao(['Iniciar Candidatura', 'Start Application']), variante: 'branco' },
      { link: '/candidaturas', texto: this.traducao.getTraducao(['Ver cursos', 'View courses']), variante: 'contorno' },
    ]
  })
  readonly bannerTitulo = computed(() => {
    this.traducao.idioma()
    return this.traducao.getTraducao([

    ])
  })

  // --- Secção 3: requisitos gerais ---
  protected readonly documentos = this.candidaturasService.documentos;
  private readonly requisitosNiveis = this.candidaturasService.requisitosPorNivel;
  protected readonly nivelRequisitosAtivo = signal(this.requisitosNiveis()[0]?.id ?? '');

  protected readonly abasRequisitos = computed(() =>
    this.requisitosNiveis().map(({ id, rotulo }) => ({ id, rotulo })),
  );
  protected readonly requisitosAtivos = computed(() => {
    const niveis = this.requisitosNiveis();
    return niveis.find((nivel) => nivel.id === this.nivelRequisitosAtivo()) ?? niveis[0];
  });

  // --- Secção 2: oferta académica ---
  protected readonly cursosOferta = this.cursosService.cursosGrau;

  protected readonly filtroFaculdade = signal('');
  protected readonly filtroGrau = signal('');
  protected readonly filtroRegime = signal('');

  protected readonly opcoesFaculdade = computed(() =>
    this.opcoesUnicas(this.cursosOferta().map((curso) => curso.faculdade)),
  );
  protected readonly opcoesGrau = computed(() =>
    this.opcoesUnicas(this.cursosOferta().map((curso) => curso.grau)),
  );
  protected readonly opcoesRegime = computed(() =>
    this.opcoesUnicas(this.cursosOferta().map((curso) => curso.regime)),
  );

  protected readonly gruposOferta = computed(() => {
    const faculdade = this.filtroFaculdade();
    const grau = this.filtroGrau();
    const regime = this.filtroRegime();

    const filtrados = this.cursosOferta().filter(
      (curso) =>
        (!faculdade || curso.faculdade === faculdade) &&
        (!grau || curso.grau === grau) &&
        (!regime || curso.regime === regime),
    );

    const porFaculdade = new Map<string, CursoOferta[]>();
    for (const curso of filtrados) {
      const grupo = porFaculdade.get(curso.faculdade) ?? [];
      grupo.push(curso);
      porFaculdade.set(curso.faculdade, grupo);
    }

    return Array.from(porFaculdade.entries()).map(([faculdadeGrupo, cursos]) => ({
      faculdade: faculdadeGrupo,
      cursos,
    }));
  });

  private opcoesUnicas(valores: string[]): OpcaoFiltroPilula[] {
    return Array.from(new Set(valores)).map((valor) => ({ valor, rotulo: valor }));
  }
}
