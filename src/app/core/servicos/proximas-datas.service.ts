import { Injectable, computed, inject, signal } from '@angular/core';
import { PROXIMAS_DATAS_MOCK } from '../dados/proximas-datas.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class ProximasDatasService {
  private readonly traducao = inject(TraducaoService);
  // Única linha ligada ao mock: no dia da API troca-se por `httpResource(...)`.
  private readonly brutos = signal(PROXIMAS_DATAS_MOCK);

  /** Já localizadas e por ordem cronológica — a ordenação é do serviço, não da página. */
  readonly proximasDatas = computed(() =>
    [...localizarProfundo(this.brutos(), this.traducao.idioma())].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    ),
  );
}
