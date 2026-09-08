import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { capaUtilizavel } from '../api/capa-utilizavel';
import { PROJETOS_MOCK, ProjetoBruto } from '../dados/projetos.mock';
import { ItemGaleria } from '../modelos/galeria.model';
import { Investigador } from '../modelos/investigacao.model';
import { MembroEquipa } from '../modelos/membro-equipa.model';
import {
  ContactoProjeto,
  DocumentoProjeto,
  EstadoEtapaCronograma,
  EstatisticaProjeto,
  EtapaCronograma,
  Projeto,
  TestemunhoProjeto,
} from '../modelos/projeto.model';
import { Idioma, IDIOMAS_DISPONIVEIS } from '../traducao/idioma';
import { TextoBilingue } from '../traducao/texto-bilingue';
import { InvestigadoresService } from './investigadores.service';

/** Espelha o `CategoriaResource`, reduzido ao nome usado na área temática. */
interface CategoriaApi {
  id: number;
  nome: string;
}

/**
 * Espelha o `EquipaProjectoResource` — só os campos usados para montar a
 * "Equipa do Projecto". A API não embute o investigador (só o `investigador_id`),
 * por isso o nome e a fotografia vêm de um segundo pedido a `GET /investigadores`.
 */
interface EquipaProjectoApi {
  id: number;
  investigador_id: number;
  funcao_no_projecto: string | null;
}

/**
 * Espelha o `CronogramaResource` — as etapas do "Cronograma do Projecto", quando
 * a API as tiver (nos dados actuais nunca tem, ver `.claude/memory/integrar-recurso.md`).
 */
interface CronogramaApi {
  id: number;
  ordem: number;
  titulo: string;
  periodo: string;
  descricao: string | null;
  estado: string;
}

/** Espelha o `ProjectoResource` do OpenAPI — a forma crua, antes do mapeamento. */
interface ProjetoApi {
  id: number;
  nome: string;
  descricao: string | null;
  imagem: string | null;
  categoria_id: number;
  categoria: CategoriaApi | null;
  status: string | null;
  equipaProjectos: EquipaProjectoApi[];
  cronogramas: CronogramaApi[];
}

/**
 * Um método por endpoint de `GET /projectos`. Sem sinais e sem cache — é uma
 * função de dados, e é ela que vai directa para o `queryFn` das consultas em
 * `core/consultas/projetos.queries.ts`.
 *
 * **Continua ligado ao mock.** O `ProjectoResource` só cobre uma fatia do
 * `Projeto` do site (identificação, resumo curto, estado, área temática,
 * imagem e, por vezes, equipa); tudo o que a secção de detalhe mostra e a API
 * não dá (contexto, objectivos, solução, cronograma quando vazio, galeria,
 * documentos, testemunhos, contacto) continua a vir do `PROJETOS_MOCK`, por
 * pedido explícito (ver `.claude/memory/integrar-recurso.md`, secção
 * `projectos`) — em vez de esconder essas secções como as outras integrações
 * fazem quando um campo falta.
 *
 * O emparelhamento de cada projecto da API com a entrada do mock que lhe
 * empresta o resto do conteúdo é pelo **id da API módulo o tamanho do mock**
 * (`paraProjeto`) — não pela posição na lista, para `listar()` e
 * `obterPorId()` devolverem sempre o mesmo conteúdo emprestado para o mesmo id,
 * independentemente da ordenação ou de quantos projectos a API tiver nesse
 * momento.
 */
@Injectable({ providedIn: 'root' })
export class ProjetosService {
  private readonly api = inject(ApiService);
  private readonly investigadoresService = inject(InvestigadoresService);

  async listar(idioma: Idioma, signal?: AbortSignal): Promise<Projeto[]> {
    const [linhas, investigadores] = await Promise.all([
      this.api.get<ProjetoApi[]>('projectos', { signal }),
      this.investigadoresService.listar(signal),
    ]);
    const investigadoresPorId = paraMapaDeInvestigadores(investigadores);

    return semProjectosDuplicados(linhas)
      .sort((a, b) => a.id - b.id)
      .map((linha) => paraProjeto(linha, investigadoresPorId, idioma));
  }

  async obterPorId(id: number, idioma: Idioma, signal?: AbortSignal): Promise<Projeto> {
    const [linha, investigadores] = await Promise.all([
      this.api.get<ProjetoApi>(`projectos/${id}`, { signal }),
      this.investigadoresService.listar(signal),
    ]);
    return paraProjeto(linha, paraMapaDeInvestigadores(investigadores), idioma);
  }
}

function paraMapaDeInvestigadores(investigadores: Investigador[]): Map<string, Investigador> {
  return new Map(investigadores.map((investigador) => [investigador.id, investigador]));
}

