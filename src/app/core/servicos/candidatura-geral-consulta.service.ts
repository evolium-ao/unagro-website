import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CandidaturaGeralConsultada } from '../modelos/candidatura-geral.model';

/** `areas[]` do `CandidaturaDocenteResource`: curso e disciplina já com o nome. */
interface AreaConsultadaApi {
  curso: { id: number; nome: string } | null;
  disciplina: { id: number; nome: string } | null;
}

/**
 * As listas de experiências vêm sem esquema no OpenAPI (`items: {}`): estes são
 * os campos do `CandidaturaDocenteRequest`, que é o que a API guarda.
 */
interface ExperienciaApi {
  [campo: string]: unknown;
}

/** Só o que a consulta mostra do `CandidaturaDocenteResource`. */
interface CandidaturaConsultadaApi {
  codigo: string | null;
  pdf_url: string | null;
  estado: string | null;
  estado_label: string | null;
  nome_completo: string | null;
  data_nascimento: string | null;
  n_documento: string | null;
  telefone: string | null;
  email: string | null;
  areas: AreaConsultadaApi[] | null;
  grau_academico: string | null;
  instituicao_ensino: string | null;
  faculdade_formacao: string | null;
  curso_formacao: string | null;
  pais_formacao: string | null;
  identificador_investigador: string | null;
  experiencias_docentes: ExperienciaApi[] | null;
  experiencias_profissionais: ExperienciaApi[] | null;
  curriculo: string | null;
  certificado_habilitacoes: string | null;
  comprovativo_docencia: string | null;
  carta_motivacao: string | null;
  declaracao_honra: boolean | null;
  consentimento_dados: boolean | null;
  created_at: string | null;
}

/** `AGRO-2026-DOC-849204` — o que não tiver esta forma é tratado como nº de BI/passaporte. */
const REGEX_CODIGO = /^AGRO-\d{4}-DOC-\d+$/i;

/**
 * `GET /candidaturas-docentes/consultar` — rota pública: o candidato procura a
 * sua candidatura pelo `codigo` **ou** pelo `n_documento` (basta um). 404 se
 * não existir (o `ErroApi` traz `estado === 404`).
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralConsultaService {
  private readonly api = inject(ApiService);

  consultar(termo: string, signal?: AbortSignal): Promise<CandidaturaGeralConsultada> {
    const valor = termo.trim();
    const parametros = REGEX_CODIGO.test(valor) ? { codigo: valor.toUpperCase() } : { n_documento: valor };
    return this.api
      .get<CandidaturaConsultadaApi>('candidaturas-docentes/consultar', { parametros, signal })
      .then(paraCandidatura);
  }
}

const texto = (valor: unknown): string => (typeof valor === 'string' ? valor.trim() : '');

function paraCandidatura(api: CandidaturaConsultadaApi): CandidaturaGeralConsultada {
  return {
    codigo: texto(api.codigo),
    estado: texto(api.estado),
    estadoRotulo: texto(api.estado_label) || texto(api.estado),
    pdfUrl: texto(api.pdf_url) || null,
    submetidaEm: api.created_at ? new Date(api.created_at) : null,
    dados: {
      nome: texto(api.nome_completo),
      // A API devolve `date-time`; o resto do site trabalha com `AAAA-MM-DD`.
      nascimento: texto(api.data_nascimento).slice(0, 10),
      documento: texto(api.n_documento),
      telefone: texto(api.telefone),
      email: texto(api.email),
    },
    disciplinas: (api.areas ?? []).map((area) => ({
      disciplina: texto(area.disciplina?.nome),
      curso: texto(area.curso?.nome),
    })),
    formacao: {
      grau: texto(api.grau_academico),
      universidade: texto(api.instituicao_ensino),
      faculdade: texto(api.faculdade_formacao),
      curso: texto(api.curso_formacao),
      pais: texto(api.pais_formacao),
      identificadorInvestigador: texto(api.identificador_investigador),
    },
    experienciasDocentes: (api.experiencias_docentes ?? []).map((experiencia) => ({
      universidade: texto(experiencia['universidade']),
      faculdade: texto(experiencia['faculdade']),
      disciplina: texto(experiencia['disciplina']),
      tempo: texto(experiencia['tempo_docencia']),
      tempoArea: texto(experiencia['tempo_experiencia_area']),
    })),
    experienciasProfissionais: (api.experiencias_profissionais ?? []).map((experiencia) => ({
      empresa: texto(experiencia['empresa']),
      area: texto(experiencia['area_trabalho']),
      tempo: texto(experiencia['tempo_experiencia']),
      tempoArea: texto(experiencia['tempo_experiencia_area']),
    })),
    documentos: {
      curriculo: !!texto(api.curriculo),
      certificados: !!texto(api.certificado_habilitacoes),
      comprovativos: !!texto(api.comprovativo_docencia),
      carta: !!texto(api.carta_motivacao),
    },
    declaracaoHonra: !!api.declaracao_honra,
    consentimentoDados: !!api.consentimento_dados,
  };
}
