import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { CampoDocumentoComponent } from '../../../../shared/componentes/campo-documento/campo-documento.component';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';
import { CandidaturaGeralEstadoService, LIMITES_DOSSIER_MB } from '../../estado/candidatura-geral-estado.service';

/** Etapa 3, secção 1 — CV, certificados, comprovativos e carta de motivação. */
@Component({
  selector: 'app-etapa-3-dossier',
  imports: [ReactiveFormsModule, CampoDocumentoComponent, TituloBlocoComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="folder-input" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <div class="mt-6 flex flex-col gap-4">
      <app-campo-documento
        formControlName="curriculo"
        aceita=".pdf,application/pdf"
        icone="file-up"
        iconeAnexado="file-text"
        [obrigatorio]="true"
        [titulo]="textos().curriculo"
        [descricao]="textos().curriculoDescricao"
        [textoSelecionar]="textos().selecionarPdf"
        [textoFormatos]="textos().formatosCurriculo"
        [textoAnexado]="textos().anexado"
        [textoSubstituir]="textos().substituir"
        [textoRemover]="textos().remover"
        [erro]="erros.curriculo()"
      />

      <app-campo-documento
        formControlName="certificados"
        aceita=".pdf,application/pdf"
        icone="file-up"
        iconeAnexado="graduation-cap"
        [obrigatorio]="true"
        [titulo]="textos().certificados"
        [descricao]="textos().certificadosDescricao"
        [textoSelecionar]="textos().selecionarPdf"
        [textoFormatos]="textos().formatosCertificados"
        [textoAnexado]="textos().anexado"
        [textoSubstituir]="textos().substituir"
        [textoRemover]="textos().remover"
        [erro]="erros.certificados()"
      />

      <app-campo-documento
        formControlName="comprovativos"
        aceita=".pdf,.zip,application/pdf,application/zip"
        icone="folder-up"
        iconeAnexado="folder-input"
        [rotuloOpcional]="textos().opcional"
        [titulo]="textos().comprovativos"
        [descricao]="textos().comprovativosDescricao"
        [textoSelecionar]="textos().selecionarDocumentos"
        [textoFormatos]="textos().formatosComprovativos"
        [textoAnexado]="textos().anexado"
        [textoSubstituir]="textos().substituir"
        [textoRemover]="textos().remover"
        [erro]="erros.comprovativos()"
      />

      <app-campo-documento
        formControlName="carta"
        aceita=".pdf,application/pdf"
        icone="mail"
        iconeAnexado="mail"
        [obrigatorio]="true"
        [titulo]="textos().carta"
        [descricao]="textos().cartaDescricao"
        [textoSelecionar]="textos().selecionarCarta"
        [textoFormatos]="textos().formatosCarta"
        [textoAnexado]="textos().anexado"
        [textoSubstituir]="textos().substituir"
        [textoRemover]="textos().remover"
        [erro]="erros.carta()"
      />

      @if (dossierMuitoGrande()) {
        <p class="text-sm text-red-600" role="alert">{{ textos().totalExcedido }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoDossierComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly dossier = inject(CandidaturaGeralEstadoService).dossier;

  protected readonly erros = criarErrosFormulario(['curriculo', 'certificados', 'comprovativos', 'carta'] as const);

  /** Erro do grupo (soma dos anexos), que não pertence a nenhum campo. */
  protected readonly dossierMuitoGrande = toSignal(
    this.dossier.events.pipe(map(() => this.dossier.hasError('dossierMuitoGrande'))),
    { initialValue: this.dossier.hasError('dossierMuitoGrande') },
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const mb = LIMITES_DOSSIER_MB;
    return {
      titulo: t('Secção 1: Dossier Documental Obrigatório', 'Section 1: Mandatory Document Dossier'),
      descricao: t(
        `Carregamento dos elementos probatórios em formato PDF ou ficheiro ZIP agregador (Máximo: ${mb.total}MB).`,
        `Upload the supporting documents as PDF files or a single aggregating ZIP file (Maximum: ${mb.total}MB).`,
      ),
      curriculo: t('1. Curriculum Vitae Circunstanciado', '1. Detailed Curriculum Vitae'),
      curriculoDescricao: t(
        'Modelo detalhado com publicações, docência e projetos aplicados.',
        'Detailed template with publications, teaching and applied projects.',
      ),
      certificados: t(
        '2. Certificado(s) de Habilitações Literárias & Equivalência',
        '2. Academic Qualification Certificate(s) & Equivalence',
      ),
      certificadosDescricao: t(
        'Arraste o ficheiro PDF ou clique para carregar o certificado do grau mais elevado (e reconhecimento INAAREES para diplomas estrangeiros).',
        'Drag the PDF file or click to upload the certificate of your highest degree (and INAAREES recognition for foreign diplomas).',
      ),
      comprovativos: t(
        '3. Comprovativos de Docência / I&D / Prática Agrícola',
        '3. Proof of Teaching / R&D / Agricultural Practice',
      ),
      comprovativosDescricao: t(
        'Declarações de tempo de serviço, sumários letivos, artigos científicos de destaque ou certificados de consultoria agrária.',
        'Length-of-service statements, teaching summaries, notable scientific papers or agricultural consultancy certificates.',
      ),
      carta: t('4. Carta de Motivação & Enquadramento Institucional', '4. Motivation Letter & Institutional Fit'),
      cartaDescricao: t(
        'Carta dirigida à Comissão Instaladora da AgroSophia (máximo 1 página com 420 palavras, fonte Times New Roman 12) explanando a visão para o desenvolvimento do setor agrário nacional.',
        'Letter addressed to the AgroSophia Installation Committee (maximum 1 page with 420 words, font Times New Roman 12) setting out your vision for the development of the national agricultural sector.',
      ),
      opcional: t('(Opcional / Valorativo)', '(Optional / Adds value)'),
      selecionarPdf: t('Selecionar Ficheiro (PDF)', 'Select File (PDF)'),
      selecionarDocumentos: t('Selecionar Documentos (PDF ou ZIP)', 'Select Documents (PDF or ZIP)'),
      selecionarCarta: t('Selecionar Carta (PDF)', 'Select Letter (PDF)'),
      formatosCurriculo: t(`Formatos: PDF até ${mb.curriculo}MB`, `Formats: PDF up to ${mb.curriculo}MB`),
      formatosCertificados: t(`Formatos: PDF até ${mb.certificados}MB`, `Formats: PDF up to ${mb.certificados}MB`),
      formatosComprovativos: t(
        `Formatos: PDF, ZIP até ${mb.comprovativos}MB`,
        `Formats: PDF, ZIP up to ${mb.comprovativos}MB`,
      ),
      formatosCarta: t(`Formatos: PDF até ${mb.carta}MB`, `Formats: PDF up to ${mb.carta}MB`),
      anexado: t('Anexado', 'Attached'),
      substituir: t('Substituir', 'Replace'),
      remover: t('Remover', 'Remove'),
      totalExcedido: t(
        `O conjunto dos ficheiros anexados ultrapassa o máximo de ${mb.total}MB. Substitua ou comprima algum dos documentos.`,
        `The attached files exceed the ${mb.total}MB maximum. Replace or compress one of the documents.`,
      ),
    };
  });
}
