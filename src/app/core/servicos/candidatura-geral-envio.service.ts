import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import {
  AREAS_TRABALHO_CANDIDATURA_GERAL_MOCK,
  GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK,
  INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK,
  TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK,
} from '../dados/candidatura-geral.mock';
import {
  CandidaturaGeralSubmetida,
  DisciplinaEscolhidaCandidaturaGeral,
  NovaCandidaturaGeral,
  OpcaoCandidaturaGeral,
} from '../modelos/candidatura-geral.model';
import { CandidaturaGeralService } from './candidatura-geral.service';
import { descreverTempoTotal } from './tempo-experiencia';

/** Só o que o site lê do `CandidaturaDocenteResource` devolvido no 201. */
interface CandidaturaDocenteCriada {
  id: number;
  created_at: string | null;
}

/**
 * `POST /candidaturas-docentes` — a candidatura do formulário em quatro etapas de
 * `/candidatura-geral`. Endpoint público (`security: []`): não leva `Authorization`.
 *
 * Vai em `multipart/form-data` por causa dos quatro anexos do dossier; as
 * listas seguem a notação de array do Laravel (`areas[0][curso_id]`). Os campos
 * opcionais vazios ficam de fora do `FormData`, para não gravar cadeias vazias.
 *
 * Nome próprio para não colidir com o `CandidaturaDocentesService`, que é o
 * `POST /candidaturas` do formulário curto de `/candidaturas/docentes`.
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralEnvioService {
  private readonly api = inject(ApiService);
  private readonly conteudo = inject(CandidaturaGeralService);

  async criar(candidatura: NovaCandidaturaGeral, signal?: AbortSignal): Promise<CandidaturaGeralSubmetida> {
    const criada = await this.api.post<CandidaturaDocenteCriada>(
      'candidaturas-docentes',
      paraPedido(candidatura, this.conteudo.disciplinasPorId()),
      { signal },
    );
    const submetidaEm = criada.created_at ? new Date(criada.created_at) : new Date();
    return { id: criada.id, codigo: codigoCandidatura(criada.id, submetidaEm), submetidaEm };
  }
}

/** `42` em 2026 → `AGRO-2026-DOC-000042`. A API não gera código próprio. */
function codigoCandidatura(id: number, data: Date): string {
  return `AGRO-${data.getFullYear()}-DOC-${String(id).padStart(6, '0')}`;
}

/** `AO` → `Angola`: a API guarda o país da formação em texto. */
function nomePais(codigo: string): string {
  if (!codigo) {
    return '';
  }
  try {
    return new Intl.DisplayNames(['pt'], { type: 'region' }).of(codigo) ?? codigo;
  } catch {
    return codigo;
  }
}

/**
 * Onde os nomes do formulário viram os do `CandidaturaDocenteRequest`. As
 * disciplinas vão como `areas[i][curso_id|disciplina_id]` (os `id`s da oferta
 * da API); o resto que vem de selects vai pelo rótulo **em português** — o que se
 * lê no backoffice não depende do idioma do site.
 */
function paraPedido(
  { dados, formacao, dossier }: NovaCandidaturaGeral,
  disciplinasPorId: Map<string, DisciplinaEscolhidaCandidaturaGeral>,
): FormData {
  const corpo = new FormData();
  const grau = GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK.find((opcao) => opcao.id === formacao.grau);
  const rotulo = (opcoes: OpcaoCandidaturaGeral[], id: string) =>
    opcoes.find((opcao) => opcao.id === id)?.rotulo.pt ?? id;
  const docentes = formacao.experienciasDocentes;
  const profissionais = formacao.experienciasProfissionais;
  const totalDocencia = descreverTempoTotal(
    docentes.map((experiencia) => experiencia.tempo),
    TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK,
    'pt',
  );
  const totalProfissional = descreverTempoTotal(
    profissionais.map((experiencia) => experiencia.tempo),
    INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK,
    'pt',
  );

  const textos: Record<string, string> = {
    // Etapa 1
    nome_completo: dados.nome,
    data_nascimento: dados.nascimento,
    n_documento: dados.documento,
    telefone: dados.telefone,
    email: dados.email,
    // Etapa 2 — o `GrauAcademicoEnum` da API é o próprio nome do grau.
    grau_academico: grau?.rotulo.pt ?? formacao.grau,
    instituicao_ensino: formacao.universidade,
    faculdade_formacao: formacao.faculdade,
    curso_formacao: formacao.curso,
    pais_formacao: nomePais(formacao.pais),
    identificador_investigador: formacao.identificadorInvestigador.trim(),
  };
  for (const [campo, valor] of Object.entries(textos)) {
    if (valor) corpo.set(campo, valor);
  }

  // Etapa 1 — disciplinas a lecionar, cada uma com o curso a que pertence.
  dados.disciplinas.forEach((id, i) => {
    const escolhida = disciplinasPorId.get(id);
    if (escolhida) {
      corpo.set(`areas[${i}][curso_id]`, escolhida.curso.id);
    }
    corpo.set(`areas[${i}][disciplina_id]`, id);
  });

  // Etapa 2 — as listas, com o total calculado repetido em cada entrada
  // (`tempo_experiencia_area`, o campo "Tempo estimado de experiência na área").
  docentes.forEach((experiencia, i) => {
    const prefixo = `experiencias_docentes[${i}]`;
    corpo.set(`${prefixo}[universidade]`, experiencia.universidade);
    corpo.set(`${prefixo}[faculdade]`, experiencia.faculdade);
    corpo.set(`${prefixo}[disciplina]`, experiencia.disciplina);
    corpo.set(`${prefixo}[tempo_docencia]`, rotulo(TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK, experiencia.tempo));
    corpo.set(`${prefixo}[tempo_experiencia_area]`, totalDocencia);
  });
  profissionais.forEach((experiencia, i) => {
    const prefixo = `experiencias_profissionais[${i}]`;
    corpo.set(`${prefixo}[empresa]`, experiencia.empresa);
    corpo.set(`${prefixo}[area_trabalho]`, rotulo(AREAS_TRABALHO_CANDIDATURA_GERAL_MOCK, experiencia.area));
    corpo.set(
      `${prefixo}[tempo_experiencia]`,
      rotulo(INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK, experiencia.tempo),
    );
    corpo.set(`${prefixo}[tempo_experiencia_area]`, totalProfissional);
  });

  // Etapa 3
  const anexos: Record<string, File | null> = {
    curriculo: dossier.curriculo,
    certificado_habilitacoes: dossier.certificados,
    comprovativo_docencia: dossier.comprovativos,
    carta_motivacao: dossier.carta,
  };
  for (const [campo, ficheiro] of Object.entries(anexos)) {
    if (ficheiro) corpo.set(campo, ficheiro, ficheiro.name);
  }

  // O `accepted` do Laravel não aceita "true"/"false" em multipart, só 1/0.
  corpo.set('declaracao_honra', dossier.compromissoHonra ? '1' : '0');
  corpo.set('consentimento_dados', dossier.consentimentoDados ? '1' : '0');

  return corpo;
}
