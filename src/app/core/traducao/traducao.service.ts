import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { CaminhoDicionario, Dicionario } from './dicionario';
import { en } from './dicionarios/en';
import { pt } from './dicionarios/pt';
import { IDIOMA_PADRAO, IDIOMAS_DISPONIVEIS, Idioma } from './idioma';

const CHAVE_ARMAZENAMENTO = 'unagro.idioma';

@Injectable({ providedIn: 'root' })
export class TraducaoService {
  private readonly idiomaSinal = signal<Idioma>(IDIOMA_PADRAO);
  readonly idioma = this.idiomaSinal.asReadonly();

  private readonly dicionarioAtual = computed<Dicionario>(() =>
    this.idiomaSinal() === 'pt' ? pt : en,
  );

  getTraducao(textos: string[]): string {
    const indice = IDIOMAS_DISPONIVEIS.indexOf(this.idiomaSinal());
    return textos[indice] ?? textos[0];
  }

  constructor() {
    afterNextRender(() => {
      const guardado = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      if (guardado === 'pt' || guardado === 'en') {
        this.idiomaSinal.set(guardado);
      }
    });
  }

  definirIdioma(idioma: Idioma): void {
    this.idiomaSinal.set(idioma);
    localStorage.setItem(CHAVE_ARMAZENAMENTO, idioma);
  }

  t(caminho: CaminhoDicionario): string {
    const partes = caminho.split('.');
    let atual: unknown = this.dicionarioAtual();
    for (const parte of partes) {
      if (atual != null && typeof atual === 'object' && parte in atual) {
        atual = (atual as Record<string, unknown>)[parte];
      } else {
        return caminho;
      }
    }
    return typeof atual === 'string' ? atual : caminho;
  }
}
