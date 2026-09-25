import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  FormatoLinhaInvestigacao,
  Investigador,
  LinhaInvestigacao,
  PassoMetodologia,
  UnidadeInvestigacao,
} from '../../core/modelos/investigacao.model';
import {
  CategoriaProjecto,
  CATEGORIAS_PROJECTO,
  ROTULOS_CATEGORIA_PROJECTO,
} from '../../core/modelos/projeto.model';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import {
  aplicarTraducao,
  aplicarTraducaoTextos,
  camposParaTraduzir,
} from '../../core/traducao/traduzir-campos';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoLinhaInvestigacaoComponent } from '../../shared/componentes/cartao-linha-investigacao/cartao-linha-investigacao.component';
import { CartaoUnidadeComponent } from '../../shared/componentes/cartao-unidade/cartao-unidade.component';
import { AlertModalService } from '../../shared/componentes/alert-modal/alert-modal.service';
import {
  DadosAgendarVisita,
  ID_MODAL_AGENDAR_VISITA,
  ModalAgendarVisitaComponent,
} from '../../shared/componentes/modal-agendar-visita/modal-agendar-visita.component';
import { CartaoProjectoComponent } from '../../shared/componentes/cartao-projecto/cartao-projecto.component';
import { CartaoProjectoEsqueletoComponent } from '../../shared/componentes/cartao-projecto-esqueleto/cartao-projecto-esqueleto.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';
import { TiraHorizontalDirective } from '../../shared/diretivas/tira-horizontal.directive';
import { CartaoUnidadeEsqueletoComponent } from '../../shared/componentes/cartao-unidade-esqueleto/cartao-unidade-esqueleto.component';
import { LaboratoriosService } from '../../core/servicos/laboratorios.service';
import { laboratoriosQueries } from '../../core/consultas/laboratorios.queries';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { ProjetosService } from '../../core/servicos/projetos.service';
import { Projeto } from '../../core/modelos/projeto.model';
import { projetosQueries } from '../../core/consultas/projetos.queries';
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { CartaoVidroComponent } from '../../shared/componentes/cartao-vidro/cartao-vidro.component';
import { ItemEstatisticaComponent } from '../../shared/componentes/item-estatistica/item-estatistica.component';
import { Estatistica } from '../../core/modelos/estatistica.model';
import { Publicacao } from '../../core/modelos/publicacao.model';
import { OpcaoFiltroPilula } from '../../shared/componentes/filtro-pilula/filtro-pilula.component';
import {
  DadosFiltroPublicacoes,
  EVENTO_APLICAR_FILTROS_PUBLICACOES,
  FILTROS_PUBLICACOES_VAZIOS,
  FiltrosPublicacoes,
  ID_MODAL_FILTRO_PUBLICACOES,
  ModalFiltroPublicacoesComponent,
} from '../../shared/componentes/modal-filtro-publicacoes/modal-filtro-publicacoes.component';
import { CartaoPublicacaoComponent } from '../../shared/componentes/cartao-publicacao/cartao-publicacao.component';
import { CartaoPublicacaoEsqueletoComponent } from '../../shared/componentes/cartao-publicacao-esqueleto/cartao-publicacao-esqueleto.component';
import { PassoMetodologiaComponent } from '../../shared/componentes/passo-metodologia/passo-metodologia.component';
import { CartaoInvestigadorComponent } from '../../shared/componentes/cartao-investigador/cartao-investigador.component';
import { CartaoInvestigadorEsqueletoComponent } from '../../shared/componentes/cartao-investigador-esqueleto/cartao-investigador-esqueleto.component';
import { InvestigadoresService } from '../../core/servicos/investigadores.service';
import { investigadoresQueries } from '../../core/consultas/investigadores.queries';
import { PublicacoesService } from '../../core/servicos/publicacoes.service';
import { publicacoesQueries } from '../../core/consultas/publicacoes.queries';

