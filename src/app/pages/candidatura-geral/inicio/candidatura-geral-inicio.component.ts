import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AcordeaoComponent } from '../../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../../shared/componentes/acordeao/item-acordeao.component';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
  MetadadoBanner,
} from '../../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoRecursoComponent } from '../../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { CartaoRequisitoComponent } from '../../../shared/componentes/cartao-requisito/cartao-requisito.component';
import { ContadorRegressivoComponent } from '../../../shared/componentes/contador-regressivo/contador-regressivo.component';
import { ContainerPaginaComponent } from '../../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { SeloComponent } from '../../../shared/componentes/selo/selo.component';
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
    AcordeaoComponent,
    ItemAcordeaoComponent,
    ContadorRegressivoComponent,
    EspacoImagemComponent,
    IconeComponent,
    SeloComponent,
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

  protected readonly parceiros = this.conteudo.parceiros;
  protected readonly destaquesVisao = this.conteudo.destaquesVisao;
  protected readonly areas = this.conteudo.areas;
  /** Começa na área marcada como `destaque` no mock (ou na primeira). */
  protected readonly areaSelecionada = linkedSignal(
    () => this.areas().find((area) => area.destaque)?.id ?? this.areas()[0]?.id ?? null,
  );
  protected readonly termosReferencia = this.conteudo.termosReferencia;
  protected readonly criterios = this.conteudo.criterios;
  protected readonly passos = this.conteudo.passos;
  protected readonly documentos = this.conteudo.documentos;
  protected readonly prazo = this.conteudo.prazo;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      heroSelo: t('Fase provisória / Manifestação de interesse', 'Provisional stage / Expression of interest'),
      heroTitulo: t('Processo de', 'Faculty'),
      heroDestaque: t('Candidatura', 'Application'),
      heroFim: t('para Docentes', 'Process'),
      heroSubtitulo: t(
        'Convocatória oficial para mestres, doutores e investigadores em Angola e na diáspora. Um compromisso rigoroso com a excelência científica, a soberania alimentar e o futuro da inovação agro-industrial em solo nacional.',
        'Official call for masters, doctors and researchers in Angola and the diaspora. A rigorous commitment to scientific excellence, food sovereignty and the future of agro-industrial innovation on national soil.',
      ),
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
      areasRotulo: t('Áreas de especialização', 'Areas of specialisation'),
      areasTitulo: t('Explore as Áreas e Descubra Oportunidades', 'Explore the Areas and Discover Opportunities'),
      areasDescricao: t(
        'Vagas abertas para as áreas prioritárias do setor agrícola e agroindustrial.',
        'Open positions in the priority areas of the agricultural and agro-industrial sector.',
      ),
      vagasAbertas: t('Vagas abertas', 'Open positions'),
      submeterPerfil: t('Submeter perfil', 'Submit profile'),
      selecionar: t('Seleccionar', 'Select'),
      selecionarArea: t('Seleccionar área', 'Select area'),
      graus: t('Graus', 'Degrees'),
      termosTitulo: t('Termos de Referência por Área Científica', 'Terms of Reference by Scientific Area'),
      termosDescricao: t(
        'Consulte as disciplinas específicas, perfis académicos e tarefas nucleares para cada departamento.',
        'See the specific courses, academic profiles and core duties for each department.',
      ),
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
      documentosDescricao: t('Dossier unificado em PDF legível (máx. 15MB).', 'Single, legible PDF dossier (max. 15MB).'),
      prazoSelo: t('Prazo impreterível de submissão', 'Final submission deadline'),
      prazoTitulo: t('10 de Outubro de 2026 às 23h59', '10 October 2026 at 11:59 pm'),
      prazoTexto: t(
        'Horário Oficial de Luanda (GMT+1). Candidaturas recepcionadas após este termo serão integradas na bolsa suplementar de reserva curricular docente.',
        'Official Luanda time (GMT+1). Applications received after this deadline will join the supplementary faculty reserve pool.',
      ),
      prazoNota: t(
        'O Gabinete Instalador emitirá aviso de recepção digital individual em até 5 dias úteis após submissão.',
        'The Installation Office will issue an individual digital acknowledgement within 5 working days of submission.',
      ),
      contador: {
        dias: t('Dias', 'Days'),
        horas: t('Horas', 'Hours'),
        minutos: t('Minutos', 'Minutes'),
        segundos: t('Segundos', 'Seconds'),
      },
    };
  });

  protected readonly selosHero = computed(() => [this.textos().heroSelo]);

  protected readonly metadadosHero = computed<MetadadoBanner[]>(() => [
    {
      icone: 'award',
      texto: this.traducao.getTraducao([
        '5 Áreas Prioritárias · Prazo até 10 Out 2026',
        '5 Priority Areas · Deadline 10 Oct 2026',
      ]),
    },
  ]);

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      texto: this.traducao.getTraducao(['Candidatar-se', 'Apply now']),
      variante: 'secundario',
      link: this.rotaEtapa1,
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
  ]);

  protected selecionarArea(area: string): void {
    this.areaSelecionada.set(area);
  }

  protected abrirFormularioComArea(area: string): void {
    void this.router.navigate([this.rotaEtapa1], { queryParams: { area } });
  }
}
