/**
 * Um ano (ou módulo, nos cursos de curta duração) do plano curricular de um
 * curso — espelha o `PlanoCurricularResource` da API, já mapeado (ver
 * `core/servicos/cursos.service.ts`).
 */
export interface AnoCurricular {
  /** Vem de `ordem`; nem sempre um ano lectivo literal. */
  ano: number;
  /**
   * A API já embute o tema no próprio título (ex.: "1.º Ano — Fundamentos
   * Científicos"), por isso não há um campo de tema à parte a concatenar.
   */
  titulo: string;
  /** Uma disciplina por linha do texto que a API devolve. */
  disciplinas: string[];
}

/** Um objetivo do curso, apresentado num cartão próprio com ícone e categoria. */
export interface ObjetivoCurso {
  rotulo: string;
  icone: string;
  texto: string;
}

/**
 * Um curso de graduação, tal como aparece em `/candidaturas` (secção "Oferta
 * Académica") e em `/cursos/:id` — espelha o `CursoResource` da API, já
 * mapeado (ver `core/servicos/cursos.service.ts`).
 */
export interface Curso {
  id: string;
  /** Sem capa utilizável (ver `capaUtilizavel`), o cartão cai no espaço reservado. */
  imagem?: string;
  faculdade: string;
  titulo: string;
  /** Vem de `tipo_grau` (ex.: "Licenciatura", "Mestrado"). */
  grau: string;
  duracao: string;
  regime: string;

  /** A API não tem resumo/descrição de curso — ausente, o subtítulo do hero desaparece. */
  resumo?: string;
  /** A API não tem objetivos de curso — ausente, a secção não aparece. */
  objetivos?: ObjetivoCurso[];
  /**
   * Vem de `planosCurriculares`. Uma lista vazia é uma resposta real da API
   * (a maioria dos cursos ainda não tem plano carregado), não um dado em
   * falta — o acordeão simplesmente fica sem itens.
   */
  planoCurricular: AnoCurricular[];
  /** A API não tem saídas profissionais — ausente, a secção não aparece. */
  saidasProfissionais?: string[];
}
