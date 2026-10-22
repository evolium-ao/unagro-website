import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import {
  descreverTempoTotal,
  descreverTempoTotalPeriodo,
  duracaoPeriodo,
  formatarDuracaoAnos,
  formatarPeriodo,
} from '../../../../core/servicos/tempo-experiencia';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../../shared/componentes/alert-modal/alert-modal.service';
import { BotaoComponent } from '../../../../shared/componentes/botao/botao.component';
import { formatarTamanho } from '../../../../shared/componentes/campo-documento/campo-documento.component';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';
import { opcoesModalVerificarEmail } from '../../componentes/modal-verificar-email.component';
import { CandidaturaGeralEstadoService, LIMITES_DOSSIER_MB } from '../../estado/candidatura-geral-estado.service';
import { ROTA_CANDIDATURA_GERAL } from '../formulario-candidatura.component';
import { BlocoRevisaoComponent } from './bloco-revisao.component';

/** Um par rótulo/valor da grelha de revisão. `ligacao` faz do valor um link. */
interface CampoRevisao {
  rotulo: string;
  valor: string;
  ligacao?: string;
}

/** Campo de ficheiro único do dossier (etapa 3). */
type CampoDossier = 'curriculo' | 'certificados' | 'comprovativos' | 'carta' | 'certificadoAgregacao';

/** Uma linha do dossier na revisão. Sem `ficheiro`, o documento (opcional) não foi anexado. */
interface DocumentoRevisao {
  /** Identifica a linha: o campo, ou `certificadosAdicionais.<i>` para cada certificado adicional. */
  chave: string;
  /** Controlo que o «Alterar» troca. */
  controlo: FormControl<File | null>;
  /** Tamanho máximo por ficheiro, em MB. */
  limite: number;
  titulo: string;
  icone: string;
  ficheiro: string | null;
  selo: string;
  /** `accept` do seletor de ficheiros do «Alterar», o mesmo da etapa 3. */
  aceita: string;
}

const VAZIO = '—';

/**
 * Etapa 4 — Revisão & Submissão (`/candidatura-geral/etapa-4`). Só leitura: mostra
 * o que foi preenchido nas etapas 1 a 3, cada secção com "Editar" para a etapa
 * de origem. A guarda da rota garante que as três estão válidas.
 */