interface EixoBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const EIXOS_BRUTOS: EixoBruto[] = [
  {
    icone: 'flask-conical',
    titulo: { pt: 'Investigação aplicada', en: 'Applied research' },
    descricao: {
      pt: 'Estudos orientados para problemas concretos da produção agropecuária nacional.',
      en: 'Studies aimed at concrete problems in national agricultural production.',
    },
  },
  {
    icone: 'sprout',
    titulo: { pt: 'Extensão rural', en: 'Rural outreach' },
    descricao: {
      pt: 'Trabalho de campo com produtores e cooperativas para levar conhecimento à prática.',
      en: 'Fieldwork with farmers and cooperatives to bring knowledge into practice.',
    },
  },
  {
    icone: 'rocket',
    titulo: { pt: 'Transferência de tecnologia', en: 'Technology transfer' },
    descricao: {
      pt: 'Passagem de resultados de investigação para soluções utilizáveis no terreno.',
      en: 'Turning research results into solutions usable in the field.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Parcerias', en: 'Partnerships' },
    descricao: {
      pt: 'Colaboração com instituições, empresas e comunidades do sector.',
      en: 'Collaboration with institutions, companies and communities in the sector.',
    },
  },
];

/** Quantos cartões entram de cada vez que se carrega mais projectos. */
const PROJECTOS_POR_PAGINA = 3;

/** Campos de texto traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_PROJETO = ['titulo', 'resumo', 'estado', 'areaTematica'] as const;

/** Esqueletos do primeiro carregamento — um lote cheio, como a "carregar mais" já usava. */
const ESQUELETOS_PROJECTOS = Array.from({ length: PROJECTOS_POR_PAGINA }, (_, indice) => indice);

/**
 * Espera que os esqueletos preenchem enquanto a página seguinte não chega. Fica
 * aqui a fazer as vezes da ida ao servidor; com a API sai e o `aCarregar` passa a
 * seguir o estado do pedido.
 */
const ESPERA_PAGINA_MS = 600;

/** "2026-03-14" → "2026"; uma data vazia ou inválida dá `''` e não entra no filtro de ano. */
const anoDe = (dataIso: string) => (/^\d{4}/.exec(dataIso ?? '')?.[0] ?? '');

/** Compara sem acentos nem maiúsculas, para a pesquisa não depender da escrita exacta. */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/**
 * A partir de quantos laboratórios a secção deixa a grelha e passa à tira que
 * rola na horizontal. Três é o que a grelha mostra numa linha em `lg`: até lá o
 * desenho é o de sempre, e só acima disso aparecem as setas.
 */
const UNIDADES_EM_GRELHA = 3;

/** Campos de texto traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_UNIDADE = ['nome', 'area'] as const;

/** Esqueletos enquanto os laboratórios não chegam — uma linha cheia da grelha. */
const ESQUELETOS_UNIDADES = Array.from({ length: UNIDADES_EM_GRELHA }, (_, indice) => indice);

/** Substituir pela resposta do endpoint de linhas de investigação. */
const LINHAS_INVESTIGACAO_MOCK: LinhaInvestigacao[] = [
  {
    id: 'melhoramento-genetico',
    formato: 'destaque',
    icone: 'server',
    titulo: ['Melhoramento Genético', 'Genetic Improvement'],
    descricao: [
      'Desenvolvimento de variedades de sementes resilientes ao clima e com maior valor nutricional para segurança alimentar.',
      'Developing seed varieties that stand up to the climate and carry more nutritional value, for food security.',
    ],
    metricas: [
      ['8 Projectos Activos', '8 Active Projects'],
      ['3 Parcerias Internacionais', '3 International Partnerships'],
    ],
  },
  {
    id: 'gestao-recursos-hidricos',
    formato: 'simples',
    icone: 'droplet',
    titulo: ['Gestão de Recursos Hídricos', 'Water Resource Management'],
    descricao: [
      'Sistemas inteligentes de rega e conservação.',
      'Smart irrigation and conservation systems.',
    ],
  },
  {
    id: 'economia-agraria',
    formato: 'simples',
    icone: 'trending-up',
    titulo: ['Economia Agrária', 'Agricultural Economics'],
    descricao: ['Cadeias de valor e mercados sustentáveis.', 'Value chains and sustainable markets.'],
  },
  {
    id: 'impacto-ambiental-sustentabilidade',
    formato: 'faixa',
    icone: 'chart-column',
    titulo: ['Impacto Ambiental & Sustentabilidade', 'Environmental Impact & Sustainability'],
    descricao: [
      'Monitorização contínua de ecossistemas agrários e pegada de carbono do sector primário.',
      'Continuous monitoring of farming ecosystems and the carbon footprint of the primary sector.',
    ],
    // A página de eventos ainda não aceita filtro por tema/ano na URL; quando aceitar,
    // acrescentar aqui o filtro da Agenda 2030.
    cta: { texto: ['Ver Agenda 2030', 'View Agenda 2030'], link: '/eventos' },
  },
];

