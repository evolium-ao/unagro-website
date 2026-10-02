import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { FormFieldInputComponentV2 } from '../../../../shared/componentes/input-field/form-input-field';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/** Etapa 1, secção 2 — área prioritária (com vagas) e área complementar. */
@Component({
  selector: 'app-etapa-1-area-candidatura',
  imports: [ReactiveFormsModule, FormFieldInputComponentV2, FormFieldSelectComponentV2, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="target" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <div class="mt-6 flex flex-col gap-4">
      <field-select-v2
        formControlName="area"
        [obrigatorio]="true"
        [label]="textos().area"
        [placeholder]="textos().areaPlaceholder"
        [options]="opcoesArea()"
        [erro]="erros.area()"
      />

      <div>
        <form-input-field
          formControlName="areaComplementar"
          [label]="textos().complementar"
          [placeholder]="textos().complementarPlaceholder"
          [erro]="erros.areaComplementar()"
        />
        <p class="-mt-1 text-xs tracking-wide text-text-secondary">{{ textos().complementarAjuda }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoAreaCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  protected readonly erros = criarErrosFormulario(['area', 'areaComplementar'] as const);

  protected readonly opcoesArea = computed<SelectOptionV2[]>(() => {
    const vagas = this.traducao.getTraducao(['Vagas', 'Positions']);
    return this.conteudo.areas().map((area) => ({
      value: area.id,
      label: `${area.numero}. ${area.titulo} (${area.vagas} ${vagas})`,
    }));
  });

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Área de Candidatura & Vagas', 'Section 2: Application Area & Positions'),
      descricao: t(
        'Selecione a linha de investigação e docência pretendida de acordo com a convocatória.',
        'Select the research and teaching line you are applying for, according to the call.',
      ),
      area: t('Área Prioritária de Manifestação de Interesse', 'Priority Area of Interest'),
      areaPlaceholder: t('Selecione a área', 'Select the area'),
      complementar: t('Especificação da Área Interdisciplinar Complementar', 'Complementary Interdisciplinary Area'),
      complementarPlaceholder: t('Ex.: Biotecnologia Florestal Aplicada ao Semiárido', 'E.g. Forest Biotechnology Applied to Semi-arid Regions'),
      complementarAjuda: t(
        'Preencher apenas se a sua proposta contemplar intersecções multidisciplinares fora do quadro base.',
        'Fill in only if your proposal covers multidisciplinary intersections outside the base framework.',
      ),
    };
  });
}