/**
 * A tabela de projectos tem duplicados: 15 das 20 linhas actuais partilham o
 * mesmo `nome` ("Recuperação de Solos Degradados") e os mesmos valores em
 * tudo o resto, só o `id` e as datas mudam — a mesma família de problema já
 * registada para `laboratorios` e `faculdades`. Ao contrário de
 * `laboratorios` (onde a duplicação é inofensiva numa tira), mostrar 15
 * cartões idênticos na grelha de projectos seria visivelmente um erro de
 * dados; agrupa-se por `nome` e fica-se com a entrada mais "rica"
 * (com imagem, equipa ou cronograma) ou, em empate, com o menor id.
 */
function semProjectosDuplicados(linhas: ProjetoApi[]): ProjetoApi[] {
  const porNome = new Map<string, ProjetoApi>();
  for (const linha of linhas) {
    const existente = porNome.get(linha.nome);
    if (!existente || precedeSubstituindo(linha, existente)) {
      porNome.set(linha.nome, linha);
    }
  }
  return [...porNome.values()];
}

function precedeSubstituindo(candidata: ProjetoApi, actual: ProjetoApi): boolean {
  const riquezaCandidata = riqueza(candidata);
  const riquezaAtual = riqueza(actual);
  if (riquezaCandidata !== riquezaAtual) return riquezaCandidata > riquezaAtual;
  return candidata.id < actual.id;
}

function riqueza(linha: ProjetoApi): number {
  return (linha.imagem ? 1 : 0) + linha.equipaProjectos.length + linha.cronogramas.length;
}

/** Resolve um par bilingue do mock para o idioma pedido — sem depender do `TraducaoService`. */
function resolver(par: TextoBilingue, idioma: Idioma): string {
  const indice = IDIOMAS_DISPONIVEIS.indexOf(idioma);
  return par[indice] ?? par[0];
}

/** Onde se junta o que a API dá com o que ela ainda não dá (emprestado ao mock). */
function paraProjeto(
  linha: ProjetoApi,
  investigadoresPorId: Map<string, Investigador>,
  idioma: Idioma,
): Projeto {
  const mock = PROJETOS_MOCK[(linha.id - 1) % PROJETOS_MOCK.length] ?? PROJETOS_MOCK[0];
  const equipaApi = paraEquipaApi(linha.equipaProjectos, investigadoresPorId);
  const cronogramaApi = paraCronogramaApi(linha.cronogramas);

  return {
    id: String(linha.id),
    // A API não tem uma categoria de filtro fechada — só uma relação de nome
    // livre (`categoria.nome`, ver `areaTematica` abaixo), sem correspondência
    // com o `CategoriaProjecto` usado nos filtros. Continua a vir do mock.
    categoria: mock.categoria,
    titulo: linha.nome,
    faculdade: resolver(mock.faculdade, idioma),
    estado: linha.status ? linha.status.toUpperCase() : resolver(mock.estado, idioma),
    local: resolver(mock.local, idioma),
    periodo: resolver(mock.periodo, idioma),
    areaTematica: linha.categoria?.nome ?? resolver(mock.areaTematica, idioma),
    resumo: linha.descricao ?? resolver(mock.resumo, idioma),
    resultado_principal: resolver(mock.resultado_principal, idioma),
    imagem_url: capaUtilizavel(linha.imagem) ?? mock.imagem_url,
    contexto: mock.contexto ? resolver(mock.contexto, idioma) : undefined,
    desafio: resolver(mock.desafio, idioma),
    estatisticasContexto: mock.estatisticasContexto?.map((estatistica) =>
      paraEstatistica(estatistica, idioma),
    ),
    imagem_contexto_url: mock.imagem_contexto_url,
    objetivoGeral: mock.objetivoGeral ? resolver(mock.objetivoGeral, idioma) : undefined,
    objetivosEspecificos: mock.objetivosEspecificos?.map((objetivo) => ({
      id: objetivo.id,
      icone: objetivo.icone,
      titulo: resolver(objetivo.titulo, idioma),
      descricao: resolver(objetivo.descricao, idioma),
    })),
    descricaoSolucao: mock.descricaoSolucao ? resolver(mock.descricaoSolucao, idioma) : undefined,
    solucoes: mock.solucoes?.map((solucao) => ({
      id: solucao.id,
      icone: solucao.icone,
      titulo: resolver(solucao.titulo, idioma),
      descricao: resolver(solucao.descricao, idioma),
    })),
    estatisticasImpacto: mock.estatisticasImpacto?.map((estatistica) =>
      paraEstatistica(estatistica, idioma),
    ),
    // O cronograma real da API entra quando existir; nos 20 projectos actuais
    // `cronogramas` vem sempre vazio, por isso cai sempre no do mock.
    cronograma: cronogramaApi.length
      ? cronogramaApi
      : mock.cronograma?.map((etapa) => paraEtapaMock(etapa, idioma)),
    galeria: mock.galeria?.map((item) => paraItemGaleria(item, idioma)),
    // A equipa real entra quando `equipaProjectos` não vier vazio (ids 1–5 nos
    // dados actuais); o resto (incluindo os duplicados de "Recuperação de Solos
    // Degradados") cai na equipa do mock.
    equipa: equipaApi.length ? equipaApi : mock.equipa?.map((membro) => paraMembroMock(membro, idioma)),
    documentos: mock.documentos?.map((documento) => paraDocumento(documento, idioma)),
    testemunhos: mock.testemunhos?.map((testemunho) => paraTestemunho(testemunho, idioma)),
    contacto: mock.contacto ? paraContacto(mock.contacto, idioma) : undefined,
  };
}

