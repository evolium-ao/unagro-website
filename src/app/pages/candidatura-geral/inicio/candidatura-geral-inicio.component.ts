import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { environment } from '../../../../environments/environment';
import { ErroApi } from '../../../core/api/erro-api';
import { TipoCandidatura } from '../../../core/modelos/candidatura-geral.model';
import { NovaDuvida } from '../../../core/modelos/duvida.model';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';
import { DuvidasService } from '../../../core/servicos/duvidas.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import {
  ID_MODAL_CONSULTAR_CANDIDATURA,
  ModalConsultarCandidaturaComponent,
} from '../componentes/modal-consultar-candidatura.component';
import { opcoesModalTipoCandidatura } from '../componentes/modal-tipo-candidatura.component';
import { SeletorDisciplinasComponent } from '../componentes/seletor-disciplinas.component';
import { LIMITES_DOSSIER_MB } from '../estado/candidatura-geral-estado.service';
import {
  DadosPartilhar,
  ID_MODAL_PARTILHAR,
  ModalPartilharComponent,
} from '../../../shared/componentes/modal-partilhar/modal-partilhar.component';
import { BannerDestaqueComponent } from '../../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoAvisoComponent } from '../../../shared/componentes/cartao-aviso/cartao-aviso.component';
import { CartaoRecursoComponent } from '../../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { CartaoRequisitoComponent } from '../../../shared/componentes/cartao-requisito/cartao-requisito.component';
import { ContadorRegressivoComponent } from '../../../shared/componentes/contador-regressivo/contador-regressivo.component';
import { ContainerPaginaComponent } from '../../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../shared/componentes/select-field-v2/select-field-v2';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/** `nome`/`email` do formulário de dúvidas levam o mesmo limite do `DuvidaRequest` da API. */
const MAXIMO_TEXTO_CURTO_DUVIDA = 255;
/** `pergunta` do `DuvidaRequest`: `minLength` 5, `maxLength` 2000. */
const MINIMO_PERGUNTA_DUVIDA = 5;
const MAXIMO_PERGUNTA_DUVIDA = 2000;

/** Primeira etapa do formulário — destino do hero e dos cartões de área. */
export const ROTA_ETAPA_1 = '/candidatura-geral/etapa-1';

/** Endereço público da convocatória que o botão de partilha divulga (o mesmo do modal de submissão). */
const LINK_CONVOCATORIA = new URL('/candidatura-geral', environment.siteUrl).href;

