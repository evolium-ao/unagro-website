import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';

/** `data` de `GET /candidaturas-docentes/verificar-bi`. */
interface VerificacaoBiApi {
  n_documento: string;
  tipo: 'bi' | 'passaporte';
  valido: boolean | null;
  mensagem: string;
}

/**
 * `valido`: `true` consta na AGT, `false` não consta, `null` não se sabe
 * (passaporte, AGT indisponível ou pedido falhado) — nesse caso deixa-se seguir.
 */
export interface VerificacaoBi {
  valido: boolean | null;
}

/**
 * `GET /candidaturas-docentes/verificar-bi` — rota pública, limitada a 10
 * pedidos por minuto. Responde sempre 200; o `valido` diz se o BI consta na AGT.
 *
 * Os resultados definitivos (`true`/`false`) ficam em memória: voltar a um
 * número já verificado não gasta outro pedido do limite.
 */
@Injectable({ providedIn: 'root' })
export class VerificacaoBiService {
  private readonly api = inject(ApiService);
  private readonly cache = new Map<string, VerificacaoBi>();

  async verificar(numero: string, signal?: AbortSignal): Promise<VerificacaoBi> {
    const chave = numero.trim().toUpperCase();
    const emCache = this.cache.get(chave);
    if (emCache) {
      return emCache;
    }
    try {
      const resposta = await this.api.get<VerificacaoBiApi>('candidaturas-docentes/verificar-bi', {
        parametros: { n_documento: chave },
        signal,
      });
      const resultado: VerificacaoBi = { valido: resposta.valido };
      if (resultado.valido !== null) {
        this.cache.set(chave, resultado);
      }
      return resultado;
    } catch (erro) {
      // Cancelado por nova escrita: quem pediu já não quer a resposta.
      if (signal?.aborted) {
        throw erro;
      }
      // Rede, 429 do limite ou 5xx: não bloqueia a candidatura.
      return { valido: null };
    }
  }
}
