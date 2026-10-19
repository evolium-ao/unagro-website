import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { CaixaConfirmacaoComponent } from '../../../../shared/componentes/caixa-confirmacao/caixa-confirmacao.component';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/** Etapa 3, secção 2 — compromisso de honra e consentimento de tratamento de dados. */
@Component({
  selector: 'app-etapa-3-declaracoes',
  imports: [ReactiveFormsModule, CaixaConfirmacaoComponent, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="gavel" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <div class="mt-8 flex flex-col gap-8 sm:pl-2">
      <app-caixa-confirmacao formControlName="compromissoHonra" [obrigatorio]="true" [erro]="erros.compromissoHonra()">
        {{ textos().compromisso }}
      </app-caixa-confirmacao>

      <app-caixa-confirmacao
        formControlName="consentimentoDados"
        [obrigatorio]="true"
        [erro]="erros.consentimentoDados()"
      >
        {{ textos().consentimento }}
      </app-caixa-confirmacao>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoDeclaracoesComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['compromissoHonra', 'consentimentoDados'] as const);

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Compromisso de Honra & Protecção de Dados', 'Section 2: Declaration of Honour & Data Protection'),
      descricao: t(
        'Conformidade com a legislação da República de Angola e regulamentos do Ensino Superior.',
        'Compliance with the legislation of the Republic of Angola and Higher Education regulations.',
      ),
      compromisso: t(
        'Declaração sob Compromisso de Honra: Declaro formalmente que todos os dados fornecidos nesta candidatura e no dossier anexo são fidedignos, correspondendo à verdade dos factos e das minhas qualificações académicas, estando ciente de que falsas declarações implicam anulação imediata do processo e responsabilidade jurídica.',
        'Declaration of Honour: I formally declare that all the information provided in this application and in the attached dossier is accurate and truthfully reflects the facts and my academic qualifications, and I am aware that false statements lead to the immediate cancellation of the process and legal liability.',
      ),
      consentimento: t(
        'Consentimento para Tratamento de Dados Pessoais: Autorizo a comissão instaladora, a proceder ao tratamento dos dados biométricos, profissionais e curriculares no estrito âmbito do credenciamento docente e processo de constituição institucional, em respeito às directivas de protecção de dados.',
        'Consent for the Processing of Personal Data: I authorize the organizing committee to process my biometric, professional, and curricular data strictly within the scope of teacher accreditation and the institutional constitution process, in accordance with data protection directives.',
      ),
    };
  });
}