@Component({
  selector: 'app-candidatura-geral-inicio',
  imports: [
    BannerDestaqueComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoRequisitoComponent,
    CartaoAvisoComponent,
    SeletorDisciplinasComponent,
    FormsModule,
    ReactiveFormsModule,
    ContadorRegressivoComponent,
    IconeComponent,
    BotaoComponent,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    RevelarAoScrollDirective,
  ],
  templateUrl: './candidatura-geral-inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidaturaGeralInicioComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly router = inject(Router);
  private readonly modais = inject(AlertModalService);
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly duvidas = inject(DuvidasService);

  protected readonly rotaEtapa1 = ROTA_ETAPA_1;

  protected readonly destaquesVisao = this.conteudo.destaquesVisao;
  protected readonly areas = this.conteudo.areas;
  protected readonly criterios = this.conteudo.criterios;
  protected readonly passos = this.conteudo.passos;
  protected readonly documentos = this.conteudo.documentos;
  protected readonly prazo = this.conteudo.prazo;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      heroSelo: t('Fase provisória / Manifestação de interesse', 'Provisional stage / Expression of interest'),
      heroTitulo: t(
        'Docentes, investigadores, especialistas e equipa administrativa no sector do',
        'Lecturers, researchers, specialists and administrative staff in the',
      ),
      heroDestaque: t('agronegócio', 'agribusiness'),
      heroFim: t('', 'sector'),
      heroSubtitulo: t(
        'A AGROSOPHIA, Lda. procura docentes, investigadores, especialistas e equipa administrativa no sector do agronegócio para desenvolver um projecto institucional com sede no Icolo e Bengo (50km de Luanda) virado para o ensino superior e prática do agronegócio.',
        'AGROSOPHIA, Lda. is looking for lecturers, researchers, specialists and administrative staff in the agribusiness sector to develop an institutional project based in Icolo e Bengo (50km from Luanda) focused on higher education and agribusiness practice.',
      ),
      heroSeloPreferencia: t(
        'Os Mestres e Doutores serão preferenciados',
        'Masters and Doctors will be given preference',
      ),
      heroCandidatar: t('Candidatar-se', 'Apply'),
      heroConsultar: t('Consultar candidatura', 'Check application'),
      heroPartilhar: t('Partilhar convocatória', 'Share the call'),
      partilhaDescricao: t(
        'Ajude a divulgar esta oportunidade académica na sua rede profissional',
        'Help spread this academic opportunity across your professional network',
      ),
      partilhaTitulo: t('Recrutamento de docentes no agronegócio — AgroSophia', 'Agribusiness faculty recruitment — AgroSophia'),
      partilhaMensagem: t(
        'A AgroSophia está a recrutar docentes, investigadores, especialistas e equipa administrativa no sector do agronegócio. Candidate-se:',
        'AgroSophia is recruiting lecturers, researchers, specialists and administrative staff in the agribusiness sector. Apply here:',
      ),
      heroPrazo: t('Prazo até 15 de Novembro de 2026', 'Deadline 15 November 2026'),
      heroLogoAlt: t('Logótipo AgroSophia', 'AgroSophia logo'),
      parceirosTitulo: t(
        'Enquadramento institucional & cooperação científica',
        'Institutional framework & scientific cooperation',
      ),
      visaoRotulo: t('Visão institucional', 'Institutional vision'),
      visaoTitulo: t(
        'Construindo a Base Académica do Agronegócio Angolano',
        'Building the Academic Foundation of Angolan Agribusiness',
      ),
      visaoTexto: t(
        'Ao abrigo do Decreto Executivo n.º 337/22 (MESCTI), está aberto o concurso para constituição do corpo docente da nova IES no Polo da Quiminha.',
        'Under Executive Decree no. 337/22 (MESCTI), applications are open to build the faculty of the new higher education institution at the Quiminha campus.',
      ),
      disciplinaRotulo: t('Atribuição de cátedras & regência', 'Chair & course assignment'),
      disciplinaTitulo: t('Escolha a Disciplina a Leccionar', 'Choose the Course to Teach'),
      disciplinaDescricao: t(
        'Indique a unidade curricular de preferência para aceder aos módulos curriculares, perfil de competências e submeter a sua candidatura.',
        'Indicate your preferred course unit to access the curricular modules and competence profile, and submit your application.',
      ),
      disciplinaAvisoSelo: t('Atenção ao candidato', 'Note to applicants'),
      disciplinaAvisoTitulo: t('Seleccione a disciplina que pretende leccionar', 'Select the course you wish to teach'),
      disciplinaAvisoTexto: t(
        'Carregue os requisitos curriculares específicos por unidade curricular e submeta a sua intenção formal de regência e leccionação no concurso.',
        'Upload the specific curricular requirements for each course unit and submit your formal intention to lead and teach in the competition.',
      ),
      disciplinaRodape: t(
        'As disciplinas seleccionadas serão incorporadas no seu dossier de candidatura docente ao submeter.',
        'The selected courses will be included in your lecturer application dossier when you submit.',
      ),
      disciplinaConfirmar: t('Confirmar Selecção', 'Confirm Selection'),
      criteriosRotulo: t('Perfil do candidato & requisitos', 'Candidate profile & requirements'),
      criteriosTitulo: t('Critérios de Admissão e Qualificação', 'Admission and Qualification Criteria'),
      criteriosDescricao: t('Perfil técnico e rigor académico com vivência de campo.', 'Technical profile and academic rigour with field experience.'),
      passosRotulo: t('Fases do concurso', 'Selection stages'),
      passosTitulo: t('Fases do concurso', 'Contest phases'),
      passosDescricao: t(
        'Procedimento selectivo transparente, público e baseado no mérito comprovado.',
        'A transparent, public selection procedure based on proven merit.',
      ),
      documentosRotulo: t('Instrução do processo', 'Application file'),
      documentosTitulo: t('Documentos Obrigatórios da Candidatura', 'Mandatory Application Documents'),
      documentosDescricao: t(
        `Dossier unificado em PDF legível (máx. ${LIMITES_DOSSIER_MB.total}MB).`,
        `Single, legible PDF dossier (max. ${LIMITES_DOSSIER_MB.total}MB).`,
      ),
      prazoSelo: t('Prazo impreterível de submissão', 'Final submission deadline'),
      prazoTitulo: t('15 de Novembro de 2026 às 23h59', '15 November 2026 at 11:59 pm'),
      prazoTexto: t(
        'Horário Oficial de Luanda (GMT+1). Candidaturas recepcionadas após este termo serão integradas na bolsa suplementar de reserva curricular docente.',
        'Official Luanda time (GMT+1). Applications received after this deadline will join the supplementary faculty reserve pool.',
      ),
      prazoCandidatar: t('Candidatar-me agora', 'Apply now'),
      contador: {
        dias: t('Dias', 'Days'),
        horas: t('Horas', 'Hours'),
        minutos: t('Minutos', 'Minutes'),
        segundos: t('Segundos', 'Seconds'),
      },
      duvidasRotulo: t('Canal de esclarecimento & dúvidas', 'Clarification & questions channel'),
      duvidasTitulo: t(
        'Dúvidas sobre o Concurso de Candidatura?',
        'Questions about the Application Contest?',
      ),
      duvidasDescricao: t(
        'Tem alguma questão sobre o enquadramento, documentação necessária ou processo de submissão? Envie a sua pergunta directamente à Comissão Instaladora.',
        'Do you have a question about the framework, required documentation or submission process? Send it directly to the Installation Committee.',
      ),
      duvidasRotuloNome: t('Nome completo', 'Full name'),
      duvidasPlaceholderNome: t('Seu nome completo', 'Your full name'),
      duvidasRotuloEmail: t('Correio electrónico', 'E-mail address'),
      duvidasPlaceholderEmail: t('exemplo@dominio.ao', 'example@domain.ao'),
      duvidasRotuloAssunto: t('Assunto / Categoria', 'Subject / Category'),
      duvidasPlaceholderAssunto: t('Seleccione o tema…', 'Select a topic…'),
      duvidasOpcaoEnquadramento: t('Enquadramento e requisitos', 'Framework and requirements'),
      duvidasOpcaoDocumentacao: t('Documentação necessária', 'Required documentation'),
      duvidasOpcaoProcesso: t('Processo de submissão', 'Submission process'),
      duvidasOpcaoPrazos: t('Prazos e calendário', 'Deadlines and schedule'),
      duvidasOpcaoOutro: t('Outro assunto', 'Other subject'),
      duvidasTextoNovoAssunto: t('Adicionar assunto', 'Add subject'),
      duvidasDicaNovoAssunto: t(
        'Não encontra o assunto? Escreva-o na pesquisa para o adicionar.',
        'Can’t find the subject? Type it in the search box to add it.',
      ),
      duvidasRotuloMensagem: t('A sua pergunta / mensagem', 'Your question / message'),
      duvidasPlaceholderMensagem: t(
        'Descreva a sua dúvida de forma objectiva…',
        'Describe your question clearly…',
      ),
      duvidasEnviar: this.envioDuvida?.isPending()
        ? t('A enviar…', 'Sending…')
        : t('Enviar pergunta à comissão', 'Send question to the committee'),
      duvidasNota: t(
        'Tempo médio de resposta: até 48 horas úteis via correio electrónico.',
        'Average response time: within 48 business hours by e-mail.',
      ),
      duvidasTituloSucesso: t('Pergunta enviada', 'Question sent'),
      duvidasMensagemSucesso: t(
        'A sua pergunta foi enviada à Comissão Instaladora. Receberá a resposta por correio electrónico em até 48 horas úteis.',
        'Your question was sent to the Installation Committee. You will receive a reply by e-mail within 48 business hours.',
      ),
      duvidasErroNomeObrigatorio: t('Indique o seu nome.', 'Please enter your name.'),
      duvidasErroNomeTamanho: t(
        'O nome não pode ter mais de 255 caracteres.',
        'The name cannot be longer than 255 characters.',
      ),
      duvidasErroEmailObrigatorio: t('Indique o seu e-mail.', 'Please enter your e-mail.'),
      duvidasErroEmailTamanho: t(
        'O e-mail não pode ter mais de 255 caracteres.',
        'The e-mail cannot be longer than 255 characters.',
      ),
      duvidasErroEmailInvalido: t('E-mail inválido.', 'Invalid e-mail address.'),
      duvidasErroAssunto: t('Escolha um assunto.', 'Please choose a subject.'),
      duvidasErroMensagem: t('Escreva a sua pergunta.', 'Please write your question.'),
      duvidasErroMensagemCurta: t(
        `A pergunta tem de ter pelo menos ${MINIMO_PERGUNTA_DUVIDA} caracteres.`,
        `The question must be at least ${MINIMO_PERGUNTA_DUVIDA} characters long.`,
      ),
      duvidasErroGenerico: t(
        'Não foi possível enviar a pergunta. Tente novamente dentro de alguns instantes.',
        'Could not send the question. Please try again in a few moments.',
      ),
      duvidasErroSemLigacao: t(
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ),
    };
  });

  protected readonly selosHero = computed(() => [this.textos().heroSelo]);

  /** Contacto oficial da convocatória, mostrado no campo do hero. */
  protected readonly emailContacto = 'agrosophia@yahoo.com';

  /**
   * 3 sessão — `id`s das disciplinas adicionadas no `app-seletor-disciplinas`.
   * «Confirmar Seleção» leva-os à etapa 1, que os pré-preenche no formulário.
   */
  protected readonly disciplinasAdicionadas = signal<string[]>([]);

  /**
   * 8 sessão — canal de dúvidas sobre a candidatura, `POST /duvidas`. A documentação
   * da API declara `assunto` como enum fechado (`enquadramento`, `documentacao`,
   * `submissao`, `prazos`, `outro`, de `GET /duvidas/assuntos`), mas o servidor aceita
   * na prática qualquer valor — por isso o `permitirNovo` do select, como em
   * `tipo_interesse` de `ContatoRequest`.
   */
  protected readonly formularioDuvidas = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO_DUVIDA)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(MAXIMO_TEXTO_CURTO_DUVIDA)],
    }),
    assunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pergunta: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(MINIMO_PERGUNTA_DUVIDA),
        Validators.maxLength(MAXIMO_PERGUNTA_DUVIDA),
      ],
    }),
  });

  protected readonly envioDuvida = injectMutation<void, ErroApi, NovaDuvida>(() => ({
    mutationFn: (dados) => this.duvidas.criar(dados),
  }));

  /**
   * Categorias do canal de dúvidas — o enum fechado de `AssuntoDuvidaEnum`, conteúdo
   * estrutural fixo (muda tão pouco quanto os outros selects de
   * `candidatura-geral.service.ts`), não uma consulta à parte.
   */
  protected readonly opcoesAssuntoDuvida = computed<SelectOptionV2[]>(() => {
    const t = this.textos();
    return [
      { value: 'enquadramento', label: t.duvidasOpcaoEnquadramento },
      { value: 'documentacao', label: t.duvidasOpcaoDocumentacao },
      { value: 'submissao', label: t.duvidasOpcaoProcesso },
      { value: 'prazos', label: t.duvidasOpcaoPrazos },
      { value: 'outro', label: t.duvidasOpcaoOutro },
    ];
  });

  protected readonly erroDuvidaNome = this.sinalErroDuvida(this.formularioDuvidas.controls.nome, (erros) =>
    erros['required'] ? this.textos().duvidasErroNomeObrigatorio : this.textos().duvidasErroNomeTamanho,
  );

  protected readonly erroDuvidaEmail = this.sinalErroDuvida(this.formularioDuvidas.controls.email, (erros) => {
    if (erros['required']) return this.textos().duvidasErroEmailObrigatorio;
    if (erros['maxlength']) return this.textos().duvidasErroEmailTamanho;
    return this.textos().duvidasErroEmailInvalido;
  });

  protected readonly erroDuvidaAssunto = this.sinalErroDuvida(this.formularioDuvidas.controls.assunto, () =>
    this.textos().duvidasErroAssunto,
  );

  protected readonly erroDuvidaMensagem = this.sinalErroDuvida(this.formularioDuvidas.controls.pergunta, (erros) =>
    erros['minlength'] ? this.textos().duvidasErroMensagemCurta : this.textos().duvidasErroMensagem,
  );

  /** Mesma lógica de `contactos`: as mensagens de validação 422 do Laravel passam à frente do texto genérico. */
  protected readonly mensagemErroDuvida = computed(() => {
    const erro = this.envioDuvida.error();
    if (!erro) {
      return '';
    }
    const doServidor = Object.values(erro.errosValidacao).flat();
    if (doServidor.length) {
      return doServidor.join(' ');
    }
    if (erro.estado === 0) {
      return this.textos().duvidasErroSemLigacao;
    }
    return this.textos().duvidasErroGenerico;
  });

  /** "Consultar candidatura" do hero — modal com a pesquisa por código ou BI / passaporte. */
  protected abrirConsulta(): void {
    void this.modais.modal({
      id: ID_MODAL_CONSULTAR_CANDIDATURA,
      template: ModalConsultarCandidaturaComponent,
      tamanho: 'xgrande',
      temHeader: false,
      semBotoes: true,
    });
  }

  /**
   * Botão de partilha do hero: abre a folha de partilha nativa do dispositivo.
   * Onde o browser não a tem (Firefox de computador, Chrome em Linux), abre o
   * modal de partilha com o link e os botões de WhatsApp, LinkedIn, Telegram e Email.
   */
  protected async partilhar(): Promise<void> {
    if (!this.ehBrowser) {
      return;
    }
    const t = this.textos();
    const dados: ShareData = { title: t.partilhaTitulo, text: t.partilhaMensagem, url: LINK_CONVOCATORIA };
    if (navigator.share && (navigator.canShare?.(dados) ?? true)) {
      try {
        await navigator.share(dados);
      } catch {
        // Cancelado pelo utilizador (`AbortError`) ou recusado: nada a fazer.
      }
      return;
    }
    const data: DadosPartilhar = {
      titulo: t.heroPartilhar,
      descricao: t.partilhaDescricao,
      mensagem: t.partilhaMensagem,
      assunto: t.partilhaTitulo,
      url: LINK_CONVOCATORIA,
    };
    void this.modais.modal({
      id: ID_MODAL_PARTILHAR,
      template: ModalPartilharComponent,
      tamanho: 'medio',
      temHeader: false,
      semBotoes: true,
      data,
    });
  }

  /** Abre a etapa 1 com as disciplinas escolhidas em `?disciplinas=id1,id2`. */
  protected confirmarSelecao(): void {
    const ids = this.disciplinasAdicionadas();
    if (!ids.length) {
      return;
    }
    // As disciplinas só seguem para o docente; o administrativo não as escolhe.
    this.abrirEscolhaTipo((tipo) =>
      this.router.navigate([this.rotaEtapa1], {
        queryParams: tipo === 'DOCENTE' ? { disciplinas: ids.join(',') } : {},
      }),
    );
  }

  /** «Candidatar-se» / «Candidatar-me agora»: o modal pergunta o perfil e só então abre a etapa 1. */
  protected abrirEscolhaTipo(
    seguir: (tipo: TipoCandidatura) => unknown = () => this.router.navigateByUrl(this.rotaEtapa1),
  ): void {
    void this.modais.modal(opcoesModalTipoCandidatura({ aoEscolher: (tipo) => void seguir(tipo) }));
  }

  /** Submete o canal de dúvidas — mesmo padrão de `enviar()` de `contactos`, agora para `POST /duvidas`. */
  protected enviarDuvida(): void {
    if (this.envioDuvida.isPending()) {
      return;
    }
    if (this.formularioDuvidas.invalid) {
      this.formularioDuvidas.markAllAsTouched();
      return;
    }

    const valores = this.formularioDuvidas.getRawValue();

    this.envioDuvida.mutate(
      {
        nome: valores.nome,
        email: valores.email,
        assunto: valores.assunto,
        pergunta: valores.pergunta,
      },
      {
        onSuccess: () => {
          this.formularioDuvidas.reset({ nome: '', email: '', assunto: '', pergunta: '' });
          void this.modais.sucesso(this.textos().duvidasMensagemSucesso, this.textos().duvidasTituloSucesso);
        },
      },
    );
  }

  /**
   * O `criarErrosFormulario` injecta o `FormGroupDirective` e não serve numa classe de
   * página; este sinal por controlo é o mesmo padrão de `contactos` — reage ao
   * `touched` e à validade via `toSignal(controlo.events)`.
   */
  private sinalErroDuvida(controlo: FormControl<string>, mensagem: (erros: ValidationErrors) => string) {
    const eventos = toSignal(controlo.events);

    return computed(() => {
      eventos();
      if (!controlo.touched || controlo.valid) return null;
      return mensagem(controlo.errors ?? {});
    });
  }
}
