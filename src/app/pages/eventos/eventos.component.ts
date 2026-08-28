import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EventosService } from '../../core/servicos/eventos.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { CartaoEventoComponent } from '../../shared/componentes/cartao-evento/cartao-evento.component';
import { ContadorRegressivoComponent } from '../../shared/componentes/contador-regressivo/contador-regressivo.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';

const TODAS_CATEGORIAS = '__todas__';

@Component({
  selector: 'app-eventos',
  imports: [CartaoEventoComponent, ContadorRegressivoComponent, SeloComponent],
  templateUrl: './eventos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly eventosService = inject(EventosService);

  protected readonly categoriaSelecionada = signal(TODAS_CATEGORIAS);
  protected readonly TODAS_CATEGORIAS = TODAS_CATEGORIAS;

  protected readonly eventoPrincipal = this.eventosService.emDestaque;

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
