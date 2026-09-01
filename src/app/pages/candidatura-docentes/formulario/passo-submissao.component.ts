import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { CampoUploadComponent } from '../../../shared/componentes/campo-upload/campo-upload.component';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import { TituloBlocoComponent } from '../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../shared/formulario/erros-formulario';

/** Passo 3 — linhas de pesquisa, motivação e anexo do CV. */
@Component({
  selector: 'app-passo-submissao',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    CampoUploadComponent,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco [titulo]="textos().bloco" />

    <p class="mt-6 max-w-2xl text-sm italic leading-relaxed text-text-secondary">
      {{ textos().intro }}
    </p>

    <div class="mt-7 flex flex-col gap-6">
      <form-input-field
        formControlName="linhasPesquisa"
        type="textarea"
        variante="minimalista"
        [rows]="5"
        [label]="textos().linhasPesquisa"
        [placeholder]="textos().linhasPesquisaPlaceholder"
        [erro]="erros.linhasPesquisa()" />

      <form-input-field
        formControlName="carta"
        type="textarea"
        variante="minimalista"
        [rows]="6"
        [label]="textos().carta"
        [placeholder]="textos().cartaPlaceholder"
        [erro]="erros.carta()" />

      <app-campo-upload
        formControlName="curriculo"
        aceita=".pdf,application/pdf"
        [label]="textos().curriculo"
        [textoAcao]="textos().uploadAcao"
        [textoArraste]="textos().uploadArraste"
        [textoLimite]="textos().uploadLimite"
        [textoTrocar]="textos().uploadTrocar"
        [erro]="erros.curriculo()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassoSubmissaoComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario([
    'linhasPesquisa',
    'carta',
    'curriculo',
  ] as const);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Pesquisa e Motivação', 'Research and Motivation']),
    intro: this.traducao.getTraducao([
      'Por favor, forneça detalhes sobre a sua trajetória académica e como os seus objetivos de pesquisa se conectam com a missão da UNAGRO.',
      'Please provide details about your academic path and how your research goals connect with UNAGRO’s mission.',
    ]),
    linhasPesquisa: this.traducao.getTraducao([
      'Áreas de pesquisa e projetos atuais',
      'Research areas and current projects',
    ]),
    linhasPesquisaPlaceholder: this.traducao.getTraducao([
      'Descreva brevemente as suas linhas de pesquisa e interesses…',
      'Briefly describe your research lines and interests…',
    ]),
    carta: this.traducao.getTraducao([
      'Carta de motivação (por que a UNAGRO?)',
      'Motivation letter (why UNAGRO?)',
    ]),
    cartaPlaceholder: this.traducao.getTraducao([
      'Explique como a sua visão académica se alinha com a nossa instituição…',
      'Explain how your academic vision aligns with our institution…',
    ]),
    curriculo: this.traducao.getTraducao([
      'Upload de curriculum vitae (PDF)',
      'Curriculum vitae upload (PDF)',
    ]),
    uploadAcao: this.traducao.getTraducao(['Selecione um arquivo', 'Choose a file']),
    uploadArraste: this.traducao.getTraducao(['ou arraste e solte', 'or drag and drop']),
    uploadLimite: this.traducao.getTraducao(['PDF até 10MB', 'PDF up to 10MB']),
    uploadTrocar: this.traducao.getTraducao(['Clique para trocar', 'Click to replace']),
  }));
}
