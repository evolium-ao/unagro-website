import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../../core/api/erro-api';
import { NovaCandidaturaDocente } from '../../../core/modelos/candidatura-docente.model';
import { CandidaturaDocentesService } from '../../../core/servicos/candidatura-docentes.service';
import { DocenciaService } from '../../../core/servicos/docencia.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { PassosFormularioComponent } from '../../../shared/componentes/passos-formulario/passos-formulario.component';
import { PassoAcademicoComponent } from './passo-academico.component';
import { PassoDadosPessoaisComponent } from './passo-dados-pessoais.component';
import { PassoSubmissaoComponent } from './passo-submissao.component';

/** Ficheiro do CV: PDF até 5MB — o limite é o da API (`5120 kilobytes`), não uma escolha do site. */
const EXTENSOES_CV = ['pdf'];
const TAMANHO_MAXIMO_CV_MB = 5;

/** `maxLength` das colunas de texto curto do `CandidaturaRequest`. Vale a pena falhar aqui e não num 422. */
const MAXIMO_TEXTO_CURTO = 255;

/** Controlos validados em cada passo — o "Continuar" só avança se os seus estiverem válidos. */
const CAMPOS_POR_PASSO: readonly (readonly string[])[] = [
  ['nome', 'email', 'telefone', 'perfil'],
  ['titulacao', 'universidade', 'area'],
  ['linhasPesquisa', 'carta', 'curriculo'],
];

@Component({
  selector: 'app-formulario-docente',
  imports: [
    ReactiveFormsModule,
    PassosFormularioComponent,
    PassoDadosPessoaisComponent,
    PassoAcademicoComponent,
    PassoSubmissaoComponent,
    BotaoComponent,
    IconeComponent,
  ],
  templateUrl: './formulario-docente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioDocenteComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly validacao = inject(ValidacaoService);
  private readonly docencia = inject(DocenciaService);
  private readonly candidaturas = inject(CandidaturaDocentesService);

  protected readonly passoAtual = signal(0);
  protected readonly submetido = signal(false);

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        this.validacao.validarEmail,
        Validators.maxLength(MAXIMO_TEXTO_CURTO),
      ],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [this.validacao.validarTelefone, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    perfil: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    titulacao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    universidade: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    area: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    linhasPesquisa: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(30)],
    }),
    carta: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(30)],
    }),
    curriculo: new FormControl<File | null>(null, {
      validators: [
        Validators.required,
        this.validacao.validarFicheiro(EXTENSOES_CV, TAMANHO_MAXIMO_CV_MB),
      ],
    }),
  });

  protected readonly titulacoes = computed(() =>
    this.docencia.titulacoes().map(({ id, rotulo }) => ({ value: id, label: rotulo })),
  );

  protected readonly rotulosPassos = computed(() => [
    this.traducao.getTraducao(['Dados pessoais', 'Personal details']),
    this.traducao.getTraducao(['Académico', 'Academic']),
    this.traducao.getTraducao(['Submissão', 'Submission']),
  ]);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Inicie a sua Candidatura', 'Start your Application']),
    subtitulo: this.traducao.getTraducao([
      'Preencha o formulário abaixo para submeter o seu perfil académico à avaliação inicial.',
      'Fill in the form below to submit your academic profile for initial review.',
    ]),
    botaoVoltar: this.traducao.getTraducao(['Voltar', 'Back']),
    botaoContinuar: this.traducao.getTraducao(['Continuar', 'Continue']),
    botaoSubmeter: this.traducao.getTraducao(['Submeter candidatura', 'Submit application']),
    sucessoTitulo: this.traducao.getTraducao(['Candidatura submetida', 'Application submitted']),
    sucessoDescricao: this.traducao.getTraducao([
      'Recebemos o seu perfil. A equipa de RH Académico entra em contacto por e-mail assim que concluir a avaliação inicial.',
      'We have received your profile. The Academic HR team will e-mail you as soon as the initial review is complete.',
    ]),
    sucessoBotao: this.traducao.getTraducao([
      'Submeter outra candidatura',
      'Submit another application',
    ]),
  }));

  /**
   * `POST /candidaturas` — endpoint público, sem `Authorization`. Não há nada
   * para invalidar a seguir: a lista de candidaturas da API pede autenticação e o
   * site nunca a lê.
   */
  protected readonly enviar = injectMutation<void, ErroApi, NovaCandidaturaDocente>(() => ({
    mutationFn: (dados) => this.candidaturas.criar(dados),
  }));

  /**
   * O que se mostra na faixa vermelha por baixo do último passo. Os 422 do
   * Laravel trazem a mensagem por campo e chegam **só em português** — a API é
   * monolingue —, mas dizem exactamente o que está errado, por isso passam à
   * frente do texto genérico.
   */
  protected readonly mensagemErro = computed(() => {
    const erro = this.enviar.error();
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
      'Não foi possível submeter a candidatura. Tente novamente dentro de alguns instantes.',
      'Could not submit the application. Please try again in a few moments.',
    ]);
  });

  protected readonly noUltimoPasso = computed(
    () => this.passoAtual() === CAMPOS_POR_PASSO.length - 1,
  );

  protected avancar(): void {
    if (!this.validarPassoAtual()) {
      return;
    }
    this.passoAtual.update((passo) => Math.min(passo + 1, CAMPOS_POR_PASSO.length - 1));
  }

  protected recuar(): void {
    this.passoAtual.update((passo) => Math.max(passo - 1, 0));
  }

  protected submeter(): void {
    if (this.enviar.isPending()) {
      return;
    }

    if (!this.validarPassoAtual() || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    this.enviar.mutate(
      {
        nome: valores.nome,
        email: valores.email,
        telefone: valores.telefone,
        perfil: valores.perfil,
        // O select guarda o `id` da titulação; a API guarda texto livre, em português.
        titulacao: this.docencia.rotuloTitulacaoEmPortugues(valores.titulacao),
        universidade: valores.universidade,
        area: valores.area,
        linhasPesquisa: valores.linhasPesquisa,
        carta: valores.carta,
        curriculo: valores.curriculo,
      },
      // Só depois de a API confirmar é que o formulário dá lugar à confirmação.
      { onSuccess: () => this.submetido.set(true) },
    );
  }

  protected recomecar(): void {
    this.formulario.reset();
    this.passoAtual.set(0);
    this.submetido.set(false);
    this.enviar.reset();
  }

  /** Marca só os campos do passo como tocados, para não pintar de vermelho o que ainda não foi visto. */
  private validarPassoAtual(): boolean {
    const campos = CAMPOS_POR_PASSO[this.passoAtual()];
    for (const campo of campos) {
      this.formulario.get(campo)?.markAsTouched();
    }
    return campos.every((campo) => this.formulario.get(campo)?.valid !== false);
  }
}
