import { Injectable, computed, inject, signal } from '@angular/core';
import { PROJECTOS_INOVADORES_MOCK } from '../dados/projectos-inovadores.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class ProjectosInovadoresService {
  private readonly traducao = inject(TraducaoService);
  // Única linha ligada ao mock: no dia da API troca-se por `httpResource(...)`.
  private readonly brutos = signal(PROJECTOS_INOVADORES_MOCK);

  /** Projectos inovadores, na ordem do mock e já localizados para o idioma corrente. */
  readonly projectos = computed(() => localizarProfundo(this.brutos(), this.traducao.idioma()));

  /** O destacado da grelha — o que leva fotografia e barra de financiamento. */
  readonly projectoDestacado = computed(() => this.projectos().find((p) => p.destaque));

  /** Os restantes, que saem nos cartões simples com ícone e estágio. */
  readonly projectosSimples = computed(() => this.projectos().filter((p) => !p.destaque));
}
