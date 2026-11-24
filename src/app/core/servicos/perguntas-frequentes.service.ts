import { Injectable, computed, inject, signal } from '@angular/core';
import { PERGUNTAS_FREQUENTES_MOCK } from '../dados/perguntas-frequentes.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class PerguntasFrequentesService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutas = signal(PERGUNTAS_FREQUENTES_MOCK);

  readonly perguntas = computed(() => localizarProfundo(this.brutas(), this.traducao.idioma()));
}
