import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { Investigador } from '../modelos/investigacao.model';

/**
 * Espelha o `InvestigadorResource` do OpenAPI — a forma crua, antes do
 * mapeamento. O `equipaProjectos` vem sempre embutido (a ligação do
 * investigador aos projectos), mas os cartões da secção "Investigadores
 * Principais" não o mostram, por isso fica fora desta interface.
 *
 * O esquema declara `areas_especializacao` como `array | null` com `items: {}`
 * (sem tipo). A resposta real manda cadeias de texto; o mapeamento normaliza-as
 * de qualquer forma, para uma entrada nula não virar a palavra "null" numa
 * pílula.
 */
interface InvestigadorApi {
  id: number;
  nome: string;
  /**
   * Caminho relativo ao `storage` do Laravel (`investigadores/xxx.jpg`), não um
   * URL absoluto — é o `capaUtilizavel` que lhe põe o prefixo.
   */
  foto_url: string | null;
  cargo: string | null;
  areas_especializacao: unknown[] | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Um método por endpoint de `GET /investigadores`. Sem sinais e sem cache — é
 * uma função de dados, e é ela que vai directa para o `queryFn` das consultas
 * em `core/consultas/investigadores.queries.ts`.
 *
 * **Sem `obterPorId`**: não há página de detalhe de investigador (mesma decisão
 * do `laboratorios.service.ts` e do `treinamentos.service.ts`) — um método que
 * ninguém chama é código morto.
 */
@Injectable({ providedIn: 'root' })
export class InvestigadoresService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Investigador[]> {
    return this.api
      .get<InvestigadorApi[]>('investigadores', { signal })
      .then((linhas) => linhas.map(paraInvestigador));
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraInvestigador(linha: InvestigadorApi): Investigador {
  const especialidades = paraEspecialidades(linha.areas_especializacao);

  return {
    id: String(linha.id),
    nome: linha.nome,
    cargo: linha.cargo ?? undefined,
    foto_url: capaUtilizavel(linha.foto_url),
    // Lista vazia e campo ausente valem o mesmo para o cartão: sem pílulas.
    especialidades: especialidades.length ? especialidades : undefined,
  };
}

/** Descarta entradas nulas e vazias — o cartão não mostra pílulas em branco. */
function paraEspecialidades(areas: unknown[] | null): string[] {
  return (areas ?? [])
    .map((area) => (typeof area === 'string' ? area.trim() : ''))
    .filter((area) => area.length > 0);
}
