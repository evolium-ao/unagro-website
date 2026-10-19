import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { map, merge } from 'rxjs';
import { ValidacaoService } from '../../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { CampoDocumentoComponent } from '../../../../shared/componentes/campo-documento/campo-documento.component';
import { CartaoAvisoComponent } from '../../../../shared/componentes/cartao-aviso/cartao-aviso.component';
import {
  GrupoCartoesSelecaoComponent,
  OpcaoCartaoSelecao,
} from '../../../../shared/componentes/grupo-cartoes-selecao/grupo-cartoes-selecao.component';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import { criarErrosFormulario } from '../../../../shared/formulario/erros-formulario';
import {
  CandidaturaGeralEstadoService,
  LIMITES_DOSSIER_MB,
  MAXIMO_CERTIFICADOS_ADICIONAIS,
} from '../../estado/candidatura-geral-estado.service';

/**
 * Etapa 3, secção 1 — primeiro os certificados (o obrigatório, os adicionais e a
 * caixa «Adicionar certificado»), depois CV, comprovativos, carta de motivação e,
 * por fim, a pergunta "Tem Agregação Pedagógica?" (pedido do cliente): com "Não"
 * avisa do prazo para a remeter; com "Sim" pede logo o certificado.
 */
@Component({
  selector: 'app-etapa-3-dossier',
  imports: [
    ReactiveFormsModule,
    CampoDocumentoComponent,
    CartaoAvisoComponent,
    GrupoCartoesSelecaoComponent,
    IconeComponent,
    TituloBlocoComponent,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <app-titulo-bloco icone="folder-input" [titulo]="textos().titulo" [descricao]="textos().descricao" />

    <!--
      Dois cartões por linha no desktop; um por linha em telemóvel e tablet.
      No desktop, linhas todas da mesma altura (mínimo 20rem): escolher ou remover
      um ficheiro não muda o tamanho das caixas. Numa só coluna cada caixa fica
      com a sua altura, sem os 20rem de espaço vazio.
    -->
    <div id="certificados-dossier" class="mt-6 grid gap-4 lg:auto-rows-[minmax(20rem,1fr)] lg:grid-cols-2">
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

      @for (controlo of certificadosAdicionais.controls; track controlo; let i = $index) {
        <!-- O X do canto retira a caixa; o «Remover» de dentro só tira o ficheiro. -->
        <div class="relative">
          <app-campo-documento
            class="h-full"
            [formControl]="controlo"
            aceita=".pdf,application/pdf"
            icone="file-up"
            iconeAnexado="graduation-cap"
            [rotuloOpcional]="textos().opcional"
            [titulo]="textos().certificadoAdicional + ' ' + (i + 1)"
            [descricao]="textos().certificadoAdicionalDescricao"
            [textoSelecionar]="textos().selecionarPdf"
            [textoFormatos]="textos().formatosCertificadoAdicional"
            [textoAnexado]="textos().anexado"
            [textoSubstituir]="textos().substituir"
            [textoRemover]="textos().remover"
            [erro]="errosCertificadosAdicionais()[i]"
          />
          <button
            type="button"
            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-primary/30"
            [attr.aria-label]="textos().retirarCaixa + ' ' + textos().certificadoAdicional + ' ' + (i + 1)"
            [title]="textos().retirarCaixa"
            (click)="estado.removerCertificado(i)"
          >
            <app-icone nome="x" [tamanho]="16" />
          </button>
        </div>
      }

      <!-- Com o formato de uma caixa de upload vazia: ao clicar, junta uma caixa nova. -->
      @if (podeAdicionar()) {
        <div class="flex h-full flex-col">
          <button
            type="button"
            class="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-8 text-center transition-colors hover:border-primary hover:bg-[#F4FAF6] focus-visible:border-primary focus-visible:outline-none"
            (click)="estado.adicionarCertificado()"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E3F1E7] text-primary">
              <app-icone nome="plus" [tamanho]="20" />
            </span>
            <span class="mt-4 text-sm font-bold text-primary-deep">{{ textos().adicionarCertificado }}</span>
            <span class="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              {{ textos().adicionarCertificadoDescricao }}
            </span>
            <span class="mt-3 text-xs tracking-wide text-text-secondary">
              {{ certificadosAdicionais.length }} / {{ maximo }} {{ textos().adicionados }}
            </span>
          </button>
          <!-- Mesma altura da linha de erro das caixas de upload, para alinharem na grelha. -->
          <p class="min-h-2 pt-1" aria-hidden="true"></p>
        </div>
      }
    </div>

    <hr class="my-6 border-gray-200 sm:my-8" />

    <div class="grid gap-4 lg:auto-rows-[minmax(20rem,1fr)] lg:grid-cols-2">
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
    </div>

    <!-- Fora da grelha, para não ganhar a altura fixa das linhas. -->
    @if (dossierMuitoGrande()) {
      <p class="mt-4 text-sm text-red-600" role="alert">{{ textos().totalExcedido }}</p>
    }

    <hr class="my-6 border-gray-200 sm:my-8" />

    <!-- 5. Agregação Pedagógica (pedido do cliente): "Não" avisa do prazo, "Sim" pede o certificado. -->
    <div class="flex flex-col gap-4">
      <app-grupo-cartoes-selecao
        class="block sm:max-w-sm"
        formControlName="agregacaoPedagogica"
        variante="caixa"
        [colunas]="2"
        [obrigatorio]="true"
        [label]="textos().agregacaoPergunta"
        [opcoes]="opcoesResposta()"
        [erro]="erros.agregacaoPedagogica()"
      />

      @if (resposta() === 'nao') {
        <app-cartao-aviso
          icone="clock"
          [selo]="textos().agregacaoAvisoSelo"
          [titulo]="textos().agregacaoAvisoTitulo"
          [descricao]="textos().agregacaoAvisoTexto"
        />
      }
      @if (resposta() === 'sim') {
        <app-campo-documento
          class="block sm:max-w-md"
          formControlName="certificadoAgregacao"
          aceita=".pdf,application/pdf"
          icone="file-up"
          iconeAnexado="award"
          [obrigatorio]="true"
          [titulo]="textos().certificadoAgregacao"
          [descricao]="textos().certificadoAgregacaoDescricao"
          [textoSelecionar]="textos().selecionarPdf"
          [textoFormatos]="textos().formatosCertificadoAgregacao"
          [textoAnexado]="textos().anexado"
          [textoSubstituir]="textos().substituir"
          [textoRemover]="textos().remover"
          [erro]="erros.certificadoAgregacao()"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoDossierComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);
  protected readonly estado = inject(CandidaturaGeralEstadoService);
  private readonly dossier = this.estado.dossier;
  protected readonly certificadosAdicionais = this.dossier.controls.certificadosAdicionais;
  protected readonly maximo = MAXIMO_CERTIFICADOS_ADICIONAIS;

  protected readonly erros = criarErrosFormulario([
    'curriculo',
    'certificados',
    'comprovativos',
    'carta',
    'agregacaoPedagogica',
    'certificadoAgregacao',
  ] as const);

  /** "Sim" / "Não" / "" (por responder), como signal — ver `sincronizarCertificadoAgregacao`. */
  protected readonly resposta = toSignal(this.dossier.controls.agregacaoPedagogica.valueChanges, {
    initialValue: this.dossier.controls.agregacaoPedagogica.value,
  });

  protected readonly opcoesResposta = computed<OpcaoCartaoSelecao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return [
      { valor: 'sim', rotulo: t('Sim', 'Yes'), icone: 'check' },
      { valor: 'nao', rotulo: t('Não', 'No'), icone: 'x' },
    ];
  });

  /**
   * Muda a cada evento do dossier ou da lista (caixa junta/retirada, ficheiro
   * escolhido, «Avançar» a marcar tudo como tocado).
   */
  private readonly eventosCertificados = toSignal(
    merge(this.dossier.events, this.certificadosAdicionais.events).pipe(map(() => ({}))),
    { initialValue: {} },
  );

  /** Erro de cada caixa de certificado adicional, pela ordem das caixas. */
  protected readonly errosCertificadosAdicionais = computed(() => {
    this.eventosCertificados();
    return this.certificadosAdicionais.controls.map((_, i) =>
      this.validacao.getErro(this.dossier, `certificadosAdicionais.${i}`),
    );
  });

  protected readonly podeAdicionar = computed(() => {
    this.eventosCertificados();
    return this.certificadosAdicionais.length < MAXIMO_CERTIFICADOS_ADICIONAIS;
  });

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
      curriculo: t('2. Curriculum Vitae Circunstanciado', '2. Detailed Curriculum Vitae'),
      curriculoDescricao: t(
        'Modelo detalhado com publicações, docência e projectos aplicados.',
        'Detailed template with publications, teaching and applied projects.',
      ),
      certificados: t(
        '1. Certificado(s) de Habilitações Literárias & Equivalência',
        '1. Academic Qualification Certificate(s) & Equivalence',
      ),
      certificadosDescricao: t(
        'Arraste o ficheiro PDF ou clique para carregar o certificado do grau mais elevado (e reconhecimento INAAREES para diplomas estrangeiros).',
        'Drag the PDF file or click to upload the certificate of your highest degree (and INAAREES recognition for foreign diplomas).',
      ),
      certificadoAdicional: t('Certificado Adicional', 'Additional Certificate'),
      certificadoAdicionalDescricao: t(
        'Outro certificado de habilitações, equivalência ou formação complementar.',
        'Another qualification, equivalence or further training certificate.',
      ),
      adicionarCertificado: t('Adicionar certificado', 'Add certificate'),
      adicionarCertificadoDescricao: t(
        `Junte até ${MAXIMO_CERTIFICADOS_ADICIONAIS} certificados além do obrigatório.`,
        `Add up to ${MAXIMO_CERTIFICADOS_ADICIONAIS} certificates besides the mandatory one.`,
      ),
      adicionados: t('adicionados', 'added'),
      retirarCaixa: t('Retirar', 'Remove'),
      comprovativos: t(
        '3. Comprovativos de Docência / I&D / Prática Agrícola',
        '3. Proof of Teaching / R&D / Agricultural Practice',
      ),
      comprovativosDescricao: t(
        'Declarações de tempo de serviço, sumários lectivos, artigos científicos de destaque ou certificados de consultoria agrária.',
        'Length-of-service statements, teaching summaries, notable scientific papers or agricultural consultancy certificates.',
      ),
      carta: t('4. Carta de Motivação & Enquadramento Institucional', '4. Motivation Letter & Institutional Fit'),
      cartaDescricao: t(
        'Carta dirigida à Comissão Instaladora da AgroSophia (máximo 1 página com 420 palavras, fonte Times New Roman 12) explanando a visão para o desenvolvimento do sector agrário nacional.',
        'Letter addressed to the AgroSophia Installation Committee (maximum 1 page with 420 words, font Times New Roman 12) setting out your vision for the development of the national agricultural sector.',
      ),
      opcional: t('(Opcional / Valorativo)', '(Optional / Adds value)'),
      selecionarPdf: t('Seleccionar Ficheiro (PDF)', 'Select File (PDF)'),
      selecionarDocumentos: t('Seleccionar Documentos (PDF ou ZIP)', 'Select Documents (PDF or ZIP)'),
      selecionarCarta: t('Seleccionar Carta (PDF)', 'Select Letter (PDF)'),
      formatosCurriculo: t(`Formatos: PDF até ${mb.curriculo}MB`, `Formats: PDF up to ${mb.curriculo}MB`),
      formatosCertificados: t(`Formatos: PDF até ${mb.certificados}MB`, `Formats: PDF up to ${mb.certificados}MB`),
      formatosCertificadoAdicional: t(
        `Formatos: PDF até ${mb.certificadosAdicionais}MB`,
        `Formats: PDF up to ${mb.certificadosAdicionais}MB`,
      ),
      formatosComprovativos: t(
        `Formatos: PDF, ZIP até ${mb.comprovativos}MB`,
        `Formats: PDF, ZIP up to ${mb.comprovativos}MB`,
      ),
      formatosCarta: t(`Formatos: PDF até ${mb.carta}MB`, `Formats: PDF up to ${mb.carta}MB`),
      agregacaoPergunta: t('5. Tem Agregação Pedagógica?', '5. Do you hold a Teaching Qualification?'),
      agregacaoAvisoSelo: t('Atenção ao candidato', 'Note to applicants'),
      agregacaoAvisoTitulo: t(
        'Remeta o certificado nos próximos meses',
        'Submit the certificate in the coming months',
      ),
      agregacaoAvisoTexto: t(
        'Tem entre 3 a 6 meses, a contar da submissão desta candidatura, para remeter o Certificado de Agregação Pedagógica ao Gabinete de Instalação.',
        'You have between 3 and 6 months from submitting this application to send the Teaching Qualification Certificate to the Installation Office.',
      ),
      certificadoAgregacao: t('Certificado de Agregação Pedagógica', 'Teaching Qualification Certificate'),
      certificadoAgregacaoDescricao: t(
        'Arraste o ficheiro PDF ou clique para carregar o certificado de Agregação Pedagógica.',
        'Drag the PDF file or click to upload the Teaching Qualification Certificate.',
      ),
      formatosCertificadoAgregacao: t(
        `Formatos: PDF até ${mb.certificadoAgregacao}MB`,
        `Formats: PDF up to ${mb.certificadoAgregacao}MB`,
      ),
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
