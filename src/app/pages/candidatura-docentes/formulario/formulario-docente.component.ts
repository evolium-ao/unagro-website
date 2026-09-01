import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenciaService } from '../../../core/servicos/docencia.service';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { PassosFormularioComponent } from '../../../shared/componentes/passos-formulario/passos-formulario.component';
import { PassoAcademicoComponent } from './passo-academico.component';
import { PassoDadosPessoaisComponent } from './passo-dados-pessoais.component';
import { PassoSubmissaoComponent } from './passo-submissao.component';

/** Ficheiro do CV: PDF até 10MB. */
const EXTENSOES_CV = ['pdf'];
const TAMANHO_MAXIMO_CV_MB = 10;

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

  protected readonly passoAtual = signal(0);
  protected readonly submetido = signal(false);

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    telefone: new FormControl('', { nonNullable: true, validators: [this.validacao.validarTelefone] }),
    perfil: new FormControl('', { nonNullable: true }),
    titulacao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    universidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    area: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
    if (!this.validarPassoAtual() || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Sem backend ainda: a candidatura fica no estado submetido para o utilizador ver a confirmação.
    this.submetido.set(true);
  }

  protected recomecar(): void {
    this.formulario.reset();
    this.passoAtual.set(0);
    this.submetido.set(false);
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
