import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';
import { FormFieldInputComponentV2 } from '../input-field/form-input-field';
import { FormFieldSelectComponentV2, SelectOptionV2 } from '../select-field-v2/select-field-v2';
import { criarErrosFormulario } from '../../formulario/erros-formulario';

/** Horários de visita disponíveis, de hora a hora. Sai quando a agenda vier da API. */
const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

/** A unidade a visitar, já traduzida, como o bloco de confirmação a mostra. */
export interface UnidadeVisita {
  rotulo: string;
  icone: string;
}

/**
 * Campos do pedido de visita. Vive debaixo do `[formGroup]` do
 * `app-modal-agendar-visita` — é essa a razão de ser um componente à parte: o
 * `criarErrosFormulario` precisa do `FormGroupDirective` do pai no injector.
 */
@Component({
  selector: 'app-campos-agendar-visita',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    IconeComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-x-8 gap-y-6 sm:grid-cols-3">
      <form-input-field
        formControlName="nome"
        variante="minimalista"
        [label]="textos().nome"
        [placeholder]="textos().nomePlaceholder"
        [erro]="erros.nome()" />

      <form-input-field
        formControlName="instituicao"
        variante="minimalista"
        [label]="textos().instituicao"
        [placeholder]="textos().instituicaoPlaceholder"
        [erro]="erros.instituicao()" />

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
        [label]="textos().telefone"
        [placeholder]="textos().telefonePlaceholder"
        [erro]="erros.telefone()" />

      <form-input-field
        formControlName="data"
        type="date"
        variante="minimalista"
        [label]="textos().data"
        [erro]="erros.data()" />

      <field-select-v2
        formControlName="hora"
        variante="minimalista"
        [options]="horarios()"
        [label]="textos().hora"
        [placeholder]="textos().horaPlaceholder"
        [erro]="erros.hora()" />
    </div>

    <!-- Sem fila de cartões: a unidade já vem escolhida do cartão clicado, só se confirma aqui. -->
    <div class="mt-8">
      <span class="block text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary">
        {{ textos().unidade }}
      </span>
      <div class="mt-2 inline-flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <app-icone [nome]="unidade().icone" [tamanho]="18" class="text-primary" />
        <span class="text-base font-semibold text-primary-deep">{{ unidade().rotulo }}</span>
      </div>
    </div>

    <div class="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
      <div class="sm:col-span-2">
        <form-input-field
          formControlName="motivo"
          type="textarea"
          variante="minimalista"
          [rows]="3"
          [label]="textos().motivo"
          [placeholder]="textos().motivoPlaceholder"
          [erro]="erros.motivo()" />
      </div>

      <form-input-field
        formControlName="participantes"
        type="number"
        variante="minimalista"
        [label]="textos().participantes"
        [erro]="erros.participantes()" />
    </div>
  `,
})
export class CamposAgendarVisitaComponent {
  /** Unidade escolhida no cartão — mostrada como confirmação, não editável. */
  readonly unidade = input.required<UnidadeVisita>();

  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario([
    'nome',
    'instituicao',
    'email',
    'telefone',
    'data',
    'hora',
    'motivo',
    'participantes',
  ] as const);

  protected readonly horarios = computed<SelectOptionV2[]>(() =>
    HORARIOS.map((hora) => ({ value: hora, label: hora })),
  );

  protected readonly textos = computed(() => ({
    nome: this.traducao.getTraducao(['Nome completo', 'Full name']),
    nomePlaceholder: this.traducao.getTraducao(['Ex: Maria Santos', 'E.g. Maria Santos']),
    instituicao: this.traducao.getTraducao([
      'Instituição / Organização',
      'Institution / Organisation',
    ]),
    instituicaoPlaceholder: this.traducao.getTraducao([
      'Ex: Universidade de Agronomia',
      'E.g. University of Agronomy',
    ]),
    email: this.traducao.getTraducao(['E-mail', 'E-mail']),
    emailPlaceholder: this.traducao.getTraducao([
      'Ex: maria.santos@email.com',
      'E.g. maria.santos@email.com',
    ]),
    telefone: this.traducao.getTraducao(['Telefone', 'Phone']),
    telefonePlaceholder: this.traducao.getTraducao(['+244 900 000 000', '+244 900 000 000']),
    data: this.traducao.getTraducao(['Data preferencial', 'Preferred date']),
    hora: this.traducao.getTraducao(['Hora preferencial', 'Preferred time']),
    horaPlaceholder: this.traducao.getTraducao(['Seleccione um horário', 'Select a time slot']),
    unidade: this.traducao.getTraducao(['Unidade a visitar', 'Unit to visit']),
    motivo: this.traducao.getTraducao(['Motivo da visita', 'Reason for the visit']),
    motivoPlaceholder: this.traducao.getTraducao([
      'Descreva brevemente o objectivo da sua visita...',
      'Briefly describe the purpose of your visit...',
    ]),
    participantes: this.traducao.getTraducao(['Nº de participantes', 'No. of participants']),
  }));
}
