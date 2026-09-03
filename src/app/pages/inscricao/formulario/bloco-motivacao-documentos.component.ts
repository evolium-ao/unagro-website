import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { CampoUploadComponent } from '../../../shared/componentes/campo-upload/campo-upload.component';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';
import { TituloBlocoComponent } from '../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../shared/formulario/erros-formulario';

/** Bloco 3 do formulário de inscrição — carta de motivação e certificado em PDF. */
@Component({
  selector: 'app-inscricao-motivacao-documentos',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    CampoUploadComponent,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco [titulo]="textos().bloco" />

    <div class="mt-7 flex flex-col gap-6">
      <div>
        <!-- O rótulo fica fora do campo para a linha de ajuda poder entrar entre os dois. -->
        <p class="text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary">
          {{ textos().motivacao }}
        </p>
        <p class="mt-1 text-xs leading-relaxed text-text-secondary/80">
          {{ textos().motivacaoAjuda }}
        </p>

        <form-input-field
          class="mt-3 block"
          formControlName="motivacao"
          type="textarea"
          variante="minimalista"
          [rows]="6"
          [placeholder]="textos().motivacaoPlaceholder"
          [erro]="erros.motivacao()" />
      </div>

      <app-campo-upload
        formControlName="certificado"
        tema="neutro"
        aceita=".pdf,application/pdf"
        [label]="textos().certificado"
        [textoAcao]="textos().uploadAcao"
        [textoArraste]="textos().uploadArraste"
        [textoLimite]="textos().uploadLimite"
        [textoTrocar]="textos().uploadTrocar"
        [erro]="erros.certificado()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocoMotivacaoDocumentosComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly erros = criarErrosFormulario(['motivacao', 'certificado'] as const);

  protected readonly textos = computed(() => ({
    bloco: this.traducao.getTraducao(['Motivação e Documentos', 'Motivation and Documents']),
    motivacao: this.traducao.getTraducao([
      'Carta de motivação (até 500 palavras)',
      'Motivation letter (up to 500 words)',
    ]),
    motivacaoAjuda: this.traducao.getTraducao([
      'Explique por que deseja estudar na UNAGRO e como os seus objectivos se alinham com a nossa visão agrícola.',
      'Explain why you want to study at UNAGRO and how your goals align with our agricultural vision.',
    ]),
    motivacaoPlaceholder: this.traducao.getTraducao([
      'Escreva a sua motivação aqui...',
      'Write your motivation here...',
    ]),
    certificado: this.traducao.getTraducao([
      'Certificado de habilitações (PDF)',
      'Qualifications certificate (PDF)',
    ]),
    uploadAcao: this.traducao.getTraducao([
      'Arraste e solte o ficheiro aqui,',
      'Drag and drop the file here,',
    ]),
    uploadArraste: this.traducao.getTraducao([
      'ou clique para seleccionar',
      'or click to select',
    ]),
    uploadLimite: this.traducao.getTraducao(['Tamanho máx.: 5MB', 'Max. size: 5MB']),
    uploadTrocar: this.traducao.getTraducao(['Clique para trocar', 'Click to replace']),
  }));
}
