import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../core/api/erro-api';
import { NovoContacto } from '../../core/modelos/contacto.model';
import { ContatosService } from '../../core/servicos/contatos.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AlertModalService } from '../../shared/componentes/alert-modal/alert-modal.service';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { FormFieldInputComponentV2 } from '../../shared/componentes/input-field/form-input-field';
import { ItemDetalheBarraComponent } from '../../shared/componentes/item-detalhe-barra/item-detalhe-barra.component';
import { ItemInformacaoComponent } from '../../shared/componentes/item-informacao/item-informacao.component';
import { MapaGoogleComponent } from '../../shared/componentes/mapa-google/mapa-google.component';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../shared/componentes/select-field-v2/select-field-v2';
import { OpcaoSeletor } from '../../shared/componentes/seletor/seletor.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/** `nome`/`email` levam `maxLength: 255` no `ContatoRequest`; validado também aqui, para poupar uma ida ao servidor. */
const MAXIMO_TEXTO_CURTO = 255;

interface InformacaoBruta {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/**
 * Conteúdo estrutural da sessão "Uma Ponte para o Futuro do Campo" — duas notas fixas
 * que acompanham o texto, e não uma lista que a API venha a servir; por isso fica aqui,
 * como as `VANTAGENS_BRUTAS` de `formacoes`.
 */
const INFORMACOES_BRUTAS: InformacaoBruta[] = [
  {
    id: 'localizacao-central',
    icone: 'map-pin',
    titulo: { pt: 'Localização Central', en: 'Central Location' },
    descricao: {
      pt: 'Luanda, Angola — o coração pulsante do agronegócio.',
      en: 'Luanda, Angola — the beating heart of agribusiness.',
    },
  },
  {
    id: 'presenca-regional',
    icone: 'globe',
    titulo: { pt: 'Presença Regional', en: 'Regional Presence' },
    descricao: {
      pt: 'Extensões em 4 províncias estratégicas.',
      en: 'Branches in 4 strategic provinces.',
    },
  },
];

/** Coordenadas do campus, partilhadas pelo mapa embutido e pela ligação ao Google Maps. */
const LATITUDE_CAMPUS = -8.839;
const LONGITUDE_CAMPUS = 13.2354;

interface DetalheLocalizacaoBruto {
  id: string;
  rotulo: TextoTraduzido;
  valor: TextoTraduzido;
}

/**
 * Conteúdo estrutural da sessão "Nossa Localização" — a morada e as coordenadas da
 * instituição, fixas, e não uma lista que a API venha a servir; fica aqui como as
 * `INFORMACOES_BRUTAS` da sessão anterior.
 */
const DETALHES_LOCALIZACAO_BRUTOS: DetalheLocalizacaoBruto[] = [
  {
    id: 'endereco-principal',
    rotulo: { pt: 'Endereço Principal', en: 'Main Address' },
    valor: {
      pt: 'Província do Bengo, polo industrial Quiminha',
      en: 'Bengo Province, Quiminha industrial hub',
    },
  },
  {
    id: 'coordenadas-gps',
    rotulo: { pt: 'Coordenadas GPS', en: 'GPS Coordinates' },
    valor: { pt: '8.8390° S, 13.2354° E', en: '8.8390° S, 13.2354° E' },
  },
];

@Component({
  selector: 'app-contactos',
  imports: [
    ReactiveFormsModule,
    BannerDestaqueComponent,
    BotaoComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    IconeComponent,
    ItemDetalheBarraComponent,
    ItemInformacaoComponent,
    MapaGoogleComponent,
    SeloComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './contactos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactosComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly contatos = inject(ContatosService);
  private readonly modais = inject(AlertModalService);

  /**
   * `POST /contatos` — endpoint público, sem `Authorization`. Não há nada para
   * invalidar a seguir: a lista de contactos da API pede autenticação e o site
   * nunca a lê.
   */
  protected readonly envio = injectMutation<void, ErroApi, NovoContacto>(() => ({
    mutationFn: (dados) => this.contatos.criar(dados),
  }));

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Entre em', 'Get in']),
  );

  protected readonly tituloDestaqueHero = computed(() =>
    this.traducao.getTraducao(['Contacto', 'Touch']),
  );

  protected readonly tituloFimHero = computed(() =>
    this.traducao.getTraducao(['com a Excelência', 'with Excellence']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Estamos aqui para apoiar a sua jornada académica e profissional no agronegócio. Escolha o canal mais adequado à sua necessidade.',
      'We are here to support your academic and professional journey in agribusiness. Choose the channel that best suits your needs.',
    ]),
  );

  protected readonly opcoesAssunto = computed<OpcaoSeletor[]>(() => [
    { valor: 'geral', rotulo: this.traducao.t('paginas.contactos.assuntoGeral') },
    { valor: 'candidaturas', rotulo: this.traducao.t('paginas.contactos.assuntoCandidaturas') },
    { valor: 'cursos', rotulo: this.traducao.t('paginas.contactos.assuntoCursos') },
    { valor: 'imprensa', rotulo: this.traducao.t('paginas.contactos.assuntoImprensa') },
  ]);

  /** O `field-select-v2` fala `SelectOptionV2`; as opções continuam a viver no `opcoesAssunto`. */
  protected readonly opcoesAssuntoSelect = computed<SelectOptionV2[]>(() =>
    this.opcoesAssunto().map((opcao) => ({ value: opcao.valor, label: opcao.rotulo })),
  );

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    assunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly erroNome = this.sinalErro(this.formulario.controls.nome, (erros) =>
    erros['required']
      ? this.traducao.getTraducao(['Indique o seu nome.', 'Please enter your name.'])
      : this.traducao.getTraducao([
        'O nome não pode ter mais de 255 caracteres.',
        'The name cannot be longer than 255 characters.',
      ]),
  );

  protected readonly erroEmail = this.sinalErro(this.formulario.controls.email, (erros) => {
    if (erros['required']) {
      return this.traducao.getTraducao(['Indique o seu e-mail.', 'Please enter your e-mail.']);
    }
    if (erros['maxlength']) {
      return this.traducao.getTraducao([
        'O e-mail não pode ter mais de 255 caracteres.',
        'The e-mail cannot be longer than 255 characters.',
      ]);
    }
    return this.traducao.getTraducao(['E-mail inválido.', 'Invalid e-mail address.']);
  });

  protected readonly erroAssunto = this.sinalErro(this.formulario.controls.assunto, () =>
    this.traducao.getTraducao(['Escolha um assunto.', 'Please choose a subject.']),
  );

  protected readonly erroMensagem = this.sinalErro(this.formulario.controls.mensagem, () =>
    this.traducao.getTraducao(['Escreva a sua mensagem.', 'Please write your message.']),
  );

  protected readonly tituloFormulario = computed(() =>
    this.traducao.getTraducao(['Envie-nos uma Mensagem', 'Send Us a Message']),
  );

  protected readonly rotuloNome = computed(() =>
    this.traducao.getTraducao(['Nome Completo', 'Full Name']),
  );

  protected readonly placeholderNome = computed(() =>
    this.traducao.getTraducao(['Ex: João Manuel', 'E.g. João Manuel']),
  );

  protected readonly rotuloEmail = computed(() => this.traducao.getTraducao(['E-mail', 'E-mail']));

  protected readonly placeholderEmail = computed(() =>
    this.traducao.getTraducao(['nome@exemplo.com', 'name@example.com']),
  );

  protected readonly rotuloAssunto = computed(() =>
    this.traducao.getTraducao(['Assunto', 'Subject']),
  );

  protected readonly placeholderAssunto = computed(() =>
    this.traducao.getTraducao(['Escolha o assunto', 'Choose a subject']),
  );

  /** permitirNovo: o assunto pode não estar na lista — ver `disciplina` na candidatura geral. */
  protected readonly textoNovoAssunto = computed(() =>
    this.traducao.getTraducao(['Adicionar assunto', 'Add subject']),
  );

  protected readonly dicaNovoAssunto = computed(() =>
    this.traducao.getTraducao([
      'Não encontra o assunto? Escreva-o na pesquisa para o adicionar.',
      'Can’t find the subject? Type it in the search box to add it.',
    ]),
  );

  protected readonly rotuloMensagem = computed(() =>
    this.traducao.getTraducao(['Mensagem', 'Message']),
  );

  protected readonly placeholderMensagem = computed(() =>
    this.traducao.getTraducao(['Como podemos ajudar?', 'How can we help?']),
  );

  protected readonly rotuloEnviar = computed(() =>
    this.envio.isPending()
      ? this.traducao.getTraducao(['A enviar…', 'Sending…'])
      : this.traducao.getTraducao(['Enviar Mensagem', 'Send Message']),
  );

  protected readonly tituloSucesso = computed(() =>
    this.traducao.getTraducao(['Mensagem enviada', 'Message sent']),
  );

  protected readonly mensagemSucesso = computed(() =>
    this.traducao.getTraducao([
      'Mensagem enviada. A nossa equipa responderá dentro de instantes.',
      'Message sent. Our team will respond shortly.',
    ]),
  );

  /**
   * O que se mostra na faixa vermelha do formulário. Os 422 do Laravel trazem a
   * mensagem por campo e chegam **só em português** — a API é monolingue —, mas
   * dizem exactamente o que está errado, por isso passam à frente do texto
   * genérico (mesmo padrão do `app-modal-inscricao-curso`).
   */
  protected readonly mensagemErro = computed(() => {
    const erro = this.envio.error();
    if (!erro) {
      return '';
    }

    const doServidor = Object.values(erro.errosValidacao).flat();
    if (doServidor.length) {
      return doServidor.join(' ');
    }

    if (erro.estado === 0) {
      return this.traducao.getTraducao([
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ]);
    }

    return this.traducao.getTraducao([
      'Não foi possível enviar a mensagem. Tente novamente dentro de alguns instantes.',
      'Could not send the message. Please try again in a few moments.',
    ]);
  });

  protected readonly etiquetaPonte = computed(() =>
    this.traducao.getTraducao(['Excelência Académica', 'Academic Excellence']),
  );

  protected readonly tituloPonte = computed(() =>
    this.traducao.getTraducao([
      'Uma Ponte para o Futuro do Campo',
      'A Bridge to the Future of the Countryside',
    ]),
  );

  protected readonly descricaoPonte = computed(() =>
    this.traducao.getTraducao([
      'Na UNAGRO, acreditamos que a comunicação aberta é a semente do progresso. Seja um futuro estudante, um investigador ou um parceiro institucional, a nossa equipa está pronta para dar as informações necessárias para cultivar o seu sucesso.',
      'At UNAGRO, we believe that open communication is the seed of progress. Whether you are a future student, a researcher or an institutional partner, our team is ready to provide the information you need to cultivate your success.',
    ]),
  );

  protected readonly informacoes = computed(() =>
    localizarProfundo(INFORMACOES_BRUTAS, this.traducao.idioma()),
  );

  protected readonly semInformacoes = computed(() =>
    this.traducao.getTraducao(['Nada a mostrar.', 'Nothing to show.']),
  );

  protected readonly latitudeCampus = LATITUDE_CAMPUS;
  protected readonly longitudeCampus = LONGITUDE_CAMPUS;

  /** Ligação de consulta do Google Maps — abre a ficha do sítio nas mesmas coordenadas. */
  protected readonly linkGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${LATITUDE_CAMPUS},${LONGITUDE_CAMPUS}`;

  protected readonly tituloLocalizacao = computed(() =>
    this.traducao.getTraducao(['Nossa Localização', 'Our Location']),
  );

  protected readonly tituloMapa = computed(() =>
    this.traducao.getTraducao([
      'Mapa da localização da UNAGRO',
      'Map of the UNAGRO location',
    ]),
  );

  protected readonly textoAbrirMapa = computed(() =>
    this.traducao.getTraducao(['Abrir no Google Maps', 'Open in Google Maps']),
  );

  protected readonly detalhesLocalizacao = computed(() =>
    localizarProfundo(DETALHES_LOCALIZACAO_BRUTOS, this.traducao.idioma()),
  );

  protected enviar(): void {
    if (this.envio.isPending()) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    this.envio.mutate(
      {
        nome: valores.nome,
        email: valores.email,
        assunto: valores.assunto,
        mensagem: valores.mensagem,
      },
      {
        // Mesmo padrão dos modais de inscrição: a confirmação é o modal de sucesso
        // partilhado, não texto solto no formulário.
        onSuccess: () => {
          this.formulario.reset({ nome: '', email: '', assunto: '', mensagem: '' });
          void this.modais.sucesso(this.mensagemSucesso(), this.tituloSucesso());
        },
      },
    );
  }

  /**
   * O `criarErrosFormulario` injecta o `FormGroupDirective` e não serve numa classe de
   * página; este sinal por controlo é o que faz o `computed` reagir ao `touched` e à
   * validade. Chamado num inicializador de campo, logo ainda em contexto de injecção.
   */
  private sinalErro(controlo: FormControl<string>, mensagem: (erros: ValidationErrors) => string) {
    const eventos = toSignal(controlo.events);

    return computed(() => {
      eventos();
      if (!controlo.touched || controlo.valid) return null;
      return mensagem(controlo.errors ?? {});
    });
  }
}
