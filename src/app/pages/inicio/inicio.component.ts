import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { eventosQueries } from '../../core/consultas/eventos.queries';
import { noticiasQueries } from '../../core/consultas/noticias.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { NOTICIAS_FALLBACK } from '../../core/dados/noticias.mock';
import { Evento } from '../../core/modelos/evento.model';
import { Noticia } from '../../core/modelos/noticia.model';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { EventosService } from '../../core/servicos/eventos.service';
import { NoticiasService } from '../../core/servicos/noticias.service';
import { PatrocinadoresService } from '../../core/servicos/patrocinadores.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import { BannerDestaqueComponent, HeroImage } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CartaoEventoDestaqueComponent } from '../../shared/componentes/cartao-evento-destaque/cartao-evento-destaque.component';
import { CartaoNoticiaDestaqueComponent } from '../../shared/componentes/cartao-noticia-destaque/cartao-noticia-destaque.component';
import { CartaoNoticiaDestaqueEsqueletoComponent } from '../../shared/componentes/cartao-noticia-destaque-esqueleto/cartao-noticia-destaque-esqueleto.component';
import { CartaoNoticiaResumoComponent } from '../../shared/componentes/cartao-noticia-resumo/cartao-noticia-resumo.component';
import { CartaoNoticiaResumoEsqueletoComponent } from '../../shared/componentes/cartao-noticia-resumo-esqueleto/cartao-noticia-resumo-esqueleto.component';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';
import { ContainerPaginaComponent } from "../../shared/componentes/container-pagina/container-pagina.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { FaixaPatrocinadoresComponent } from "../../shared/componentes/faixa-patrocinadores/faixa-patrocinadores.component";
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";

interface PilarBruto {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/**
 * Os quatro pilares do modelo UNAGRO. É conteúdo estrutural da própria sessão —
 * não uma lista que a API venha a servir —, por isso fica aqui, como as
 * `VANTAGENS_BRUTAS` de `formacoes`.
 */
const PILARES_MODELO: PilarBruto[] = [
  {
    id: 'educacao-solo-real',
    icone: 'sprout',
    titulo: { pt: 'Educação em Solo Real', en: 'Education on Real Ground' },
    descricao: {
      pt: 'Aprendizagem prática diretamente nos campos experimentais e projetos reais da indústria.',
      en: 'Hands-on learning straight from our experimental fields and real industry projects.',
    },
  },
  {
    id: 'tecnologia-inovacao',
    icone: 'bot',
    titulo: { pt: 'Tecnologia e Inovação', en: 'Technology and Innovation' },
    descricao: {
      pt: 'Domínio de ferramentas de agricultura de precisão, IoT e gestão inteligente de recursos.',
      en: 'Mastery of precision farming tools, IoT and smart resource management.',
    },
  },
  {
    id: 'sustentabilidade',
    icone: 'earth',
    titulo: { pt: 'Sustentabilidade', en: 'Sustainability' },
    descricao: {
      pt: 'Foco em modelos de produção resilientes que preservam a biodiversidade de Angola.',
      en: "A focus on resilient production models that safeguard Angola's biodiversity.",
    },
  },
  {
    id: 'conexao-mercado',
    icone: 'handshake',
    titulo: { pt: 'Conexão com o Mercado', en: 'Industry Connections' },
    descricao: {
      pt: 'Networking direto com grandes players do agronegócio e estágios garantidos.',
      en: 'Direct networking with major agribusiness players and guaranteed internships.',
    },
  },
];

/** Uma notícia em destaque mais três secundárias preenchem a grelha da secção. */
const NOTICIAS_POR_PAGINA = 4;

/** Campos de texto traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_NOTICIA = ['titulo', 'resumo', 'categoria'] as const;
const CAMPOS_TRADUZIVEIS_EVENTO = ['titulo', 'descricao', 'local'] as const;

/** Destaques primeiro; dentro de cada grupo, a mais recente à frente. */
function porDestaqueEData(a: Noticia, b: Noticia): number {
  if (a.destaque !== b.destaque) return a.destaque ? -1 : 1;
  return new Date(b.data).getTime() - new Date(a.data).getTime();
}

@Component({
  selector: 'app-inicio',
  imports: [
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    CartaoEventoDestaqueComponent,
    CartaoNoticiaDestaqueComponent,
    CartaoNoticiaDestaqueEsqueletoComponent,
    CartaoNoticiaResumoComponent,
    CartaoNoticiaResumoEsqueletoComponent,
    CartaoRecursoComponent,
    IconeComponent,
    RevelarAoScrollDirective,
    FaixaPatrocinadoresComponent
  ],
  templateUrl: './inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent {
  protected readonly traducao = inject(TraducaoService);

  private readonly estatisticasService = inject(EstatisticasService);
  private readonly noticiasService = inject(NoticiasService);
  private readonly eventosService = inject(EventosService);
  private readonly patrocinadoresService = inject(PatrocinadoresService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  protected readonly estatisticas = this.estatisticasService.institucionais;
  protected readonly pilares = this.estatisticasService.pilares;
  protected readonly patrocinadores = this.patrocinadoresService.patrocinadores;

  /** `GET /eventos` — a lista vem inteira, sem paginação nem filtros do lado da API. */
  protected readonly consultaEventos = injectQuery(() => eventosQueries.lista(this.eventosService));

  /** A API só devolve português (ver `.claude/README.md`); traduzido antes do `find`. */
  private readonly consultaTraducaoEventos = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaEventos.data() ?? [], CAMPOS_TRADUZIVEIS_EVENTO),
      this.traducao.idioma(),
    ),
  );

