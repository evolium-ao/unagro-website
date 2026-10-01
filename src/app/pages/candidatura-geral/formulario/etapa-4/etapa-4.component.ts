import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { formatarTamanho } from '../../../../shared/componentes/campo-documento/campo-documento.component';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';
import { ROTA_CANDIDATURA_GERAL } from '../formulario-candidatura.component';
import { BlocoRevisaoComponent } from './bloco-revisao.component';

/** Um par rótulo/valor da grelha de revisão. `ligacao` faz do valor um link. */
interface CampoRevisao {
  rotulo: string;
  valor: string;
  ligacao?: string;
}

/** Uma linha do dossier na revisão. Sem `ficheiro`, o documento (opcional) não foi anexado. */
interface DocumentoRevisao {
  titulo: string;
  icone: string;
  ficheiro: string | null;
  selo: string;
}

const VAZIO = '—';

/**
 * Etapa 4 — Revisão & Submissão (`/candidatura-geral/etapa-4`). Só leitura: mostra
 * o que foi preenchido nas etapas 1 a 3, cada secção com "Editar" para a etapa
 * de origem. A guarda da rota garante que as três estão válidas.
 */
@Component({
  selector: 'app-etapa-4',
  imports: [BlocoRevisaoComponent, IconeComponent],
  templateUrl: './etapa-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa4Component {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  protected readonly estado = inject(CandidaturaGeralEstadoService);

  /** Destino do "Editar" de cada secção. Arrays fixos: criados no template, mudariam a cada verificação. */
  protected readonly rotasEditar = [1, 2, 3].map((etapa) => [ROTA_CANDIDATURA_GERAL, `etapa-${etapa}`]);

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      editar: t('Editar', 'Edit'),
      dadosTitulo: t('1. Dados Pessoais & Área de Candidatura', '1. Personal Details & Application Area'),
      dadosDescricao: t(
        'Identificação oficial e departamento académico de enquadramento.',
        'Official identification and academic department.',
      ),
      areaPrioritaria: t('Área Prioritária Selecionada', 'Selected Priority Area'),
      vagas: t('Vagas Disponíveis', 'Available Positions'),
      areaComplementar: t('Área Interdisciplinar / Linha de Investigação', 'Interdisciplinary Area / Research Line'),
      formacaoTitulo: t('2. Formação Académica & Experiência Docente', '2. Academic Background & Teaching Experience'),
      formacaoDescricao: t(
        'Qualificações académicas, titulação e trajectória profissional consolidada.',
        'Academic qualifications, degrees and established professional career.',
      ),
      dossierTitulo: t('3. Dossier Documental & Declarações Jurídicas', '3. Document Dossier & Legal Declarations'),
      dossierDescricao: t(
        'Ficheiros submetidos para validação pelo Gabinete de Instalação.',
        'Files submitted for validation by the Installation Office.',
      ),
      naoAnexado: t('Não anexado (opcional)', 'Not attached (optional)'),
    };
  });

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

  protected readonly areaComplementar = computed(() => this.estado.dados.getRawValue().areaComplementar || VAZIO);

  protected readonly camposFormacao = computed<CampoRevisao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const formacao = this.estado.formacao.getRawValue();
    const grau = this.conteudo.grausAcademicos().find((opcao) => opcao.id === formacao.grau);
    const intervalo = (id: string) =>
      this.conteudo.intervalosExperiencia().find((opcao) => opcao.id === id)?.rotulo ?? '';
    const docencia = intervalo(formacao.tempoDocencia);
    const pratica = intervalo(formacao.experienciaPratica);
    const identificador = formacao.identificadorInvestigador.trim();

    return [
      {
        rotulo: t('Grau Académico Mais Elevado', 'Highest Academic Degree'),
        valor: grau
          ? `${grau.rotulo} (${grau.sigla}) ${t('em', 'in')} ${formacao.especializacao}`
          : formacao.especializacao || VAZIO,
      },
      { rotulo: t('Instituição Concedente', 'Awarding Institution'), valor: formacao.instituicao || VAZIO },
      {
        rotulo: t('Identificador de Investigador', 'Researcher Identifier'),
        valor: identificador ? identificador.replace(/^https?:\/\//i, '') : VAZIO,
        ligacao: identificador || undefined,
      },
      {
        rotulo: t('Experiência no Ensino Superior', 'Higher Education Experience'),
        valor: docencia ? `${docencia} ${t('de docência efetiva', 'of effective teaching')}` : VAZIO,
      },
      {
        rotulo: t('Experiência Prática no Agronegócio / I&D', 'Practical Experience in Agribusiness / R&D'),
        valor: pratica ? `${pratica} ${t('em projetos de campo', 'in field projects')}` : VAZIO,
      },
    ];
  });

  protected readonly documentos = computed<DocumentoRevisao[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const dossier = this.estado.dossier.getRawValue();
    const descrever = (ficheiro: File | null) =>
      ficheiro ? `${ficheiro.name} (${formatarTamanho(ficheiro.size)})` : null;
    const valido = t('Verificado / Válido', 'Verified / Valid');

    return [
      {
        titulo: t('Curriculum Vitae Circunstanciado', 'Detailed Curriculum Vitae'),
        icone: 'file-text',
        ficheiro: descrever(dossier.curriculo),
        selo: valido,
      },
      {
        titulo: t('Certificados de Habilitações & Equivalência', 'Qualification Certificates & Equivalence'),
        icone: 'graduation-cap',
        ficheiro: descrever(dossier.certificados),
        selo: valido,
      },
      {
        titulo: t('Comprovativos de Docência / I&D', 'Proof of Teaching / R&D'),
        icone: 'archive',
        ficheiro: descrever(dossier.comprovativos),
        selo: t('Anexado', 'Attached'),
      },
      {
        titulo: t('Carta de Motivação & Enquadramento', 'Motivation Letter & Institutional Fit'),
        icone: 'mail',
        ficheiro: descrever(dossier.carta),
        selo: valido,
      },
    ];
  });

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