/**
 * Junta o `funcao_no_projecto` de cada linha de `equipaProjectos` ao
 * investigador correspondente (`GET /investigadores`). Uma linha cujo
 * investigador não apareça na lista (não deveria acontecer, mas a API não
 * garante integridade referencial do lado do cliente) é descartada em vez de
 * desenhar um cartão sem nome.
 */
function paraEquipaApi(
  equipa: EquipaProjectoApi[],
  investigadoresPorId: Map<string, Investigador>,
): MembroEquipa[] {
  const membros: MembroEquipa[] = [];
  for (const linha of equipa) {
    const investigador = investigadoresPorId.get(String(linha.investigador_id));
    if (!investigador) continue;
    membros.push({
      id: String(linha.id),
      nome: investigador.nome,
      cargo: linha.funcao_no_projecto ?? investigador.cargo ?? '',
      foto_url: investigador.foto_url,
    });
  }
  return membros;
}

function paraCronogramaApi(cronogramas: CronogramaApi[]): EtapaCronograma[] {
  return [...cronogramas]
    .sort((a, b) => a.ordem - b.ordem)
    .map((etapa) => ({
      id: String(etapa.id),
      titulo: etapa.titulo,
      periodo: etapa.periodo || undefined,
      descricao: etapa.descricao ?? '',
      estado: paraEstadoEtapa(etapa.estado),
    }));
}

/** A API não declara os valores possíveis; um valor desconhecido cai em "futura". */
function paraEstadoEtapa(valor: string): EstadoEtapaCronograma {
  return valor === 'concluida' || valor === 'atual' || valor === 'futura' ? valor : 'futura';
}

function paraEstatistica(
  estatistica: NonNullable<ProjetoBruto['estatisticasContexto']>[number],
  idioma: Idioma,
): EstatisticaProjeto {
  return {
    id: estatistica.id,
    valor: resolver(estatistica.valor, idioma),
    rotulo: resolver(estatistica.rotulo, idioma),
  };
}

function paraEtapaMock(
  etapa: NonNullable<ProjetoBruto['cronograma']>[number],
  idioma: Idioma,
): EtapaCronograma {
  return {
    id: etapa.id,
    titulo: resolver(etapa.titulo, idioma),
    periodo: etapa.periodo ? resolver(etapa.periodo, idioma) : undefined,
    descricao: resolver(etapa.descricao, idioma),
    estado: etapa.estado,
  };
}

function paraItemGaleria(
  item: NonNullable<ProjetoBruto['galeria']>[number],
  idioma: Idioma,
): ItemGaleria {
  return {
    id: item.id,
    url: item.url,
    legenda: item.legenda ? resolver(item.legenda, idioma) : undefined,
  };
}

function paraMembroMock(
  membro: NonNullable<ProjetoBruto['equipa']>[number],
  idioma: Idioma,
): MembroEquipa {
  return {
    id: membro.id,
    nome: membro.nome,
    cargo: resolver(membro.cargo, idioma),
    foto_url: membro.foto_url,
  };
}

function paraDocumento(
  documento: NonNullable<ProjetoBruto['documentos']>[number],
  idioma: Idioma,
): DocumentoProjeto {
  return {
    id: documento.id,
    titulo: resolver(documento.titulo, idioma),
    url: documento.url,
  };
}

function paraTestemunho(
  testemunho: NonNullable<ProjetoBruto['testemunhos']>[number],
  idioma: Idioma,
): TestemunhoProjeto {
  return {
    id: testemunho.id,
    citacao: resolver(testemunho.citacao, idioma),
    autor: testemunho.autor,
    papel: resolver(testemunho.papel, idioma),
    foto: testemunho.foto,
  };
}

function paraContacto(contacto: NonNullable<ProjetoBruto['contacto']>, idioma: Idioma): ContactoProjeto {
  return {
    email: contacto.email,
    telefone: contacto.telefone,
    localizacao: resolver(contacto.localizacao, idioma),
  };
}
