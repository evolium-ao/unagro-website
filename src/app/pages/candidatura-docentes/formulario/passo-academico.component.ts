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

/** Passo 2 — habilitações do candidato. */
@Component({
  selector: 'app-passo-academico',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco [titulo]="textos().bloco" />

    <div class="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      <field-select-v2
        formControlName="titulacao"
        variante="minimalista"
        [options]="titulacoes()"
        [label]="textos().titulacao"
        [placeholder]="textos().titulacaoPlaceholder"
        [erro]="erros.titulacao()" />

      <form-input-field
        formControlName="universidade"
        variante="minimalista"
        [label]="textos().universidade"
        [placeholder]="textos().universidadePlaceholder"
        [erro]="erros.universidade()" />

      <div class="sm:col-span-2">
        <form-input-field
          formControlName="area"
          variante="minimalista"
          [label]="textos().area"
          [placeholder]="textos().areaPlaceholder"
          [erro]="erros.area()" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassoAcademicoComponent {
  readonly titulacoes = input<SelectOptionV2[]>([]);

  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['titulacao', 'universidade', 'area'] as const);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Formação Académica', 'Academic Background']),
    titulacao: this.traducao.getTraducao(['Maior titulação', 'Highest degree']),
    titulacaoPlaceholder: this.traducao.getTraducao([
      'Selecione a sua titulação…',
      'Select your degree…',
    ]),
    universidade: this.traducao.getTraducao(['Universidade de origem', 'Awarding university']),
    universidadePlaceholder: this.traducao.getTraducao([
      'Instituição onde obteve o título',
      'Institution that awarded the degree',
    ]),
    area: this.traducao.getTraducao(['Área de estudo principal', 'Main field of study']),
    areaPlaceholder: this.traducao.getTraducao([
      'Ex: Genética Vegetal, Economia Agrária…',
      'E.g. Plant Genetics, Agricultural Economics…',
    ]),
  }));
}
