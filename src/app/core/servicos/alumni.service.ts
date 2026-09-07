import { Injectable, computed, inject, signal } from '@angular/core';
import { HISTORIAS_ALUMNI_MOCK } from '../dados/historias-alumni.mock';
import { Estatistica } from '../modelos/estatistica.model';
import {
  ESTATISTICAS_IMPACTO_ALUMNI_MOCK,
  ESTATISTICA_MEMBROS_ALUMNI_MOCK,
} from '../dados/estatisticas.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

/** Quantas histórias com retrato a secção de destaque mostra. */
const HISTORIAS_DESTAQUE = 3;

@Injectable({ providedIn: 'root' })
export class AlumniService {
  private readonly traducao = inject(TraducaoService);
  private readonly historiasBrutas = signal(HISTORIAS_ALUMNI_MOCK);
  private readonly estatisticasBrutas = signal(ESTATISTICAS_IMPACTO_ALUMNI_MOCK);
  private readonly membrosRedeBruto = signal<Estatistica | undefined>(ESTATISTICA_MEMBROS_ALUMNI_MOCK);

  readonly historias = computed(() => localizarProfundo(this.historiasBrutas(), this.traducao.idioma()));
  readonly estatisticasImpacto = computed(() =>
    localizarProfundo(this.estatisticasBrutas(), this.traducao.idioma()),
  );

  /**
   * Histórias em destaque da secção "Onde estão os nossos Alumni?": só as que têm
   * retrato, no máximo três. A filtragem vive aqui — a página mostra o sinal, não
   * faz `slice`.
   */
  readonly historiasDestaque = computed(() =>
    this.historias()
      .filter((historia) => !!historia.foto)
      .slice(0, HISTORIAS_DESTAQUE),
  );

  /** Indicador da dimensão da rede; `undefined` enquanto a API não o servir. */
  readonly membrosRede = computed(() => {
    const bruto = this.membrosRedeBruto();
    return bruto ? localizarProfundo(bruto, this.traducao.idioma()) : undefined;
  });
}
