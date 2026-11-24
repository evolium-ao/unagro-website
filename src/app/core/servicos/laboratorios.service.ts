import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { UnidadeInvestigacao } from '../modelos/investigacao.model';

/**
 * A faculdade tal como vem embutida no laboratório. O `FaculdadeResource` traz
 * muito mais (conteúdo, cursos, bolsas); só o `nome` interessa ao cartão, que o
 * mostra no selo sobre a fotografia.
 */
interface FaculdadeApi {
  id: number;
  nome: string;
}

/** Espelha o `LaboratorioResource` do OpenAPI — a forma crua, antes do mapeamento. */
interface LaboratorioApi {
  id: number;
  capa_url: string | null;
  faculdade_id: number;
  /** O esquema não a dá como obrigatória, mas `GET /laboratorios` manda-a sempre. */
  faculdade?: FaculdadeApi | null;
  nome: string;
  descricao: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Destino do cartão enquanto não houver rota de detalhe de laboratório. Na página
 * de desenvolvimento o botão nem chega a ser link — `acaoComoBotao` põe-no a
 * abrir o modal de agendamento —, mas o campo faz parte do modelo e não pode
 * ficar vazio nos sítios onde o cartão volte a ser navegável.
 */
const LINK_SECAO_UNIDADES = '/desenvolvimento#secao-investigacao';

/**
 * Ícone de recurso do laboratório. A API não classifica os laboratórios por
 * área nem lhes dá ícone; onde a unidade aparece sem fotografia — os cartões de
 * escolha do modal de agendamento — todos ficam com o mesmo.
 */
const ICONE_LABORATORIO = 'flask-conical';

/**
 * Um método por endpoint de `GET /laboratorios`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/laboratorios.queries.ts`.
 */
@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<UnidadeInvestigacao[]> {
    return this.api
      .get<LaboratorioApi[]>('laboratorios', { signal })
      .then((linhas) => linhas.map(paraUnidade));
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraUnidade(linha: LaboratorioApi): UnidadeInvestigacao {
  return {
    id: String(linha.id),
    nome: linha.nome,
    area: linha.faculdade?.nome ?? '',
    imagem_url: capaUtilizavel(linha.capa_url),
    icone: ICONE_LABORATORIO,
    link: LINK_SECAO_UNIDADES,
  };
}
