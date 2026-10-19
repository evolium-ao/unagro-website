import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import {
  GrupoCartoesSelecaoComponent,
  OpcaoCartaoSelecao,
} from '../../../../shared/componentes/grupo-cartoes-selecao/grupo-cartoes-selecao.component';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';
import {
  FormFieldInputComponentV2,
  LeftIconDirective,
} from '../../../../shared/componentes/input-field/form-input-field';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/**
 * Homologação de estudos (licenciado/mestre/doutor) no SEPE — pedido do cliente:
 * partilhar com quem não tem o certificado reconhecido pelo INAAREES.
 */
const LINK_HOMOLOGACAO_INAAREES =
  'https://sepe.gov.ao/catalogo/mais-servicos/homologacao-de-estudos-feitos-em-angola/homologacao-de-estudos-graus-licenciado-mestre-e-doutor';

/** Etapa 2, secção 1 — grau mais elevado, universidade/faculdade/curso/país e perfil de investigador. */
@Component({
  selector: 'app-etapa-2-formacao-academica',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    LeftIconDirective,
    GrupoCartoesSelecaoComponent,
    IconeComponent,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="graduation-cap" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <a
      [href]="linkHomologacaoInaarees"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      <app-icone nome="external-link" [tamanho]="14" class="shrink-0" />
      {{ textos().linkInaarees }}
    </a>

    <div class="mt-6 flex flex-col gap-4">
      <app-grupo-cartoes-selecao
        formControlName="grau"
        variante="caixa"
        [obrigatorio]="true"
        [colunas]="4"
        [label]="textos().grau"
        [opcoes]="opcoesGrau()"
        [erro]="erros.grau()"
      />

      <div class="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <form-input-field
          formControlName="universidade"
          [obrigatorio]="true"
          [label]="textos().universidade"
          [placeholder]="textos().universidadePlaceholder"
          [erro]="erros.universidade()"
        />
        <form-input-field
          formControlName="faculdade"
          [obrigatorio]="true"
          [label]="textos().faculdade"
          [placeholder]="textos().faculdadePlaceholder"
          [erro]="erros.faculdade()"
        />
        <form-input-field
          formControlName="curso"
          [obrigatorio]="true"
          [label]="textos().curso"
          [placeholder]="textos().cursoPlaceholder"
          [erro]="erros.curso()"
        />
        <field-select-v2
          formControlName="pais"
          [label]="textos().pais"
          [placeholder]="textos().selecione"
          [searchable]="true"
          [options]="opcoesPais()"
        />
      </div>

      <div>
        <form-input-field
          formControlName="identificadorInvestigador"
          type="url"
          [label]="textos().identificador"
          placeholder="https://orcid.org/0000-0002-XXXX-XXXX"
          [erro]="erros.identificadorInvestigador()"
        >
          <span leftIcon class="-ml-3 flex self-stretch items-center border-r border-[#E2E8F0] bg-gray-100 px-3">
            <app-icone nome="link" [tamanho]="16" class="text-text-secondary" />
          </span>
        </form-input-field>
        <p class="-mt-1 text-xs tracking-wide text-text-secondary">{{ textos().identificadorAjuda }}</p>
        <!-- Pedido do cliente. -->

        <p class="mt-3 text-xs tracking-wide  text-green-700">{{ textos().preferenciaGrau }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoFormacaoAcademicaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  protected readonly linkHomologacaoInaarees = LINK_HOMOLOGACAO_INAAREES;

  protected readonly erros = criarErrosFormulario([
    'grau',
    'universidade',
    'faculdade',
    'curso',
    'identificadorInvestigador',
  ] as const);

  protected readonly opcoesPais = computed<SelectOptionV2[]>(() =>
    this.conteudo.paises().map((pais) => ({ value: pais.id, label: pais.rotulo })),
  );

  protected readonly opcoesGrau = computed<OpcaoCartaoSelecao[]>(() =>
    this.conteudo.grausAcademicos().map((grau) => ({
      valor: grau.id,
      rotulo: grau.rotulo,
      subrotulo: grau.sigla,
      icone: grau.icone,
    })),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 1: Formação Académica & Habilitações', 'Section 1: Academic Background & Qualifications'),
      descricao: t(
        'Qualificações académicas formais obtidas ou homologadas pelo INAAREES / MESCTI.',
        'Formal academic qualifications obtained or recognised by INAAREES / MESCTI.',
      ),
      linkInaarees: t(
        'Certificado ainda não homologado pelo INAAREES? Veja como pedir a homologação',
        'Certificate not yet recognised by INAAREES? See how to apply for recognition',
      ),
      grau: t('Grau Académico Mais Elevado Concluído', 'Highest Academic Degree Completed'),
      universidade: t('Universidade', 'University'),
      universidadePlaceholder: t('Ex.: Universidade Agostinho Neto', 'E.g. Agostinho Neto University'),
      faculdade: t('Faculdade', 'Faculty'),
      faculdadePlaceholder: t('Ex.: Agronómica e Produção Vegetal', 'E.g. Agronomy and Crop Production'),
      curso: t('Curso', 'Degree programme'),
      cursoPlaceholder: t('Ex.: Fitotecnia e Protecção de Culturas', 'E.g. Crop Science and Protection'),
      pais: t('País', 'Country'),
      selecione: t('Selecione...', 'Select...'),
      identificador: t(
        'Identificador de Investigador (ORCID / CiênciaVitae / Lattes / Google Scholar)',
        'Researcher Identifier (ORCID / CiênciaVitae / Lattes / Google Scholar)',
      ),
      identificadorAjuda: t(
        'Permite ao Gabinete Científico consultar prontamente as suas publicações indexadas e projectos de I&D.',
        'Allows the Scientific Office to promptly review your indexed publications and R&D projects.',
      ),
      preferenciaGrau: t(
        'Os mestres e doutores serão preferenciados',
        'Candidates holding a Master’s or Doctoral degree will be given preference',
      ),
    };
  });
}
