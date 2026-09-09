import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovaInscricaoCurso } from '../modelos/inscricao-curso.model';
import { NovaInscricaoEvento } from '../modelos/inscricao-evento.model';

/**
 * Espelha o `InscricaoRequest` do OpenAPI. Só `curso_id`, `nome` e `email` são
 * obrigatórios do lado da API — `telefone` vai como `undefined` quando o campo
 * fica vazio, para não gravar cadeia vazia.
 */
interface InscricaoRequest {
  curso_id: number;
  nome: string;
  email: string;
  telefone?: string;
}

/**
 * Espelha o `InscricaoEventoRequest` do OpenAPI. Só `evento_id`, `nome` e
 * `email` são obrigatórios do lado da API.
 */
interface InscricaoEventoRequest {
  evento_id: number;
  nome: string;
  email: string;
  telefone?: string;
}

/**
 * `POST /inscricoes` e `POST /inscricoes/evento` — os pedidos de inscrição que
 * saem dos modais de inscrição em curso e em evento. Ambos públicos
 * (`security: []` no esquema): não levam `Authorization`.
 *
 * **`curso_id` valida contra a tabela `cursos` (cursos de grau), não
 * `treinamentos` (cursos de curta duração)** — ver a nota "A API não dá" no
 * registo da integração (`.claude/memory/integrar-recurso.md`). Este serviço
 * manda o `id` que o modal lhe dá tal qual; não há como corrigir isso deste
 * lado.
 */
@Injectable({ providedIn: 'root' })
export class InscricoesService {
  private readonly api = inject(ApiService);

  /**
   * A resposta traz a inscrição criada, com o curso embutido. O modal só
   * precisa de saber que passou — por isso descarta-se o corpo em vez de se
   * inventar um modelo que ninguém lê.
   */
  criar(dados: NovaInscricaoCurso, signal?: AbortSignal): Promise<void> {
    return this.api.post<unknown>('inscricoes', paraPedido(dados), { signal }).then(() => undefined);
  }

  /**
   * `POST /inscricoes/evento` — o pedido de inscrição que sai do modal de
   * inscrição em evento. É público (`security: []` no esquema): não leva
   * `Authorization`. A resposta traz a inscrição criada, com o evento
   * embutido; o modal só precisa de saber que passou.
   */
  criarEvento(dados: NovaInscricaoEvento, signal?: AbortSignal): Promise<void> {
    return this.api
      .post<unknown>('inscricoes/evento', paraPedidoEvento(dados), { signal })
      .then(() => undefined);
  }
}

/** Onde os nomes dos campos do formulário viram os nomes da API. */
function paraPedido(dados: NovaInscricaoCurso): InscricaoRequest {
  return {
    curso_id: Number(dados.cursoId),
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone || undefined,
  };
}

/** Onde os nomes dos campos do formulário viram os nomes da API. */
function paraPedidoEvento(dados: NovaInscricaoEvento): InscricaoEventoRequest {
  return {
    evento_id: Number(dados.eventoId),
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone || undefined,
  };
}
