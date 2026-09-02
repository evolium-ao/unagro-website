import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TraducaoService } from '../../core/traducao/traducao.service';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import {
  CartaoEventoFotoComponent,
  EventoFotoCartao,
} from '../../shared/componentes/cartao-evento-foto/cartao-evento-foto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ItemFiltroLateralComponent } from '../../shared/componentes/item-filtro-lateral/item-filtro-lateral.component';
import { PilarIconeComponent } from '../../shared/componentes/pilar-icone/pilar-icone.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/** Âmbito do evento — é por ele que a barra lateral filtra a listagem. */
type AmbitoEventoProximo = 'nacional' | 'internacional' | 'corporacao' | 'unagro';

const TODOS_OS_AMBITOS = '__todos__';

/** Uma linha com o cartão de destaque mais uma coluna, e outra linha com três cartões. */
const EVENTOS_POR_PAGINA = 5;

/** Par `[pt, en]` resolvido em `computed`, para a lista mudar de idioma sem recarregar. */
type TextoBilingue = [string, string];

interface EventoProximoApi {
  id: string;
  ambito: AmbitoEventoProximo;
  /** Rótulo do selo do cartão; não tem de coincidir com o âmbito. */
  selo: TextoBilingue;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
  local: TextoBilingue;
  dataInicio: string;
  imagem: string;
}

// TODO: substituir pelo EventosService quando o back-end devolver fotografia e âmbito.
const EVENTOS_PROXIMOS_MOCK: EventoProximoApi[] = [
  {
    id: 'workshop-recursos-hidricos',
    ambito: 'corporacao',
    selo: ['Cooperativa', 'Cooperative'],
    titulo: ['Workshop de Gestão de Recursos Hídricos', 'Water Resources Management Workshop'],
    descricao: [
      'Exploração de técnicas avançadas de irrigação gota-a-gota e reaproveitamento de água em explorações agrícolas.',
      'A hands-on look at advanced drip irrigation techniques and water reuse on working farms.',
    ],
    local: ['Quiminha', 'Quiminha'],
    dataInicio: '2026-10-15T09:00:00',
    imagem: '/imagens/recursos-idricos.png',
  },
  {
    id: 'dia-campo-culturas-milho',
    ambito: 'nacional',
    selo: ['Nacional', 'National'],
    titulo: ['Dia de Campo: Inovação em Culturas de Milho', 'Field Day: Innovation in Maize Crops'],
    descricao: [
      'Demonstração prática de novas variedades de sementes resilientes a pragas.',
      'Field demonstration of new seed varieties resilient to pests.',
    ],
    local: ['Huambo Hub', 'Huambo Hub'],
    dataInicio: '2026-11-22T08:30:00',
    imagem: '/imagens/cultivo-milho.png',
  },
  {
    id: 'conferencia-economia-agraria-2026',
    ambito: 'internacional',
    selo: ['Internacional', 'International'],
    titulo: ['Conferência de Economia Agrária 2026', '2026 Agricultural Economics Conference'],
    descricao: [
      'Análise das tendências de mercado global para produtos tropicais.',
      'A read on global market trends for tropical produce.',
    ],
    local: ['Auditório Principal da UNAGRO', 'UNAGRO Main Auditorium'],
    dataInicio: '2026-11-05T09:00:00',
    imagem: '/imagens/conferencia-agronomia.png',
  },
  {
    id: 'forum-melhoramento-genetico',
    ambito: 'unagro',
    selo: ['Promovido pela UNAGRO', 'UNAGRO Promoted'],
    titulo: ['Fórum de Melhoramento Genético', 'Genetic Improvement Forum'],
    descricao: [
      'Avanços em CRISPR para a agricultura de precisão em África.',
      'CRISPR advances for precision agriculture in Africa.',
    ],
    local: ['Estação Experimental', 'Experimental Station'],
    dataInicio: '2026-11-28T10:00:00',
    imagem: '/imagens/forum-melhoramento-genetico.png',
  },
  {
    id: 'seminario-agricultura-precisao',
    ambito: 'nacional',
    selo: ['Nacional', 'National'],
    titulo: ['Seminário: Agricultura de Precisão', 'Seminar: Precision Agriculture'],
    descricao: [
      'O papel do Big Data na otimização de colheitas em larga escala.',
      'The role of big data in optimising harvests at scale.',
    ],
    local: ['Campus da UNAGRO', 'UNAGRO Campus'],
    dataInicio: '2026-12-04T14:00:00',
    imagem: '/imagens/agricultura-de-precisao.png',
  },
];

