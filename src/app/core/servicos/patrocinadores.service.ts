import { Injectable, computed, inject, signal } from '@angular/core';
import { PATROCINADORES_MOCK } from '../dados/patrocinadores.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class PatrocinadoresService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutos = signal(PATROCINADORES_MOCK);

  /** Lista institucional já localizada — é o que a `app-faixa-patrocinadores` recebe. */
  readonly patrocinadores = computed(() =>
    localizarProfundo(this.brutos(), this.traducao.idioma()),
  );
}
