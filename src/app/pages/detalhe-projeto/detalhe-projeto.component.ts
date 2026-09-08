import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { projetosQueries } from '../../core/consultas/projetos.queries';
import { traducaoQueries } from '../../core/consultas/traducao.queries';
import { MembroEquipa } from '../../core/modelos/membro-equipa.model';
import { PatrocinadoresService } from '../../core/servicos/patrocinadores.service';
import { ProjetosService } from '../../core/servicos/projetos.service';
import { ValidacaoService } from '../../core/servicos/Validacao.service';
import { TextoBilingue } from '../../core/traducao/texto-bilingue';
import { SeoService } from '../../core/seo/seo.service';
import { TraducaoAutomaticaService } from '../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { aplicarTraducao, aplicarTraducaoTextos, camposParaTraduzir } from '../../core/traducao/traduzir-campos';
import { BannerDestaqueComponent, MetadadoBanner } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoApoioComponent } from '../../shared/componentes/cartao-apoio/cartao-apoio.component';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { EtapaCronogramaComponent } from '../../shared/componentes/etapa-cronograma/etapa-cronograma.component';
import { FaixaPatrocinadoresComponent } from '../../shared/componentes/faixa-patrocinadores/faixa-patrocinadores.component';
import { CartaoTestemunhoComponent } from '../../shared/componentes/cartao-testemunho/cartao-testemunho.component';
import { GaleriaMosaicoComponent } from '../../shared/componentes/galeria-mosaico/galeria-mosaico.component';
import { FormFieldInputComponentV2 } from '../../shared/componentes/input-field/form-input-field';
import { ItemContactoComponent } from '../../shared/componentes/item-contacto/item-contacto.component';
import { ItemDocumentoComponent } from '../../shared/componentes/item-documento/item-documento.component';
import { FormFieldSelectComponentV2, SelectOptionV2 } from '../../shared/componentes/select-field-v2/select-field-v2';
import { ItemEstatisticaComponent } from '../../shared/componentes/item-estatistica/item-estatistica.component';
import { MembroEquipaComponent } from '../../shared/componentes/membro-equipa/membro-equipa.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Campos de texto traduzidos automaticamente quando o idioma não é português —
 * só os que a API dá mesmo (ver `ProjetosService`); os que ela não dá já saem
 * do serviço resolvidos no idioma certo, a partir do mock bilingue.
 */
const CAMPOS_TRADUZIVEIS_PROJETO = ['titulo', 'resumo', 'estado', 'areaTematica'] as const;

/**
 * Opções do campo "Tipo de Interessado". É conteúdo estrutural do formulário, não
 * uma lista que a API vá servir, por isso fica aqui e não em `core/dados`.
 */
const TIPOS_INTERESSADO: { valor: string; rotulo: TextoBilingue }[] = [
  { valor: 'investidor-parceiro', rotulo: ['Investidor / Parceiro', 'Investor / Partner'] },
  { valor: 'visita-tecnica', rotulo: ['Visita Técnica', 'Technical Visit'] },
  {
    valor: 'estudante-pos-graduacao',
    rotulo: ['Estudante de Pós-Graduação', 'Postgraduate Student'],
  },
  { valor: 'outro', rotulo: ['Outro', 'Other'] },
];

