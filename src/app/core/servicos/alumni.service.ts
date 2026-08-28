import { Injectable, computed, inject, signal } from '@angular/core';
import { HISTORIAS_ALUMNI_MOCK } from '../dados/historias-alumni.mock';
import { ESTATISTICAS_IMPACTO_ALUMNI_MOCK } from '../dados/estatisticas.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class AlumniService {
  private readonly traducao = inject(TraducaoService);
  private readonly historiasBrutas = signal(HISTORIAS_ALUMNI_MOCK);
  private readonly estatisticasBrutas = signal(ESTATISTICAS_IMPACTO_ALUMNI_MOCK);

  readonly historias = computed(() => localizarProfundo(this.historiasBrutas(), this.traducao.idioma()));
  readonly estatisticasImpacto = computed(() =>
    localizarProfundo(this.estatisticasBrutas(), this.traducao.idioma()),
  );
}
