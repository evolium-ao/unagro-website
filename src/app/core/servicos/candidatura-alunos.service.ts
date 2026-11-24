import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovaCandidaturaAluno } from '../modelos/candidatura-aluno.model';

/**
 * `POST /candidaturas/aluno` — candidatura de aluno a uma graduação, que sai do
 * formulário de `/inscricao`. Endpoint público (`security: []` no esquema): não
 * leva `Authorization`.
 *
 * O corpo vai em `multipart/form-data`, e não em JSON, porque leva o certificado
 * de habilitações em PDF. Só `nome_completo` e `email` são obrigatórios do lado
 * da API — os restantes campos ficam de fora do `FormData` quando estão vazios,
 * para não gravar cadeias vazias.
 *
 * Nome próprio para não colidir com o `CandidaturasService`, que é o conteúdo
 * (mock) da página `/candidaturas` e não fala com a API — mesma decisão já
 * tomada para o `CandidaturaDocentesService`.
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaAlunosService {
  private readonly api = inject(ApiService);

  /**
   * A resposta traz a candidatura criada (com o `curso` embutido). O site não
   * tem onde a mostrar — ao formulário basta saber que passou —, por isso
   * descarta-se o corpo em vez de se inventar um modelo que ninguém lê.
   */
  criar(dados: NovaCandidaturaAluno, signal?: AbortSignal): Promise<void> {
    return this.api
      .post<unknown>('candidaturas/aluno', paraPedido(dados), { signal })
      .then(() => undefined);
  }
}

/**
 * Onde os nomes dos campos do formulário viram os nomes da API. Espelha o
 * `CandidaturaAlunoRequest` do OpenAPI: `nome_completo`, `email`, `telefone`,
 * `data_nascimento`, `genero`, `escola_origem`, `ano_conclusao`, `media_final`,
 * `curso_id` e `certificado_habilitacoes` — confirmados um a um contra a API
 * (2026-09-08) com pedidos que violam as regras de cada campo (ver registo em
 * `.claude/memory/integrar-recurso.md`).
 */
function paraPedido(dados: NovaCandidaturaAluno): FormData {
  const corpo = new FormData();
  corpo.set('nome_completo', dados.nome);
  corpo.set('email', dados.email);

  const opcionais: Record<string, string> = {
    telefone: dados.telefone,
    data_nascimento: dados.nascimento,
    genero: dados.genero,
    escola_origem: dados.escola,
    ano_conclusao: dados.anoConclusao,
    // O campo aceita vírgula decimal ("16,5"); a API só entende ponto.
    media_final: dados.media ? dados.media.replace(',', '.') : '',
    curso_id: dados.curso,
    desc_motivacao: dados.motivacao,
  };
  for (const [campo, valor] of Object.entries(opcionais)) {
    if (valor) corpo.set(campo, valor);
  }

  if (dados.certificado) {
    corpo.set('certificado_habilitacoes', dados.certificado, dados.certificado.name);
  }

  return corpo;
}
