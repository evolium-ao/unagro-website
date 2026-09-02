import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  Projecto,
  ROTULOS_CATEGORIA_PROJECTO,
} from '../../core/modelos/projecto.model';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
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
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { CartaoVidroComponent } from '../../shared/componentes/cartao-vidro/cartao-vidro.component';
import { ItemEstatisticaComponent } from '../../shared/componentes/item-estatistica/item-estatistica.component';
import { Estatistica } from '../../core/modelos/estatistica.model';
import { Publicacao } from '../../core/modelos/publicacao.model';
import { CartaoPublicacaoComponent } from '../../shared/componentes/cartao-publicacao/cartao-publicacao.component';
import { PassoMetodologiaComponent } from '../../shared/componentes/passo-metodologia/passo-metodologia.component';
import { CartaoInvestigadorComponent } from '../../shared/componentes/cartao-investigador/cartao-investigador.component';

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

/**
 * Espera que os esqueletos preenchem enquanto a página seguinte não chega. Fica
 * aqui a fazer as vezes da ida ao servidor; com a API sai e o `aCarregar` passa a
 * seguir o estado do pedido.
 */
const ESPERA_PAGINA_MS = 600;

/** Substituir pela resposta do endpoint de projectos — a forma é a mesma. */
const PROJECTOS_MOCK: Projecto[] = [
  {
    id: 'revitalizacao-fazenda-quiminha',
    categoria: 'agricultura',
    titulo: ['Revitalização da Fazenda da Quiminha', 'Revitalising the Quiminha Farm'],
    descricao: [
      'Implementação de sistemas de irrigação inteligentes e rotação de culturas para maximizar o uso da terra e dos recursos hídricos.',
      'Smart irrigation systems and crop rotation to get the most out of the land and its water resources.',
    ],
    resultado_principal: ['+40% Produtividade', '+40% Productivity'],
    imagem_url: '/imagens/desenvolvimento-projecto-1.png',
  },
  {
    id: 'bio-sementes-resilientes',
    categoria: 'tecnologia',
    titulo: ['Bio-Sementes Resilientes', 'Resilient Bio-Seeds'],
    descricao: [
      'Pesquisa avançada em biotecnologia para o desenvolvimento de sementes adaptadas a climas áridos e pragas regionais.',
      'Advanced biotechnology research to develop seeds adapted to arid climates and regional pests.',
    ],
    resultado_principal: ['Resiliência Hídrica', 'Water Resilience'],
    imagem_url: '/imagens/desenvolvimento-projecto-2.png',
  },
  {
    id: 'corredor-verde-cabinda',
    categoria: 'meio_ambiente',
    titulo: ['Corredor Verde de Cabinda', 'Cabinda Green Corridor'],
    descricao: [
      'Projecto de reflorestamento e protecção da biodiversidade integrado nas práticas de agricultura familiar da região.',
      'Reforestation and biodiversity protection woven into the smallholder farming of the region.',
    ],
    resultado_principal: ['50k Árvores', '50k Trees'],
    imagem_url: '/imagens/desenvolvimento-projecto-3.png',
  },
];

/** Compara sem acentos nem maiúsculas, para a pesquisa não depender da escrita exacta. */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Substituir pela resposta do endpoint de centros e laboratórios. */
const UNIDADES_MOCK: UnidadeInvestigacao[] = [
  {
    id: 'centro-biotecnologia-agricola',
    area: ['Biotecnologia', 'Biotechnology'],
    nome: ['Centro de Biotecnologia Agrícola', 'Agricultural Biotechnology Centre'],
    imagem_url: '/imagens/desenvolvimento-card-1.png',
    icone: 'flask-conical',
    // TODO: apontar para a página da unidade quando existir rota própria.
    link: '/desenvolvimento#secao-investigacao',
  },
  {
    id: 'laboratorio-solos-nutricao',
    area: ['Agronomia', 'Agronomy'],
    nome: ['Laboratório de Solos e Nutrição', 'Soil and Nutrition Laboratory'],
    imagem_url: '/imagens/desenvolvimento-card-2.png',
    icone: 'sprout',
    link: '/desenvolvimento#secao-investigacao',
  },
  {
    id: 'unidade-engenharia-rural',
    area: ['Engenharia', 'Engineering'],
    nome: ['Unidade de Engenharia Rural', 'Rural Engineering Unit'],
    imagem_url: '/imagens/desenvolvimento-card-3.png',
    icone: 'wrench',
    link: '/desenvolvimento#secao-investigacao',
  },
];

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
    // TODO: apontar para a Agenda 2030 quando o documento ou a página existir.
    cta: { texto: ['Ver Agenda 2030', 'View Agenda 2030'], link: '/desenvolvimento#secao-investigacao' },
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

