import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';

/** `data` de `POST /candidaturas-docentes/email/enviar-codigo`. */
interface CodigoEnviadoApi {
  /** Segundos até o código expirar. */
  expira_em: number;
  /** Segundos até ser permitido pedir outro código. */
  reenviar_em: number;
}

export interface CodigoEnviado {
  expiraEm: number;
  reenviarEm: number;
}

/** Valores por omissão quando a API não os devolve. */
const EXPIRA_EM_S = 600;
const REENVIAR_EM_S = 60;

/**
 * Confirmação do e-mail da candidatura docente por código OTP de 6 dígitos —
 * a alternativa a validar a caixa por SMTP ou por uma API externa com chave.
 *
 * O site pede o código (a API envia-o para o e-mail), o candidato escreve-o e o
 * site confirma-o; o mesmo código segue depois no `POST /candidaturas-docentes`
 * (`codigo_otp`), onde a API o volta a verificar e o consome. Rotas públicas.
 */
@Injectable({ providedIn: 'root' })
export class VerificacaoEmailService {
  private readonly api = inject(ApiService);

  async enviarCodigo(email: string, signal?: AbortSignal): Promise<CodigoEnviado> {
    const resposta = await this.api.post<CodigoEnviadoApi | null>(
      'candidaturas-docentes/email/enviar-codigo',
      { email: email.trim() },
      { signal },
    );
    return {
      expiraEm: resposta?.expira_em ?? EXPIRA_EM_S,
      reenviarEm: resposta?.reenviar_em ?? REENVIAR_EM_S,
    };
  }

  /** Resolve se o código é válido; rejeita com 422 (`codigo_otp`) se não for. Não consome o código. */
  async verificarCodigo(email: string, codigo: string, signal?: AbortSignal): Promise<void> {
    await this.api.post<unknown>(
      'candidaturas-docentes/email/verificar-codigo',
      { email: email.trim(), codigo_otp: codigo },
      { signal },
    );
  }
}
