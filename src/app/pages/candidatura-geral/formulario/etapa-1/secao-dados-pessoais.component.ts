import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import {
  FormFieldInputComponentV2,
  LeftIconDirective,
} from '../../../../shared/componentes/input-field/form-input-field';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/** Etapa 1, secção 1 — identificação e contacto do candidato. */
@Component({
  selector: 'app-etapa-1-dados-pessoais',
  imports: [ReactiveFormsModule, FormFieldInputComponentV2, LeftIconDirective, TituloBlocoComponent],
  // Herda o `formGroup` da etapa: os `formControlName` resolvem sem o repetir.
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="id-card" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <div class="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <form-input-field
        class="sm:col-span-2"
        formControlName="nome"
        [obrigatorio]="true"
        [label]="textos().nome"
        [placeholder]="textos().nomePlaceholder"
        [erro]="erros.nome()"
      />

      <form-input-field
        formControlName="nascimento"
        type="date"
        [obrigatorio]="true"
        [label]="textos().nascimento"
        [erro]="erros.nascimento()"
      />

      <form-input-field
        formControlName="documento"
        [obrigatorio]="true"
        [label]="textos().documento"
        [placeholder]="textos().documentoPlaceholder"
        [erro]="erros.documento()"
      />

      <form-input-field
        formControlName="telefone"
        type="tel"
        [obrigatorio]="true"
        [label]="textos().telefone"
        placeholder="923 000 000"
        [erro]="erros.telefone()"
      >
        <span leftIcon class="-ml-3 self-stretch border-r border-[#E2E8F0] bg-gray-100 px-3 py-2 text-sm text-text-secondary">
          +244
        </span>
      </form-input-field>

      <form-input-field
        formControlName="email"
        type="email"
        [obrigatorio]="true"
        [label]="textos().email"
        [placeholder]="textos().emailPlaceholder"
        [erro]="erros.email()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoDadosPessoaisComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario([
    'nome',
    'nascimento',
    'documento',
    'telefone',
    'email',
  ] as const);

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 1: Dados Pessoais & Contacto', 'Section 1: Personal Details & Contact'),
      descricao: t(
        'Identificação oficial segundo os registos civis da República de Angola ou país de origem.',
        'Official identification according to the civil records of the Republic of Angola or country of origin.',
      ),
      nome: t('Nome Completo', 'Full Name'),
      nomePlaceholder: t('Insira o nome conforme documento oficial', 'Enter your name as in your official document'),
      nascimento: t('Data de Nascimento', 'Date of Birth'),
      documento: t('N.º de Bilhete de Identidade / Passaporte', 'ID Card / Passport No.'),
      documentoPlaceholder: t('Ex.: 007849204LA049', 'E.g. 007849204LA049'),
      telefone: t('Contacto Telefónico Principal', 'Main Phone Number'),
      email: t('E-mail Principal de Correspondência', 'Main Correspondence E-mail'),
      emailPlaceholder: t('doutor.candidato@universidade.ao', 'doctor.candidate@university.ao'),
    };
  });
}