/** Substituir pela resposta do endpoint de estatísticas de impacto. */
const ESTATISTICAS_IMPACTO_MOCK: Estatistica[] = [
  {
    id: 'familias-impactadas',
    valor: '12k+',
    rotulo: { pt: 'Famílias impactadas', en: 'Families impacted' },
  },
  {
    id: 'hectares-monitorados',
    valor: '300k',
    rotulo: { pt: 'Hectares monitorados', en: 'Hectares monitored' },
  },
  {
    id: 'taxa-sustentabilidade',
    valor: '85%',
    rotulo: { pt: 'Taxa de sustentabilidade', en: 'Sustainability rate' },
  },
  {
    id: 'inovacoes-patenteadas',
    valor: '22',
    rotulo: { pt: 'Inovações patenteadas', en: 'Patented innovations' },
  },
];

/** Campos de texto da publicação que passam pela tradução automática quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_PUBLICACAO = ['titulo', 'resumo'] as const;

const PUBLICACOES_POR_PAGINA = 3;

/** Substituir pela resposta do endpoint da metodologia (Ciclo de Excelência UNAGRO). */
const PASSOS_METODOLOGIA_MOCK: PassoMetodologia[] = [
  {
    id: 'diagnostico',
    numero: '01',
    icone: 'square-activity',
    titulo: ['Diagnóstico', 'Diagnosis'],
    descricao: [
      'Análise profunda multivariada do solo, climatologia e necessidades das comunidades.',
      'In-depth multivariate analysis of soil, climate and community needs.',
    ],
  },
  {
    id: 'desenho',
    numero: '02',
    icone: 'drafting-compass',
    titulo: ['Desenho', 'Design'],
    descricao: [
      'Planeamento estratégico utilizando simulações avançadas e parcerias académicas.',
      'Strategic planning using advanced simulations and academic partnerships.',
    ],
  },
  {
    id: 'execucao',
    numero: '03',
    icone: 'wrench',
    titulo: ['Execução', 'Delivery'],
    descricao: [
      'Implementação técnica com supervisão de doutores e transferência de know-how local.',
      'Technical implementation supervised by doctorate holders, with transfer of local know-how.',
    ],
  },
  {
    id: 'monitoramento',
    numero: '04',
    icone: 'trending-up',
    titulo: ['Monitoramento', 'Monitoring'],
    descricao: [
      'Acompanhamento de KPIs em tempo real e otimização dinâmica de performance.',
      'Real-time KPI tracking and dynamic performance optimisation.',
    ],
  },
];

/** Quantos investigadores entram na fila; as setas andam de lote em lote. */
const INVESTIGADORES_POR_PAGINA = 4;

/**
 * Campos de texto do investigador traduzidos automaticamente quando o idioma
 * não é português. O `nome` fica de fora de propósito — nome próprio não se
 * traduz; as `especialidades` são uma lista e traduzem-se à parte (ver
 * `consultaTraducaoEspecialidades`).
 */
const CAMPOS_TRADUZIVEIS_INVESTIGADOR = ['cargo'] as const;

/** Esqueletos enquanto os investigadores não chegam — um lote cheio da fila. */
const ESQUELETOS_INVESTIGADORES = Array.from(
  { length: INVESTIGADORES_POR_PAGINA },
  (_, indice) => indice,
);

/** Como cada formato se estende na grelha de 4 colunas. */
const COLUNAS_LINHA: Record<FormatoLinhaInvestigacao, string> = {
  destaque: 'sm:col-span-2',
  simples: '',
  faixa: 'sm:col-span-2 lg:col-span-4',
};

