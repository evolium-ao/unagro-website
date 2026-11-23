/** Utilizador autenticado, na forma que o site usa (a da API é mapeada no serviço). */
export interface Utilizador {
  id: string;
  nome: string;
  email: string;
}

/** O que resulta de um `POST /login` bem sucedido. */
export interface Sessao {
  token: string;
  utilizador: Utilizador;
}

/** O que o formulário de entrada envia. */
export interface Credenciais {
  email: string;
  palavraPasse: string;
}
