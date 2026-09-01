import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import { TituloBlocoComponent } from '../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../shared/formulario/erros-formulario';

/** Passo 1 — identificação do candidato. */
@Component({
  selector: 'app-passo-dados-pessoais',
  imports: [ReactiveFormsModule, FormFieldInputComponentV2, TituloBlocoComponent],
  // Herda o `formGroup` do formulário pai: os `formControlName` resolvem sem o repetir.
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco [titulo]="textos().bloco" />

    <div class="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      <form-input-field
        formControlName="nome"
        variante="minimalista"
        [label]="textos().nome"
        [placeholder]="textos().nomePlaceholder"
        [erro]="erros.nome()" />

      <form-input-field
        formControlName="email"
        type="email"
        variante="minimalista"
        [label]="textos().email"
        [placeholder]="textos().emailPlaceholder"
        [erro]="erros.email()" />

      <form-input-field
        formControlName="telefone"
        type="tel"
        variante="minimalista"
        [optional]="true"
        [textoOpcional]="textos().opcional"
        [label]="textos().telefone"
        [placeholder]="textos().telefonePlaceholder"
        [erro]="erros.telefone()" />

      <form-input-field
        formControlName="perfil"
        type="url"
        variante="minimalista"
        [optional]="true"
        [textoOpcional]="textos().opcional"
        [label]="textos().perfil"
        [placeholder]="textos().perfilPlaceholder" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassoDadosPessoaisComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['nome', 'email', 'telefone'] as const);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Informações Pessoais', 'Personal Information']),
    nome: this.traducao.getTraducao(['Nome completo', 'Full name']),
    nomePlaceholder: this.traducao.getTraducao(['Dr. Nome Sobrenome', 'Dr. First Last']),
    email: this.traducao.getTraducao(['E-mail académico', 'Academic e-mail']),
    emailPlaceholder: this.traducao.getTraducao([
      'nome@universidade.edu',
      'name@university.edu',
    ]),
    telefone: this.traducao.getTraducao(['Telefone', 'Phone']),
    telefonePlaceholder: this.traducao.getTraducao(['900 000 000', '900 000 000']),
    perfil: this.traducao.getTraducao(['LinkedIn / Lattes (URL)', 'LinkedIn / Lattes (URL)']),
    perfilPlaceholder: this.traducao.getTraducao(['https://…', 'https://…']),
    opcional: this.traducao.getTraducao(['(opcional)', '(optional)']),
  }));
}
