/*
 * Oferta curricular, de `GET /candidaturas-docentes/areas`.
 * Nomenclatura do documento do cliente → API/portal: "Categoria" → Faculdade,
 * "Área" → Curso, e cada curso tem as suas disciplinas. Os nomes vêm só em
 * português, como a API os guarda.
 *
 * Os `id`s são os da API em texto (`"16"`).
 *
 * Neste repositório (site principal) só ficaram os tipos que a aba "Cursos" de
 * `/sobre` usa; o resto do modelo da candidatura vive no repositório
 * `candidatura-Agrosophia`.
 */

/** Faculdade ("Categoria" no documento) — agrupa cursos. */
export interface FaculdadeCandidaturaGeral {
  id: string;
  nome: string;
  cursos: CursoCandidaturaGeral[];
}

/** Curso ("Área" no documento) — tem várias disciplinas. */
export interface CursoCandidaturaGeral {
  id: string;
  nome: string;
  disciplinas: DisciplinaCandidaturaGeral[];
}

/** Disciplina / unidade curricular. */
export interface DisciplinaCandidaturaGeral {
  /** Único em toda a oferta (cada disciplina da API pertence a um só curso). */
  id: string;
  nome: string;
  descricao: string;
  /** Código do plano curricular (`EAZ-01`), quando a API o tem. */
  codigo: string | null;
}
