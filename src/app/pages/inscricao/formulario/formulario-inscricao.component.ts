import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursosService } from '../../../core/servicos/cursos.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
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
  ],
  templateUrl: './formulario-inscricao.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioInscricaoComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);
  private readonly cursosService = inject(CursosService);

  protected readonly passoAtual = signal(0);

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

  /** Opções do "Curso de interesse" — vêm das graduações do `CursosService`. */
  protected readonly opcoesCursos = computed<SelectOptionV2[]>(() =>
    this.cursosService.cursosGrau().map((curso) => ({ value: curso.id, label: curso.titulo })),
  );

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
    avancar: this.traducao.getTraducao(['Avançar para a revisão', 'Continue to review']),
  }));

  /**
   * Valida o passo 1 inteiro. Os passos 2 e 3 do indicador ainda não têm ecrã:
   * TODO — implementar quando o conteúdo desses passos estiver definido.
   */
  protected avancar(): void {
    for (const campo of CAMPOS_PASSO_UM) {
      this.formulario.get(campo)?.markAsTouched();
    }

    if (CAMPOS_PASSO_UM.some((campo) => this.formulario.get(campo)?.invalid)) {
      return;
    }
  }
}
