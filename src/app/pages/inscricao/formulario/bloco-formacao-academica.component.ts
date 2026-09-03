import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../shared/formulario/erros-formulario';

/** Bloco 2 do formulário de inscrição — percurso escolar e curso pretendido. */
@Component({
  selector: 'app-inscricao-formacao-academica',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco [titulo]="textos().bloco" />

    <div class="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-3">
      <form-input-field
        formControlName="escola"
        variante="minimalista"
        [label]="textos().escola"
        [placeholder]="textos().escolaPlaceholder"
        [erro]="erros.escola()" />

      <form-input-field
        formControlName="anoConclusao"
        variante="minimalista"
        [label]="textos().anoConclusao"
        [placeholder]="textos().anoConclusaoPlaceholder"
        [erro]="erros.anoConclusao()" />

      <form-input-field
        formControlName="media"
        variante="minimalista"
        [label]="textos().media"
        [placeholder]="textos().mediaPlaceholder"
        [erro]="erros.media()" />
    </div>

    <div class="mt-2">
      <field-select-v2
        formControlName="curso"
        variante="minimalista"
        [label]="textos().curso"
        [placeholder]="textos().cursoPlaceholder"
        [options]="cursos()"
        [searchable]="true"
        [erro]="erros.curso()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocoFormacaoAcademicaComponent {
  private readonly traducao = inject(TraducaoService);

  /** Cursos de graduação, já vindos do `CursosService` pela página. */
  readonly cursos = input<SelectOptionV2[]>([]);

  protected readonly erros = criarErrosFormulario([
    'escola',
    'anoConclusao',
    'media',
    'curso',
  ] as const);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Formação Académica', 'Academic Background']),
    escola: this.traducao.getTraducao([
      'Escola de origem (ensino médio)',
      'Previous school (secondary)',
    ]),
    escolaPlaceholder: this.traducao.getTraducao([
      'Nome da instituição',
      'Name of the institution',
    ]),
    anoConclusao: this.traducao.getTraducao(['Ano de conclusão', 'Year of completion']),
    anoConclusaoPlaceholder: this.traducao.getTraducao(['AAAA', 'YYYY']),
    media: this.traducao.getTraducao(['Média final', 'Final grade']),
    mediaPlaceholder: this.traducao.getTraducao(['Ex: 16,5', 'E.g. 16.5']),
    curso: this.traducao.getTraducao(['Curso de interesse', 'Course of interest']),
    cursoPlaceholder: this.traducao.getTraducao([
      'Selecione uma graduação...',
      'Select a degree...',
    ]),
  }));
}
