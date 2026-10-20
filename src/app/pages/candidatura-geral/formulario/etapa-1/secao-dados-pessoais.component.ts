import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import {
  EstadoVerificacao,
  IndicadorVerificacaoComponent,
} from '../../../../shared/componentes/indicador-verificacao/indicador-verificacao.component';
import {
  FormFieldInputComponentV2,
  LeftIconDirective,
  RightIconDirective,
} from '../../../../shared/componentes/input-field/form-input-field';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';

/** Etapa 1, secção 1 — identificação e contacto do candidato. */
@Component({
  selector: 'app-etapa-1-dados-pessoais',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    LeftIconDirective,
    RightIconDirective,
    IndicadorVerificacaoComponent,
    TituloBlocoComponent,
  ],
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

      <!-- O BI é verificado na AGT quando o candidato pára de escrever (ver
           verificarBiNaAgt no estado): a rodar, ✓ ou ✗ dentro do campo. -->
      <div class="flex flex-col">
        <form-input-field
          formControlName="documento"
          [obrigatorio]="true"
          [label]="textos().documento"
          [placeholder]="textos().documentoPlaceholder"
          [erro]="erroDocumento()"
        >
          <app-indicador-verificacao rightIcon [estado]="estadoDocumento()" [rotuloAVerificar]="textos().biAVerificar" />
        </form-input-field>
        @if (estadoDocumento() === 'valido') {
          <p class="-mt-1 text-xs text-green-600" aria-live="polite">{{ textos().biValido }}</p>
        } @else if (biPorVerificar()) {
          <p class="-mt-1 text-xs text-text-secondary" aria-live="polite">{{ textos().biIndisponivel }}</p>
        }
      </div>

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
  private readonly estado = inject(CandidaturaGeralEstadoService);

  protected readonly erros = criarErrosFormulario([
    'nome',
    'nascimento',
    'documento',
    'telefone',
    'email',
  ] as const);

  private readonly controloDocumento = this.estado.dados.controls.documento;
  private readonly valorDocumento = toSignal(this.controloDocumento.valueChanges, {
    initialValue: this.controloDocumento.value,
  });

  /** Resposta da AGT, só se for para o nº que está agora no campo. */
  private readonly verificacaoAtual = computed(() => {
    const verificacao = this.estado.verificacaoDocumento();
    const numero = this.valorDocumento().trim().toUpperCase();
    return verificacao?.numero === numero ? verificacao : null;
  });

  /**
   * Não lê o `status` do controlo (um `EventEmitter` sem memória): se a
   * verificação arrancar antes deste componente montar — BI já preenchido
   * pelo rascunho ao abrir a página — perder-se-ia a transição e o indicador
   * ficava preso em "a verificar" para sempre. `aVerificarDocumento` e
   * `verificacaoDocumento` são `signal`s do estado, lidos directamente, por
   * isso reflectem sempre o valor actual.
   */
  protected readonly estadoDocumento = computed<EstadoVerificacao>(() => {
    if (this.estado.aVerificarDocumento()) {
      return 'aVerificar';
    }
    const verificacao = this.verificacaoAtual();
    if (!verificacao || verificacao.valido === null) {
      return null;
    }
    return verificacao.valido ? 'valido' : 'invalido';
  });

  /** AGT indisponível (ou limite de pedidos): o candidato pode seguir, mas fica a saber. */
  protected readonly biPorVerificar = computed(
    () => !this.estado.aVerificarDocumento() && this.verificacaoAtual()?.valido === null,
  );

  /** O «não consta na AGT» aparece logo, sem esperar que o campo seja tocado. */
  protected readonly erroDocumento = computed(() =>
    this.estadoDocumento() === 'invalido' ? this.textos().biInvalido : this.erros.documento(),
  );

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
      biAVerificar: t('A verificar o Bilhete de Identidade…', 'Checking the ID card…'),
      biValido: t('Bilhete de Identidade válido', 'Valid ID card'),
      biInvalido: t('Bilhete de Identidade inválido', 'Invalid ID card'),
      biIndisponivel: t(
        'Não foi possível verificar o BI agora. Pode continuar a candidatura.',
        'The ID card could not be checked right now. You can continue your application.',
      ),
      telefone: t('Contacto Telefónico Principal', 'Main Phone Number'),
      email: t('E-mail Principal de Correspondência', 'Main Correspondence E-mail'),
      emailPlaceholder: t('doutor.candidato@universidade.ao', 'doctor.candidate@university.ao'),
    };
  });
}
