/**
 * Candidatura de aluno a uma graduação, na forma que o **site** preenche — os
 * nomes dos campos do `app-formulario-inscricao`. Quem a traduz para o
 * `CandidaturaAlunoRequest` da API é o `CandidaturaAlunosService`.
 */
export interface NovaCandidaturaAluno {
  nome: string;
  email: string;
  telefone: string;
  /** `AAAA-MM-DD`, como o `<input type="date">` já devolve. */
  nascimento: string;
  genero: string;
  escola: string;
  anoConclusao: string;
  /** Média final, com vírgula decimal (ex.: "16,5") — a API espera um número entre 0 e 20. */
  media: string;
  /** `id` do curso de graduação (`CursosService`), como texto. */
  curso: string;
  motivacao: string;
  /** Certificado de habilitações em PDF, até 5MB (limite da API). */
  certificado: File | null;
}