@Component({
  selector: 'app-detalhe-projeto',
  imports: [
    EspacoImagemComponent,
    ReactiveFormsModule,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoApoioComponent,
    CartaoRecursoComponent,
    ItemEstatisticaComponent,
    EtapaCronogramaComponent,
    FaixaPatrocinadoresComponent,
    GaleriaMosaicoComponent,
    MembroEquipaComponent,
    ItemDocumentoComponent,
    CartaoTestemunhoComponent,
    ItemContactoComponent,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    BotaoComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './detalhe-projeto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalheProjetoComponent {
  readonly id = input.required<string>();

  protected readonly traducao = inject(TraducaoService);
  private readonly projetosService = inject(ProjetosService);
  private readonly patrocinadoresService = inject(PatrocinadoresService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);
  private readonly seo = inject(SeoService);
  protected readonly validacao = inject(ValidacaoService);

  /**
   * Os ids da API são inteiros. Um id que não seja número não pode existir em
   * `GET /projectos/{id}` — nesse caso nem se chama a API, e o projecto fica
   * logo por "não encontrado" (mesmo padrão do `detalhe-noticia`).
   */
  private readonly idApi = computed(() => {
    const numero = Number(this.id());
    return Number.isInteger(numero) && numero > 0 ? numero : null;
  });

  protected readonly consultaProjeto = injectQuery(() => ({
    ...projetosQueries.porId(this.projetosService, this.idApi() ?? 0, this.traducao.idioma()),
    enabled: this.idApi() !== null,
  }));

  /**
   * A API só devolve português (ver `.claude/README.md`). Os campos que o
   * `ProjetosService` empresta ao mock (contexto, cronograma quando vazio,
   * galeria, documentos, testemunhos, contacto, …) já saem resolvidos no
   * idioma pedido — só os campos que vêm mesmo da API precisam desta tradução.
   */
  private readonly consultaTraducaoProjeto = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      camposParaTraduzir(
        this.consultaProjeto.data() ? [this.consultaProjeto.data()!] : [],
        CAMPOS_TRADUZIVEIS_PROJETO,
      ),
      this.traducao.idioma(),
    ),
  );

  /**
   * A equipa vem, ou toda da API (`funcao_no_projecto`, em português) ou toda
   * do mock (já resolvida no idioma certo pelo `ProjetosService`) — nunca
   * misturada dentro do mesmo projecto. Traduzir de novo um cargo que já veio
   * do mock é inofensivo em português (a tradução automática nem chega a
   * correr, `enabled: idioma !== 'pt'`) mas arriscaria um resultado estranho
   * em inglês nesse caso raro — registado em
   * `.claude/memory/integrar-recurso.md`.
   */
  private readonly cargosEquipaParaTraduzir = computed(
    () => this.consultaProjeto.data()?.equipa?.map((membro) => membro.cargo) ?? [],
  );

  private readonly consultaTraducaoEquipa = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      this.cargosEquipaParaTraduzir(),
      this.traducao.idioma(),
    ),
  );

  private readonly equipaTraduzida = computed<MembroEquipa[] | undefined>(() => {
    const equipa = this.consultaProjeto.data()?.equipa;
    if (!equipa) return undefined;
    const cargos = aplicarTraducaoTextos(
      this.cargosEquipaParaTraduzir(),
      this.consultaTraducaoEquipa.data(),
    );
    return equipa.map((membro, indice) => ({ ...membro, cargo: cargos[indice] ?? membro.cargo }));
  });

  protected readonly projeto = computed(() => {
    const dados = this.consultaProjeto.data();
    if (!dados) return undefined;
    const [traduzido] = aplicarTraducao(
      [dados],
      CAMPOS_TRADUZIVEIS_PROJETO,
      this.consultaTraducaoProjeto.data(),
    );
    return { ...traduzido, equipa: this.equipaTraduzida() ?? traduzido.equipa };
  });

  /** Enquanto o pedido corre ainda não se pode dizer que o projecto não existe. */
  protected readonly aCarregarProjeto = computed(
    () => this.idApi() !== null && this.consultaProjeto.isPending(),
  );

  /** Os selos e metadados do hero são dados do projecto, não frases fixas da página. */
  protected readonly selosHero = computed(() => {
    const estado = this.projeto()?.estado;
    return estado ? [estado] : [];
  });

  protected readonly metadadosHero = computed<MetadadoBanner[]>(() => {
    const projeto = this.projeto();
    if (!projeto) {
      return [];
    }
    return [
      { icone: 'map-pin', texto: projeto.local },
      { icone: 'calendar', texto: projeto.periodo },
      { icone: 'sprout', texto: projeto.areaTematica },
    ];
  });

  /** Rótulos fixos da secção de contexto — o conteúdo em si vem já traduzido do serviço. */
  protected readonly tituloContexto = computed(() =>
    this.traducao.getTraducao(['Contexto e Desafio', 'Context and Challenge']),
  );
  protected readonly legendaImagemContexto = computed(() =>
    this.traducao.getTraducao(['Fotografia do projecto', 'Project photograph']),
  );

  /** Rótulos fixos da secção de objectivos — os objectivos em si vêm do projecto. */
  protected readonly tituloObjetivos = computed(() =>
    this.traducao.getTraducao(['Objetivos do Projecto', 'Project Objectives']),
  );
  protected readonly tituloObjetivoGeral = computed(() =>
    this.traducao.getTraducao(['Objetivo Geral', 'Overall Objective']),
  );

  /** Rótulo fixo da secção da solução — os componentes dela vêm do projecto. */
  protected readonly tituloSolucao = computed(() =>
    this.traducao.getTraducao(['Solução Implementada', 'Implemented Solution']),
  );

  /** Rótulo fixo da secção do cronograma — as etapas em si vêm do projecto. */
  protected readonly tituloCronograma = computed(() =>
    this.traducao.getTraducao(['Cronograma do Projecto', 'Project Timeline']),
  );

  /** Rótulo fixo da secção da galeria — as fotografias e legendas vêm do projecto. */
  protected readonly tituloGaleria = computed(() =>
    this.traducao.getTraducao(['Galeria Multimédia', 'Media Gallery']),
  );

  /** Rótulo fixo da secção da equipa — os membros em si vêm do projecto. */
  protected readonly tituloEquipa = computed(() =>
    this.traducao.getTraducao(['Equipa do Projecto', 'Project Team']),
  );

  /**
   * Rótulo e lista da faixa de parceiros: institucional, não do projecto — vem do
   * serviço e não do `Projeto`, para a mesma lista servir esta página e a inicial.
   */
  protected readonly rotuloParceiros = computed(() =>
    this.traducao.getTraducao(['Parceiros Estratégicos', 'Strategic Partners']),
  );
  protected readonly patrocinadores = this.patrocinadoresService.patrocinadores;

  /** Rótulos fixos das duas colunas da sessão de documentos — o conteúdo vem do projecto. */
  protected readonly tituloDocumentos = computed(() =>
    this.traducao.getTraducao(['Documentos e Publicações', 'Documents and Publications']),
  );
  protected readonly tituloTestemunhos = computed(() =>
    this.traducao.getTraducao(['Testemunhos', 'Testimonials']),
  );

  /** Rótulos fixos do painel de contacto — só os valores vêm do projecto. */
  protected readonly tituloContacto = computed(() =>
    this.traducao.getTraducao(['Interessado no Projecto?', 'Interested in the Project?']),
  );
  protected readonly descricaoContacto = computed(() =>
    this.traducao.getTraducao([
      'Estamos abertos a novas parcerias, visitas técnicas e candidaturas de estudantes de pós-graduação.',
      'We are open to new partnerships, technical visits and applications from postgraduate students.',
    ]),
  );

  /**
   * Os três canais do painel verde: o ícone e o rótulo são interface, o valor é
   * dado do projecto. Sem `contacto` a lista fica vazia e a secção não se desenha.
   */
  protected readonly itensContacto = computed(() => {
    const contacto = this.projeto()?.contacto;
    if (!contacto) {
      return [];
    }
    return [
      {
        id: 'email',
        icone: 'mail',
        rotulo: this.traducao.getTraducao(['Email do líder de projecto', 'Project lead email']),
        valor: contacto.email,
      },
      {
        id: 'telefone',
        icone: 'phone',
        rotulo: this.traducao.getTraducao(['Telefone direto', 'Direct phone']),
        valor: contacto.telefone,
      },
      {
        id: 'localizacao',
        icone: 'map-pin',
        rotulo: this.traducao.getTraducao(['Localização de campo', 'Field location']),
        valor: contacto.localizacao,
      },
    ];
  });

  protected readonly rotuloNome = computed(() =>
    this.traducao.getTraducao(['Nome Completo', 'Full Name']),
  );
  protected readonly placeholderNome = computed(() =>
    this.traducao.getTraducao(['O seu nome', 'Your name']),
  );
  protected readonly rotuloEmail = computed(() => this.traducao.getTraducao(['Email', 'Email']));
  protected readonly placeholderEmail = computed(() =>
    this.traducao.getTraducao(['nome@dominio.com', 'name@domain.com']),
  );
  protected readonly rotuloTipoInteressado = computed(() =>
    this.traducao.getTraducao(['Tipo de Interessado', 'Type of Interest']),
  );
  protected readonly placeholderTipoInteressado = computed(() =>
    this.traducao.getTraducao(['Selecione uma opção', 'Select an option']),
  );
  protected readonly rotuloMensagem = computed(() =>
    this.traducao.getTraducao(['Mensagem', 'Message']),
  );
  protected readonly placeholderMensagem = computed(() =>
    this.traducao.getTraducao([
      'Descreva o seu interesse no projecto',
      'Describe your interest in the project',
    ]),
  );
  protected readonly rotuloEnviar = computed(() =>
    this.traducao.getTraducao(['ENVIAR MENSAGEM', 'SEND MESSAGE']),
  );
  protected readonly mensagemSucesso = computed(() =>
    this.traducao.getTraducao([
      'Mensagem enviada. A equipa do projecto entra em contacto em breve.',
      'Message sent. The project team will get in touch shortly.',
    ]),
  );

  /** O `field-select-v2` fala `SelectOptionV2`; os rótulos seguem o idioma activo. */
  protected readonly opcoesTipoInteressado = computed<SelectOptionV2[]>(() =>
    TIPOS_INTERESSADO.map((tipo) => ({
      value: tipo.valor,
      label: this.traducao.getTraducao(tipo.rotulo),
    })),
  );

  protected readonly estadoEnvio = signal<'ocioso' | 'enviando' | 'sucesso'>('ocioso');
  /**
   * O e-mail usa o `validarEmail` do `ValidacaoService` em vez do `Validators.email`
   * do Angular, que aceita endereços sem domínio de topo.
   */
  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    tipoInteressado: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const projeto = this.projeto();
      this.seo.definirTituloDinamico(projeto ? projeto.titulo : null);
    });
  }

  protected enviarMensagem(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estadoEnvio.set('enviando');
    // TODO: falta o endpoint de contacto do projecto — por agora só simula o envio.
    setTimeout(() => {
      this.estadoEnvio.set('sucesso');
      this.formulario.reset({ nome: '', email: '', tipoInteressado: '', mensagem: '' });
    }, 700);
  }
}