interface FiltroAmbito {
  valor: string;
  rotulo: string;
  icone: string;
}

interface PilarBruto {
  id: string;
  icone: string;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
}

/**
 * Conteúdo estrutural da sessão da certificação — não é uma lista que a API vá
 * servir, por isso fica aqui em vez de mock + serviço.
 */
const PILARES_CERTIFICACAO: PilarBruto[] = [
  {
    id: 'reconhecimento-academico',
    icone: 'graduation-cap',
    titulo: ['Reconhecimento Académico', 'Academic Recognition'],
    descricao: [
      'Certificados emitidos por uma universidade de referência, garantindo base teórica sólida e validada.',
      'Certificates issued by a leading university, guaranteeing a solid, validated theoretical foundation.',
    ],
  },
  {
    id: 'validacao-tecnica',
    icone: 'wrench',
    titulo: ['Validação Técnica', 'Technical Validation'],
    descricao: [
      'Conteúdo prático desenvolvido em parceria com fabricantes e grandes produtores do agronegócio.',
      'Practical content developed with manufacturers and major agribusiness producers.',
    ],
  },
  {
    id: 'certificacao-digital',
    icone: 'shield-check',
    titulo: ['Certificação Digital', 'Digital Certification'],
    descricao: [
      'Validação via código QR e blockchain, garantindo segurança total contra fraudes no seu currículo.',
      'Validation via QR code and blockchain, for complete protection against CV fraud.',
    ],
  },
];