/**
 * Substituir pela resposta do endpoint de publicações.
 * TODO: `link_abstract` e `link_download` apontam para a própria secção enquanto
 * não houver página de resumo nem ficheiro do artigo para descarregar.
 */
const PUBLICACOES_MOCK: Publicacao[] = [
  {
    id: 'resiliencia-climatica-milho-zambeze',
    revista: ['Agronomia Natural', 'Natural Agronomy'],
    data: ['JAN 2024', 'JAN 2024'],
    titulo: [
      'Resiliência Climática em Culturas de Milho no Vale do Zambeze',
      'Climate Resilience in Maize Crops of the Zambezi Valley',
    ],
    autores: [
      'Dra. Amara Okafor, Prof. João Silva et al.',
      'Dr Amara Okafor, Prof. João Silva et al.',
    ],
    link_abstract: '/desenvolvimento#secao-publicacoes',
    link_download: '/desenvolvimento#secao-publicacoes',
  },
  {
    id: 'impacto-automacao-agricultura-familiar',
    revista: ['Segurança dos Alimentos', 'Food Safety'],
    data: ['DEZ 2023', 'DEC 2023'],
    titulo: [
      'Impacto da Automação na Pequena Agricultura Familiar',
      'The Impact of Automation on Smallholder Family Farming',
    ],
    autores: ['Dr. Carlos Mendes, Eng. Sarah Kouamé.', 'Dr Carlos Mendes, Eng. Sarah Kouamé.'],
    link_abstract: '/desenvolvimento#secao-publicacoes',
    link_download: '/desenvolvimento#secao-publicacoes',
  },
  {
    id: 'bio-fertilizantes-alternativa-quimica',
    revista: ['Jornal de Bio-Ciência', 'Journal of Bio-Science'],
    data: ['NOV 2026', 'NOV 2026'],
    titulo: [
      'Bio-Fertilizantes: Uma Alternativa à Dependência Química',
      'Bio-Fertilisers: An Alternative to Chemical Dependency',
    ],
    autores: ['Dra. Maria Zungu, Prof. David Olawale.', 'Dr Maria Zungu, Prof. David Olawale.'],
    link_abstract: '/desenvolvimento#secao-publicacoes',
    link_download: '/desenvolvimento#secao-publicacoes',
  },
];

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

/** Substituir pela resposta do endpoint dos investigadores principais. */
const INVESTIGADORES_MOCK: Investigador[] = [
  {
    id: 'amara-okafor',
    nome: 'Dra. Amara Okafor',
    cargo: ['Directora de Biotecnologia', 'Director of Biotechnology'],
    foto_url: '/imagens/avatar-directora-biotecnologia.png',
    especialidades: [
      ['Genética', 'Genetics'],
      ['Sustentabilidade', 'Sustainability'],
    ],
  },
  {
    id: 'joao-silva',
    nome: 'Prof. João Silva',
    cargo: ['Especialista em Engenharia Rural', 'Rural Engineering Specialist'],
    foto_url: '/imagens/avatar-especialista-engenharia.png',
    especialidades: [
      ['Mecanização', 'Mechanisation'],
      ['Irrigação', 'Irrigation'],
    ],
  },
  {
    id: 'maria-zungu',
    nome: 'Dra. Maria Zungu',
    cargo: ['Coordenadora de Solos', 'Soil Coordinator'],
    foto_url: '/imagens/avatar-coordenadora-solo.png',
    especialidades: [
      ['Microbiologia', 'Microbiology'],
      ['Edafologia', 'Soil Science'],
    ],
  },
  {
    id: 'carlos-mendes',
    nome: 'Dr. Carlos Mendes',
    cargo: ['Investigador de Mercados Agrícolas', 'Agricultural Markets Researcher'],
    foto_url: '/imagens/avatar-investigador-mercado.png',
    especialidades: [
      ['Agro-negócio', 'Agribusiness'],
      ['Cadeias de Valor', 'Value Chains'],
    ],
  },
];

