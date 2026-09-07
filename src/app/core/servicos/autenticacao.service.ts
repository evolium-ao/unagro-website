import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ErroApi } from '../api/erro-api';
import { Credenciais, Sessao, Utilizador } from '../modelos/sessao.model';

/**
 * Serviço de recurso da autenticação: um método por endpoint, promessas, sem
 * sinais nem cache — é a função de dados que vai directa para o `mutationFn`.
 * O estado da sessão (token guardado, quem está dentro) é do `SessaoService`.
 */
@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly api = inject(ApiService);

  entrar(credenciais: Credenciais, signal?: AbortSignal): Promise<Sessao> {
    return this.api
      .post<RespostaLoginApi>(
        'login',
        { email: credenciais.email, password: credenciais.palavraPasse },
        { signal },
      )
      .then(paraSessao);
  }
}

/**
 * Espelha a resposta do `POST /login`.
 *
 * TODO: confirmar contra `http://192.168.1.252:8000/docs/api` — a API não estava
 * alcançável quando isto foi escrito. Daí os pares de nomes alternativos: o
 * projecto Laravel pode devolver `token`/`access_token` e `user`/`utilizador`,
 * e o `paraSessao` aceita qualquer combinação em vez de rebentar em silêncio.
 * Quando o contrato estiver confirmado, corta os campos que não existem.
 */
interface RespostaLoginApi {
  token?: string;
  access_token?: string;
  user?: UtilizadorApi;
  utilizador?: UtilizadorApi;
}

interface UtilizadorApi {
  id: number | string;
  name?: string;
  nome?: string;
  email: string;
}

function paraSessao(resposta: RespostaLoginApi): Sessao {
  const token = resposta.token ?? resposta.access_token;
  const utilizador = resposta.user ?? resposta.utilizador;

  // Sem token não há sessão: falhar aqui é melhor do que deixar a aplicação
  // seguir como autenticada e só descobrir no primeiro pedido protegido.
  if (!token) {
    throw new ErroApi(0, 'A resposta de entrada não trouxe token de acesso.', resposta);
  }

  return { token, utilizador: paraUtilizador(utilizador, '') };
}

function paraUtilizador(linha: UtilizadorApi | undefined, emailPorOmissao: string): Utilizador {
  return {
    id: linha ? String(linha.id) : '',
    nome: linha?.nome ?? linha?.name ?? '',
    email: linha?.email ?? emailPorOmissao,
  };
}
