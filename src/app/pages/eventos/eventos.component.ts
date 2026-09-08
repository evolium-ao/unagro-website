import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { eventosQueries } from '../../core/consultas/eventos.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { AMBITOS_EVENTO, AmbitoEvento, ROTULOS_AMBITO_EVENTO } from '../../core/modelos/evento.model';
import { EventosService } from '../../core/servicos/eventos.service';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoEventoFotoEsqueletoComponent } from '../../shared/componentes/cartao-evento-foto-esqueleto/cartao-evento-foto-esqueleto.component';
import {
  CartaoEventoFotoComponent,
  EventoFotoCartao,
} from '../../shared/componentes/cartao-evento-foto/cartao-evento-foto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ItemFiltroLateralComponent } from '../../shared/componentes/item-filtro-lateral/item-filtro-lateral.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

const TODOS_OS_AMBITOS = '__todos__';

/** Uma linha com o cartão de destaque mais uma coluna, e outra linha com três cartões. */
const EVENTOS_POR_PAGINA = 5;

interface FiltroAmbito {
  valor: string;
  rotulo: string;
  icone: string;
}

/** Ícone da barra de filtros lateral, por âmbito. */
const ICONES_AMBITO: Record<AmbitoEvento, string> = {
  nacional: 'map-pin',
  internacional: 'globe',
  unagro: 'award',
};

/** Campos de texto do evento traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_EVENTO = ['titulo', 'descricao', 'local'] as const;

@Component({
  selector: 'app-eventos',
  imports: [
    BannerDestaqueComponent,
    CabecalhoSecaoComponent,
    CartaoEventoFotoComponent,
    CartaoEventoFotoEsqueletoComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    IconeComponent,
    ItemFiltroLateralComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './eventos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly servico = inject(EventosService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

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

  /** `GET /eventos` — a lista vem inteira, sem paginação nem filtros do lado da API. */
  protected readonly consultaEventos = injectQuery(() => eventosQueries.lista(this.servico));

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês,
   * `titulo`/`descricao`/`local` passam pela tradução automática antes de
   * chegar a `eventosFiltrados`. Enquanto a tradução carrega, ou se falhar,
   * fica o texto original em português — nunca uma lista vazia.
   */
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

  protected readonly erroEventos = computed(() =>
    this.traducao.getTraducao([
      'Não foi possível carregar os eventos.',
      'Could not load the events.',
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
    ...AMBITOS_EVENTO.map((ambito) => ({
      valor: ambito,
      rotulo: this.traducao.getTraducao(ROTULOS_AMBITO_EVENTO[ambito]),
      icone: ICONES_AMBITO[ambito],
    })),
  ]);

  private readonly eventosFiltrados = computed<EventoFotoCartao[]>(() => {
    const ambito = this.ambitoSelecionado();
    return this.eventosTraduzidos()
      .filter((evento) => ambito === TODOS_OS_AMBITOS || evento.ambito === ambito)
      .map((evento) => ({
        id: evento.id,
        titulo: evento.titulo,
        descricao: evento.descricao,
        categoria: this.traducao.getTraducao(ROTULOS_AMBITO_EVENTO[evento.ambito]),
        local: evento.local,
        dataInicio: evento.dataInicio,
        imagem: evento.imagem_url,
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
