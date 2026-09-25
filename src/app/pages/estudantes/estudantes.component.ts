import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvisoIntranet, TipoAvisoIntranet } from '../../core/modelos/aviso-intranet.model';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { IntranetService } from '../../core/servicos/intranet.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { noticiasQueries } from '../../core/consultas/noticias.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { Noticia } from '../../core/modelos/noticia.model';
import { NoticiasService } from '../../core/servicos/noticias.service';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import { CartaoNoticiaDestaqueEsqueletoComponent } from '../../shared/componentes/cartao-noticia-destaque-esqueleto/cartao-noticia-destaque-esqueleto.component';
import { CartaoNoticiaResumoEsqueletoComponent } from '../../shared/componentes/cartao-noticia-resumo-esqueleto/cartao-noticia-resumo-esqueleto.component';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoNoticiaDestaqueComponent } from '../../shared/componentes/cartao-noticia-destaque/cartao-noticia-destaque.component';
import { CartaoNoticiaResumoComponent } from '../../shared/componentes/cartao-noticia-resumo/cartao-noticia-resumo.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { FaixaEstatisticasComponent } from '../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { saxLockOutline } from '@ng-icons/iconsax/outline';
import { BotaoComponent } from "../../shared/componentes/botao/botao.component";
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";

/**
 * Valores de `tipo_noticia` (texto livre na API, sem lista fechada) que contam
 * como notícia estudantil, já normalizados por `normalizarTipo`. `estudantil`
 * é o tipo pedido para o back office; `academica` é o que a API já usa hoje
 * para as notícias da vida académica.
 */
const TIPOS_NOTICIA_ESTUDANTIL = new Set(['estudantil', 'academica']);

/** Uma em destaque e duas na lista — é o que a grelha da secção comporta. */
const NOTICIAS_ESTUDANTIS_POR_SECCAO = 3;

/** Campos de texto traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_NOTICIA = ['titulo', 'resumo', 'categoria'] as const;

/** "Académica" → "academica": sem acentos, maiúsculas nem espaços à volta. */
function normalizarTipo(tipo: string): string {
  return tipo.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

/** Cada tipo de aviso da intranet tem o seu ícone na faixa de notas informativas. */
const ICONES_AVISO: Record<TipoAvisoIntranet, string> = {
  manutencao: 'clock',
  inscricao: 'clipboard-check',
  geral: 'square-text',
};

@Component({
  selector: 'app-estudantes',
  imports: [
    BannerDestaqueComponent,
    CabecalhoSecaoComponent,
    CartaoNoticiaDestaqueComponent,
    CartaoNoticiaResumoComponent,
    CartaoNoticiaDestaqueEsqueletoComponent,
    CartaoNoticiaResumoEsqueletoComponent,
    ContainerPaginaComponent,
    IconeComponent,
    RouterLink,
    NgIcon,
    BotaoComponent,
    ContainerBannerFaixaEstatisticaComponent
],
viewProviders: [provideIcons({ saxLockOutline })],
  templateUrl: './estudantes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstudantesComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly intranetService = inject(IntranetService);
  private readonly noticiasService = inject(NoticiasService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);

  protected readonly avisos = this.intranetService.avisos;

  protected readonly mostrarAvisoAcesso = signal(false);

  protected readonly selosHero = computed(() => [this.traducao.t('paginas.estudantes.heroSelo')]);

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/estudantes#secao-intranet',
      texto: this.traducao.t('paginas.estudantes.heroCtaCursos'),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
    {
      link: '/estudantes#secao-intranet',
      texto: this.traducao.t('paginas.estudantes.heroCtaHorarios'),
      variante: 'glass',
    },
  ]);

  protected readonly selosIntranet = computed(() => [
    this.traducao.t('paginas.estudantes.intranetCartaoSelo'),
  ]);

  // TODO: trocar pelo endereço real do portal da intranet quando existir.
  protected readonly ctasIntranet = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/entrar',
      texto: this.traducao.t('paginas.estudantes.intranetCartaoCta'),
      variante: 'secundario',
      icone: 'log-in',
      posicaoIcone: 'direita',

    },
  ]);

  /**
   * `GET /noticias` — a mesma consulta (e cache) da página inicial. A API não
   * tem filtro por tipo, por isso a secção fica só com as estudantis aqui.
   */
  protected readonly consultaNoticias = injectQuery(() =>
    noticiasQueries.lista(this.noticiasService),
  );

  /** As mais recentes primeiro, só as de tipo estudantil, até encher a grelha. */
  private readonly noticiasEstudantis = computed<Noticia[]>(() =>
    (this.consultaNoticias.data() ?? [])
      .filter((noticia) => TIPOS_NOTICIA_ESTUDANTIL.has(normalizarTipo(noticia.categoria)))
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, NOTICIAS_ESTUDANTIS_POR_SECCAO),
  );

  /** A API só devolve português (ver `.claude/README.md`); traduzido antes de chegar aos cartões. */
  private readonly consultaTraducaoNoticias = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.noticiasEstudantis(), CAMPOS_TRADUZIVEIS_NOTICIA),
      this.traducao.idioma(),
    ),
  );

  private readonly noticias = computed<Noticia[]>(() =>
    aplicarTraducao(
      this.noticiasEstudantis(),
      CAMPOS_TRADUZIVEIS_NOTICIA,
      this.consultaTraducaoNoticias.data(),
    ),
  );

  /** Só uma notícia marcada como destaque ocupa o cartão grande; sem ela, todas vão para a lista. */
  protected readonly noticiaDestaque = computed(() =>
    this.noticias().find((noticia) => noticia.destaque),
  );

  protected readonly noticiasSecundarias = computed(() =>
    this.noticias().filter((noticia) => noticia.id !== this.noticiaDestaque()?.id),
  );

  protected iconeAviso(tipo: TipoAvisoIntranet): string {
    return ICONES_AVISO[tipo];
  }

  protected tentarAceder(): void {
    this.mostrarAvisoAcesso.set(true);
  }

  avisoAutenticacao = computed(() => ({
    id: 'acesso-restrito',
    tipo: 'geral',
    titulo: this.traducao.getTraducao(['O acesso a estas áreas requer autenticação institucional.', 'Access to these areas requires institutional authentication.']),
    mensagem: this.traducao.getTraducao(['Use as suas credenciais de estudante para entrar na Intranet.', 'Use your student credentials to log in to the Intranet.']),
    data: new Date().toISOString(),
  }));
}
