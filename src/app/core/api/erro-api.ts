import { HttpErrorResponse } from '@angular/common/http';

/**
 * Falha de um pedido à API, já normalizada. O `error()` de uma query do TanStack
 * Query devolve sempre uma destas, o que dá aos componentes um `estado` e uma
 * `mensagem` estáveis em vez do `HttpErrorResponse` cru.
 */
export class ErroApi extends Error {
  constructor(
    /** Código HTTP; `0` quando o pedido nem chegou ao servidor (rede em baixo, CORS). */
    readonly estado: number,
    mensagem: string,
    /** Corpo da resposta de erro, tal como veio — útil para os erros de validação 422. */
    readonly corpo?: unknown,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }

  /** `true` quando o recurso pedido não existe — o caso a tratar como "vazio" e não como avaria. */
  get naoEncontrado(): boolean {
    return this.estado === 404;
  }

  /**
   * Erros de validação do Laravel, na forma `{ campo: [mensagens] }`. Vazio
   * quando a resposta não é um 422.
   */
  get errosValidacao(): Record<string, string[]> {
    if (this.estado !== 422) return {};
    const erros = (this.corpo as { errors?: Record<string, string[]> } | undefined)?.errors;
    return erros ?? {};
  }

  static aPartirDe(erro: unknown): ErroApi {
    if (erro instanceof ErroApi) return erro;
    if (erro instanceof HttpErrorResponse) {
      const mensagem =
        (erro.error as { message?: string } | null)?.message ??
        erro.message ??
        'Falha ao comunicar com a API.';
      return new ErroApi(erro.status, mensagem, erro.error);
    }
    return new ErroApi(0, erro instanceof Error ? erro.message : String(erro));
  }
}
