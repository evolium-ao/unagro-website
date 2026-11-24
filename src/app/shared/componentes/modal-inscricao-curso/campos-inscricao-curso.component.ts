import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { criarErrosFormulario } from '../../formulario/erros-formulario';
import { IconeComponent } from '../icone/icone.component';
import { FormFieldInputComponentV2, LeftIconDirective } from '../input-field/form-input-field';

/**
 * Campos da inscrição em curso de curta duração. Vive debaixo do `[formGroup]` do
 * `app-modal-inscricao-curso` — é essa a razão de ser um componente à parte: o
 * `criarErrosFormulario` precisa do `FormGroupDirective` do pai no injector.
 */
@Component({
  selector: 'app-campos-inscricao-curso',
  imports: [ReactiveFormsModule, FormFieldInputComponentV2, IconeComponent, LeftIconDirective],
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

    <!-- Sem select: o curso já vem escolhido do cartão clicado, só se confirma aqui. -->
    <div class="mt-4">
      <span class="block text-sm font-medium text-text-secondary">{{ textos().curso }}</span>
      <p class="mt-1 text-base font-semibold text-primary-deep">{{ tituloCurso() }}</p>
    </div>
  `,
})
export class CamposInscricaoCursoComponent {
  /** Título do curso escolhido no cartão — mostrado como confirmação, não editável. */
  readonly tituloCurso = input.required<string>();

  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['nome', 'email', 'telefone'] as const);

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
    curso: this.traducao.getTraducao(['Curso seleccionado', 'Selected course']),
  }));
}
