import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErroApi } from './erro-api';
import { promessaCancelavel } from './promessa-cancelavel';
import { RespostaApi } from './resposta-api';

/** Valores aceites na query string. As chaves com `undefined`/`null` são omitidas. */
export type ParametrosPedido = Record<string, string | number | boolean | undefined | null>;

export interface OpcoesPedido {
  parametros?: ParametrosPedido;
  /**
   * Sinal de cancelamento. Passa sempre o `signal` que o `queryFn` recebe —
   * é o que faz o pedido morrer quando a query é descartada ou refeita.
   */
  signal?: AbortSignal;
}

/**
 * O único ponto do projecto que fala HTTP com a API da Unagro.
 *
 * Faz três coisas e mais nenhuma:
 * 1. monta o URL a partir de `environment.apiUrl`;
 * 2. desembrulha o envelope `{ status, message, data }` e devolve só o `data`;
 * 3. devolve uma **promessa**, que é a forma que o `queryFn` do TanStack Query espera.
 *
 * Não guarda estado, não faz cache e não traduz — a cache é do TanStack Query e
 * a forma dos dados é dos serviços de recurso (`core/servicos/*.service.ts`)
 * que ficam por cima deste.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(caminho: string, opcoes: OpcoesPedido = {}): Promise<T> {
    return this.desembrulhar(
      this.http.get<RespostaApi<T>>(this.url(caminho), { params: this.params(opcoes.parametros) }),
      opcoes.signal,
    );
  }

  /** O `corpo` pode ser um objecto (vai como JSON) ou um `FormData`, para envios com ficheiro. */
  post<T>(caminho: string, corpo?: unknown, opcoes: OpcoesPedido = {}): Promise<T> {
    return this.desembrulhar(
      this.http.post<RespostaApi<T>>(this.url(caminho), corpo ?? {}, {
        params: this.params(opcoes.parametros),
      }),
      opcoes.signal,
    );
  }

  put<T>(caminho: string, corpo?: unknown, opcoes: OpcoesPedido = {}): Promise<T> {
    return this.desembrulhar(
      this.http.put<RespostaApi<T>>(this.url(caminho), corpo ?? {}, {
        params: this.params(opcoes.parametros),
      }),
      opcoes.signal,
    );
  }

  delete<T>(caminho: string, opcoes: OpcoesPedido = {}): Promise<T> {
    return this.desembrulhar(
      this.http.delete<RespostaApi<T>>(this.url(caminho), {
        params: this.params(opcoes.parametros),
      }),
      opcoes.signal,
    );
  }

  private url(caminho: string): string {
    return `${environment.apiUrl}/${caminho.replace(/^\//, '')}`;
  }

  private params(parametros?: ParametrosPedido): HttpParams | undefined {
    if (!parametros) return undefined;
    let params = new HttpParams();
    for (const [chave, valor] of Object.entries(parametros)) {
      if (valor === undefined || valor === null) continue;
      params = params.set(chave, String(valor));
    }
    return params;
  }

  private async desembrulhar<T>(
    pedido: Observable<RespostaApi<T>>,
    signal?: AbortSignal,
  ): Promise<T> {
    try {
      const resposta = await promessaCancelavel(pedido, signal);
      return resposta.data;
    } catch (erro) {
      throw ErroApi.aPartirDe(erro);
    }
  }
}
