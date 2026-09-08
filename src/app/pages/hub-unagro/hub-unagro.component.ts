import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { startupsQueries } from '../../core/consultas/startups.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { aplicarTraducao, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoStartupComponent, StartupCartao } from '../../shared/componentes/cartao-startup/cartao-startup.component';
import { CartaoStartupEsqueletoComponent } from '../../shared/componentes/cartao-startup-esqueleto/cartao-startup-esqueleto.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';
import { StartupsService } from '../../core/servicos/startups.service';
import { CartaoProjectoInovadorComponent } from '../../shared/componentes/cartao-projecto-inovador/cartao-projecto-inovador.component';
import { ProjectosInovadoresService } from '../../core/servicos/projectos-inovadores.service';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { FormFieldInputComponentV2 } from '../../shared/componentes/input-field/form-input-field';
import { ValidacaoService } from '../../core/servicos/Validacao.service';

/** Campos de texto da startup traduzidos automaticamente quando o idioma não é português. */
const CAMPOS_TRADUZIVEIS_STARTUP = ['nome', 'categoria', 'descricao'] as const;

interface ServicoBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const SERVICOS_BRUTOS: ServicoBruto[] = [
  {
    icone: 'rocket',
    titulo: { pt: 'Incubação de projetos', en: 'Project incubation' },
    descricao: {
      pt: 'Acompanhamento de ideias com potencial de negócio no sector agropecuário.',
      en: 'Support for ideas with business potential in the agricultural sector.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Mentoria', en: 'Mentoring' },
    descricao: {
      pt: 'Orientação por docentes, investigadores e profissionais do sector.',
      en: 'Guidance from faculty, researchers and sector professionals.',
    },
  },
  {
    icone: 'flask-conical',
    titulo: { pt: 'Acesso a laboratórios', en: 'Access to laboratories' },
    descricao: {
      pt: 'Utilização de infraestruturas da universidade para testar e validar soluções.',
      en: 'Use of university facilities to test and validate solutions.',
    },
  },
  {
    icone: 'briefcase',
    titulo: { pt: 'Ligação ao mercado', en: 'Market connection' },
    descricao: {
      pt: 'Contacto com empresas, cooperativas e parceiros institucionais do sector.',
      en: 'Contact with companies, cooperatives and institutional partners in the sector.',
    },
  },
];

interface FormaApoioBruta {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  textoAcao: TextoTraduzido;
  iconeAcao: string;
  linkAcao: string;
}

// TODO: `app.routes.ts` não tem Portal do Investidor, Programa de Grants nem Fundo
// de Doação — as três acções ficam na âncora da própria sessão até essas rotas
// existirem.
const LINK_COMO_APOIAR = '/hub-unagro#secao-como-apoiar';

/**
 * Conteúdo estrutural da sessão "Como Apoiar": são as três vias de apoio do Hub, não
 * uma lista que a API venha a servir — por isso ficam aqui e não em mock.
 * Os ícones do mockup (setas em volta de um símbolo monetário, nota de dinheiro e mão
 * com um rebento) não existem em `dados-icones.ts`; usam-se os mais próximos.
 */
const FORMAS_APOIO_BRUTAS: FormaApoioBruta[] = [
  {
    id: 'investir',
    icone: 'trending-up',
    titulo: { pt: 'Investir (Equity/VC)', en: 'Invest (Equity/VC)' },
    descricao: {
      pt: 'Participe do capital social de agritechs promissoras com alto potencial de retorno financeiro e impacto sistémico no mercado regional.',
      en: 'Take an equity stake in promising agritechs with high potential for financial return and systemic impact on the regional market.',
    },
    textoAcao: { pt: 'Portal do Investidor', en: 'Investor Portal' },
    iconeAcao: 'arrow-up-right',
    linkAcao: LINK_COMO_APOIAR,
  },
  {
    id: 'financiar',
    icone: 'landmark',
    titulo: { pt: 'Financiar Ideias', en: 'Fund Ideas' },
    descricao: {
      pt: 'Micro-subvenções para projetos académicos e MVPs em estágio inicial que precisam de pequenos impulsos para validação técnica.',
      en: 'Micro-grants for academic projects and early-stage MVPs that need a small push towards technical validation.',
    },
    textoAcao: { pt: 'Programa de Grants', en: 'Grants Programme' },
    iconeAcao: 'award',
    linkAcao: LINK_COMO_APOIAR,
  },
  {
    id: 'doar',
    icone: 'sprout',
    titulo: { pt: 'Doar (Research)', en: 'Donate (Research)' },
    descricao: {
      pt: 'Apoie a infraestrutura de pesquisa pura, bolsas de estudo e laboratórios compartilhados acessíveis a todos os nossos hubs.',
      en: 'Support pure research infrastructure, scholarships and shared laboratories accessible to all our hubs.',
    },
    textoAcao: { pt: 'Fundo de Doação', en: 'Donation Fund' },
    iconeAcao: 'heart',
    linkAcao: LINK_COMO_APOIAR,
  },
];

