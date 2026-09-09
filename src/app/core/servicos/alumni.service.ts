import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { Alumni } from '../modelos/alumni.model';

/**
 * Espelha o `AlumniResource` do OpenAPI — a forma crua, antes do mapeamento.
 *
 * `curso` vem como o `CursoResource` inteiro, mas o único consumidor desta
 * camada por agora (`app-cartao-historia-alumni`, secção "Onde estão os
 * nossos Alumni?") não mostra o curso nem um ano de conclusão — por isso
 * `curso`/`curso_id` ficam por mapear. A API também não devolve nenhum
 * equivalente a "ano de conclusão da pessoa" (`curso.data_fim` é a data de
 * fim do curso em si, não serve de substituto) — ver "A API não dá" em
 * `.claude/memory/integrar-recurso.md`.
 *
 * O esquema OpenAPI declara `id`/`curso_id` como `string` e `destaque` como
 * `string` — a resposta real devolve number/boolean; segue-se a resposta
 * real, como já se fez em `noticias.service.ts`.
 */
interface AlumniApi {
  id: number;
  nome: string;
  foto: string | null;
  cargo_atual: string;
  citacao: string;
  curso_id: number;
  destaque: boolean;
}

/**
 * Um método por endpoint de `GET /alumni`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/alumni.queries.ts`.
 *
 * As estatísticas institucionais da página `alumni` (sessão 1) não vivem
 * aqui: a API de alumni não tem endpoint de estatísticas agregadas, e
 * continuam alimentadas pelo mock em `AlumniEstatisticasService`.
 */
@Injectable({ providedIn: 'root' })
export class AlumniService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Alumni[]> {
    return this.api.get<AlumniApi[]>('alumni', { signal }).then((linhas) => linhas.map(paraAlumni));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Alumni> {
    return this.api.get<AlumniApi>(`alumni/${id}`, { signal }).then(paraAlumni);
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraAlumni(linha: AlumniApi): Alumni {
  return {
    id: String(linha.id),
    nome: linha.nome,
    cargoAtual: linha.cargo_atual,
    testemunho: linha.citacao,
    foto: capaUtilizavel(linha.foto),
    destaque: linha.destaque,
  };
}
