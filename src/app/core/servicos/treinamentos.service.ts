import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { Treinamento } from '../modelos/treinamento.model';

/**
 * Espelha o `TreinamentoResource` do OpenAPI — a forma crua, antes do
 * mapeamento. `carga_horaria` e `preco` chegam como texto ("48 horas",
 * "45000.00"), não como número. Não tem estado de inscrição nem "próxima
 * turma" — ver a nota em `treinamento.model.ts`.
 */
interface TreinamentoApi {
  id: number;
  capa_url: string | null;
  nome: string;
  descricao: string | null;
  carga_horaria: string | null;
  preco: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Um método por endpoint de `GET /treinamentos`. Sem sinais e sem cache — é
 * uma função de dados, e é ela que vai directa para o `queryFn` das consultas
 * em `core/consultas/treinamentos.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class TreinamentosService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Treinamento[]> {
    return this.api
      .get<TreinamentoApi[]>('treinamentos', { signal })
      .then((linhas) => linhas.map(paraTreinamento));
  }
}

/** "48 horas" → `48`; sem número reconhecível no texto, fica por preencher. */
function paraCargaHoraria(texto: string | null): number | undefined {
  if (!texto) return undefined;
  const numero = texto.match(/\d+/)?.[0];
  return numero ? Number(numero) : undefined;
}

/** "45000.00" → `45000`; a API já manda ponto decimal, sem separador de milhares. */
function paraPreco(texto: string | null): number | undefined {
  if (!texto) return undefined;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : undefined;
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraTreinamento(linha: TreinamentoApi): Treinamento {
  return {
    id: String(linha.id),
    titulo: linha.nome,
    resumo: linha.descricao ?? '',
    imagem: capaUtilizavel(linha.capa_url),
    cargaHoraria: paraCargaHoraria(linha.carga_horaria),
    preco: paraPreco(linha.preco),
  };
}
