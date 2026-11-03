import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { FuncaoCandidaturaGeral } from '../modelos/candidatura-geral.model';

/** Espelha o `FuncaoResource` da API, reduzido ao que o formulário usa. */
interface FuncaoApi {
  id: number;
  nome: string;
  grupo: string;
  grupo_label: string;
  area: string | null;
  servico: string | null;
  vagas: number | null;
  perfil: string | null;
}

/**
 * `GET /candidaturas-docentes/funcoes` — funções administrativas abertas à
 * candidatura. Endpoint público, sem filtros: devolve sempre a lista completa.
 * Sem sinais nem cache: vai directo para o `queryFn` de
 * `core/consultas/funcoes-candidatura.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class FuncoesCandidaturaService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<FuncaoCandidaturaGeral[]> {
    return this.api.get<FuncaoApi[]>('candidaturas-docentes/funcoes', { signal }).then((funcoes) =>
      funcoes
        .map(paraFuncao)
        // Pelo grupo e, dentro dele, pelo nome — a API devolve por `id`.
        .sort((a, b) => a.grupoRotulo.localeCompare(b.grupoRotulo, 'pt') || a.nome.localeCompare(b.nome, 'pt')),
    );
  }
}

function paraFuncao(funcao: FuncaoApi): FuncaoCandidaturaGeral {
  return {
    id: String(funcao.id),
    nome: funcao.nome,
    grupo: funcao.grupo,
    grupoRotulo: funcao.grupo_label,
    area: funcao.area ?? '',
    servico: funcao.servico ?? '',
    vagas: funcao.vagas ?? 0,
    perfil: funcao.perfil ?? '',
  };
}
