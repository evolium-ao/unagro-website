import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';

/**
 * Espelha o `TestemunhoResource` do OpenAPI — a forma crua, antes do
 * mapeamento. `projecto` vem embutido, mas só o `projecto_id` é usado (para
 * ligar o testemunho ao projecto na página de detalhe).
 */
interface TestemunhoApi {
  id: number;
  citacao: string;
  nome_autor: string;
  tipo: string | null;
  foto: string | null;
  projecto_id: number | null;
}

/**
 * Testemunho já na forma do site, mas ainda com o `projetoId` que o
 * `ProjetosService` usa para o agrupar — o `TestemunhoProjeto` de
 * `core/modelos/projeto.model.ts` não o tem, porque aí já vem filtrado para
 * um único projecto.
 */
export interface TestemunhoComProjeto {
  id: string;
  citacao: string;
  autor: string;
  papel: string;
  foto?: string;
  projetoId?: string;
}

/**
 * Um método por endpoint de `GET /testemunhos`. Sem sinais e sem cache — é
 * uma função de dados, e é ela que vai directa para o `queryFn` das consultas
 * em `core/consultas/testemunhos.queries.ts`.
 *
 * **Sem `obterPorId`**: não há página de detalhe de testemunho — a única
 * consumidora é a coluna "Testemunhos" de `detalhe-projeto`, que filtra a
 * lista completa por `projetoId` do lado do cliente — a API não tem
 * parâmetro de filtro em `GET /testemunhos`.
 */
@Injectable({ providedIn: 'root' })
export class TestemunhosService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<TestemunhoComProjeto[]> {
    return this.api
      .get<TestemunhoApi[]>('testemunhos', { signal })
      .then((linhas) => linhas.map(paraTestemunho));
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraTestemunho(linha: TestemunhoApi): TestemunhoComProjeto {
  return {
    id: String(linha.id),
    citacao: linha.citacao,
    autor: linha.nome_autor,
    papel: linha.tipo ?? '',
    foto: capaUtilizavel(linha.foto),
    projetoId: linha.projecto_id != null ? String(linha.projecto_id) : undefined,
  };
}
