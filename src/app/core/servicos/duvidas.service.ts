import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovaDuvida } from '../modelos/duvida.model';

/**
 * `POST /duvidas` — a pergunta do canal de dúvidas de `candidatura-geral/inicio`.
 * É público (rota sem `Authorization`, limitada a 10 pedidos por minuto do lado da API):
 * `nome`, `email`, `assunto` (um dos `valor` de `GET /duvidas/assuntos`) e `pergunta`.
 *
 * **Sem `listarAssuntos()`**: os 5 valores do enum (`enquadramento`, `documentacao`,
 * `submissao`, `prazos`, `outro`) são conteúdo estrutural fixo, como os outros selects
 * de `candidatura-geral.service.ts` — não vale a pena uma consulta à parte só para isto.
 *
 * **Sem `listar()`**: `GET /duvidas` devolve as já respondidas, mas o site ainda não
 * tem onde as mostrar.
 */
@Injectable({ providedIn: 'root' })
export class DuvidasService {
  private readonly api = inject(ApiService);

  criar(dados: NovaDuvida, signal?: AbortSignal): Promise<void> {
    return this.api.post<unknown>('duvidas', dados, { signal }).then(() => undefined);
  }
}
