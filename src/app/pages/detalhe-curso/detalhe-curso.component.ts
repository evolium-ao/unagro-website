import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { CursosService } from '../../core/servicos/cursos.service';
import { SeoService } from '../../core/seo/seo.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AcordeaoComponent } from '../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../shared/componentes/acordeao/item-acordeao.component';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';

/** Um facto do curso apresentado na faixa de métricas sob o hero. */
interface MetricaCurso {
  id: string;
  icone: string;
  valor: string;
  rotulo: string;
}

interface ItemMetodologia {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

interface PerguntaCurso {
  id: string;
  pergunta: TextoTraduzido;
  resposta: TextoTraduzido;
}

/**
 * Metodologia, requisitos de admissão e dúvidas frequentes são iguais para toda a
 * oferta formativa, por isso vivem aqui e não no mock de cada curso.
 */
const METODOLOGIA_BRUTA: ItemMetodologia[] = [
  {
    icone: 'flask-conical',
    titulo: { pt: 'Aulas Práticas Laboratoriais', en: 'Hands-on Laboratory Classes' },
    descricao: {
      pt: '50% da carga horária dedicada à experimentação em laboratórios modernos de solos e biotecnologia.',
      en: '50% of the course load is devoted to experimentation in modern soil and biotechnology laboratories.',
    },
  },
  {
    icone: 'sprout',
    titulo: { pt: 'Visitas Técnicas & Campos', en: 'Field Trips & Experimental Plots' },
    descricao: {
      pt: 'Experiência directa em explorações agrícolas reais e no nosso campo experimental de 5ha.',
      en: 'Direct experience on working farms and at our 5-hectare experimental station.',
    },
  },
];

const REQUISITOS_ADMISSAO_BRUTOS: TextoTraduzido[] = [
  {
    pt: 'Conclusão do Ensino Médio (Puniv ou Médio Técnico em áreas afins).',
    en: 'Completed secondary education (Puniv or technical secondary school in a related field).',
  },
  {
    pt: 'Aprovação no Exame de Acesso (Matemática e Biologia).',
    en: 'A pass in the entrance exam (Mathematics and Biology).',
  },
  {
    pt: 'Apresentação de documentos legais e pagamento da taxa de inscrição.',
    en: 'Submission of legal documents and payment of the application fee.',
  },
];

const FAQ_CURSO_BRUTO: PerguntaCurso[] = [
  {
    id: 'estagio',
    pergunta: {
      pt: 'O curso tem estágio garantido?',
      en: 'Does the course include a guaranteed internship?',
    },
    resposta: {
      pt: 'Sim. O estágio profissional faz parte do plano curricular e é assegurado através da nossa rede de parceiros do sector agrícola e do campo experimental da UNAGRO.',
      en: 'Yes. The professional internship is part of the curriculum and is secured through our network of partners in the agricultural sector and at UNAGRO’s own experimental station.',
    },
  },
  {
    id: 'horarios',
    pergunta: { pt: 'Quais são os horários das aulas?', en: 'What are the class schedules?' },
    resposta: {
      pt: 'Depende do regime: as turmas presenciais funcionam das 8h às 13h e as turmas pós-laborais das 17h30 às 21h30, de segunda a sexta-feira.',
      en: 'It depends on the study mode: on-campus groups run from 8:00 AM to 1:00 PM and evening groups from 5:30 PM to 9:30 PM, Monday to Friday.',
    },
  },
];

@Component({
  selector: 'app-detalhe-curso',
  imports: [
    BannerDestaqueComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    EspacoImagemComponent,
    AcordeaoComponent,
    ItemAcordeaoComponent,
    BotaoComponent,
    SeloComponent,
    IconeComponent,
  ],
  templateUrl: './detalhe-curso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalheCursoComponent {
  /** Vem do segmento `:id` da rota `/cursos/:id` — é o nome do curso em slug. */
  readonly id = input.required<string>();

  protected readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);
  private readonly seo = inject(SeoService);

  protected readonly curso = computed(() => this.cursosService.cursos().find((c) => c.id === this.id()));

  protected readonly totalDisciplinas = computed(() =>
    (this.curso()?.planoCurricular ?? []).reduce((total, ano) => total + ano.disciplinas.length, 0),
  );

  /** O hero realça a última palavra do título a dourado — ex.: "Engenharia" + "Agronómica". */
  protected readonly tituloPartes = computed(() => {
    const titulo = this.curso()?.titulo ?? '';
    const separador = titulo.lastIndexOf(' ');
    return separador === -1
      ? { inicio: titulo, destaque: undefined }
      : { inicio: titulo.slice(0, separador), destaque: titulo.slice(separador + 1) };
  });

  protected readonly selosHero = computed(() => [this.traducao.t('paginas.detalheCurso.heroSelo')]);

  /** A frase de abertura da secção 1 nomeia o curso aberto — o dicionário traz `{curso}` como marcador. */
  protected readonly secao1Paragrafo1 = computed(() =>
    this.traducao
      .t('paginas.detalheCurso.secao1Paragrafo1')
      .replace('{curso}', this.curso()?.titulo ?? ''),
  );

  protected readonly ctaFinalDescricao = computed(() =>
    this.traducao
      .t('paginas.detalheCurso.ctaFinalDescricao')
      .replace('{curso}', this.curso()?.titulo ?? ''),
  );

  /** O acordeão mostra "1º Ano: Fundamentos Científicos" quando o ano tem tema definido. */
  protected readonly anosPlano = computed(() =>
    (this.curso()?.planoCurricular ?? []).map((ano) => ({
      ano: ano.ano,
      titulo: ano.tema ? `${ano.titulo}: ${ano.tema}` : ano.titulo,
      disciplinas: ano.disciplinas,
    })),
  );

  protected readonly metodologia = computed(() =>
    localizarProfundo(METODOLOGIA_BRUTA, this.traducao.idioma()),
  );
  protected readonly requisitosAdmissao = computed(() =>
    localizarProfundo(REQUISITOS_ADMISSAO_BRUTOS, this.traducao.idioma()),
  );
  protected readonly faqCurso = computed(() =>
    localizarProfundo(FAQ_CURSO_BRUTO, this.traducao.idioma()),
  );

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/candidaturas/admissao-candidatura#secao-portal',
      texto: this.traducao.t('paginas.detalheCurso.heroCtaCandidatar'),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
    {
      link: `/cursos/${this.id()}#plano-curricular`,
      texto: this.traducao.t('paginas.detalheCurso.heroCtaPlano'),
      variante: 'glass',
    },
  ]);

  protected readonly metricas = computed<MetricaCurso[]>(() => {
    const curso = this.curso();
    if (!curso) {
      return [];
    }

    const metricas: MetricaCurso[] = [
      {
        id: 'duracao',
        icone: 'clock',
        valor: curso.duracao,
        rotulo: this.traducao.t('paginas.detalheCurso.metricaDuracao'),
      },
      {
        id: 'grau',
        icone: 'graduation-cap',
        valor: curso.grau,
        rotulo: this.traducao.t('paginas.detalheCurso.metricaGrau'),
      },
      {
        id: 'regime',
        icone: 'briefcase',
        valor: curso.regime,
        rotulo: this.traducao.t('paginas.detalheCurso.metricaRegime'),
      },
      {
        id: 'disciplinas',
        icone: 'file-text',
        valor: String(this.totalDisciplinas()),
        rotulo: this.traducao.t('paginas.detalheCurso.metricaDisciplinas'),
      },
    ];

    // Só os cursos de curta duração anunciam a data da próxima entrada.
    if (curso.proximaData) {
      metricas.push({
        id: 'proxima-data',
        icone: 'calendar',
        valor: curso.proximaData,
        rotulo: this.traducao.t('paginas.detalheCurso.metricaProximaData'),
      });
    }

    return metricas;
  });

  protected readonly outrosCursos = computed(() => {
    const curso = this.curso();
    if (!curso) {
      return [];
    }
    return this.cursosService
      .cursos()
      .filter((c) => c.faculdade === curso.faculdade && c.id !== curso.id)
      .slice(0, 3);
  });

  constructor() {
    effect(() => {
      const curso = this.curso();
      this.seo.definirTituloDinamico(curso ? curso.titulo : null);
    });
  }
}
