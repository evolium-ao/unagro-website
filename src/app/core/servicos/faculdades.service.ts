import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Faculdade } from '../modelos/faculdade.model';

/** Espelha o `CursoResource`, reduzido aos campos que o cartão da faculdade usa. */
interface CursoApi {
  id: number;
  nome: string;
}

/** Espelha o `FaculdadeResource` do OpenAPI — a forma crua, antes do mapeamento. */
interface FaculdadeApi {
  id: number;
  nome: string;
  descricao: string | null;
  conteudo: string | null;
  capa_url: string | null;
  cursos: CursoApi[];
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Um método por endpoint de `GET /faculdades`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/faculdades.queries.ts`.
 *
 * **Sem `obterPorId`**: não há página de detalhe de faculdade — uma fábrica
 * que ninguém chama é código morto (mesma decisão do `laboratorios.service.ts`).
 */
@Injectable({ providedIn: 'root' })
export class FaculdadesService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Faculdade[]> {
    return this.api
      .get<FaculdadeApi[]>('faculdades', { signal })
      .then((linhas) => semFaculdadesDuplicadas(linhas).map(paraFaculdade));
  }
}

/**
 * A API duplica as faculdades: os ids 6–10 repetem os nomes dos ids 1–5, mas
 * sempre com `cursos`/`laboratorios`/`bolsas` vazios (confirmado em
 * `GET /faculdades`, 2026-09-08 — a mesma família de problema já registada
 * para `laboratorios`, que também tem ids 1–5 e 6–10 com os cinco nomes
 * repetidos).
 *
 * Nos laboratórios optou-se por não corrigir, porque a duplicação produz
 * cartões idênticos numa lista plana — inofensivo. Aqui a duplicação produz
 * cartões de faculdade **vazios** (zero cursos, à frente na lista porque a
 * API devolve por ordem decrescente de id), o que contradiz o propósito desta
 * aba. Por isso agrupa-se por `nome` e fica-se com a entrada que tiver mais
 * cursos — sempre uma das duas, nunca inventada.
 */
function semFaculdadesDuplicadas(linhas: FaculdadeApi[]): FaculdadeApi[] {
  const porNome = new Map<string, FaculdadeApi>();
  for (const linha of linhas) {
    const existente = porNome.get(linha.nome);
    if (!existente || linha.cursos.length > existente.cursos.length) {
      porNome.set(linha.nome, linha);
    }
  }
  return [...porNome.values()];
}

/**
 * Dentro de uma mesma faculdade, o próprio array `cursos` também vem com
 * duplicados (o mesmo `nome` com `id` diferente — dados de seed repetidos).
 * Mantém-se o de menor id, para o cartão não listar o mesmo curso duas vezes.
 */
function semCursosDuplicados(cursos: CursoApi[]): CursoApi[] {
  const porNome = new Map<string, CursoApi>();
  for (const curso of cursos) {
    const existente = porNome.get(curso.nome);
    if (!existente || curso.id < existente.id) {
      porNome.set(curso.nome, curso);
    }
  }
  return [...porNome.values()];
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraFaculdade(linha: FaculdadeApi): Faculdade {
  return {
    id: String(linha.id),
    nome: linha.nome,
    cursos: semCursosDuplicados(linha.cursos).map((curso) => ({
      id: String(curso.id),
      titulo: curso.nome,
    })),
  };
}
