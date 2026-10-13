import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { SeletorDisciplinasComponent } from '../componentes/seletor-disciplinas.component';
import { LIMITES_DOSSIER_MB } from '../estado/candidatura-geral-estado.service';
import { BannerDestaqueComponent } from '../../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoRecursoComponent } from '../../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { CartaoRequisitoComponent } from '../../../shared/componentes/cartao-requisito/cartao-requisito.component';
import { ContadorRegressivoComponent } from '../../../shared/componentes/contador-regressivo/contador-regressivo.component';
import { ContainerPaginaComponent } from '../../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/** Primeira etapa do formulário — destino do hero e dos cartões de área. */
export const ROTA_ETAPA_1 = '/candidatura-geral/etapa-1';

@Component({
  selector: 'app-candidatura-geral-inicio',
  imports: [
    BannerDestaqueComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoRecursoComponent,
    CartaoRequisitoComponent,
    SeletorDisciplinasComponent,
    FormsModule,
    ContadorRegressivoComponent,
    EspacoImagemComponent,
    IconeComponent,
    BotaoComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './candidatura-geral-inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidaturaGeralInicioComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly router = inject(Router);

  protected readonly rotaEtapa1 = ROTA_ETAPA_1;

  protected readonly destaquesVisao = this.conteudo.destaquesVisao;
  protected readonly areas = this.conteudo.areas;
  protected readonly criterios = this.conteudo.criterios;
  protected readonly passos = this.conteudo.passos;
  protected readonly documentos = this.conteudo.documentos;
  protected readonly prazo = this.conteudo.prazo;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      heroSelo: t('Fase provisória / Manifestação de interesse', 'Provisional stage / Expression of interest'),
      heroTitulo: t('Docentes, investigadores e especialistas no sector do', 'Lecturers, researchers and specialists in the'),
      heroDestaque: t('agronegócio', 'agribusiness'),
      heroFim: t('', 'sector'),
      heroSubtitulo: t(
        'A AGROSOPHIA, Lda. procura docentes, investigadores e especialistas no sector do agronegócio para desenvolver um projecto institucional com sede no Icolo e Bengo (50km de Luanda) virado para o ensino superior e prática do agronegócio. Os Mestres e Doutores serão preferenciados.',
        'AGROSOPHIA, Lda. is looking for lecturers, researchers and specialists in the agribusiness sector to develop an institutional project based in Icolo e Bengo (50km from Luanda) focused on higher education and agribusiness practice. Masters and Doctors will be given preference.',
      ),
      heroCandidatar: t('Candidatar', 'Apply'),
      heroPrazo: t('Prazo até 31 de Outubro de 2026', 'Deadline 31 October 2026'),
      heroLogoAlt: t('Logótipo AgroSophia', 'AgroSophia logo'),
      parceirosTitulo: t(
        'Enquadramento institucional & cooperação científica',
        'Institutional framework & scientific cooperation',
      ),
      visaoRotulo: t('Visão institucional', 'Institutional vision'),
      visaoTitulo: t(
        'Construindo a Base Académica do Agronegócio Angolano',
        'Building the Academic Foundation of Angolan Agribusiness',
      ),
      visaoTexto: t(
        'Ao abrigo do Decreto Executivo n.º 337/22 (MESCTI), está aberto o concurso para constituição do corpo docente da nova IES no Polo da Quiminha.',
        'Under Executive Decree no. 337/22 (MESCTI), applications are open to build the faculty of the new higher education institution at the Quiminha campus.',
      ),
      disciplinaRotulo: t('Atribuição de cátedras & regência', 'Chair & course assignment'),
      disciplinaTitulo: t('Escolha a Disciplina a Lecionar', 'Choose the Course to Teach'),
      disciplinaDescricao: t(
        'Indique a unidade curricular de preferência para aceder aos módulos curriculares, perfil de competências e submeter a sua candidatura.',
        'Indicate your preferred course unit to access the curricular modules and competence profile, and submit your application.',
      ),
      disciplinaAvisoSelo: t('Atenção ao candidato', 'Note to applicants'),
      disciplinaAvisoTitulo: t('Selecione a disciplina que pretende lecionar', 'Select the course you wish to teach'),
      disciplinaAvisoTexto: t(
        'Carregue os requisitos curriculares específicos por unidade curricular e submeta a sua intenção formal de regência e leccionação no concurso.',
        'Upload the specific curricular requirements for each course unit and submit your formal intention to lead and teach in the competition.',
      ),
      disciplinaRodape: t(
        'As disciplinas selecionadas serão incorporadas no seu dossier de candidatura docente ao submeter.',
        'The selected courses will be included in your lecturer application dossier when you submit.',
      ),
      disciplinaConfirmar: t('Confirmar Seleção', 'Confirm Selection'),
      criteriosRotulo: t('Perfil do candidato & requisitos', 'Candidate profile & requirements'),
      criteriosTitulo: t('Critérios de Admissão e Qualificação', 'Admission and Qualification Criteria'),
      criteriosDescricao: t('Perfil técnico e rigor académico com vivência de campo.', 'Technical profile and academic rigour with field experience.'),
      passosRotulo: t('Fases do concurso', 'Selection stages'),
      passosTitulo: t('Como Candidatar-se em 3 Passos', 'How to Apply in 3 Steps'),
      passosDescricao: t(
        'Procedimento selectivo transparente, público e baseado no mérito comprovado.',
        'A transparent, public selection procedure based on proven merit.',
      ),
      documentosRotulo: t('Instrução do processo', 'Application file'),
      documentosTitulo: t('Documentos Obrigatórios da Candidatura', 'Mandatory Application Documents'),
      documentosDescricao: t(
        `Dossier unificado em PDF legível (máx. ${LIMITES_DOSSIER_MB.total}MB).`,
        `Single, legible PDF dossier (max. ${LIMITES_DOSSIER_MB.total}MB).`,
      ),
      prazoSelo: t('Prazo impreterível de submissão', 'Final submission deadline'),
      prazoTitulo: t('31 de Outubro de 2026 às 23h59', '31 October 2026 at 11:59 pm'),
      prazoTexto: t(
        'Horário Oficial de Luanda (GMT+1). Candidaturas recepcionadas após este termo serão integradas na bolsa suplementar de reserva curricular docente.',
        'Official Luanda time (GMT+1). Applications received after this deadline will join the supplementary faculty reserve pool.',
      ),
      prazoCandidatar: t('Candidatar-me agora', 'Apply now'),
      contador: {
        dias: t('Dias', 'Days'),
        horas: t('Horas', 'Hours'),
        minutos: t('Minutos', 'Minutes'),
        segundos: t('Segundos', 'Seconds'),
      },
    };
  });

  protected readonly selosHero = computed(() => [this.textos().heroSelo]);

  /** Contacto oficial da convocatória, mostrado no campo do hero. */
  protected readonly emailContacto = 'agrosophia@yahoo.com';

  /**
   * 3 sessão — `id`s das disciplinas adicionadas no `app-seletor-disciplinas`.
   * «Confirmar Seleção» leva-os à etapa 1, que os pré-preenche no formulário.
   */
  protected readonly disciplinasAdicionadas = signal<string[]>([]);

  /** Abre a etapa 1 com as disciplinas escolhidas em `?disciplinas=id1,id2`. */
  protected confirmarSelecao(): void {
    const ids = this.disciplinasAdicionadas();
    if (!ids.length) {
      return;
    }
    void this.router.navigate([this.rotaEtapa1], { queryParams: { disciplinas: ids.join(',') } });
  }
}
