import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';

/**
 * Etapa 1, secção 2 do administrativo — a função a que se candidata. É a que
 * ficou escolhida no modal da página inicial; aqui pode ser trocada.
 */
@Component({
  selector: 'app-etapa-1-funcao-candidatura',
  imports: [ReactiveFormsModule, FormFieldSelectComponentV2, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="target" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <field-select-v2
      class="mt-6 block"
      formControlName="funcaoId"
      [obrigatorio]="true"
      [searchable]="true"
      [label]="textos().funcao"
      [placeholder]="textos().selecione"
      [options]="opcoes()"
      [erro]="erros.funcaoId() ? textos().obrigatorio : null"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoFuncaoCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  protected readonly erros = criarErrosFormulario(['funcaoId'] as const);

  constructor() {
    // Um rascunho administrativo abre aqui sem passar pelo modal: a lista tem de vir na mesma.
    this.conteudo.pedirFuncoes();
  }

  protected readonly opcoes = computed<SelectOptionV2[]>(() =>
    this.conteudo.funcoes().map((funcao) => ({ value: funcao.id, label: funcao.nome })),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Função Pretendida', 'Section 2: Desired Position'),
      descricao: t(
        'Seleccione a função administrativa a que se candidata.',
        'Select the administrative position you are applying for.',
      ),
      funcao: t('Função', 'Position'),
      selecione: t('Selecione...', 'Select...'),
      obrigatorio: t('Escolha a função a que se candidata.', 'Choose the position you are applying for.'),
    };
  });
}
