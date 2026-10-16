import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';
import { SeletorDisciplinasComponent } from '../../componentes/seletor-disciplinas.component';

/**
 * Etapa 1, secção 2 — disciplinas a lecionar. É o mesmo registo da 3.ª secção
 * da página inicial: o que lá se confirmou chega aqui já preenchido.
 */
@Component({
  selector: 'app-etapa-1-area-candidatura',
  imports: [ReactiveFormsModule, SeletorDisciplinasComponent, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="target" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <!-- O único erro possível é a lista vazia: mensagem própria em vez do genérico. -->
    <app-seletor-disciplinas class="mt-6 block" formControlName="disciplinas"
      [erro]="erros.disciplinas() ? textos().semDisciplinas : null" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoAreaCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['disciplinas'] as const);

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Área de Candidatura & Vagas', 'Section 2: Application Area & Vacancies'),
      descricao: t(
        'Selecione a linha de investigação e docência pretendida de acordo com a convocatória.',
        'Select the intended research and teaching line in accordance with the call.',
      ),
      semDisciplinas: t('Adicione pelo menos uma disciplina que pretende lecionar.', 'Add at least one course you wish to teach.'),
    };
  });
}
