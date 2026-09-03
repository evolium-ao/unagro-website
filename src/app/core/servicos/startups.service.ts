import { Injectable, computed, inject, signal } from '@angular/core';
import { STARTUPS_MOCK } from '../dados/startups.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class StartupsService {
  private readonly traducao = inject(TraducaoService);
  // Única linha ligada ao mock: no dia da API troca-se por `httpResource(...)`.
  private readonly brutos = signal(STARTUPS_MOCK);

  /** Startups incubadas, já localizadas para o idioma corrente. */
  readonly startups = computed(() => localizarProfundo(this.brutos(), this.traducao.idioma()));
}
