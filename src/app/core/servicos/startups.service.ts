import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { Startup } from '../modelos/startup.model';

/**
 * Espelha o `StartupResource` do OpenAPI — a forma crua, antes do mapeamento.
 *
 * A API não devolve `link` (destino do "Saiba Mais") — ver a nota em
 * `startup.model.ts`. `data_inicio`/`data_fim` existem mas o cartão do site
 * não os mostra, por isso ficam de fora do mapeamento.
 */
interface StartupApi {
  id: number;
  nome: string;
  categoria: string | null;
  descricao: string | null;
  capa_url: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Um método por endpoint de `GET /startups`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/startups.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class StartupsService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Startup[]> {
    return this.api
      .get<StartupApi[]>('startups', { signal })
      .then((linhas) => linhas.map(paraStartup));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Startup> {
    return this.api.get<StartupApi>(`startups/${id}`, { signal }).then(paraStartup);
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraStartup(linha: StartupApi): Startup {
  return {
    id: String(linha.id),
    nome: linha.nome,
    categoria: linha.categoria ?? '',
    descricao: linha.descricao ?? '',
    imagem_url: capaUtilizavel(linha.capa_url),
  };
}
