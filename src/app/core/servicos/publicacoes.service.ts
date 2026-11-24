import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { Publicacao } from '../modelos/publicacao.model';

/**
 * Espelha o `PublicacaoResource` do OpenAPI — a forma crua, antes do
 * mapeamento. `projecto`/`user` vêm embutidos, mas só o `projecto_id` é usado
 * (para ligar a publicação ao projecto na página de detalhe); o resto da
 * relação fica fora desta interface.
 *
 * `link`/`link_en` existem na API mas não se usam — por pedido, os botões de
 * descarga apontam sempre para `documento`/`documento_en`.
 */
interface PublicacaoApi {
  id: number;
  titulo: string;
  descricao: string | null;
  projecto_id: number | null;
  data_publicacao: string;
  /** Ficheiro em português, caminho relativo ao `storage` do Laravel — o `capaUtilizavel` põe-lhe o prefixo. */
  documento: string | null;
  /** Ficheiro em inglês; ausente enquanto o backoffice não o carregar. */
  documento_en: string | null;
}

/**
 * Um método por endpoint de `GET /publicacoes`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/publicacoes.queries.ts`.
 *
 * **Sem `obterPorId`**: não há página de detalhe de publicação — as duas
 * consumidoras (secção "Publicações Recentes" de `/desenvolvimento` e a
 * coluna "Documentos e Publicações" de `detalhe-projeto`) usam sempre a lista
 * completa, filtrando por `projetoId` do lado do cliente quando é preciso —
 * a API não tem parâmetro de filtro em `GET /publicacoes`.
 */
@Injectable({ providedIn: 'root' })
export class PublicacoesService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Publicacao[]> {
    return this.api
      .get<PublicacaoApi[]>('publicacoes', { signal })
      .then((linhas) => linhas.map(paraPublicacao));
  }
}

/** Onde se corrigem os nomes dos campos da API para os do site. */
function paraPublicacao(linha: PublicacaoApi): Publicacao {
  return {
    id: String(linha.id),
    titulo: linha.titulo,
    resumo: linha.descricao ?? '',
    data: linha.data_publicacao,
    documentoUrl: capaUtilizavel(linha.documento),
    documentoUrlEn: capaUtilizavel(linha.documento_en),
    projetoId: linha.projecto_id != null ? String(linha.projecto_id) : undefined,
  };
}
