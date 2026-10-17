import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { alumniQueries } from '../../core/consultas/alumni.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { AlumniEstatisticasService } from '../../core/servicos/alumni-estatisticas.service';
import { AlumniService } from '../../core/servicos/alumni.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoHistoriaAlumniEsqueletoComponent } from '../../shared/componentes/cartao-historia-alumni-esqueleto/cartao-historia-alumni-esqueleto.component';
import { CartaoHistoriaAlumniComponent } from '../../shared/componentes/cartao-historia-alumni/cartao-historia-alumni.component';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { FaixaEstatisticasComponent } from '../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ItemEstatisticaComponent } from '../../shared/componentes/item-estatistica/item-estatistica.component';
import { ItemInformacaoComponent } from '../../shared/componentes/item-informacao/item-informacao.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

interface PilarAlumniBruto {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/**
 * Conteúdo estrutural da sessão "Sobre a Alumni UNAGRO" — os três eixos da rede, fixos
 * no desenho da secção e não uma lista que a API venha a servir; fica aqui como as
 * `VANTAGENS_BRUTAS` de `formacoes`.
 */
const PILARES_ALUMNI_BRUTOS: PilarAlumniBruto[] = [
  {
    id: 'educacao',
    icone: 'graduation-cap',
    titulo: { pt: 'Educação', en: 'Education' },
    descricao: {
      pt: 'Acesso exclusivo a formações de pós-graduação e webinars de vanguarda tecnológica.',
      en: 'Exclusive access to postgraduate training and cutting-edge technology webinars.',
    },
  },
  {
    id: 'networking',
    icone: 'handshake',
    titulo: { pt: 'Networking', en: 'Networking' },
    descricao: {
      pt: 'Eventos globais para ligar líderes do sector e fomentar novas parcerias de negócio.',
      en: 'Global events connecting industry leaders and fostering new business partnerships.',
    },
  },
  {
    id: 'carreiras',
    icone: 'award',
    titulo: { pt: 'Carreiras', en: 'Careers' },
    descricao: {
      pt: 'Canal directo com o mercado de trabalho especializado e programas de mentoria personalizados.',
      en: 'A direct channel to the specialised job market and personalised mentoring programmes.',
    },
  },
];

/**
 * Conteúdo estrutural da sessão "Contribua com a UNAGRO" — as duas vias de apoio são
 * parte do desenho da secção, não uma lista que a API venha a servir.
 */
const MODOS_CONTRIBUICAO_BRUTOS: PilarAlumniBruto[] = [
  {
    id: 'bolsas',
    icone: 'sprout',
    titulo: { pt: 'Bolsas de Estudo', en: 'Scholarships' },
    descricao: {
      pt: 'Apoie estudantes talentosos.',
      en: 'Support talented students.',
    },
  },
  {
    id: 'pesquisa',
    icone: 'flask-conical',
    titulo: { pt: 'Fundos de Pesquisa', en: 'Research Funds' },
    descricao: {
      pt: 'Acelere a inovação agrícola.',
      en: 'Accelerate agricultural innovation.',
    },
  },
];

/** Campos de texto do alumni traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_ALUMNI = ['cargoAtual', 'testemunho'] as const;

@Component({
  selector: 'app-alumni',
  imports: [
    ReactiveFormsModule,

    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoRecursoComponent,
    CartaoHistoriaAlumniComponent,
    CartaoHistoriaAlumniEsqueletoComponent,
    ItemEstatisticaComponent,
    ItemInformacaoComponent,
    BotaoComponent,
    IconeComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './alumni.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlumniComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly servico = inject(AlumniService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);
  private readonly estatisticasService = inject(AlumniEstatisticasService);

  protected readonly estatisticasImpacto = this.estatisticasService.estatisticasImpacto;
  protected readonly membrosRede = this.estatisticasService.membrosRede;

  /** `GET /alumni` — a lista vem inteira, sem paginação nem filtros do lado da API. */
  protected readonly consultaAlumni = injectQuery(() => alumniQueries.lista(this.servico));

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês,
   * `cargoAtual`/`testemunho` passam pela tradução automática antes de
   * chegar a `historiasDestaque`. Enquanto a tradução carrega, ou se falhar,
   * fica o texto original em português — nunca um cartão vazio.
   */
  private readonly consultaTraducaoAlumni = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaAlumni.data() ?? [], CAMPOS_TRADUZIVEIS_ALUMNI),
      this.traducao.idioma(),
    ),
  );

  private readonly alumniTraduzidos = computed(() =>
    aplicarTraducao(
      this.consultaAlumni.data() ?? [],
      CAMPOS_TRADUZIVEIS_ALUMNI,
      this.consultaTraducaoAlumni.data(),
    ),
  );

  /** Lista completa traduzida; sem consumidor no template por agora, como no serviço original. */
  protected readonly historias = this.alumniTraduzidos;

  /**
   * Histórias da secção "Onde estão os nossos Alumni?": a API já marca
   * `destaque` por linha, por isso não se recria aqui a antiga heurística do
   * mock (ter fotografia + `slice(0, 3)`).
   */
  protected readonly historiasDestaque = computed(() =>
    this.alumniTraduzidos().filter((historia) => historia.destaque),
  );

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Comunidade Alumni', 'Alumni Community']),
  );

  protected readonly tituloDestaqueHero = computed(() =>
    this.traducao.getTraducao(['UNAGRO', 'UNAGRO']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Uma rede global de graduados ligados pela inovação agroindustrial e excelência académica. Junte-se ao legado que está a transformar o futuro do sector.',
      'A global network of graduates connected by agro-industrial innovation and academic excellence. Join the legacy that is transforming the future of the sector.',
    ]),
  );

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      // TODO: falta a página/rota de inscrição na comunidade Alumni; por agora
      // aponta para a secção "Sobre a Alumni UNAGRO" da própria página.
      link: '/alumni#secao-comunidade',
      texto: this.traducao.getTraducao(['Juntar-se à comunidade', 'Join the community']),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
  ]);

  protected readonly tituloSobre = computed(() =>
    this.traducao.getTraducao(['Sobre a Alumni UNAGRO', 'About UNAGRO Alumni']),
  );

  protected readonly tituloMissao = computed(() =>
    this.traducao.getTraducao(['Nossa Missão', 'Our Mission']),
  );

  protected readonly textoMissao = computed(() =>
    this.traducao.getTraducao([
      'Fortalecer os laços entre a instituição e os seus graduados, promovendo um ecossistema de aprendizagem contínua, colaboração profissional e apoio mútuo para impulsionar a agricultura moderna e sustentável.',
      'To strengthen the ties between the institution and its graduates, fostering an ecosystem of continuous learning, professional collaboration and mutual support to drive modern, sustainable agriculture.',
    ]),
  );

  protected readonly pilares = computed(() =>
    localizarProfundo(PILARES_ALUMNI_BRUTOS, this.traducao.idioma()),
  );

  protected readonly semPilares = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há informação sobre a comunidade.',
      'There is no community information yet.',
    ]),
  );

  protected readonly tituloHistorias = computed(() =>
    this.traducao.getTraducao(['Onde estão os nossos Alumni?', 'Where are our Alumni?']),
  );

  protected readonly descricaoHistorias = computed(() =>
    this.traducao.getTraducao([
      'Descubra as histórias de impacto de quem transformou o conhecimento da UNAGRO em inovação real no terreno.',
      "Discover the impact stories of those who turned UNAGRO's knowledge into real innovation in the field.",
    ]),
  );

  protected readonly textoTodasHistorias = computed(() =>
    this.traducao.getTraducao(['Ver todas as histórias', 'See all stories']),
  );

  // TODO: falta a página/rota de listagem das histórias Alumni; por agora a
  // ligação aponta para a própria secção de destaques.
  protected readonly linkTodasHistorias = '/alumni#secao-historias-alumni';

  protected readonly semHistorias = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há histórias publicadas.',
      'There are no published stories yet.',
    ]),
  );

  protected readonly erroHistorias = computed(() =>
    this.traducao.getTraducao([
      'Não foi possível carregar as histórias.',
      'Could not load the stories.',
    ]),
  );

  protected readonly tituloContribuir = computed(() =>
    this.traducao.getTraducao(['Contribua com a UNAGRO', 'Contribute to UNAGRO']),
  );

  protected readonly descricaoContribuir = computed(() =>
    this.traducao.getTraducao([
      'O seu apoio permite-nos continuar a oferecer educação de excelência e a apoiar a próxima geração de talentos através de bolsas de estudo e infra-estruturas de ponta.',
      'Your support allows us to keep offering education of excellence and to back the next generation of talent through scholarships and state-of-the-art facilities.',
    ]),
  );

  protected readonly modosContribuicao = computed(() =>
    localizarProfundo(MODOS_CONTRIBUICAO_BRUTOS, this.traducao.idioma()),
  );

  protected readonly semModosContribuicao = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há vias de apoio publicadas.',
      'There are no support options published yet.',
    ]),
  );

  protected readonly legendaImagemContribuir = computed(() =>
    this.traducao.getTraducao([
      'Jovens agrónomos graduados pela UNAGRO',
      'Young agronomists who graduated from UNAGRO',
    ]),
  );

  protected readonly textoDoacao = computed(() =>
    this.traducao.getTraducao(['Fazer uma Doação', 'Make a Donation']),
  );

  protected readonly textoComunidade = computed(() =>
    this.traducao.getTraducao(['Fazer parte da comunidade', 'Join the community']),
  );

  // TODO: não há página de doações no `app.routes.ts`; até existir, a doação
  // encaminha para o formulário de contacto institucional.
  protected readonly linkDoacao = '/contactos';

  // TODO: falta a rota de inscrição na comunidade Alumni; por agora sobe para a
  // secção "Sobre a Alumni UNAGRO" da própria página, como o CTA do hero.
  protected readonly linkComunidade = '/alumni#secao-sobre-alumni';

  protected readonly estadoEnvio = signal<'ocioso' | 'enviando' | 'sucesso'>('ocioso');

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    valor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true }),
  });

  protected contribuir(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estadoEnvio.set('enviando');
    setTimeout(() => {
      this.estadoEnvio.set('sucesso');
      this.formulario.reset({ nome: '', email: '', valor: '', mensagem: '' });
    }, 700);
  }
}
