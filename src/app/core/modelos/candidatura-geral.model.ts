import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Cartão curto com ícone, título e descrição (visão institucional). */
export interface DestaqueCandidaturaGeral {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Área de especialização aberta a concurso — também é a opção da etapa 1. */
export interface AreaCandidaturaGeral {
  id: string;
  numero: number;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  especialidades: TextoTraduzido[];
  graus: TextoTraduzido;
  vagas: number;
  /** Cartão escuro com o selo "Vagas abertas", como o primeiro do mockup. */
  destaque: boolean;
}

/*
 * Oferta curricular do concurso, de `GET /candidaturas-docentes/areas`.
 * Nomenclatura do documento do cliente → API/portal: "Categoria" → Faculdade,
 * "Área" → Curso, e cada curso tem as suas disciplinas. Os nomes vêm só em
 * português, como a API os guarda.
 *
 * Os `id`s são os da API em texto (`"16"`): é assim que vivem no formulário,
 * no rascunho e no `?disciplinas=`; o envio volta a convertê-los em número.
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

/** Disciplina / unidade curricular que o docente pode pedir para lecionar. */
export interface DisciplinaCandidaturaGeral {
  /** Único em toda a oferta (cada disciplina da API pertence a um só curso). */
  id: string;
  nome: string;
  descricao: string;
  /** Código do plano curricular (`EAZ-01`), quando a API o tem. */
  codigo: string | null;
}

/** Disciplina com o curso a que pertence, para a lista "Disciplinas selecionadas". */
export interface DisciplinaEscolhidaCandidaturaGeral {
  disciplina: DisciplinaCandidaturaGeral;
  curso: CursoCandidaturaGeral;
}

/** Critério de admissão ou passo do concurso: cartão numerado. */
export interface EtapaNumeradaCandidaturaGeral {
  id: string;
  numero: number;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  /** Rótulo em maiúsculas no pé do cartão (só nos passos do concurso). */
  fase?: TextoTraduzido;
}

/** Grau académico da etapa 2 — cartão com ícone, nome e sigla. */
export interface GrauAcademicoCandidaturaGeral {
  id: string;
  icone: string;
  rotulo: TextoTraduzido;
  sigla: TextoTraduzido;
}

/** Opção de um select do formulário (p. ex. áreas de trabalho). */
export interface OpcaoCandidaturaGeral {
  id: string;
  rotulo: TextoTraduzido;
}

/**
 * Opção de tempo de experiência ("12 anos", "De 8 a 12 anos"). `min`/`max` em
 * anos servem para somar as experiências; `max: null` é um intervalo aberto
 * ("Mais de 12 anos").
 */
export interface OpcaoTempoCandidaturaGeral extends OpcaoCandidaturaGeral {
  min: number;
  max: number | null;
}

/** Etapa 2, secção 2 — uma experiência de docência no ensino superior. */
export interface ExperienciaDocenteCandidaturaGeral {
  universidade: string;
  faculdade: string;
  /** Nome da disciplina (texto: pode ter sido lecionada noutro plano curricular). */
  disciplina: string;
  /** `id` da `OpcaoTempoCandidaturaGeral` (tempos de docência). */
  tempo: string;
}

/** Etapa 2, secção 3 — uma experiência profissional. */
export interface ExperienciaProfissionalCandidaturaGeral {
  empresa: string;
  /** `id` da área de trabalho (`OpcaoCandidaturaGeral`). */
  area: string;
  /** `id` da `OpcaoTempoCandidaturaGeral` (intervalos de experiência). */
  tempo: string;
}

/**
 * Candidatura do formulário `/candidatura-geral`, na forma que o **site**
 * preenche — os `getRawValue()` das etapas 1 a 3. Quem a traduz para o
 * `CandidaturaDocenteRequest` da API é o `CandidaturaGeralEnvioService`.
 */
export interface NovaCandidaturaGeral {
  dados: {
    nome: string;
    /** `AAAA-MM-DD`, do `<input type="date">`. */
    nascimento: string;
    documento: string;
    telefone: string;
    email: string;
    /** `id`s das `DisciplinaCandidaturaGeral` que o docente quer lecionar. */
    disciplinas: string[];
  };
  formacao: {
    /** `id` do `GrauAcademicoCandidaturaGeral`. */
    grau: string;
    universidade: string;
    faculdade: string;
    curso: string;
    /** Código ISO 3166-1 alfa-2 (`AO`, `PT`, …). */
    pais: string;
    identificadorInvestigador: string;
    experienciasDocentes: ExperienciaDocenteCandidaturaGeral[];
    experienciasProfissionais: ExperienciaProfissionalCandidaturaGeral[];
  };
  dossier: {
    curriculo: File | null;
    certificados: File | null;
    comprovativos: File | null;
    carta: File | null;
    compromissoHonra: boolean;
    consentimentoDados: boolean;
  };
}

/** O que o modal de sucesso precisa da candidatura que a API acabou de criar. */
export interface CandidaturaGeralSubmetida {
  id: number;
  /**
   * `codigo` da API (`AGRO-2026-DOC-849204`), gerado pelo servidor. Se vier vazio,
   * é derivado do `id` no mesmo formato.
   */
  codigo: string;
  /** `created_at` da API; a hora local quando a API não o devolve. */
  submetidaEm: Date;
  /** `pdf_url` da API: link assinado da ficha de candidatura em PDF (abre tal como vem). */
  pdfUrl: string | null;
}

/** `estado` da candidatura na API. Outro valor que surja é mostrado pelo `estadoRotulo`. */
export type EstadoCandidaturaGeral = 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada';

/**
 * Candidatura devolvida por `GET /candidaturas-docentes/consultar`, já com os
 * nomes do site. Os textos vêm como o candidato os submeteu (e a API os guarda:
 * em português); campos vazios chegam como `''`.
 */
export interface CandidaturaGeralConsultada {
  codigo: string;
  estado: EstadoCandidaturaGeral | string;
  /** `estado_label` da API ("Em análise"). */
  estadoRotulo: string;
  pdfUrl: string | null;
  submetidaEm: Date | null;
  dados: {
    nome: string;
    /** `AAAA-MM-DD`, ou `''`. */
    nascimento: string;
    documento: string;
    telefone: string;
    email: string;
  };
  disciplinas: { disciplina: string; curso: string }[];
  formacao: {
    grau: string;
    universidade: string;
    faculdade: string;
    curso: string;
    pais: string;
    identificadorInvestigador: string;
  };
  experienciasDocentes: {
    universidade: string;
    faculdade: string;
    disciplina: string;
    tempo: string;
    tempoArea: string;
  }[];
  experienciasProfissionais: {
    empresa: string;
    area: string;
    tempo: string;
    tempoArea: string;
  }[];
  /** Os quatro anexos: `true` se a API tem o ficheiro. */
  documentos: { curriculo: boolean; certificados: boolean; comprovativos: boolean; carta: boolean };
  declaracaoHonra: boolean;
  consentimentoDados: boolean;
}

/** Documento obrigatório do dossier de candidatura. */
export interface DocumentoCandidaturaGeral {
  id: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}
