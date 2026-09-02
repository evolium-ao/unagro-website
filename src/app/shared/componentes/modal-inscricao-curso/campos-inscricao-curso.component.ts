import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { criarErrosFormulario } from '../../formulario/erros-formulario';
import { IconeComponent } from '../icone/icone.component';
import { FormFieldInputComponentV2, LeftIconDirective } from '../input-field/form-input-field';
import { FormFieldSelectComponentV2, SelectOptionV2 } from '../select-field-v2/select-field-v2';

/**
 * Campos da inscrição em curso de curta duração. Vive debaixo do `[formGroup]` do
 * `app-modal-inscricao-curso` — é essa a razão de ser um componente à parte: o
 * `criarErrosFormulario` precisa do `FormGroupDirective` do pai no injector.
 */
@Component({
  selector: 'app-campos-inscricao-curso',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    IconeComponent,
    LeftIconDirective,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form-input-field
    variante="minimalista"
      formControlName="nome"
      [label]="textos().nome"
      [placeholder]="textos().nomePlaceholder"
      [erro]="erros.nome()"
    >
      <app-icone leftIcon nome="users" [tamanho]="16" />
    </form-input-field>

    <div class="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <form-input-field
      variante="minimalista"
        formControlName="email"
        type="email"
        [label]="textos().email"
        [placeholder]="textos().emailPlaceholder"
        [erro]="erros.email()"
      >
        <app-icone leftIcon nome="mail" [tamanho]="16" />
      </form-input-field>

      <form-input-field
      variante="minimalista"
        formControlName="telefone"
        type="tel"
        [label]="textos().telefone"
        [placeholder]="textos().telefonePlaceholder"
        [erro]="erros.telefone()"
      >
        <app-icone leftIcon nome="phone" [tamanho]="16" />
      </form-input-field>
    </div>

    <!-- O field-select-v2 não tem slot de ícone: fica sem ícone à esquerda. -->
    <field-select-v2
      class="mt-4 block"
      formControlName="curso"
      [options]="cursos()"
      [label]="textos().curso"
      [placeholder]="textos().cursoPlaceholder"
      [erro]="erros.curso()"
    />
  `,
})
export class CamposInscricaoCursoComponent {
  /** Opções do "Curso desejado", já traduzidas pela página que abre o modal. */
  readonly cursos = input.required<SelectOptionV2[]>();

  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['nome', 'email', 'telefone', 'curso'] as const);

  protected readonly textos = computed(() => ({
    nome: this.traducao.getTraducao(['Nome completo', 'Full name']),
    nomePlaceholder: this.traducao.getTraducao(['Ex: João Silva', 'E.g. João Silva']),
    email: this.traducao.getTraducao(['E-mail', 'E-mail']),
    emailPlaceholder: this.traducao.getTraducao([
      'joao.silva@exemplo.com',
      'joao.silva@example.com',
    ]),
    telefone: this.traducao.getTraducao(['Telefone', 'Phone']),
    telefonePlaceholder: this.traducao.getTraducao(['+244 9XX XXX XXX', '+244 9XX XXX XXX']),
    curso: this.traducao.getTraducao(['Curso desejado', 'Desired course']),
    cursoPlaceholder: this.traducao.getTraducao(['Selecione um módulo...', 'Select a module...']),
  }));
}
