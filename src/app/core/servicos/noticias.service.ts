import { Injectable, computed, inject, signal } from '@angular/core';
import { NOTICIAS_MOCK } from '../dados/noticias.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly traducao = inject(TraducaoService);
  private readonly brutas = signal(NOTICIAS_MOCK);

  readonly noticias = computed(() => localizarProfundo(this.brutas(), this.traducao.idioma()));
  readonly emDestaque = computed(() => this.noticias().filter((n) => n.destaque));
  readonly academicas = computed(() => this.noticias().filter((n) => n.academica));
}