/** Quantos investigadores entram na fila; as setas andam de lote em lote. */
const INVESTIGADORES_POR_PAGINA = 4;

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
    BotaoComponent,
    CabecalhoSecaoComponent,
    CartaoLinhaInvestigacaoComponent,
    CartaoUnidadeComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ItemEstatisticaComponent,
    CartaoVidroComponent,
    CartaoPublicacaoComponent,
    PassoMetodologiaComponent,
    CartaoInvestigadorComponent,
  ],
  templateUrl: './desenvolvimento.component.html',
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

  /** Substituir por sinais alimentados pelos endpoints respectivos. */
  protected readonly unidades = signal<UnidadeInvestigacao[]>(UNIDADES_MOCK);
  protected readonly linhasInvestigacao = signal<LinhaInvestigacao[]>(LINHAS_INVESTIGACAO_MOCK);

  /**
   * "Visitar Unidade" de um cartão: abre o formulário de agendamento com a unidade
   * clicada já escolhida. O cartão só avisa — quem conhece o modal é a página.
   */
  protected abrirAgendamentoVisita(unidade: UnidadeInvestigacao): void {
    const dados: DadosAgendarVisita = { unidadeSelecionada: unidade, unidades: this.unidades() };

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

  /** Substituir por um sinal alimentado pelo endpoint de projectos. */
  private readonly projectosBrutos = signal<Projecto[]>(PROJECTOS_MOCK);

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
      return [projecto.titulo, projecto.descricao, projecto.resultado_principal].some((texto) =>
        normalizar(this.traducao.getTraducao(texto)).includes(termo),
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

  /** Substituir por um sinal alimentado pelo endpoint de publicações. */
  private readonly publicacoesBrutas = signal<Publicacao[]>(PUBLICACOES_MOCK);

  protected readonly pesquisaPublicacoes = signal('');

  protected readonly publicacoesVisiveis = computed(() => {
    const termo = normalizar(this.pesquisaPublicacoes());
    if (!termo) {
      return this.publicacoesBrutas();
    }

    return this.publicacoesBrutas().filter((publicacao) =>
      [publicacao.titulo, publicacao.revista, publicacao.autores].some((texto) =>
        normalizar(this.traducao.getTraducao(texto)).includes(termo),
      ),
    );
  });

  protected definirPesquisaPublicacoes(termo: string): void {
    this.pesquisaPublicacoes.set(termo);
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

  /** Substituir por um sinal alimentado pelo endpoint dos investigadores. */
  private readonly investigadoresBrutos = signal<Investigador[]>(INVESTIGADORES_MOCK);

  private readonly paginaInvestigadores = signal(0);

  private readonly totalPaginasInvestigadores = computed(() =>
    Math.max(1, Math.ceil(this.investigadoresBrutos().length / INVESTIGADORES_POR_PAGINA)),
  );

  protected readonly investigadoresVisiveis = computed(() => {
    const inicio = this.paginaInvestigadores() * INVESTIGADORES_POR_PAGINA;
    return this.investigadoresBrutos().slice(inicio, inicio + INVESTIGADORES_POR_PAGINA);
  });

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

  protected readonly rotuloInvestigadoresAnteriores = computed(() =>
    this.traducao.getTraducao(['Ver investigadores anteriores', 'See previous researchers']),
  );

  protected readonly rotuloInvestigadoresSeguintes = computed(() =>
    this.traducao.getTraducao(['Ver investigadores seguintes', 'See next researchers']),
  );
}
