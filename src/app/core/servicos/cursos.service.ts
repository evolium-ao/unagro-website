import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { AnoCurricular, Curso } from '../modelos/curso.model';

/** Espelha o `PlanoCurricularResource` do OpenAPI, reduzido ao que o acordeão usa. */
interface PlanoCurricularApi {
  id: number;
  titulo: string;
  ordem: number;
  conteudo: string | null;
}

/** Espelha o `FaculdadeResource`, reduzida ao que o curso usa. */
interface FaculdadeCursoApi {
  id: number;
  nome: string;
}

/** Espelha o `CursoResource` do OpenAPI — a forma crua, antes do mapeamento. */
interface CursoApi {
  id: number;
  capa_url: string | null;
  nome: string;
  faculdade_id: number;
  faculdade: FaculdadeCursoApi;
  duracao: string;
  regime: string;
  tipo_grau: string;
  planosCurriculares: PlanoCurricularApi[];
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Um método por endpoint de `GET /cursos`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/cursos.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Curso[]> {
    return this.api.get<CursoApi[]>('cursos', { signal }).then((linhas) => linhas.map(paraCurso));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Curso> {
    return this.api.get<CursoApi>(`cursos/${id}`, { signal }).then(paraCurso);
  }
}

/**
 * "Matemática I e II\nQuímica Geral e Inorgânica\n…" → uma disciplina por
 * linha, sem linhas em branco. Sem `conteudo`, fica sem disciplinas.
 */
function paraDisciplinas(conteudo: string | null): string[] {
  if (!conteudo) return [];
  return conteudo
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean);
}

function paraAnoCurricular(linha: PlanoCurricularApi): AnoCurricular {
  return {
    ano: linha.ordem,
    titulo: linha.titulo,
    disciplinas: paraDisciplinas(linha.conteudo),
  };
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraCurso(linha: CursoApi): Curso {
  return {
    id: String(linha.id),
    imagem: capaUtilizavel(linha.capa_url),
    faculdade: linha.faculdade.nome,
    titulo: linha.nome,
    grau: linha.tipo_grau,
    duracao: linha.duracao,
    regime: linha.regime,
    planoCurricular: [...linha.planosCurriculares]
      .sort((a, b) => a.ordem - b.ordem)
      .map(paraAnoCurricular),
  };
}
