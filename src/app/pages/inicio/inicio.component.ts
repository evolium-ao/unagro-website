import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { EventosService } from '../../core/servicos/eventos.service';
import { NoticiasService } from '../../core/servicos/noticias.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent, HeroImage } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CartaoEventoDestaqueComponent } from '../../shared/componentes/cartao-evento-destaque/cartao-evento-destaque.component';
import { CartaoNoticiaDestaqueComponent } from '../../shared/componentes/cartao-noticia-destaque/cartao-noticia-destaque.component';
import { CartaoNoticiaResumoComponent } from '../../shared/componentes/cartao-noticia-resumo/cartao-noticia-resumo.component';
import { FaixaEstatisticasComponent } from '../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component';
import {
  FaixaPatrocinadoresComponent,
  PatrocinadorExibido,
} from '../../shared/componentes/faixa-patrocinadores/faixa-patrocinadores.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';
import { ContainerPaginaComponent } from "../../shared/componentes/container-pagina/container-pagina.component";

/** Uma notícia em destaque mais três secundárias preenchem a grelha da secção. */
const NOTICIAS_POR_PAGINA = 4;

/** Placeholder até existirem logótipos reais dos patrocinadores. */
const PATROCINADORES_PLACEHOLDER: PatrocinadorExibido[] = [
  { id: '1', nome: 'Patrocinador 1' },
  { id: '2', nome: 'Patrocinador 2' },
  { id: '3', nome: 'Patrocinador 3' },
  { id: '4', nome: 'Patrocinador 4' },
  { id: '5', nome: 'Patrocinador 5' },
  { id: '6', nome: 'Patrocinador 6' },
];

@Component({
  selector: 'app-inicio',
  imports: [
    BannerDestaqueComponent,
    FaixaEstatisticasComponent,
    FaixaPatrocinadoresComponent,
    CartaoNoticiaDestaqueComponent,
    CartaoNoticiaResumoComponent,
    CartaoEventoDestaqueComponent,
    IconeComponent,
    RevelarAoScrollDirective,
    ContainerPaginaComponent
  ],
  templateUrl: './inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent {
  protected readonly traducao = inject(TraducaoService);

  private readonly estatisticasService = inject(EstatisticasService);
  private readonly noticiasService = inject(NoticiasService);
  private readonly eventosService = inject(EventosService);

  protected readonly estatisticas = this.estatisticasService.institucionais;
  protected readonly pilares = this.estatisticasService.pilares;
  protected readonly eventoPrincipal = this.eventosService.emDestaque;
  protected readonly patrocinadores = signal(PATROCINADORES_PLACEHOLDER);

  private readonly paginaNoticias = signal(0);

  private readonly totalPaginasNoticias = computed(() =>
    Math.max(1, Math.ceil(this.noticiasService.noticias().length / NOTICIAS_POR_PAGINA)),
  );

  private readonly noticiasDaPagina = computed(() => {
    const inicio = this.paginaNoticias() * NOTICIAS_POR_PAGINA;
    return this.noticiasService.noticias().slice(inicio, inicio + NOTICIAS_POR_PAGINA);
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
}
