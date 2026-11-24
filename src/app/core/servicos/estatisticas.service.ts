import { Injectable, computed, inject, signal } from '@angular/core';
import { ESTATISTICAS_INSTITUCIONAIS_MOCK } from '../dados/estatisticas.mock';
import { PILARES_FACULDADE_MOCK } from '../dados/pilares-faculdade.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class EstatisticasService {
  private readonly traducao = inject(TraducaoService);
  private readonly institucionaisBrutas = signal(ESTATISTICAS_INSTITUCIONAIS_MOCK);
  private readonly pilaresBrutos = signal(PILARES_FACULDADE_MOCK);

  readonly institucionais = computed(() =>
    localizarProfundo(this.institucionaisBrutas(), this.traducao.idioma()),
  );
  readonly pilares = computed(() => localizarProfundo(this.pilaresBrutos(), this.traducao.idioma()));
}