/** `enviado` troca a nota de privacidade pela confirmação da subscrição. */
type EstadoSubscricao = 'ocioso' | 'enviado';

@Component({
  selector: 'app-hub-unagro',
  imports: [
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoStartupComponent,
    CartaoStartupEsqueletoComponent,
    CartaoProjectoInovadorComponent,
    CartaoRecursoComponent,
    FormFieldInputComponentV2,
    ReactiveFormsModule,
    BotaoComponent,
    IconeComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './hub-unagro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubUnagroComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly startupsService = inject(StartupsService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);
  private readonly projectosInovadoresService = inject(ProjectosInovadoresService);
  private readonly validacao = inject(ValidacaoService);

  /** `GET /startups` — a lista vem inteira, sem paginação nem filtros do lado da API. */
  protected readonly consultaStartups = injectQuery(() => startupsQueries.lista(this.startupsService));

  /**
   * A API só devolve português (ver `.claude/README.md`); em inglês,
   * `nome`/`categoria`/`descricao` passam pela tradução automática antes de
   * chegar ao cartão. Enquanto a tradução carrega, ou se falhar, fica o texto
   * original em português — nunca uma lista vazia.
   */
  private readonly consultaTraducaoStartups = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(this.consultaStartups.data() ?? [], CAMPOS_TRADUZIVEIS_STARTUP),
      this.traducao.idioma(),
    ),
  );

  private readonly startupsTraduzidas = computed(() =>
    aplicarTraducao(
      this.consultaStartups.data() ?? [],
      CAMPOS_TRADUZIVEIS_STARTUP,
      this.consultaTraducaoStartups.data(),
    ),
  );

  /**
   * A API não devolve destino de detalhe — `app.routes.ts` também não tem
   * listagem própria de startups — por isso todos os cartões apontam para a
   * âncora da própria sessão, como o "Ver todas" acima.
   */
  protected readonly startups = computed<StartupCartao[]>(() =>
    this.startupsTraduzidas().map((startup) => ({
      id: startup.id,
      categoria: startup.categoria,
      nome: startup.nome,
      descricao: startup.descricao,
      imagem_url: startup.imagem_url,
      link: this.linkTodasStartups,
    })),
  );

  protected readonly erroStartups = computed(() =>
    this.traducao.getTraducao([
      'Não foi possível carregar as startups.',
      'Could not load the startups.',
    ]),
  );

  protected readonly projectosInovadores = this.projectosInovadoresService.projectos;
  protected readonly servicos = computed(() =>
    localizarProfundo(SERVICOS_BRUTOS, this.traducao.idioma()),
  );

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao([
      'Hub UNAGRO: Cultivando a Inovação no',
      'UNAGRO Hub: Cultivating Innovation in',
    ]),
  );

  protected readonly tituloDestaqueHero = computed(() =>
    this.traducao.getTraducao(['Agronegócio', 'Agribusiness']),
  );

  protected readonly tituloStartups = computed(() =>
    this.traducao.getTraducao(['Startups & Incubação', 'Startups & Incubation']),
  );

  protected readonly descricaoStartups = computed(() =>
    this.traducao.getTraducao([
      'Conheça as agritechs que estão redefinindo a produtividade no campo através de dados, biotecnologia e automação.',
      'Meet the agritechs redefining productivity in the field through data, biotechnology and automation.',
    ]),
  );

  protected readonly verTodasStartups = computed(() =>
    this.traducao.getTraducao(['Ver todas', 'View all']),
  );

  // TODO: `app.routes.ts` não tem listagem de startups — o "Ver todas" fica na
  // âncora da própria sessão até essa rota existir.
  protected readonly linkTodasStartups = '/hub-unagro#secao-startups';

  protected readonly semStartups = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há startups incubadas para mostrar.',
      'There are no incubated startups to show yet.',
    ]),
  );

  protected readonly tituloProjectos = computed(() =>
    this.traducao.getTraducao(['Projectos Inovadores', 'Innovative Projects']),
  );

  protected readonly descricaoProjectos = computed(() =>
    this.traducao.getTraducao([
      'Iniciativas em estágio de pesquisa que necessitam de apoio técnico ou financeiro para escala.',
      'Research-stage initiatives that need technical or financial support to scale up.',
    ]),
  );

  protected readonly semProjectos = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há projectos inovadores para mostrar.',
      'There are no innovative projects to show yet.',
    ]),
  );

  // Conteúdo estrutural da sessão: a Aceleradora é uma chamada de atenção da
  // própria secção, não um projecto que a API venha a servir.
  protected readonly tituloAceleradora = computed(() =>
    this.traducao.getTraducao(['Aceleradora de Impacto Social', 'Social Impact Accelerator']),
  );

  protected readonly descricaoAceleradora = computed(() =>
    this.traducao.getTraducao([
      'Fundo dedicado a projetos que beneficiam diretamente cooperativas de mulheres rurais no interior do país.',
      'A fund dedicated to projects that directly benefit rural women’s cooperatives in the country’s interior.',
    ]),
  );

  protected readonly textoAceleradora = computed(() =>
    this.traducao.getTraducao(['Explorar Iniciativas', 'Explore Initiatives']),
  );

  // TODO: `app.routes.ts` não tem listagem da Aceleradora nem detalhe de projectos
  // inovadores — as duas acções ficam na âncora da própria sessão até essas rotas
  // existirem.
  protected readonly linkAceleradora = '/hub-unagro#secao-projectos-inovadores';

  protected readonly tituloComoApoiar = computed(() =>
    this.traducao.getTraducao(['Como Apoiar', 'How to Support']),
  );

  protected readonly descricaoComoApoiar = computed(() =>
    this.traducao.getTraducao([
      'Escolha o seu caminho para impulsionar a soberania alimentar e a inovação tecnológica no campo.',
      'Choose your path to drive food sovereignty and technological innovation in the field.',
    ]),
  );

  protected readonly formasApoio = computed(() =>
    localizarProfundo(FORMAS_APOIO_BRUTAS, this.traducao.idioma()),
  );

  protected readonly semFormasApoio = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há formas de apoio para mostrar.',
      'There are no ways to support us to show yet.',
    ]),
  );

  protected readonly tituloAcompanhar = computed(() =>
    this.traducao.getTraducao(['Acompanhar Projectos', 'Follow Projects']),
  );

  protected readonly descricaoAcompanhar = computed(() =>
    this.traducao.getTraducao([
      'Receba atualizações mensais sobre o desempenho das startups, rodadas de investimento e novos editais de pesquisa.',
      'Get monthly updates on startup performance, investment rounds and new research calls.',
    ]),
  );

  protected readonly placeholderEmail = computed(() =>
    this.traducao.getTraducao(['seuemail@exemplo.com', 'youremail@example.com']),
  );

  protected readonly rotuloAssinar = computed(() =>
    this.traducao.getTraducao(['Assinar', 'Subscribe']),
  );

  protected readonly notaPrivacidade = computed(() =>
    this.traducao.getTraducao([
      'Respeitamos sua privacidade. Cancele a qualquer momento.',
      'We respect your privacy. Unsubscribe at any time.',
    ]),
  );

  protected readonly confirmacaoSubscricao = computed(() =>
    this.traducao.getTraducao([
      'Obrigado! Vai passar a receber as atualizações mensais no seu e-mail.',
      'Thank you! You will now receive the monthly updates by e-mail.',
    ]),
  );

  protected readonly estadoSubscricao = signal<EstadoSubscricao>('ocioso');

  protected readonly formularioSubscricao = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
  });

  // O `criarErrosFormulario` não serve aqui: injecta o `FormGroupDirective`, e a
  // classe da página não vive debaixo do `[formGroup]` do template. A mensagem passa
  // por input, e este sinal é o que faz o `computed` reagir ao estado do controlo.
  private readonly eventosEmail = toSignal(this.formularioSubscricao.controls.email.events);

  protected readonly erroEmail = computed(() => {
    this.eventosEmail();
    const controlo = this.formularioSubscricao.controls.email;
    if (!controlo.touched || controlo.valid) return null;

    return controlo.hasError('required')
      ? this.traducao.getTraducao(['Indique o seu e-mail.', 'Please enter your e-mail.'])
      : this.traducao.getTraducao(['E-mail inválido.', 'Invalid e-mail address.']);
  });

  protected subscrever(): void {
    if (this.formularioSubscricao.invalid) {
      this.formularioSubscricao.markAllAsTouched();
      return;
    }
    // TODO: falta o endpoint de subscrição — por agora só se confirma no ecrã.
    this.estadoSubscricao.set('enviado');
  }

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Unindo ciência de ponta e empreendedorismo para transformar o futuro da agricultura africana. Um ecossistema fértil para ideias que alimentam o mundo.',
      'Bringing together cutting-edge science and entrepreneurship to transform the future of African agriculture. A fertile ecosystem for ideas that feed the world.',
    ]),
  );
}
