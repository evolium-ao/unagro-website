import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovoAgendamentoVisita } from '../modelos/agendamento-visita.model';

/**
 * Espelha o `AgendamentoVisitaRequest` do OpenAPI. Só `laboratorio_id`, `nome`,
 * `email`, `data_preferencial` e `hora_preferencial` são obrigatórios do lado da
 * API — os restantes vão como `undefined` quando o campo fica vazio, para não
 * gravar cadeias vazias.
 */
interface AgendamentoVisitaRequest {
  laboratorio_id: number;
  nome: string;
  organizacao?: string;
  email: string;
  telefone?: string;
  data_preferencial: string;
  hora_preferencial: string;
  motivo_visita?: string;
  numero_participantes?: number;
}

/**
 * `POST /agendamento-visitas` — o pedido de visita que sai do modal de
 * agendamento. É dos poucos endpoints de escrita **públicos** (`security: []` no
 * esquema): não leva `Authorization`.
 */
@Injectable({ providedIn: 'root' })
export class AgendamentoVisitasService {
  private readonly api = inject(ApiService);

  /**
   * A resposta traz o agendamento criado, com o laboratório embutido. O site não
   * tem onde o mostrar — ao modal basta saber que passou —, por isso descarta-se
   * o corpo em vez de se inventar um modelo que ninguém lê.
   */
  criar(dados: NovoAgendamentoVisita, signal?: AbortSignal): Promise<void> {
    return this.api
      .post<unknown>('agendamento-visitas', paraPedido(dados), { signal })
      .then(() => undefined);
  }
}

/** Onde os nomes dos campos do formulário viram os nomes da API. */
function paraPedido(dados: NovoAgendamentoVisita): AgendamentoVisitaRequest {
  return {
    laboratorio_id: Number(dados.unidade_id),
    nome: dados.nome,
    organizacao: dados.instituicao || undefined,
    email: dados.email,
    telefone: dados.telefone || undefined,
    data_preferencial: dados.data,
    hora_preferencial: dados.hora,
    motivo_visita: dados.motivo || undefined,
    numero_participantes: dados.participantes,
  };
}
