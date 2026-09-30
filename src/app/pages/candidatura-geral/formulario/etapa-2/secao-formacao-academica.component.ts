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
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/** Etapa 2, secção 1 — grau mais elevado, instituição, especialização e perfil de investigador. */
@Component({
  selector: 'app-etapa-2-formacao-academica',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    LeftIconDirective,
    GrupoCartoesSelecaoComponent,
    IconeComponent,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="graduation-cap" [titulo]="textos().titulo" [descricao]="textos().descricao" />

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
          formControlName="instituicao"
          [obrigatorio]="true"
          [label]="textos().instituicao"
          [placeholder]="textos().instituicaoPlaceholder"
          [erro]="erros.instituicao()"
        />
        <form-input-field
          formControlName="especializacao"
          [obrigatorio]="true"
          [label]="textos().especializacao"
          [placeholder]="textos().especializacaoPlaceholder"
          [erro]="erros.especializacao()"
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
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoFormacaoAcademicaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  protected readonly erros = criarErrosFormulario([
    'grau',
    'instituicao',
    'especializacao',
    'identificadorInvestigador',
  ] as const);

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
      grau: t('Grau Académico Mais Elevado Concluído', 'Highest Academic Degree Completed'),
      instituicao: t('Instituição de Ensino Superior Concedente', 'Awarding Higher Education Institution'),
      instituicaoPlaceholder: t('Ex.: Universidade Agostinho Neto', 'E.g. Agostinho Neto University'),
      especializacao: t('Área Específica de Formação / Especialização', 'Specific Field of Study / Specialisation'),
      especializacaoPlaceholder: t('Ex.: Fisiologia e Fitotecnia Tropical', 'E.g. Tropical Plant Physiology and Crop Science'),
      identificador: t(
        'Identificador de Investigador (ORCID / CiênciaVitae / Lattes / Google Scholar)',
        'Researcher Identifier (ORCID / CiênciaVitae / Lattes / Google Scholar)',
      ),
      identificadorAjuda: t(
        'Permite ao Gabinete Científico consultar prontamente as suas publicações indexadas e projetos de I&D.',
        'Allows the Scientific Office to promptly review your indexed publications and R&D projects.',
      ),
    };
  });
}