  private readonly eventosTraduzidos = computed(() =>
    aplicarTraducao(
      this.consultaEventos.data() ?? [],
      CAMPOS_TRADUZIVEIS_EVENTO,
      this.consultaTraducaoEventos.data(),
    ),
  );

  /**
   * A API ainda não dá a data do evento (ver `evento.model.ts`), e sem ela o
   * `app-cartao-evento-destaque` não tem o que mostrar na contagem decrescente.
   * Enquanto isso não mudar do lado do Laravel, esta secção fica na mensagem de
   * "sem eventos" já prevista no template, em vez de mostrar uma contagem para
   * uma data inventada.
   */
  protected readonly eventoPrincipal = computed<(Evento & { dataInicio: string }) | undefined>(() =>
    this.eventosTraduzidos().find(
      (evento): evento is Evento & { dataInicio: string } => !!evento.dataInicio,
    ),
  );

  protected readonly pilaresModelo = computed(() =>
    localizarProfundo(PILARES_MODELO, this.traducao.idioma()),
  );

  /** `GET /noticias` — a lista vem inteira, sem paginação nem filtros do lado da API. */
  protected readonly consultaNoticias = injectQuery(() =>
    noticiasQueries.lista(this.noticiasService),
  );

  /**
   * A API só devolve português (ver `.claude/README.md`). O conteúdo de
   * recurso (`noticiasFallback`) já vem bilingue por `localizarProfundo` — só
   * o que vier da API precisa desta tradução automática.
   */
  private readonly consultaTraducaoNoticias = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaNoticias.data() ?? [], CAMPOS_TRADUZIVEIS_NOTICIA),
      this.traducao.idioma(),
    ),
  );

  private readonly noticiasApiTraduzidas = computed(() =>
    aplicarTraducao(
      this.consultaNoticias.data() ?? [],
      CAMPOS_TRADUZIVEIS_NOTICIA,
      this.consultaTraducaoNoticias.data(),
    ),
  );

  /** O conteúdo local de recurso, já no idioma escolhido. */
  private readonly noticiasFallback = computed<Noticia[]>(() =>
    localizarProfundo(NOTICIAS_FALLBACK, this.traducao.idioma()),
  );

  /**
   * A API manda tudo de uma vez, por isso a ordenação é feita aqui. Sem notícias
   * do lado da API — lista vazia ou pedido falhado — a secção mostra o conteúdo
   * de recurso em vez de ficar às moscas na página de entrada.
   */
  private readonly noticias = computed<Noticia[]>(() => {
    const daApi = this.noticiasApiTraduzidas();
    return daApi.length ? [...daApi].sort(porDestaqueEData) : this.noticiasFallback();
  });

  private readonly paginaNoticias = signal(0);

  private readonly totalPaginasNoticias = computed(() =>
    Math.max(1, Math.ceil(this.noticias().length / NOTICIAS_POR_PAGINA)),
  );

  private readonly noticiasDaPagina = computed(() => {
    const inicio = this.paginaNoticias() * NOTICIAS_POR_PAGINA;
    return this.noticias().slice(inicio, inicio + NOTICIAS_POR_PAGINA);
  });

  protected readonly noticiaDestaque = computed(() => this.noticiasDaPagina()[0]);
  /** As duas notícias da coluna do meio. */
  protected readonly noticiasEmpilhadas = computed(() => this.noticiasDaPagina().slice(1, 3));
  /** A notícia da coluna da direita. */
  protected readonly noticiaLateral = computed(() => this.noticiasDaPagina()[3]);

  protected readonly temNoticiasAnteriores = computed(() => this.paginaNoticias() > 0);
  protected readonly temNoticiasSeguintes = computed(
    () => this.paginaNoticias() < this.totalPaginasNoticias() - 1,
  );

  protected readonly noticiasTitulo = computed(() =>
    this.traducao.getTraducao(['Notícias', 'News']),
  );
  protected readonly noticiasSubtitulo = computed(() =>
    this.traducao.getTraducao(['Veja aqui notícias recentes', 'See the latest news here']),
  );

  protected noticiasAnteriores(): void {
    this.paginaNoticias.update((pagina) => Math.max(0, pagina - 1));
  }

  protected noticiasSeguintes(): void {
    this.paginaNoticias.update((pagina) => Math.min(this.totalPaginasNoticias() - 1, pagina + 1));
  }

  readonly heroImageConfig: HeroImage = {
    url: '/imagens/estudante.png',
    x: '0',
    y: '0px'
  }

  readonly heroSubtitulo = computed(() => this.traducao.getTraducao([
    "Ciência, inovação e sustentabilidade ao serviço do futuro agrícola de Angola, do campo ao mercado global.",
    "Science, innovation and sustainability at the service of Angola's agricultural future, from the field to the global market."
  ]));
  readonly heroTitulo = computed(() => this.traducao.getTraducao([
    "Formando os",
    "Training"
  ]));
  readonly heroTituloDestaque = computed(() => this.traducao.getTraducao([
    "lideres",
    "Leaders"
  ]));
  readonly heroTituloFim = computed(() => this.traducao.getTraducao([
    "do Agronegócio Africano!",
    "African Agribusiness"
  ]));
}
