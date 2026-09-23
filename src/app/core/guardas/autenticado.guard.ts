import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessaoService } from '../servicos/sessao.service';

/**
 * Protege rotas que exigem sessão iniciada. Redirecciona para `/entrar` em
 * vez de bloquear com página em branco.
 *
 * No servidor a sessão vive só no navegador (`localStorage`/`sessionStorage`),
 * por isso `autenticado()` é sempre `false` no SSR — um utilizador autenticado
 * a aceder directamente à rota vê o redireccionamento no HTML do servidor até
 * a hidratação corrigir com o token real do navegador.
 */
export const autenticadoGuard: CanActivateFn = () => {
  const sessaoService = inject(SessaoService);
  if (sessaoService.autenticado()) return true;

  return inject(Router).createUrlTree(['/entrar']);
};