@Component({
  selector: 'app-etapa-4',
  imports: [BlocoRevisaoComponent, BotaoComponent, IconeComponent],
  templateUrl: './etapa-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa4Component {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly modais = inject(AlertModalService);
  protected readonly estado = inject(CandidaturaGeralEstadoService);

  /** Destino do "Editar" de cada secção. Arrays fixos: criados no template, mudariam a cada verificação. */
  protected readonly rotasEditar = [1, 2, 3].map((etapa) => [ROTA_CANDIDATURA_GERAL, `etapa-${etapa}`]);

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      editar: t('Editar', 'Edit'),
      dadosTitulo: t('1. Dados Pessoais & Disciplinas', '1. Personal Details & Courses'),
      dadosDescricao: t(
        'Identificação oficial e departamento académico de enquadramento.',
        'Official identification and academic department.',
      ),
      disciplinas: t('Disciplinas a Leccionar', 'Courses to Teach'),
      formacaoTitulo: t('2. Formação Académica & Experiência', '2. Academic Background & Experience'),
      formacaoDescricao: t(
        'Qualificações académicas, titulação e trajectória profissional consolidada.',
        'Academic qualifications, degrees and established professional career.',
      ),
      dossierTitulo: t('3. Dossier Documental & Declarações Jurídicas', '3. Document Dossier & Legal Declarations'),
      dossierDescricao: t(
        'Ficheiros submetidos para validação pelo Gabinete da Comissão Instaladora.',
        'Files submitted for validation by the Installation Office.',
      ),
      naoAnexado: t('Não anexado (opcional)', 'Not attached (optional)'),
      semExperiencias: t('Nenhuma adicionada', 'None added'),
      agregacaoRotulo: t('Agregação Pedagógica', 'Teaching Qualification'),
      agregacaoSim: t('Sim', 'Yes'),
      agregacaoNao: t('Não', 'No'),
      certificadoAgregacao: t('Certificado de Agregação Pedagógica', 'Teaching Qualification Certificate'),
      alterar: t('Alterar', 'Change'),
      anexar: t('Anexar', 'Attach'),
      alterarDica: t(
        'Pode substituir qualquer documento aqui, sem voltar à etapa 3.',
        'You can replace any document here without going back to step 3.',
      ),
      validarEmail: t('Validar Email', 'Verify Email'),
      emailValidado: t('E-mail validado', 'E-mail verified'),
      emailPorValidar: t(
        'Confirme o e-mail com o código que lhe vamos enviar. Sem esta validação a candidatura não pode ser submetida.',
        'Confirm your e-mail with the code we will send you. Without this verification the application cannot be submitted.',
      ),
    };
  });

  /** O código OTP do e-mail actual já foi confirmado (volta a `false` se o e-mail mudar). */
  protected readonly emailValidado = computed(() => this.estado.codigoOtp() !== null);

  protected validarEmail(): void {
    void this.modais.modal(opcoesModalVerificarEmail({ email: this.estado.dados.controls.email.value }));
  }

  protected readonly camposDados = computed<CampoRevisao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const dados = this.estado.dados.getRawValue();
    return [
      { rotulo: t('Nome Completo', 'Full Name'), valor: dados.nome || VAZIO },
      { rotulo: t('Data de Nascimento', 'Date of Birth'), valor: this.dataComIdade(dados.nascimento) },
      { rotulo: t('N.º de BI / Passaporte', 'ID Card / Passport No.'), valor: dados.documento || VAZIO },
      { rotulo: t('Contacto Telefónico', 'Phone Number'), valor: formatarTelefone(dados.telefone) },
      { rotulo: t('E-mail Principal', 'Main E-mail'), valor: dados.email || VAZIO },
    ];
  });

  protected readonly camposFormacao = computed<CampoRevisao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const formacao = this.estado.formacao.getRawValue();
    const grau = this.conteudo.grausAcademicos().find((opcao) => opcao.id === formacao.grau);
    const pais = this.conteudo.paises().find((opcao) => opcao.id === formacao.pais)?.rotulo;
    const identificador = formacao.identificadorInvestigador.trim();
    const idioma = this.traducao.idioma();
    const docencia = descreverTempoTotalPeriodo(formacao.experienciasDocentes, idioma);
    const pratica = descreverTempoTotal(
      formacao.experienciasProfissionais.map((experiencia) => experiencia.tempo),
      this.conteudo.intervalosExperiencia(),
      idioma,
    );

    return [
      {
        rotulo: t('Grau Académico Mais Elevado', 'Highest Academic Degree'),
        valor: grau ? `${grau.rotulo} (${grau.sigla}) ${t('em', 'in')} ${formacao.curso}` : formacao.curso || VAZIO,
      },
      {
        rotulo: t('Universidade / Faculdade', 'University / Faculty'),
        valor: [formacao.universidade, formacao.faculdade].filter(Boolean).join(' · ') || VAZIO,
      },
      { rotulo: t('País', 'Country'), valor: pais || VAZIO },
      {
        rotulo: t('Identificador de Investigador', 'Researcher Identifier'),
        valor: identificador ? identificador.replace(/^https?:\/\//i, '') : VAZIO,
        ligacao: identificador || undefined,
      },
      { rotulo: t('Tempo Total de Docência', 'Total Teaching Experience'), valor: docencia || VAZIO },
      { rotulo: t('Tempo Total de Experiência Profissional', 'Total Professional Experience'), valor: pratica || VAZIO },
    ];
  });

  /** Listas da etapa 2, uma linha por experiência adicionada. */
  protected readonly experiencias = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const formacao = this.estado.formacao.getRawValue();
    const rotulo = (opcoes: { id: string; rotulo: string }[], id: string) =>
      opcoes.find((opcao) => opcao.id === id)?.rotulo ?? '';
    const idioma = this.traducao.idioma();
    const intervalos = this.conteudo.intervalosExperiencia();
    const areas = this.conteudo.areasTrabalho();
    return [
      {
        titulo: t('Experiência Docente', 'Teaching Experience'),
        itens: formacao.experienciasDocentes.map((experiencia) => ({
          titulo: experiencia.disciplina,
          detalhe: `${experiencia.universidade} · ${experiencia.faculdade} · ${formatarPeriodo(experiencia, idioma)}`,
          tempo: formatarDuracaoAnos(duracaoPeriodo(experiencia), idioma),
        })),
      },
      {
        titulo: t('Experiência Profissional', 'Professional Experience'),
        itens: formacao.experienciasProfissionais.map((experiencia) => ({
          titulo: experiencia.empresa,
          detalhe: rotulo(areas, experiencia.area),
          tempo: rotulo(intervalos, experiencia.tempo),
        })),
      },
    ];
  });

  /** Valor do dossier como signal: o «Alterar» troca ficheiros sem sair desta etapa. */
  private readonly dossier = toSignal(this.estado.dossier.valueChanges.pipe(map(() => this.estado.dossier.getRawValue())), {
    initialValue: this.estado.dossier.getRawValue(),
  });

  /** Erro do último «Alterar» recusado, por documento; o ficheiro anterior mantém-se. */
  protected readonly errosDocumento = signal<Partial<Record<string, string>>>({});

  /** "Sim" / "Não" da pergunta "Tem Agregação Pedagógica?" (etapa 3). */
  protected readonly agregacaoResposta = computed(() => {
    const t = this.textos();
    const resposta = this.dossier().agregacaoPedagogica;
    return resposta === 'sim' ? t.agregacaoSim : resposta === 'nao' ? t.agregacaoNao : VAZIO;
  });

  protected readonly documentos = computed<DocumentoRevisao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const dossier = this.dossier();
    const controlos = this.estado.dossier.controls;
    const descrever = (ficheiro: File | null) =>
      ficheiro ? `${ficheiro.name} (${formatarTamanho(ficheiro.size)})` : null;
    const valido = t('Verificado / Válido', 'Verified / Valid');
    const pdf = '.pdf,application/pdf';
    const unico = (campo: CampoDossier) => ({
      chave: campo,
      controlo: controlos[campo],
      limite: LIMITES_DOSSIER_MB[campo],
      ficheiro: descrever(dossier[campo]),
    });

    // Só os certificados adicionais com ficheiro; a numeração é a das caixas da etapa 3.
    const adicionais: DocumentoRevisao[] = controlos.certificadosAdicionais.controls.flatMap((controlo, i) =>
      dossier.certificadosAdicionais[i]
        ? [
            {
              chave: `certificadosAdicionais.${i}`,
              controlo,
              limite: LIMITES_DOSSIER_MB.certificadosAdicionais,
              titulo: `${t('Certificado Adicional', 'Additional Certificate')} ${i + 1}`,
              icone: 'graduation-cap',
              ficheiro: descrever(dossier.certificadosAdicionais[i]),
              selo: valido,
              aceita: pdf,
            },
          ]
        : [],
    );

    return [
      {
        ...unico('curriculo'),
        titulo: t('Curriculum Vitae Circunstanciado', 'Detailed Curriculum Vitae'),
        icone: 'file-text',
        selo: valido,
        aceita: pdf,
      },
      {
        ...unico('certificados'),
        titulo: t('Certificados de Habilitações & Equivalência', 'Qualification Certificates & Equivalence'),
        icone: 'graduation-cap',
        selo: valido,
        aceita: pdf,
      },
      ...adicionais,
      {
        ...unico('comprovativos'),
        titulo: t('Comprovativos de Docência / I&D', 'Proof of Teaching / R&D'),
        icone: 'archive',
        selo: t('Anexado', 'Attached'),
        aceita: '.pdf,.zip,application/pdf,application/zip',
      },
      {
        ...unico('carta'),
        titulo: t('Carta de Motivação & Enquadramento', 'Motivation Letter & Institutional Fit'),
        icone: 'mail',
        selo: valido,
        aceita: pdf,
      },
      // Só entra na lista com "Sim" na pergunta da etapa 3 — com "Não" não há nada para anexar aqui.
      ...(dossier.agregacaoPedagogica === 'sim'
        ? [
            {
              ...unico('certificadoAgregacao'),
              titulo: t('Certificado de Agregação Pedagógica', 'Teaching Qualification Certificate'),
              icone: 'award',
              selo: valido,
              aceita: pdf,
            },
          ]
        : []),
    ];
  });

  /**
   * «Alterar»/«Anexar» de uma linha do dossier: troca o ficheiro no formulário
   * com as mesmas regras da etapa 3 (tipo, tamanho por documento e total). Se o
   * novo ficheiro for recusado, volta o anterior e a linha mostra o motivo.
   */
  protected alterarDocumento(documento: DocumentoRevisao, evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const novo = entrada.files?.[0];
    // Limpo já, para escolher de novo o mesmo ficheiro voltar a disparar `change`.
    entrada.value = '';
    if (!novo) {
      return;
    }
    const { chave, controlo } = documento;
    const anterior = controlo.value;
    controlo.setValue(novo);

    const erro = this.motivoRecusa(documento);
    if (erro) {
      controlo.setValue(anterior);
      this.errosDocumento.update((erros) => ({ ...erros, [chave]: erro }));
      return;
    }
    controlo.markAsDirty();
    this.errosDocumento.update((erros) => ({ ...erros, [chave]: undefined }));
  }

  /** Porque é que o ficheiro agora na linha não serve, ou `null` se servir. */
  private motivoRecusa({ chave, controlo, limite }: DocumentoRevisao): string | null {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    if (controlo.hasError('ficheiroTipoInvalido')) {
      return chave === 'comprovativos'
        ? t('Formato não aceite: use PDF ou ZIP.', 'Format not accepted: use PDF or ZIP.')
        : t('Formato não aceite: use PDF.', 'Format not accepted: use PDF.');
    }
    if (controlo.hasError('ficheiroMuitoGrande')) {
      return t(`O ficheiro não pode exceder ${limite}MB.`, `The file cannot exceed ${limite}MB.`);
    }
    if (this.estado.dossier.hasError('dossierMuitoGrande')) {
      const total = LIMITES_DOSSIER_MB.total;
      return t(
        `Com este ficheiro o dossier ultrapassa o máximo de ${total}MB.`,
        `With this file the dossier exceeds the ${total}MB maximum.`,
      );
    }
    return null;
  }

  /** `1982-05-14` → `14/05/1982 (44 anos)`. */
  private dataComIdade(iso: string): string {
    const [ano, mes, dia] = iso.split('-').map(Number);
    if (!ano || !mes || !dia) {
      return VAZIO;
    }
    const hoje = new Date();
    const passouAniversario =
      hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);
    const idade = hoje.getFullYear() - ano - (passouAniversario ? 0 : 1);
    const anos = this.traducao.getTraducao(['anos', 'years old']);
    const data = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
    return `${data} (${idade} ${anos})`;
  }
}

/** `923000000` → `+244 923 000 000` (o campo só aceita os 9 dígitos nacionais). */
function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  return digitos.length === 9 ? `+244 ${digitos.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}` : telefone || VAZIO;
}