@Component({
  selector: 'app-desenvolvimento',
  imports: [
    BannerDestaqueComponent,
    CartaoProjectoComponent,
    CartaoProjectoEsqueletoComponent,
    ContainerPaginaComponent,
    IconeComponent,
    RevelarAoScrollDirective,
    TiraHorizontalDirective,
    BotaoComponent,
    CabecalhoSecaoComponent,
    CartaoLinhaInvestigacaoComponent,
    CartaoUnidadeComponent,
    CartaoUnidadeEsqueletoComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ItemEstatisticaComponent,
    CartaoVidroComponent,
    CartaoPublicacaoComponent,
    CartaoPublicacaoEsqueletoComponent,
    PassoMetodologiaComponent,
    CartaoInvestigadorComponent,
    CartaoInvestigadorEsqueletoComponent,
  ],
  templateUrl: './desenvolvimento.component.html',
  styles: `
    /* A tira dos laboratórios rola mas sem barra à vista: quem indica que ela
       continua são as setas do canto superior direito e o rebordo do cartão
       seguinte. */
    .tira-unidades {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tira-unidades::-webkit-scrollbar {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesenvolvimentoComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  protected readonly eixos = computed(() =>
    localizarProfundo(EIXOS_BRUTOS, this.traducao.idioma()),
  );

  protected readonly selosHero = computed(() => [
    this.traducao.getTraducao(['EXCELÊNCIA EM AGRONEGÓCIO', 'EXCELLENCE IN AGRIBUSINESS']),
  ]);

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao([
      'Inovação que Cultiva o Futuro de',
      'Innovation that Cultivates the Future of',
    ]),
  );

  protected readonly tituloDestaqueHero = computed(() =>
    this.traducao.getTraducao(['África', 'Africa']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Conheça as iniciativas que estão a transformar o cenário agrícola africano. Unindo rigor académico, inovação tecnológica e práticas sustentáveis para cultivar o futuro do continente.',
      'Discover the initiatives transforming the African agricultural landscape, combining academic rigour, technological innovation and sustainable practices to cultivate the continent’s future.',
    ]),
  );

  private readonly laboratoriosService = inject(LaboratoriosService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  /** `GET /laboratorios` — os cartões de "Centros e Laboratórios". */
  protected readonly consultaUnidades = injectQuery(() =>
    laboratoriosQueries.lista(this.laboratoriosService),
  );

  /** A API só devolve português (ver `.claude/README.md`). */
  private readonly consultaTraducaoUnidades = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaUnidades.data() ?? [], CAMPOS_TRADUZIVEIS_UNIDADE),
      this.traducao.idioma(),
    ),
  );

  protected readonly unidades = computed<UnidadeInvestigacao[]>(() =>
    aplicarTraducao(
      this.consultaUnidades.data() ?? [],
      CAMPOS_TRADUZIVEIS_UNIDADE,
      this.consultaTraducaoUnidades.data(),
    ),
  );

  /**
   * Acima de uma linha de grelha os cartões passam a uma tira horizontal, com as
   * setas no canto superior direito da secção. Decidido pelo número de cartões e
   * não por medição, para o servidor renderizar já a forma certa.
   */
  protected readonly temTiraUnidades = computed(
    () => this.unidades().length > UNIDADES_EM_GRELHA,
  );

  /** Estado da tira — é o que liga e desliga as duas setas. */
  protected readonly tiraUnidades = viewChild(TiraHorizontalDirective);

  protected readonly esqueletosUnidades = ESQUELETOS_UNIDADES;

  /** A cascata reinicia a cada linha, para o atraso não crescer ao longo da tira. */
  protected readonly unidadesEmGrelha = UNIDADES_EM_GRELHA;

  protected rolarUnidades(sentido: 1 | -1): void {
    this.tiraUnidades()?.rolar(sentido);
  }

  protected readonly erroUnidades = computed(() =>
    this.traducao.getTraducao([
      'Não foi possível carregar os centros e laboratórios.',
      'Could not load the centres and laboratories.',
    ]),
  );

  protected readonly mensagemSemUnidades = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há centros nem laboratórios publicados.',
      'No centres or laboratories published yet.',
    ]),
  );

  protected readonly rotuloUnidadesAnteriores = computed(() =>
    this.traducao.getTraducao(['Ver unidades anteriores', 'See previous units']),
  );

  protected readonly rotuloUnidadesSeguintes = computed(() =>
    this.traducao.getTraducao(['Ver unidades seguintes', 'See next units']),
  );

  /** Substituir por um sinal alimentado pelo endpoint das linhas de investigação. */
  protected readonly linhasInvestigacao = signal<LinhaInvestigacao[]>(LINHAS_INVESTIGACAO_MOCK);

  /**
   * "Visitar Unidade" de um cartão: abre o formulário de agendamento com a unidade
   * clicada já escolhida. O cartão só avisa — quem conhece o modal é a página.
   */
  protected abrirAgendamentoVisita(unidade: UnidadeInvestigacao): void {
    const dados: DadosAgendarVisita = { unidadeSelecionada: unidade };

    void this.modais.modal({
      id: ID_MODAL_AGENDAR_VISITA,
      template: ModalAgendarVisitaComponent,
      tamanho: 'xlgrande',
      temHeader: false,
      semBotoes: true,
      // O formulário é longo: um clique no fundo não o pode fazer desaparecer.
      fecharAoClicarFundo: false,
      data: dados,
    });
  }

  protected colunasLinha(formato: FormatoLinhaInvestigacao): string {
    return COLUNAS_LINHA[formato];
  }
  projectoServico = inject(EstatisticasService);
  private readonly projetosService = inject(ProjetosService);

  /** `GET /projectos` — a listagem da 1ª sessão; mesma origem de dados da página de detalhe. */
  protected readonly consultaProjectos = injectQuery(() =>
    projetosQueries.lista(this.projetosService, this.traducao.idioma()),
  );

  /**
   * A API só devolve português (ver `.claude/README.md`). Os campos que o
   * `ProjetosService` empresta ao mock já saem resolvidos no idioma pedido —
   * só os campos que vêm mesmo da API precisam desta tradução automática.
   */
  private readonly consultaTraducaoProjectos = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaProjectos.data() ?? [], CAMPOS_TRADUZIVEIS_PROJETO),
      this.traducao.idioma(),
    ),
  );

  /** Mesma origem de dados da página de detalhe, para os ids dos cartões resolverem lá. */
  private readonly projectosBrutos = computed<Projeto[]>(() =>
    aplicarTraducao(
      this.consultaProjectos.data() ?? [],
      CAMPOS_TRADUZIVEIS_PROJETO,
      this.consultaTraducaoProjectos.data(),
    ),
  );

  protected readonly esqueletosProjectosIniciais = ESQUELETOS_PROJECTOS;

  protected readonly erroProjectos = computed(() =>
    this.traducao.getTraducao(['Não foi possível carregar os projectos.', 'Could not load the projects.']),
  );

  protected readonly categoriaActiva = signal<CategoriaProjecto | 'todos'>('todos');
  protected readonly pesquisa = signal('');
  private readonly limite = signal(PROJECTOS_POR_PAGINA);

  protected readonly filtrosCategoria = computed(() => [
    { id: 'todos' as const, rotulo: this.traducao.getTraducao(['Todos', 'All']) },
    ...CATEGORIAS_PROJECTO.map((categoria) => ({
      id: categoria,
      rotulo: this.traducao.getTraducao(ROTULOS_CATEGORIA_PROJECTO[categoria]),
    })),
  ]);

  private readonly projectosFiltrados = computed(() => {
    const categoria = this.categoriaActiva();
    const termo = normalizar(this.pesquisa());

    return this.projectosBrutos().filter((projecto) => {
      if (categoria !== 'todos' && projecto.categoria !== categoria) {
        return false;
      }
      if (!termo) {
        return true;
      }
      return [projecto.titulo, projecto.resumo, projecto.resultado_principal].some((texto) =>
        normalizar(texto).includes(termo),
      );
    });
  });

  protected readonly projectosVisiveis = computed(() =>
    this.projectosFiltrados().slice(0, this.limite()),
  );

  protected readonly temMaisProjectos = computed(
    () => this.projectosFiltrados().length > this.limite(),
  );

  /** Verdadeiro enquanto há projectos a caminho; a grelha mostra esqueletos no lugar. */
  protected readonly aCarregar = signal(false);

  /** Um esqueleto por cartão que está a caminho, nunca mais do que os que faltam. */
  protected readonly esqueletos = computed(() =>
    Array.from(
      {
        length: Math.min(
          PROJECTOS_POR_PAGINA,
          this.projectosFiltrados().length - this.projectosVisiveis().length,
        ),
      },
      (_, indice) => indice,
    ),
  );

  /** A cascata reinicia em cada lote, para o atraso não crescer sem fim. */
  protected readonly projectosPorPagina = PROJECTOS_POR_PAGINA;

  /** Filtrar ou pesquisar recomeça a paginação; senão herdava o limite anterior. */
  protected definirCategoria(categoria: CategoriaProjecto | 'todos'): void {
    this.categoriaActiva.set(categoria);
    this.limite.set(PROJECTOS_POR_PAGINA);
  }

  protected definirPesquisa(termo: string): void {
    this.pesquisa.set(termo);
    this.limite.set(PROJECTOS_POR_PAGINA);
  }

  protected carregarMais(): void {
    if (this.aCarregar()) {
      return;
    }
    this.aCarregar.set(true);

    setTimeout(() => {
      this.limite.update((actual) => actual + PROJECTOS_POR_PAGINA);
      this.aCarregar.set(false);
    }, ESPERA_PAGINA_MS);
  }

  /** Substituir por um sinal alimentado pelo endpoint de estatísticas de impacto. */
  protected readonly estatisticasImpacto = computed(() =>
    localizarProfundo(ESTATISTICAS_IMPACTO_MOCK, this.traducao.idioma()),
  );

  protected readonly tituloImpacto = computed(() =>
    this.traducao.getTraducao(['Impacto em Números', 'Impact in Numbers']),
  );

  protected readonly descricaoImpacto = computed(() =>
    this.traducao.getTraducao([
      'A nossa actuação vai além dos campos. Medimos o sucesso através do desenvolvimento das comunidades e da estabilidade económica que geramos.',
      'Our work goes beyond the fields. We measure success through the development of communities and the economic stability we generate.',
    ]),
  );

  protected readonly tituloNotaImpacto = computed(() =>
    this.traducao.getTraducao(['Presença Nacional', 'Nationwide Presence']),
  );

  protected readonly textoNotaImpacto = computed(() =>
    this.traducao.getTraducao([
      'A actuar em todas as 18 províncias.',
      'Working across all 18 provinces.',
    ]),
  );

  protected readonly legendaImagemImpacto = computed(() =>
    this.traducao.getTraducao([
      'Produtores num viveiro comunitário acompanhado pela UNAGRO',
      'Farmers at a community nursery supported by UNAGRO',
    ]),
  );

  private readonly publicacoesService = inject(PublicacoesService);

  /** `GET /publicacoes` — a lista de "Publicações Recentes" e a fonte dos documentos de cada projecto. */
  protected readonly consultaPublicacoes = injectQuery(() =>
    publicacoesQueries.lista(this.publicacoesService),
  );

  /** A API só devolve português (ver `.claude/README.md`). */
  private readonly consultaTraducaoPublicacoes = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaPublicacoes.data() ?? [], CAMPOS_TRADUZIVEIS_PUBLICACAO),
      this.traducao.idioma(),
    ),
  );

  private readonly publicacoesBrutas = computed<Publicacao[]>(() =>
    aplicarTraducao(
      this.consultaPublicacoes.data() ?? [],
      CAMPOS_TRADUZIVEIS_PUBLICACAO,
      this.consultaTraducaoPublicacoes.data(),
    ),
  );

  protected readonly pesquisaPublicacoes = signal('');
  /** Os filtros do modal de filtros (ano, língua, projecto) — somam-se à pesquisa. */
  protected readonly filtrosPublicacoes = signal<FiltrosPublicacoes>(FILTROS_PUBLICACOES_VAZIOS);
  private readonly limitePublicacoes = signal(PUBLICACOES_POR_PAGINA);

  private readonly publicacoesFiltradas = computed(() => {
    const termo = normalizar(this.pesquisaPublicacoes());
    const { ano, lingua, projetoId } = this.filtrosPublicacoes();

    return this.publicacoesBrutas().filter((publicacao) => {
      if (ano && anoDe(publicacao.data) !== ano) return false;
      if (lingua === 'com-en' && !publicacao.documentoUrlEn) return false;
      if (lingua === 'so-pt' && publicacao.documentoUrlEn) return false;
      if (projetoId && publicacao.projetoId !== projetoId) return false;
      return !termo || normalizar(`${publicacao.titulo} ${publicacao.resumo}`).includes(termo);
    });
  });

  /** Quantos filtros do modal estão activos — o número no botão de filtros. */
  protected readonly totalFiltrosPublicacoes = computed(
    () => Object.values(this.filtrosPublicacoes()).filter(Boolean).length,
  );

  /** Os anos que existem nas publicações, do mais recente para o mais antigo. */
  private readonly anosPublicacoes = computed(() =>
    [...new Set(this.publicacoesBrutas().map((publicacao) => anoDe(publicacao.data)))]
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a)),
  );

  /** Só os projectos que têm publicações — um projecto sem nenhuma dava sempre lista vazia. */
  private readonly projectosComPublicacoes = computed<OpcaoFiltroPilula[]>(() => {
    const ids = new Set(this.publicacoesBrutas().map((publicacao) => publicacao.projetoId));
    return this.projectosBrutos()
      .filter((projecto) => ids.has(projecto.id))
      .map((projecto) => ({ valor: projecto.id, rotulo: projecto.titulo }));
  });

  protected abrirFiltrosPublicacoes(): void {
    const dados: DadosFiltroPublicacoes = {
      filtros: this.filtrosPublicacoes(),
      anos: this.anosPublicacoes(),
      projectos: this.projectosComPublicacoes(),
    };

    void this.modais.modal({
      id: ID_MODAL_FILTRO_PUBLICACOES,
      template: ModalFiltroPublicacoesComponent,
      tamanho: 'medio',
      temHeader: false,
      semBotoes: true,
      data: dados,
      on: {
        [EVENTO_APLICAR_FILTROS_PUBLICACOES]: (filtros: FiltrosPublicacoes) => {
          this.filtrosPublicacoes.set(filtros);
          this.limitePublicacoes.set(PUBLICACOES_POR_PAGINA);
        },
      },
    });
  }

  protected readonly publicacoesVisiveis = computed(() =>
    this.publicacoesFiltradas().slice(0, this.limitePublicacoes()),
  );

  protected readonly temMaisPublicacoes = computed(
    () => this.publicacoesFiltradas().length > this.limitePublicacoes(),
  );

  /** Verdadeiro enquanto há publicações a caminho; a lista mostra esqueletos no lugar. */
  protected readonly aCarregarPublicacoes = signal(false);

  /** Um esqueleto por publicação que está a caminho, nunca mais do que as que faltam. */
  protected readonly esqueletosPublicacoes = computed(() =>
    Array.from(
      {
        length: Math.min(
          PUBLICACOES_POR_PAGINA,
          this.publicacoesFiltradas().length - this.publicacoesVisiveis().length,
        ),
      },
      (_, indice) => indice,
    ),
  );

  /** A cascata reinicia em cada lote, para o atraso não crescer sem fim. */
  protected readonly publicacoesPorPagina = PUBLICACOES_POR_PAGINA;

  /** Pesquisar recomeça a paginação; senão herdava o limite anterior. */
  protected definirPesquisaPublicacoes(termo: string): void {
    this.pesquisaPublicacoes.set(termo);
    this.limitePublicacoes.set(PUBLICACOES_POR_PAGINA);
  }

  protected carregarMaisPublicacoes(): void {
    if (this.aCarregarPublicacoes()) {
      return;
    }
    this.aCarregarPublicacoes.set(true);

    setTimeout(() => {
      this.limitePublicacoes.update((actual) => actual + PUBLICACOES_POR_PAGINA);
      this.aCarregarPublicacoes.set(false);
    }, ESPERA_PAGINA_MS);
  }

  protected readonly tituloPublicacoes = computed(() =>
    this.traducao.getTraducao(['Publicações Recentes', 'Recent Publications']),
  );

  protected readonly descricaoPublicacoes = computed(() =>
    this.traducao.getTraducao([
      'Acesso aberto aos últimos avanços científicos da nossa faculdade.',
      'Open access to the latest scientific advances from our faculty.',
    ]),
  );

  protected readonly rotuloFiltroPublicacoes = computed(() =>
    this.traducao.getTraducao(['Filtrar publicações', 'Filter publications']),
  );

  protected readonly tituloArquivoPublicacoes = computed(() =>
    this.traducao.getTraducao(['Ver Arquivo Completo (400+)', 'View Full Archive (400+)']),
  );

  // TODO: apontar para o arquivo de publicações quando existir rota própria.
  protected readonly linkArquivoPublicacoes = '/desenvolvimento#secao-publicacoes';

  // TODO: apontar para o relatório de impacto quando existir página ou ficheiro.
  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/desenvolvimento#secao-eixos',
      texto: this.traducao.getTraducao(['Ver relatório de impacto', 'View impact report']),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
  ]);

  // ---- 5 sessão: Nossa Metodologia ----

  /** Substituir por um sinal alimentado pelo endpoint da metodologia. */
  protected readonly passosMetodologia = signal<PassoMetodologia[]>(PASSOS_METODOLOGIA_MOCK);

  protected readonly tituloMetodologia = computed(() =>
    this.traducao.getTraducao(['Nossa Metodologia', 'Our Methodology']),
  );

  protected readonly descricaoMetodologia = computed(() =>
    this.traducao.getTraducao([
      'O Ciclo de Excelência UNAGRO é um framework proprietário que garante que cada iniciativa seja baseada em evidências científicas e gere impacto social mensurável.',
      'The UNAGRO Excellence Cycle is a proprietary framework that keeps every initiative grounded in scientific evidence and generating measurable social impact.',
    ]),
  );

  // ---- 6 sessão: Investigadores Principais ----

  private readonly investigadoresService = inject(InvestigadoresService);

  /** `GET /investigadores` — os cartões de "Investigadores Principais". */
  protected readonly consultaInvestigadores = injectQuery(() =>
    investigadoresQueries.lista(this.investigadoresService),
  );

  /** A API só devolve português (ver `.claude/README.md`). */
  private readonly consultaTraducaoInvestigadores = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(
        this.consultaInvestigadores.data() ?? [],
        CAMPOS_TRADUZIVEIS_INVESTIGADOR,
      ),
      this.traducao.idioma(),
    ),
  );

  /**
   * As especialidades são uma lista por investigador, e o `camposParaTraduzir`
   * só sabe achatar campos de texto simples — por isso vai numa consulta
   * própria, com todas as pílulas de todos os investigadores numa única lista
   * (a mesma ordem em que se voltam a distribuir abaixo).
   */
  private readonly especialidadesParaTraduzir = computed(() =>
    (this.consultaInvestigadores.data() ?? []).flatMap(
      (investigador) => investigador.especialidades ?? [],
    ),
  );

  private readonly consultaTraducaoEspecialidades = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      this.especialidadesParaTraduzir(),
      this.traducao.idioma(),
    ),
  );

  private readonly investigadores = computed<Investigador[]>(() => {
    const comCargo = aplicarTraducao(
      this.consultaInvestigadores.data() ?? [],
      CAMPOS_TRADUZIVEIS_INVESTIGADOR,
      this.consultaTraducaoInvestigadores.data(),
    );

    const especialidadesTraduzidas = this.consultaTraducaoEspecialidades.data();
    if (!especialidadesTraduzidas) return comCargo;

    // Desfaz o achatamento: cada investigador leva de volta tantas pílulas
    // quantas tinha, na ordem em que foram mandadas a traduzir.
    let cursor = 0;
    return comCargo.map((investigador) => {
      const originais = investigador.especialidades ?? [];
      if (!originais.length) return investigador;

      const traduzidas = aplicarTraducaoTextos(
        originais,
        especialidadesTraduzidas.slice(cursor, cursor + originais.length),
      );
      cursor += originais.length;
      return { ...investigador, especialidades: traduzidas };
    });
  });

  private readonly paginaInvestigadores = signal(0);

  private readonly totalPaginasInvestigadores = computed(() =>
    Math.max(1, Math.ceil(this.investigadores().length / INVESTIGADORES_POR_PAGINA)),
  );

  protected readonly investigadoresVisiveis = computed(() => {
    const inicio = this.paginaInvestigadores() * INVESTIGADORES_POR_PAGINA;
    return this.investigadores().slice(inicio, inicio + INVESTIGADORES_POR_PAGINA);
  });

  protected readonly esqueletosInvestigadores = ESQUELETOS_INVESTIGADORES;

  protected readonly temInvestigadoresAnteriores = computed(() => this.paginaInvestigadores() > 0);
  protected readonly temInvestigadoresSeguintes = computed(
    () => this.paginaInvestigadores() < this.totalPaginasInvestigadores() - 1,
  );

  protected investigadoresAnteriores(): void {
    this.paginaInvestigadores.update((pagina) => Math.max(0, pagina - 1));
  }

  protected investigadoresSeguintes(): void {
    this.paginaInvestigadores.update((pagina) =>
      Math.min(this.totalPaginasInvestigadores() - 1, pagina + 1),
    );
  }

  /** A cascata reinicia em cada lote, para o atraso não crescer sem fim. */
  protected readonly investigadoresPorPagina = INVESTIGADORES_POR_PAGINA;

  protected readonly tituloInvestigadores = computed(() =>
    this.traducao.getTraducao(['Investigadores Principais', 'Principal Researchers']),
  );

  protected readonly descricaoInvestigadores = computed(() =>
    this.traducao.getTraducao([
      'Mentes brilhantes dedicadas à transformação do panorama agrário através da ciência aplicada.',
      'Brilliant minds devoted to transforming the agricultural landscape through applied science.',
    ]),
  );

  protected readonly erroInvestigadores = computed(() =>
    this.traducao.getTraducao([
      'Não foi possível carregar os investigadores.',
      'Could not load the researchers.',
    ]),
  );

  protected readonly rotuloInvestigadoresAnteriores = computed(() =>
    this.traducao.getTraducao(['Ver investigadores anteriores', 'See previous researchers']),
  );

  protected readonly rotuloInvestigadoresSeguintes = computed(() =>
    this.traducao.getTraducao(['Ver investigadores seguintes', 'See next researchers']),
  );
}
