import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Instituição da faixa "Enquadramento institucional" da candidatura docente. */
export interface ParceiroCandidaturaGeral {
  id: string;
  icone: string;
  nome: TextoTraduzido;
}

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

/** Departamento do acordeão "Termos de Referência por Área Científica". */
export interface TermoReferenciaCandidaturaGeral {
  id: string;
  codigo: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
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

/** Opção de um select do formulário (intervalos de anos de experiência). */
export interface OpcaoCandidaturaGeral {
  id: string;
  rotulo: TextoTraduzido;
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
    /** `id` da `AreaCandidaturaGeral`. */
    area: string;
    areaComplementar: string;
  };
  formacao: {
    /** `id` do `GrauAcademicoCandidaturaGeral`. */
    grau: string;
    instituicao: string;
    especializacao: string;
    identificadorInvestigador: string;
    /** `id` da `OpcaoCandidaturaGeral` (intervalo de anos). */
    tempoDocencia: string;
    experienciaPratica: string;
    sintese: string;
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
  /** Código para o candidato guardar, derivado do `id` — p. ex. `AGRO-2026-DOC-000042`. */
  codigo: string;
  /** `created_at` da API; a hora local quando a API não o devolve. */
  submetidaEm: Date;
}

/** Documento obrigatório do dossier de candidatura. */
export interface DocumentoCandidaturaGeral {
  id: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}
