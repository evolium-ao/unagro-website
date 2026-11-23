import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { promessaCancelavel } from '../api/promessa-cancelavel';
import { environment } from '../../../environments/environment';
import { Idioma } from './idioma';

const RAIZ_MYMEMORY = 'https://api.mymemory.translated.net/get';

interface RespostaMyMemory {
  responseData: { translatedText: string };
}

/**
 * Traduz conteúdo vindo da API da Unagro, que só existe em português (ver
 * `.claude/README.md`, secção "Dados da API — TanStack Query"). Usa a
 * MyMemory (`api.mymemory.translated.net`), que não pede chave de API.
 *
 * Fica em `core/traducao/` e não em `core/api/` porque não fala com a API da
 * Unagro — é um serviço de tradução de terceiros, genérico a qualquer texto.
 */
@Injectable({ providedIn: 'root' })
export class TraducaoAutomaticaService {
  private readonly http = inject(HttpClient);

  /**
   * Traduz uma lista de textos de uma vez (uma chamada por texto, em
   * paralelo). Uma entrada vazia devolve `''` sem chamar a API; uma entrada
   * cuja tradução falhe devolve o texto original, para nunca partir a lista
   * toda por causa de uma frase.
   */
  traduzirLista(textos: readonly string[], idioma: Idioma, signal?: AbortSignal): Promise<string[]> {
    if (idioma === 'pt') return Promise.resolve([...textos]);
    return Promise.all(textos.map((texto) => this.traduzirTexto(texto, idioma, signal)));
  }

  private async traduzirTexto(texto: string, idioma: Idioma, signal?: AbortSignal): Promise<string> {
    if (!texto.trim()) return '';
    try {
      const parametros: Record<string, string> = { q: texto, langpair: `pt|${idioma}` };
      if (environment.traducaoEmail) parametros['de'] = environment.traducaoEmail;
      const resposta = await promessaCancelavel(
        this.http.get<RespostaMyMemory>(RAIZ_MYMEMORY, { params: parametros }),
        signal,
      );
      return resposta.responseData.translatedText || texto;
    } catch {
      return texto;
    }
  }
}
