import { Injectable, computed, inject } from '@angular/core';
import { PROJETOS_MOCK } from '../dados/projetos.mock';
import { Projeto } from '../modelos/projeto.model';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class ProjetosService {
  private readonly traducao = inject(TraducaoService);

  /** Substituir pela chamada à API — devolve já a forma traduzida (`Projeto`). */
  readonly projetos = computed<Projeto[]>(() =>
    PROJETOS_MOCK.map((projeto) => ({
      id: projeto.id,
      categoria: projeto.categoria,
      titulo: this.traducao.getTraducao(projeto.titulo),
      faculdade: this.traducao.getTraducao(projeto.faculdade),
      estado: this.traducao.getTraducao(projeto.estado),
      local: this.traducao.getTraducao(projeto.local),
      periodo: this.traducao.getTraducao(projeto.periodo),
      areaTematica: this.traducao.getTraducao(projeto.areaTematica),
      resumo: this.traducao.getTraducao(projeto.resumo),
      resultado_principal: this.traducao.getTraducao(projeto.resultado_principal),
      imagem_url: projeto.imagem_url,
      contexto: projeto.contexto ? this.traducao.getTraducao(projeto.contexto) : undefined,
      desafio: this.traducao.getTraducao(projeto.desafio),
      estatisticasContexto: projeto.estatisticasContexto?.map((estatistica) => ({
        id: estatistica.id,
        valor: this.traducao.getTraducao(estatistica.valor),
        rotulo: this.traducao.getTraducao(estatistica.rotulo),
      })),
      imagem_contexto_url: projeto.imagem_contexto_url,
      objetivoGeral: projeto.objetivoGeral ? this.traducao.getTraducao(projeto.objetivoGeral) : undefined,
      objetivosEspecificos: projeto.objetivosEspecificos?.map((objetivo) => ({
        id: objetivo.id,
        icone: objetivo.icone,
        titulo: this.traducao.getTraducao(objetivo.titulo),
        descricao: this.traducao.getTraducao(objetivo.descricao),
      })),
      descricaoSolucao: projeto.descricaoSolucao
        ? this.traducao.getTraducao(projeto.descricaoSolucao)
        : undefined,
      solucoes: projeto.solucoes?.map((solucao) => ({
        id: solucao.id,
        icone: solucao.icone,
        titulo: this.traducao.getTraducao(solucao.titulo),
        descricao: this.traducao.getTraducao(solucao.descricao),
      })),
      estatisticasImpacto: projeto.estatisticasImpacto?.map((estatistica) => ({
        id: estatistica.id,
        valor: this.traducao.getTraducao(estatistica.valor),
        rotulo: this.traducao.getTraducao(estatistica.rotulo),
      })),
      cronograma: projeto.cronograma?.map((etapa) => ({
        id: etapa.id,
        titulo: this.traducao.getTraducao(etapa.titulo),
        periodo: etapa.periodo ? this.traducao.getTraducao(etapa.periodo) : undefined,
        descricao: this.traducao.getTraducao(etapa.descricao),
        estado: etapa.estado,
      })),
      galeria: projeto.galeria?.map((item) => ({
        id: item.id,
        url: item.url,
        legenda: item.legenda ? this.traducao.getTraducao(item.legenda) : undefined,
      })),
    })),
  );

  obterPorId(id: string) {
    return computed(() => this.projetos().find((p) => p.id === id));
  }
}
