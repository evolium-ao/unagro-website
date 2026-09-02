import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvisoIntranet, TipoAvisoIntranet } from '../../core/modelos/aviso-intranet.model';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { IntranetService } from '../../core/servicos/intranet.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { NoticiaCartao } from '../../shared/modelos/noticia-cartao.model';
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
 * Forma como uma notícia académica chega do backend: cada texto é o par
 * `[pt, en]` que o `TraducaoService.getTraducao` resolve para o idioma activo.
 * Para trocar o mock pela API basta alimentar `noticiasBrutas` com a resposta
 * HTTP — o resto da secção não muda.
 */
interface NoticiaAcademicaApi {
  id: string;
  categoria: [string, string];
  titulo: [string, string];
  resumo: [string, string];
  /** Data de publicação em ISO; o cartão mostra a antiguidade ("há 2 dias"). */
  data: string;
  imagem?: string;
  destaque?: boolean;
}

const NOTICIAS_ACADEMICAS_MOCK: NoticiaAcademicaApi[] = [
  {
    id: 'sementes-resilientes-clima',
    categoria: ['Investigação', 'Research'],
    titulo: [
      'Novo avanço em sementes resilientes ao clima',
      'New breakthrough in climate-resilient seeds',
    ],
    resumo: [
      'Equipa de investigadores da UNAGRO desenvolve variedade de milho capaz de resistir a períodos prolongados de seca severa.',
      'A UNAGRO research team has developed a maize variety able to withstand prolonged periods of severe drought.',
    ],
    data: '2026-08-31',
    imagem: '/imagens/estudante-noticia-pesquisa.png',
    destaque: true,
  },
  {
    id: 'workshop-horticultura-urbana',
    categoria: ['Campus Life', 'Campus Life'],
    titulo: [
      'Workshop de Horticultura Urbana atrai centenas de alunos',
      'Urban Horticulture workshop draws hundreds of students',
    ],
    resumo: [
      'Duas tardes de prática em canteiros verticais e compostagem doméstica esgotaram as inscrições.',
      'Two afternoons of hands-on vertical beds and home composting sold out within days.',
    ],
    data: '2026-08-30',
    imagem: '/imagens/image-curso-1.png',
  },
  {
    id: 'protocolo-lider-tecnologico',
    categoria: ['Parcerias', 'Partnerships'],
    titulo: [
      'UNAGRO assina protocolo com líder tecnológico do setor',
      'UNAGRO signs agreement with a leading sector technology firm',
    ],
    resumo: [
      'O acordo abre estágios e acesso a equipamento de agricultura de precisão aos estudantes dos últimos anos.',
      'The agreement opens internships and access to precision-farming equipment for final-year students.',
    ],
    data: '2026-08-27',
    imagem: '/imagens/image-curso-2.png',
  },
];

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
    ContainerPaginaComponent,
    FaixaEstatisticasComponent,
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
      link: '/estudantes#secao-intranet',
      texto: this.traducao.t('paginas.estudantes.intranetCartaoCta'),
      variante: 'secundario',
      icone: 'log-in',
      posicaoIcone: 'direita',
    },
  ]);

  /** Substituir por um sinal alimentado pelo endpoint de notícias académicas. */
  private readonly noticiasBrutas = signal<NoticiaAcademicaApi[]>(NOTICIAS_ACADEMICAS_MOCK);

  private readonly noticias = computed<NoticiaCartao[]>(() =>
    this.noticiasBrutas().map((noticia) => ({
      id: noticia.id,
      categoria: this.traducao.getTraducao(noticia.categoria),
      titulo: this.traducao.getTraducao(noticia.titulo),
      resumo: this.traducao.getTraducao(noticia.resumo),
      data: noticia.data,
      imagem: noticia.imagem,
    })),
  );

  protected readonly noticiaDestaque = computed(() => {
    const indice = this.noticiasBrutas().findIndex((noticia) => noticia.destaque);
    return this.noticias()[indice >= 0 ? indice : 0];
  });

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
