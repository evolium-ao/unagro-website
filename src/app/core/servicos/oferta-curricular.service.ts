import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { FaculdadeCandidaturaGeral } from '../modelos/candidatura-geral.model';

/** Espelha o `DisciplinaResource` do OpenAPI, reduzido ao que o formulário usa. */
interface DisciplinaApi {
  id: number;
  curso_id: number;
  codigo: string | null;
  nome: string;
  descricao: string | null;
  ordem: number;
}

/** Espelha o `CursoResource` (com `disciplinas`), reduzido ao que o formulário usa. */
interface CursoApi {
  id: number;
  nome: string;
  disciplinas: DisciplinaApi[];
}

/** Espelha o `AreaCandidaturaResource`: uma faculdade e os seus cursos. */
interface AreaCandidaturaApi {
  id: number;
  nome: string;
  cursos: CursoApi[];
}

/**
 * `GET /candidaturas-docentes/areas` — faculdades, cursos e disciplinas abertos
 * à candidatura docente. Endpoint público. Sem sinais nem cache: vai directo
 * para o `queryFn` de `core/consultas/oferta-curricular.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class OfertaCurricularService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<FaculdadeCandidaturaGeral[]> {
    return this.api
      .get<AreaCandidaturaApi[]>('candidaturas-docentes/areas', { signal })
      .then((areas) => areas.map(paraFaculdade));
  }
}

/** Ordena por nome (a API devolve os cursos por `id`) e as disciplinas pela `ordem` do plano. */
function paraFaculdade(area: AreaCandidaturaApi): FaculdadeCandidaturaGeral {
  return {
    id: String(area.id),
    nome: area.nome,
    cursos: [...(area.cursos ?? [])]
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'))
      .map((curso) => ({
        id: String(curso.id),
        nome: curso.nome,
        disciplinas: [...(curso.disciplinas ?? [])]
          .sort((a, b) => a.ordem - b.ordem)
          .map((disciplina) => ({
            id: String(disciplina.id),
            nome: disciplina.nome,
            descricao: disciplina.descricao ?? '',
            codigo: disciplina.codigo,
          })),
      })),
  };
}
