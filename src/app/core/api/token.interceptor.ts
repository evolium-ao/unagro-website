import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SessaoService } from '../servicos/sessao.service';

/**
 * Anexa `Authorization: Bearer <token>` aos pedidos para a API da Unagro.
 *
 * Só toca em pedidos para `environment.apiUrl` — outros pedidos que passem
 * pelo `HttpClient` (ex.: a API de tradução MyMemory, em `core/traducao/`)
 * nunca devem receber o token da sessão.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessaoService).token();
  if (!token || !req.url.startsWith(environment.apiUrl)) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
