import { Injectable, computed, inject, signal } from '@angular/core';
import { EVENTOS_MOCK } from '../dados/eventos.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutos = signal(EVENTOS_MOCK);

  readonly eventos = computed(() =>
    [...localizarProfundo(this.brutos(), this.traducao.idioma())].sort(
      (a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime(),
    ),
  );
  readonly emDestaque = computed(() => this.eventos().find((e) => e.destaque) ?? this.eventos()[0]);
  readonly proximos = computed(() => this.eventos().filter((e) => e.id !== this.emDestaque()?.id));

  obterPorId(id: string) {
    return computed(() => this.eventos().find((e) => e.id === id));
  }
}
