import { Injectable, computed, inject, signal } from '@angular/core';
import { PROJETOS_MOCK } from '../dados/projetos.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class ProjetosService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutos = signal(PROJETOS_MOCK);

  readonly projetos = computed(() => localizarProfundo(this.brutos(), this.traducao.idioma()));

  obterPorId(id: string) {
    return computed(() => this.projetos().find((p) => p.id === id));
  }
}
