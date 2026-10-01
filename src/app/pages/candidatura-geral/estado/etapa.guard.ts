import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CandidaturaGeralEstadoService, NumeroEtapa } from './candidatura-geral-estado.service';

/**
 * Impede abrir uma etapa (pela URL ou pelo histórico) sem as anteriores estarem
 * completas: redirecciona para a primeira etapa por preencher. A etapa vem do
 * `data.etapa` da própria rota.
 */
export const etapaGuard: CanActivateFn = (rota) => {
  const estado = inject(CandidaturaGeralEstadoService);
  const router = inject(Router);

  const etapa = Number(rota.data['etapa']) as NumeroEtapa;
  const pendente = estado.primeiraEtapaInvalidaAntes(etapa);

  return pendente === null ? true : router.createUrlTree(['/candidatura-geral', `etapa-${pendente}`]);
};
