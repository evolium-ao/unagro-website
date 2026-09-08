import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { AmbitoEvento, Evento } from '../modelos/evento.model';

/**
 * Espelha o `EventoResource` do OpenAPI — a forma crua, antes do mapeamento.
 *
 * A API **não tem data do evento** (só `created_at`/`updated_at`, datas de
 * registo) — ver a nota em `evento.model.ts`. Também não devolve `categoria`
 * nem `selo` separados do `abrangencia`; o rótulo do selo é derivado do
 * `ambito` no componente, com `ROTULOS_AMBITO_EVENTO`.
 */
interface EventoApi {
  id: number;
  capa_url: string | null;
  titulo: string;
  descricao: string | null;
  localizacao: string | null;
  abrangencia: 'nacional' | 'internacional' | 'unagro_prometed';
  created_at: string | null;
  updated_at: string | null;
}

/** A API escreve "unagro_prometed" (erro tipográfico de "promovido"); normaliza-se para `unagro`. */
const AMBITOS_API: Record<EventoApi['abrangencia'], AmbitoEvento> = {
  nacional: 'nacional',
  internacional: 'internacional',
  unagro_prometed: 'unagro',
};

/**
 * Um método por endpoint de `GET /eventos`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/eventos.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Evento[]> {
    return this.api.get<EventoApi[]>('eventos', { signal }).then((linhas) => linhas.map(paraEvento));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Evento> {
    return this.api.get<EventoApi>(`eventos/${id}`, { signal }).then(paraEvento);
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraEvento(linha: EventoApi): Evento {
  return {
    id: String(linha.id),
    titulo: linha.titulo,
    descricao: linha.descricao ?? '',
    local: linha.localizacao ?? '',
    ambito: AMBITOS_API[linha.abrangencia] ?? 'nacional',
    imagem_url: capaUtilizavel(linha.capa_url),
  };
}
