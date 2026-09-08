import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovaCandidaturaDocente } from '../modelos/candidatura-docente.model';

/**
 * `POST /candidaturas` — a candidatura ao corpo docente que sai do formulário de
 * `/candidaturas/docentes`. É dos poucos endpoints de escrita **públicos**
 * (`security: []` no esquema): não leva `Authorization`.
 *
 * O corpo vai em `multipart/form-data`, e não em JSON, porque leva o PDF do
 * currículo. Só `nome_completo` e `email` são obrigatórios do lado da API — os
 * restantes campos ficam de fora do `FormData` quando estão vazios, para não
 * gravar cadeias vazias.
 *
 * Nome próprio para não colidir com o `CandidaturasService`, que é o conteúdo
 * (mock) da página `/candidaturas` e não fala com a API.
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaDocentesService {
  private readonly api = inject(ApiService);

  /**
   * A resposta traz a candidatura criada. O site não tem onde a mostrar — ao
   * formulário basta saber que passou —, por isso descarta-se o corpo em vez de
   * se inventar um modelo que ninguém lê.
   */
  criar(dados: NovaCandidaturaDocente, signal?: AbortSignal): Promise<void> {
    return this.api
      .post<unknown>('candidaturas', paraPedido(dados), { signal })
      .then(() => undefined);
  }
}

/**
 * Onde os nomes dos campos do formulário viram os nomes da API. Espelha o
 * `CandidaturaRequest` do OpenAPI: `nome_completo`, `email`, `telefone`,
 * `linkedin_url`, `maior_titulo`, `universidade_origem`, `area_estudo_principal`,
 * `desc_areas_pesquisas`, `desc_motivacao` e `curriculo`.
 */
function paraPedido(dados: NovaCandidaturaDocente): FormData {
  const corpo = new FormData();
  corpo.set('nome_completo', dados.nome);
  corpo.set('email', dados.email);

  const opcionais: Record<string, string> = {
    telefone: dados.telefone,
    linkedin_url: dados.perfil,
    maior_titulo: dados.titulacao,
    universidade_origem: dados.universidade,
    area_estudo_principal: dados.area,
    desc_areas_pesquisas: dados.linhasPesquisa,
    desc_motivacao: dados.carta,
  };
  for (const [campo, valor] of Object.entries(opcionais)) {
    if (valor) corpo.set(campo, valor);
  }

  if (dados.curriculo) {
    corpo.set('curriculo', dados.curriculo, dados.curriculo.name);
  }

  return corpo;
}
