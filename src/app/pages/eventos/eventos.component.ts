import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EventosService } from '../../core/servicos/eventos.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CartaoEventoComponent } from '../../shared/componentes/cartao-evento/cartao-evento.component';
import { ContadorRegressivoComponent } from '../../shared/componentes/contador-regressivo/contador-regressivo.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";

const TODAS_CATEGORIAS = '__todas__';

@Component({
  selector: 'app-eventos',
  imports: [BannerDestaqueComponent, CartaoEventoComponent, ContadorRegressivoComponent, SeloComponent, ContainerBannerFaixaEstatisticaComponent],
  templateUrl: './eventos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly eventosService = inject(EventosService);

  protected readonly categoriaSelecionada = signal(TODAS_CATEGORIAS);
  protected readonly TODAS_CATEGORIAS = TODAS_CATEGORIAS;

  protected readonly eventoPrincipal = this.eventosService.emDestaque;

  protected readonly tituloHero = computed(() => this.traducao.getTraducao(['Simpósio', 'International']));

  protected readonly tituloHeroDestaque = computed(() =>
    this.traducao.getTraducao(['Internacional', 'Symposium']),
  );

  protected readonly tituloHeroFim = computed(() =>
    this.traducao.getTraducao(['de Biotecnologia Agrária', 'on Agrarian Biotechnology']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Unindo as maiores mentes do continente para discutir o futuro da segurança alimentar através de inovações genéticas e sustentabilidade climática.',
      'Bringing together the continent’s greatest minds to discuss the future of food security through genetic innovation and climate sustainability.',
    ]),
  );

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      // TODO: apontar para a inscrição do evento quando existir rota de detalhe/inscrição.
      link: '/eventos#secao-destaque',
      texto: this.traducao.getTraducao(['Inscrever-se agora', 'Register now']),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
  ]);

  protected readonly categorias = computed(() => [
    ...new Set(this.eventosService.proximos().map((e) => e.categoria)),
  ]);

  protected readonly eventosFiltrados = computed(() => {
    const categoria = this.categoriaSelecionada();
    const proximos = this.eventosService.proximos();
    return categoria === TODAS_CATEGORIAS ? proximos : proximos.filter((e) => e.categoria === categoria);
  });

  protected readonly rotulosContador = computed(() => ({
    dias: this.traducao.t('paginas.eventos.contadorDias'),
    horas: this.traducao.t('paginas.eventos.contadorHoras'),
    minutos: this.traducao.t('paginas.eventos.contadorMinutos'),
    segundos: this.traducao.t('paginas.eventos.contadorSegundos'),
  }));

  protected selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada.set(categoria);
  }
}
