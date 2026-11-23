import { Observable } from 'rxjs';

/**
 * Converte um observable numa promessa que **cancela o pedido** quando o
 * `AbortSignal` dispara. O `firstValueFrom` do RxJS não serve aqui: ele nunca
 * se dessubscreve por si, e um pedido que já não interessa a ninguém
 * continuaria a ocupar a rede.
 *
 * Vive em `core/api/` porque serve qualquer chamada HTTP cancelável do site,
 * não só a API da Unagro — o `TraducaoAutomaticaService` também a usa.
 */
export function promessaCancelavel<T>(fonte: Observable<T>, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((resolver, rejeitar) => {
    if (signal?.aborted) {
      rejeitar(signal.reason);
      return;
    }
    let aoAbortar: (() => void) | undefined;
    const limpar = () => {
      if (aoAbortar) signal?.removeEventListener('abort', aoAbortar);
    };
    const subscricao = fonte.subscribe({
      next: (valor) => {
        limpar();
        resolver(valor);
      },
      error: (erro) => {
        limpar();
        rejeitar(erro);
      },
    });
    aoAbortar = () => {
      subscricao.unsubscribe();
      rejeitar(signal?.reason);
    };
    signal?.addEventListener('abort', aoAbortar, { once: true });
  });
}
