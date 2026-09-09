import { Injectable, computed, inject, signal } from '@angular/core';
import { ESTATISTICAS_IMPACTO_ALUMNI_MOCK, ESTATISTICA_MEMBROS_ALUMNI_MOCK } from '../dados/estatisticas.mock';
import { Estatistica } from '../modelos/estatistica.model';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

/**
 * Estatísticas institucionais da página `alumni` (sessão 1, "Sobre a Alumni
 * UNAGRO") — continuam alimentadas pelo mock: a API de alumni não tem
 * endpoint de estatísticas agregadas. Separado do `AlumniService`, que passou
 * a ser o serviço de recurso puro do `GET /alumni` (sessão 2, "Onde estão os
 * nossos Alumni?", sem sinais nem cache) — ver `.claude/memory/integrar-recurso.md`.
 */
@Injectable({ providedIn: 'root' })
export class AlumniEstatisticasService {
  private readonly traducao = inject(TraducaoService);
  private readonly estatisticasBrutas = signal(ESTATISTICAS_IMPACTO_ALUMNI_MOCK);
  private readonly membrosRedeBruto = signal<Estatistica | undefined>(ESTATISTICA_MEMBROS_ALUMNI_MOCK);

  readonly estatisticasImpacto = computed(() =>
    localizarProfundo(this.estatisticasBrutas(), this.traducao.idioma()),
  );

  /** Indicador da dimensão da rede; `undefined` enquanto a API não o servir. */
  readonly membrosRede = computed(() => {
    const bruto = this.membrosRedeBruto();
    return bruto ? localizarProfundo(bruto, this.traducao.idioma()) : undefined;
  });
}
