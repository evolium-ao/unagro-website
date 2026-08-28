import { Injectable, computed, inject, signal } from '@angular/core';
import { CURSOS_MOCK } from '../dados/cursos.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutos = signal(CURSOS_MOCK);

  readonly cursos = computed(() => localizarProfundo(this.brutos(), this.traducao.idioma()));
  readonly cursosGrau = computed(() => this.cursos().filter((c) => c.tipo === 'grau'));
  readonly cursosCurtaDuracao = computed(() => this.cursos().filter((c) => c.tipo === 'curta-duracao'));

  obterPorId(id: string) {
    return computed(() => this.cursos().find((c) => c.id === id));
  }
}
