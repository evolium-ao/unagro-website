import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { cursosQueries } from '../../core/consultas/cursos.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { CandidaturasService } from '../../core/servicos/candidaturas.service';
import { PerguntasFrequentesService } from '../../core/servicos/perguntas-frequentes.service';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
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
import { CartaoCursoComponent, CursoExibidoCard } from '../../shared/componentes/cartao-curso/cartao-curso.component';
import { CartaoCursoEsqueletoComponent } from '../../shared/componentes/cartao-curso-esqueleto/cartao-curso-esqueleto.component';
import { FiltroPilulaComponent, OpcaoFiltroPilula } from '../../shared/componentes/filtro-pilula/filtro-pilula.component';
import { ListaVerificacaoComponent } from "../../shared/componentes/lista-verificacao/lista-verificacao.component";
import { AbasComponent } from "../../shared/componentes/abas/abas.component";
import { CartaoRequisitoComponent } from "../../shared/componentes/cartao-requisito/cartao-requisito.component";
import { CartaoFaseComponent } from '../../shared/componentes/cartao-fase/cartao-fase.component';
import { CartaoChamadaAcaoComponent } from '../../shared/componentes/cartao-chamada-acao/cartao-chamada-acao.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';
import { RouterLink } from '@angular/router';
import { CartaoBolsaComponent } from '../../shared/componentes/cartao-bolsa/cartao-bolsa.component';
import { ItemContactoComponent } from '../../shared/componentes/item-contacto/item-contacto.component';
import { ContactosComponent } from "../contactos/contactos.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/** Campos de texto do curso traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_CURSO_OFERTA = ['titulo', 'faculdade', 'grau', 'duracao', 'regime'] as const;

const BENEFICIOS_RECRUTAMENTO_BRUTOS: TextoTraduzido[] = [
  {
    pt: 'Financiamento para projectos de pesquisa aprovados',
    en: 'Funding for approved research projects',
  },
  { pt: 'Rede de colaboração internacional activa', en: 'Active international collaboration network' },
  { pt: 'Infra-estrutura laboratorial de última geração', en: 'State-of-the-art laboratory facilities' },
];

const REQUISITOS_BRUTOS: TextoTraduzido[] = [
  { pt: 'Certificado de conclusão do ensino médio', en: 'High school completion certificate' },
  { pt: 'Bilhete de identidade válido', en: 'Valid national ID card' },
  { pt: '2 fotografias tipo passe', en: '2 passport-style photographs' },
  { pt: 'Comprovativo de pagamento da taxa de candidatura', en: 'Proof of application fee payment' },
  { pt: 'Aprovação no exame de admissão', en: 'Admission exam approval' },
];

@Component({
  selector: 'app-candidaturas',
  imports: [
    BannerDestaqueComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    IndicadorPassosComponent,
    FiltroPilulaComponent,
    CartaoCursoComponent,
    CartaoCursoEsqueletoComponent,
    ListaVerificacaoComponent,
    AbasComponent,
    CartaoRequisitoComponent,
    CartaoFaseComponent,
    CartaoChamadaAcaoComponent,
    BotaoComponent,
    EspacoImagemComponent,
    SeloComponent,
    RouterLink,
    AcordeaoComponent,
    ItemAcordeaoComponent,
    CartaoBolsaComponent,
    ItemContactoComponent,
    IconeComponent,
    ContainerBannerFaixaEstatisticaComponent,
    RevelarAoScrollDirective
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
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);
  protected readonly estatisticas = this.estatisticasService.institucionais;
  protected readonly passos = this.candidaturasService.passos;
  protected readonly bolsas = this.candidaturasService.bolsas;
  protected readonly calendario = this.candidaturasService.calendario;
  protected readonly perguntas = this.faqService.perguntas;
  protected readonly ctaBannerDestaque = computed<CtaBannerDestaque[]>(() => {
    return [
      {
        link: '/candidaturas/estudantes',
        texto: this.traducao.getTraducao(['Iniciar Candidatura', 'Start Application']),
        variante: 'branco',
        icone: "arrow-right",
        posicaoIcone: 'direita',
      },
      {
        link: '/candidaturas#secao-cursos',
        texto: this.traducao.getTraducao(['Ver cursos', 'View courses']),
        variante: 'glass'
      },
    ]
  })
  readonly TituloInicio = computed(() => {
    return this.traducao.getTraducao([
      'Candidate-se à ',
      'Apply to '
    ])
  })


  readonly heroSubtitulo = computed(() => {
    return this.traducao.getTraducao([
      'Encontre o curso ideal para a sua carreira no agronegócio, conheça os requisitos e faça a sua candidatura totalmente online de forma rápida e segura.',
      'Find the ideal course for your career in agribusiness, learn about the requirements and apply completely online quickly and securely.'
    ])
  })


  protected readonly requisitos = computed(() => localizarProfundo(REQUISITOS_BRUTOS, this.traducao.idioma()));

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

  // --- Secção 4: calendário académico ---
  protected readonly fases = this.candidaturasService.fases;

  // --- Secção 7: bolsas, dúvidas frequentes e contactos ---
  protected readonly canaisContacto = this.candidaturasService.canaisContacto;

  // --- Secção 6: recrutamento de professores ---
  protected readonly beneficiosRecrutamento = computed(() =>
    localizarProfundo(BENEFICIOS_RECRUTAMENTO_BRUTOS, this.traducao.idioma()),
  );

  // --- Secção 2: oferta académica ---
  protected readonly consultaCursosOferta = injectQuery(() => cursosQueries.lista(this.cursosService));

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês, os
   * campos de texto do curso passam pela tradução automática.
   */
  private readonly consultaTraducaoCursosOferta = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaCursosOferta.data() ?? [], CAMPOS_TRADUZIVEIS_CURSO_OFERTA),
      this.traducao.idioma(),
    ),
  );

  protected readonly cursosOferta = computed(() =>
    aplicarTraducao(
      this.consultaCursosOferta.data() ?? [],
      CAMPOS_TRADUZIVEIS_CURSO_OFERTA,
      this.consultaTraducaoCursosOferta.data(),
    ),
  );

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

    const porFaculdade = new Map<string, CursoExibidoCard[]>();
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
