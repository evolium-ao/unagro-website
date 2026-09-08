import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../../core/api/erro-api';
import { cursosQueries } from '../../../core/consultas/cursos.queries';
import { traducaoQueries } from '../../../core/consultas/traducao.queries';
import { NovaCandidaturaAluno } from '../../../core/modelos/candidatura-aluno.model';
import { CandidaturaAlunosService } from '../../../core/servicos/candidatura-alunos.service';
import { CursosService } from '../../../core/servicos/cursos.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoAutomaticaService } from '../../../core/traducao/traducao-automatica.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { aplicarTraducaoTextos } from '../../../core/traducao/traduzir-campos';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { PassosFormularioComponent } from '../../../shared/componentes/passos-formulario/passos-formulario.component';
import { SelectOptionV2 } from '../../../shared/componentes/select-field-v2/select-field-v2';
import { validarTelefoneComIndicativo } from '../../../shared/formulario/validadores';
import { BlocoDadosPessoaisComponent } from './bloco-dados-pessoais.component';
import { BlocoFormacaoAcademicaComponent } from './bloco-formacao-academica.component';
import { BlocoMotivacaoDocumentosComponent } from './bloco-motivacao-documentos.component';

/** Certificado de habilitações: PDF até 5MB. */
const EXTENSOES_CERTIFICADO = ['pdf'];
const TAMANHO_MAXIMO_CERTIFICADO_MB = 5;

/** Campos validados no passo 1 — os passos 2 e 3 ainda não têm campos definidos. */
const CAMPOS_PASSO_UM = [
  'nome',
  'email',
  'telefone',
  'nascimento',
  'genero',
  'escola',
  'anoConclusao',
  'media',
  'curso',
  'motivacao',
  'certificado',
] as const;

@Component({
  selector: 'app-formulario-inscricao',
  imports: [
    ReactiveFormsModule,
    PassosFormularioComponent,
    BlocoDadosPessoaisComponent,
    BlocoFormacaoAcademicaComponent,
    BlocoMotivacaoDocumentosComponent,
    BotaoComponent,
    IconeComponent,
  ],
  templateUrl: './formulario-inscricao.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioInscricaoComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);
  private readonly cursosService = inject(CursosService);
  private readonly servicoTraducaoAutomatica = inject(TraducaoAutomaticaService);
  private readonly candidaturas = inject(CandidaturaAlunosService);

  protected readonly passoAtual = signal(0);
  protected readonly submetido = signal(false);

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarTelefoneComIndicativo],
    }),
    nascimento: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    genero: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    escola: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    anoConclusao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarAno],
    }),
    media: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    curso: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    motivacao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(30)],
    }),
    certificado: new FormControl<File | null>(null, {
      validators: [
        Validators.required,
        this.validacao.validarFicheiro(EXTENSOES_CERTIFICADO, TAMANHO_MAXIMO_CERTIFICADO_MB),
      ],
    }),
  });

  /** `GET /cursos` — as graduações que alimentam o "Curso de interesse". */
  private readonly consultaCursos = injectQuery(() => cursosQueries.lista(this.cursosService));

  /** A API só devolve português (ver `.claude/README.md`); os títulos das opções traduzem-se automaticamente. */
  private readonly titulosCursosOriginais = computed(() =>
    (this.consultaCursos.data() ?? []).map((curso) => curso.titulo),
  );

  private readonly consultaTraducaoCursos = injectQuery(() =>
    traducaoQueries.lista(
      this.servicoTraducaoAutomatica,
      this.titulosCursosOriginais(),
      this.traducao.idioma(),
    ),
  );

  /** Opções do "Curso de interesse" — vêm das graduações do `CursosService`. */
  protected readonly opcoesCursos = computed<SelectOptionV2[]>(() => {
    const titulos = aplicarTraducaoTextos(
      this.titulosCursosOriginais(),
      this.consultaTraducaoCursos.data(),
    );
    return (this.consultaCursos.data() ?? []).map((curso, indice) => ({
      value: curso.id,
      label: titulos[indice] ?? curso.titulo,
    }));
  });

  protected readonly rotulosPassos = computed(() => [
    this.traducao.getTraducao(['Dados pessoais', 'Personal details']),
    this.traducao.getTraducao(['Académico', 'Academic']),
    this.traducao.getTraducao(['Submissão', 'Submission']),
  ]);

  protected readonly textos = computed(() => ({
    progresso: this.traducao.getTraducao([
      'Progresso da candidatura',
      'Application progress',
    ]),
    // Os passos 2 e 3 do indicador ainda não têm ecrã próprio (ver TODO em `submeter`);
    // este botão já submete a candidatura, e não apenas avança para uma revisão.
    avancar: this.traducao.getTraducao(['Submeter candidatura', 'Submit application']),
    sucessoTitulo: this.traducao.getTraducao(['Candidatura submetida', 'Application submitted']),
    sucessoDescricao: this.traducao.getTraducao([
      'Recebemos a sua candidatura. A equipa de admissões entra em contacto por e-mail assim que concluir a avaliação.',
      'We have received your application. The admissions team will e-mail you as soon as the review is complete.',
    ]),
    sucessoBotao: this.traducao.getTraducao([
      'Submeter outra candidatura',
      'Submit another application',
    ]),
  }));

  /**
   * `POST /candidaturas/aluno` — endpoint público, sem `Authorization`. Não há
   * nada para invalidar a seguir: a lista de candidaturas da API pede
   * autenticação e o site nunca a lê.
   */
  protected readonly enviar = injectMutation<void, ErroApi, NovaCandidaturaAluno>(() => ({
    mutationFn: (dados) => this.candidaturas.criar(dados),
  }));

  /**
   * O que se mostra na faixa vermelha por baixo do formulário. Os 422 do
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

  /**
   * Valida o passo 1 (todos os campos que o formulário já recolhe hoje) e
   * submete a candidatura. Os passos 2 e 3 do indicador ainda não têm ecrã —
   * TODO: quando existirem (revisão, confirmação), este método passa a só
   * avançar, e a submissão real muda para o último passo, como em
   * `formulario-docente.component.ts`.
   */
  protected submeter(): void {
    if (this.enviar.isPending()) {
      return;
    }

    for (const campo of CAMPOS_PASSO_UM) {
      this.formulario.get(campo)?.markAsTouched();
    }

    if (CAMPOS_PASSO_UM.some((campo) => this.formulario.get(campo)?.invalid)) {
      return;
    }

    const valores = this.formulario.getRawValue();

    this.enviar.mutate(
      {
        nome: valores.nome,
        email: valores.email,
        telefone: valores.telefone,
        nascimento: valores.nascimento,
        genero: valores.genero,
        escola: valores.escola,
        anoConclusao: valores.anoConclusao,
        media: valores.media,
        curso: valores.curso,
        motivacao: valores.motivacao,
        certificado: valores.certificado,
      },
      // Só depois de a API confirmar é que o formulário dá lugar à confirmação.
      { onSuccess: () => this.submetido.set(true) },
    );
  }

  protected recomecar(): void {
    this.formulario.reset();
    this.submetido.set(false);
    this.enviar.reset();
  }
}
