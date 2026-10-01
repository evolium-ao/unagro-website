import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import {
  AREAS_CANDIDATURA_GERAL_MOCK,
  GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK,
  INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK,
} from '../dados/candidatura-geral.mock';
import { CandidaturaGeralSubmetida, NovaCandidaturaGeral } from '../modelos/candidatura-geral.model';

/** Só o que o site lê do `CandidaturaDocenteResource` devolvido no 201. */
interface CandidaturaDocenteCriada {
  id: number;
  created_at: string | null;
}

/**
 * `POST /candidaturas-docentes` — a candidatura do formulário em quatro etapas de
 * `/candidatura-geral`. Endpoint público (`security: []`): não leva `Authorization`.
 *
 * Vai em `multipart/form-data` por causa dos quatro anexos do dossier. Só
 * `nome_completo` e `email` são obrigatórios do lado da API; os campos vazios
 * ficam de fora do `FormData`, para não gravar cadeias vazias.
 *
 * Nome próprio para não colidir com o `CandidaturaDocentesService`, que é o
 * `POST /candidaturas` do formulário curto de `/candidaturas/docentes`.
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralEnvioService {
  private readonly api = inject(ApiService);

  async criar(candidatura: NovaCandidaturaGeral, signal?: AbortSignal): Promise<CandidaturaGeralSubmetida> {
    const criada = await this.api.post<CandidaturaDocenteCriada>(
      'candidaturas-docentes',
      paraPedido(candidatura),
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

/**
 * Onde os nomes do formulário viram os nomes da API (`CandidaturaDocenteRequest`).
 * Os selects guardam `id`s; a API guarda texto livre, por isso vão os rótulos
 * **em português** — o que se lê no backoffice não depende do idioma do site.
 */
function paraPedido({ dados, formacao, dossier }: NovaCandidaturaGeral): FormData {
  const corpo = new FormData();
  corpo.set('nome_completo', dados.nome);
  corpo.set('email', dados.email);

  const area = AREAS_CANDIDATURA_GERAL_MOCK.find((opcao) => opcao.id === dados.area);
  const grau = GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK.find((opcao) => opcao.id === formacao.grau);
  const intervalo = (id: string) =>
    INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK.find((opcao) => opcao.id === id)?.rotulo.pt ?? id;

  const textos: Record<string, string> = {
    data_nascimento: dados.nascimento,
    n_documento: dados.documento,
    telefone: dados.telefone,
    areas_interesse: area?.titulo.pt ?? dados.area,
    areas_complementares: dados.areaComplementar,
    grau_academico: grau?.rotulo.pt ?? formacao.grau,
    instituicao_ensino: formacao.instituicao,
    especializacao: formacao.especializacao,
    identificador_investigador: formacao.identificadorInvestigador.trim(),
    tempo_docencia: intervalo(formacao.tempoDocencia),
    experiencia_agro: intervalo(formacao.experienciaPratica),
    sintese_curricular: formacao.sintese,
  };
  for (const [campo, valor] of Object.entries(textos)) {
    if (valor) corpo.set(campo, valor);
  }

  const anexos: Record<string, File | null> = {
    curriculo: dossier.curriculo,
    certificado_habilitacoes: dossier.certificados,
    comprovativo_docencia: dossier.comprovativos,
    carta_motivacao: dossier.carta,
  };
  for (const [campo, ficheiro] of Object.entries(anexos)) {
    if (ficheiro) corpo.set(campo, ficheiro, ficheiro.name);
  }

  // O `boolean` do Laravel não aceita "true"/"false" em multipart, só 1/0.
  corpo.set('declaracao_honra', dossier.compromissoHonra ? '1' : '0');
  corpo.set('consentimento_dados', dossier.consentimentoDados ? '1' : '0');

  return corpo;
}