@Component({
  selector: 'app-eventos',
  imports: [
    BannerDestaqueComponent,
    CabecalhoSecaoComponent,
    CartaoEventoFotoComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    IconeComponent,
    ItemFiltroLateralComponent,
    PilarIconeComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './eventos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosComponent {
  protected readonly traducao = inject(TraducaoService);

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Simpósio', 'International']),
  );

  protected readonly tituloHeroDestaque = computed(() =>
    this.traducao.getTraducao(['Internacional', 'Symposium']),
  );

  protected readonly tituloHeroFim = computed(() =>
    this.traducao.getTraducao(['de Biotecnologia Agrária', 'on Agrarian Biotechnology']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Unindo as maiores mentes do continente para discutir o futuro da segurança alimentar através de inovações genéticas e sustentabilidade climática.',
      'Bringing together the greatest minds on the continent to discuss the future of food security through genetic innovation and climate sustainability.',
    ]),
  );

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      // TODO: apontar para a inscrição do evento quando existir rota de detalhe/inscrição.
      link: '/eventos#secao-proximos-eventos',
      texto: this.traducao.getTraducao(['Inscrever-se agora', 'Register now']),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
  ]);

  // 1 sessão — Próximos Eventos: filtros por âmbito à esquerda, grelha paginada à direita
  protected readonly TODOS_OS_AMBITOS = TODOS_OS_AMBITOS;

  private readonly eventosBrutos = signal(EVENTOS_PROXIMOS_MOCK);
  protected readonly ambitoSelecionado = signal(TODOS_OS_AMBITOS);
  private readonly pagina = signal(0);

  protected readonly tituloSecao = computed(() =>
    this.traducao.getTraducao(['Próximos Eventos', 'Upcoming Events']),
  );

  protected readonly descricaoSecao = computed(() =>
    this.traducao.getTraducao([
      'Descubra as conferências e workshops científicos mais relevantes.',
      'Discover the most relevant scientific conferences and workshops.',
    ]),
  );

  protected readonly rotuloFiltros = computed(() =>
    this.traducao.getTraducao(['Filtro de categorias', 'Category filter']),
  );

  protected readonly semEventos = computed(() =>
    this.traducao.getTraducao([
      'Não há eventos neste âmbito.',
      'There are no events in this category.',
    ]),
  );

  protected readonly rotuloAnterior = computed(() =>
    this.traducao.getTraducao(['Eventos anteriores', 'Previous events']),
  );

  protected readonly rotuloSeguinte = computed(() =>
    this.traducao.getTraducao(['Eventos seguintes', 'Next events']),
  );

  protected readonly filtros = computed<FiltroAmbito[]>(() => [
    {
      valor: TODOS_OS_AMBITOS,
      rotulo: this.traducao.getTraducao(['Todos os eventos', 'All events']),
      icone: 'square-check-list',
    },
    {
      valor: 'nacional',
      rotulo: this.traducao.getTraducao(['Nacionais', 'National']),
      icone: 'map-pin',
    },
    {
      valor: 'internacional',
      rotulo: this.traducao.getTraducao(['Internacionais', 'International']),
      icone: 'globe',
    },
    {
      valor: 'corporacao',
      rotulo: this.traducao.getTraducao(['Corporações', 'Corporate']),
      icone: 'users',
    },
    {
      valor: 'unagro',
      rotulo: this.traducao.getTraducao(['Promovidos pela UNAGRO', 'UNAGRO promoted']),
      icone: 'award',
    },
  ]);

  private readonly eventosFiltrados = computed<EventoFotoCartao[]>(() => {
    const ambito = this.ambitoSelecionado();
    return this.eventosBrutos()
      .filter((evento) => ambito === TODOS_OS_AMBITOS || evento.ambito === ambito)
      .map((evento) => ({
        id: evento.id,
        titulo: this.traducao.getTraducao(evento.titulo),
        descricao: this.traducao.getTraducao(evento.descricao),
        categoria: this.traducao.getTraducao(evento.selo),
        local: this.traducao.getTraducao(evento.local),
        dataInicio: evento.dataInicio,
        imagem: evento.imagem,
        // TODO: trocar por /eventos/:id quando existir a rota de detalhe do evento.
        link: '/contactos',
      }));
  });

  private readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.eventosFiltrados().length / EVENTOS_POR_PAGINA)),
  );

  /** Trocar de filtro pode encurtar a lista para menos páginas do que a actual. */
  private readonly paginaValida = computed(() => Math.min(this.pagina(), this.totalPaginas() - 1));

  protected readonly eventosDaPagina = computed(() => {
    const inicio = this.paginaValida() * EVENTOS_POR_PAGINA;
    return this.eventosFiltrados().slice(inicio, inicio + EVENTOS_POR_PAGINA);
  });

  /** O primeiro cartão de cada página é o largo, como no mockup. */
  protected readonly eventoDestacado = computed(() => this.eventosDaPagina()[0]);
  protected readonly eventosSecundarios = computed(() => this.eventosDaPagina().slice(1));

  protected readonly temAnteriores = computed(() => this.paginaValida() > 0);
  protected readonly temSeguintes = computed(() => this.paginaValida() < this.totalPaginas() - 1);

  // 2 sessão — A Autoridade de uma Certificação UNAGRO: três pilares sobre fundo verde
  protected readonly tituloCertificacao = computed(() =>
    this.traducao.getTraducao([
      'A Autoridade de uma Certificação UNAGRO',
      'The Authority of a UNAGRO Certification',
    ]),
  );

  protected readonly descricaoCertificacao = computed(() =>
    this.traducao.getTraducao([
      'Os nossos certificados são reconhecidos nacionalmente como padrão de ouro em excelência técnica, abrindo portas nas maiores empresas do sector.',
      'Our certificates are recognised nationwide as the gold standard in technical excellence, opening doors at the sector’s largest companies.',
    ]),
  );

  protected readonly pilaresCertificacao = computed(() =>
    PILARES_CERTIFICACAO.map((pilar) => ({
      id: pilar.id,
      icone: pilar.icone,
      titulo: this.traducao.getTraducao(pilar.titulo),
      descricao: this.traducao.getTraducao(pilar.descricao),
    })),
  );

  protected selecionarAmbito(ambito: string): void {
    this.ambitoSelecionado.set(ambito);
    this.pagina.set(0);
  }

  protected anteriores(): void {
    this.pagina.update((pagina) => Math.max(0, pagina - 1));
  }

  protected seguintes(): void {
    this.pagina.update((pagina) => Math.min(this.totalPaginas() - 1, pagina + 1));
  }
}
