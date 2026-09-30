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
import { MAXIMO_SINTESE } from '../../estado/candidatura-geral-estado.service';

/** Etapa 2, secção 2 — anos de docência e de prática, e síntese curricular. */
@Component({
  selector: 'app-etapa-2-experiencia',
  imports: [ReactiveFormsModule, FormFieldInputComponentV2, FormFieldSelectComponentV2, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="briefcase" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <div class="mt-6 flex flex-col gap-4">
      <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:w-2/3">
        <field-select-v2
          formControlName="tempoDocencia"
          [obrigatorio]="true"
          [label]="textos().docencia"
          [placeholder]="textos().selecione"
          [options]="opcoesIntervalo()"
          [erro]="erros.tempoDocencia()"
        />
        <field-select-v2
          formControlName="experienciaPratica"
          [obrigatorio]="true"
          [label]="textos().pratica"
          [placeholder]="textos().selecione"
          [options]="opcoesIntervalo()"
          [erro]="erros.experienciaPratica()"
        />
      </div>

      <form-input-field
        formControlName="sintese"
        type="textarea"
        [rows]="6"
        [obrigatorio]="true"
        [maxCaracteres]="maximoSintese"
        [textoCaracteres]="textos().caracteres"
        [label]="textos().sintese"
        [placeholder]="textos().sintesePlaceholder"
        [erro]="erros.sintese()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoExperienciaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  protected readonly maximoSintese = MAXIMO_SINTESE;

  protected readonly erros = criarErrosFormulario(['tempoDocencia', 'experienciaPratica', 'sintese'] as const);

  protected readonly opcoesIntervalo = computed<SelectOptionV2[]>(() =>
    this.conteudo.intervalosExperiencia().map((intervalo) => ({ value: intervalo.id, label: intervalo.rotulo })),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Experiência Docente & Profissional', 'Section 2: Teaching & Professional Experience'),
      descricao: t(
        'Trajetória letiva no ensino superior e experiência no agronegócio ou investigação agrária.',
        'Higher education teaching record and experience in agribusiness or agricultural research.',
      ),
      docencia: t('Tempo de Docência no Ensino Superior', 'Higher Education Teaching Experience'),
      pratica: t('Experiência Prática no Agronegócio / I&D', 'Practical Experience in Agribusiness / R&D'),
      selecione: t('Selecione...', 'Select...'),
      sintese: t('Síntese Curricular e Linha de Investigação Proposta', 'Curriculum Summary and Proposed Research Line'),
      sintesePlaceholder: t(
        'Apresente de modo sintético a sua visão pedagógica, principais temas investigados e como a sua especialização contribui para a missão da UNAGRO em Angola...',
        'Briefly present your teaching vision, main research topics and how your specialisation contributes to UNAGRO’s mission in Angola...',
      ),
      caracteres: t('caracteres', 'characters'),
    };
  });
}
