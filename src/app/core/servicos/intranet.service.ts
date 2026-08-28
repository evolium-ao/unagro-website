import { Injectable, computed, inject, signal } from '@angular/core';
import { AVISOS_INTRANET_MOCK } from '../dados/avisos-intranet.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class IntranetService {
  private readonly traducao = inject(TraducaoService);
  private readonly avisosBrutos = signal(AVISOS_INTRANET_MOCK);

  readonly avisos = computed(() => localizarProfundo(this.avisosBrutos(), this.traducao.idioma()));
}
