import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../shared/formulario/erros-formulario';

/** Bloco 1 do formulário de inscrição — identificação do candidato. */
@Component({
  selector: 'app-inscricao-dados-pessoais',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    TituloBlocoComponent,
  ],
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
    </div>

    <div class="mt-2 grid gap-x-10 gap-y-6 sm:grid-cols-3">
      <form-input-field
        formControlName="telefone"
        type="tel"
        variante="minimalista"
        [label]="textos().telefone"
        [placeholder]="textos().telefonePlaceholder"
        [erro]="erros.telefone()" />

      <form-input-field
        formControlName="nascimento"
        type="date"
        variante="minimalista"
        [label]="textos().nascimento"
        [erro]="erros.nascimento()" />

      <field-select-v2
        formControlName="genero"
        variante="minimalista"
        [label]="textos().genero"
        [placeholder]="textos().generoPlaceholder"
        [options]="opcoesGenero()"
        [erro]="erros.genero()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocoDadosPessoaisComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario([
    'nome',
    'email',
    'telefone',
    'nascimento',
    'genero',
  ] as const);

  protected readonly opcoesGenero = computed<SelectOptionV2[]>(() => [
    { value: 'masculino', label: this.traducao.getTraducao(['Masculino', 'Male']) },
    { value: 'feminino', label: this.traducao.getTraducao(['Feminino', 'Female']) },
  ]);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Informações Pessoais', 'Personal Details']),
    nome: this.traducao.getTraducao(['Nome completo', 'Full name']),
    nomePlaceholder: this.traducao.getTraducao(['Ex: Maria Silva', 'E.g. Maria Silva']),
    email: this.traducao.getTraducao(['E-mail de contacto', 'Contact e-mail']),
    emailPlaceholder: this.traducao.getTraducao(['maria@exemplo.com', 'maria@example.com']),
    telefone: this.traducao.getTraducao(['Telefone / WhatsApp', 'Phone / WhatsApp']),
    telefonePlaceholder: this.traducao.getTraducao(['+244 900 000 000', '+244 900 000 000']),
    nascimento: this.traducao.getTraducao(['Nascimento', 'Date of birth']),
    genero: this.traducao.getTraducao(['Sexo', 'Sex']),
    generoPlaceholder: this.traducao.getTraducao(['Selecione...', 'Select...']),
  }));
}
