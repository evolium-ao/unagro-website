import {
  AreaCandidaturaGeral,
  DestaqueCandidaturaGeral,
  DocumentoCandidaturaGeral,
  EtapaNumeradaCandidaturaGeral,
  ParceiroCandidaturaGeral,
  TermoReferenciaCandidaturaGeral,
} from '../modelos/candidatura-geral.model';

/** Fim do prazo de submissão, na hora de Luanda (GMT+1). */
export const PRAZO_CANDIDATURA_GERAL = '2026-10-10T23:59:00+01:00';

export const PARCEIROS_CANDIDATURA_GERAL_MOCK: ParceiroCandidaturaGeral[] = [
  { id: 'mescti', icone: 'landmark', nome: { pt: 'MESCTI Angola', en: 'MESCTI Angola' } },
  { id: 'cplp', icone: 'share-2', nome: { pt: 'Rede CPLP', en: 'CPLP Network' } },
  {
    id: 'academia',
    icone: 'graduation-cap',
    nome: { pt: 'Academia Angolana', en: 'Angolan Academy' },
  },
  {
    id: 'investigacao',
    icone: 'sprout',
    nome: { pt: 'Investigação Agrária', en: 'Agricultural Research' },
  },
  { id: 'diaspora', icone: 'earth', nome: { pt: 'Diáspora Global', en: 'Global Diaspora' } },
];

export const DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK: DestaqueCandidaturaGeral[] = [
  {
    id: 'teoria-pratica',
    icone: 'circle-check',
    titulo: { pt: 'Conjugação Teoria e Prática', en: 'Theory Meets Practice' },
    descricao: {
      pt: 'Prática imediata nos 5.000 ha irrigados e laboratórios do Polo.',
      en: 'Immediate practice on the 5,000 irrigated hectares and campus laboratories.',
    },
  },
  {
    id: 'inovacao',
    icone: 'target',
    titulo: { pt: 'Inovação no Agronegócio', en: 'Agribusiness Innovation' },
    descricao: {
      pt: 'Cadeias de valor, mecanização e agroindústria de precisão.',
      en: 'Value chains, mechanisation and precision agro-industry.',
    },
  },
];

export const AREAS_CANDIDATURA_GERAL_MOCK: AreaCandidaturaGeral[] = [
  {
    id: 'engenharia-agronomica',
    numero: 1,
    icone: 'sprout',
    titulo: {
      pt: 'Engenharia Agronómica & Zootécnica',
      en: 'Agronomic & Animal Science Engineering',
    },
    descricao: {
      pt: 'Mecanização agrícola, solos, fitossanidade e pecuária avançada.',
      en: 'Agricultural mechanisation, soils, plant health and advanced livestock farming.',
    },
    especialidades: [
      { pt: 'Agricultura de Precisão & Hidráulica', en: 'Precision Agriculture & Hydraulics' },
      { pt: 'Nutrição & Sanidade Animal', en: 'Animal Nutrition & Health' },
      { pt: 'Horticultura Protegida & Estufas', en: 'Protected Horticulture & Greenhouses' },
    ],
    graus: { pt: 'Doutor / Mestre', en: 'PhD / Master' },
    vagas: 4,
    destaque: true,
  },
  {
    id: 'agro-industria',
    numero: 2,
    icone: 'flask-conical',
    titulo: {
      pt: 'Agro-Indústria & Tecnologia Alimentar',
      en: 'Agro-Industry & Food Technology',
    },
    descricao: {
      pt: 'Processamento alimentar, logística integrada e normas HACCP.',
      en: 'Food processing, integrated logistics and HACCP standards.',
    },
    especialidades: [
      {
        pt: 'Transformação e Embalagem Agroalimentar',
        en: 'Agri-food Processing and Packaging',
      },
      { pt: 'Cadeia de Frio & Logística Integrada', en: 'Cold Chain & Integrated Logistics' },
      { pt: 'Segurança Sanitária dos Alimentos', en: 'Food Safety' },
    ],
    graus: { pt: 'Doutor / Mestre', en: 'PhD / Master' },
    vagas: 3,
    destaque: false,
  },
  {
    id: 'economia-agraria',
    numero: 3,
    icone: 'chart-column',
    titulo: {
      pt: 'Economia Agrária & Gestão de Agronegócio',
      en: 'Agricultural Economics & Agribusiness Management',
    },
    descricao: {
      pt: 'Gestão rural, finanças agrícolas e mercados internacionais.',
      en: 'Rural management, agricultural finance and international markets.',
    },
    especialidades: [
      { pt: 'Gestão Financeira & Análise de Riscos', en: 'Financial Management & Risk Analysis' },
      { pt: 'Comercialização & Exportação Agrícola', en: 'Agricultural Marketing & Export' },
      { pt: 'Cooperativismo e Extensão Rural', en: 'Cooperatives and Rural Extension' },
    ],
    graus: { pt: 'Doutor / Mestre', en: 'PhD / Master' },
    vagas: 3,
    destaque: false,
  },
];

export const TERMOS_REFERENCIA_CANDIDATURA_GERAL_MOCK: TermoReferenciaCandidaturaGeral[] = [
  {
    id: 'agronomia-fitossanidade',
    codigo: 'A.1',
    titulo: {
      pt: 'Departamento de Agronomia e Fitossanidade',
      en: 'Department of Agronomy and Plant Health',
    },
    descricao: {
      pt: 'Disciplinas de fitotecnia, ciência do solo, protecção integrada de culturas e melhoramento vegetal. Perfil com experiência em ensaios de campo e acompanhamento de explorações irrigadas.',
      en: 'Courses in crop science, soil science, integrated crop protection and plant breeding. Profile with experience in field trials and support to irrigated farms.',
    },
  },
  {
    id: 'engenharia-rural',
    codigo: 'A.2',
    titulo: {
      pt: 'Departamento de Engenharia Rural & Mecanização',
      en: 'Department of Rural Engineering & Mechanisation',
    },
    descricao: {
      pt: 'Disciplinas de máquinas agrícolas, hidráulica e sistemas de rega, topografia e construções rurais. Perfil com prática em projectos de mecanização e gestão de água.',
      en: 'Courses in farm machinery, hydraulics and irrigation systems, surveying and rural buildings. Profile with hands-on experience in mechanisation and water management projects.',
    },
  },
  {
    id: 'transformacao-biotecnologia',
    codigo: 'A.3',
    titulo: {
      pt: 'Departamento de Transformação Agroindustrial & Biotecnologia',
      en: 'Department of Agro-industrial Processing & Biotechnology',
    },
    descricao: {
      pt: 'Disciplinas de tecnologia alimentar, microbiologia, controlo de qualidade e biotecnologia aplicada. Perfil com experiência em unidades agroindustriais e laboratórios certificados.',
      en: 'Courses in food technology, microbiology, quality control and applied biotechnology. Profile with experience in agro-industrial plants and certified laboratories.',
    },
  },
];

export const CRITERIOS_CANDIDATURA_GERAL_MOCK: EtapaNumeradaCandidaturaGeral[] = [
  {
    id: 'perfil-hibrido',
    numero: 1,
    titulo: { pt: 'Perfil Híbrido (Académico & Prático)', en: 'Hybrid Profile (Academic & Practical)' },
    descricao: {
      pt: 'Doutoramento/Mestrado aliado à experiência executiva no sector.',
      en: 'PhD/Master’s degree combined with executive experience in the sector.',
    },
  },
  {
    id: 'solo-real',
    numero: 2,
    titulo: { pt: 'Aptidão para «Ensino em Solo Real»', en: 'Aptitude for «Real-Soil Teaching»' },
    descricao: {
      pt: 'Aptidão para aulas práticas em campo e ensaios experimentais.',
      en: 'Aptitude for practical field classes and experimental trials.',
    },
  },
  {
    id: 'investigacao',
    numero: 3,
    titulo: {
      pt: 'Investigação Aplicada & Publicações',
      en: 'Applied Research & Publications',
    },
    descricao: {
      pt: 'Artigos indexados e investigação focada nos desafios africanos.',
      en: 'Indexed articles and research focused on African challenges.',
    },
  },
];

export const PASSOS_CANDIDATURA_GERAL_MOCK: EtapaNumeradaCandidaturaGeral[] = [
  {
    id: 'submissao',
    numero: 1,
    titulo: { pt: 'Submissão do Dossier & Triagem', en: 'Dossier Submission & Screening' },
    descricao: {
      pt: 'Validação documental e triagem curricular eliminatória.',
      en: 'Document validation and eliminatory CV screening.',
    },
    fase: { pt: 'Fase eliminatória', en: 'Eliminatory stage' },
  },
  {
    id: 'entrevista',
    numero: 2,
    titulo: { pt: 'Entrevista Técnico-Pedagógica', en: 'Technical-Pedagogical Interview' },
    descricao: {
      pt: 'Entrevista técnica e prova prática experimental.',
      en: 'Technical interview and practical experimental test.',
    },
    fase: { pt: 'Fase classificatória', en: 'Ranking stage' },
  },
  {
    id: 'homologacao',
    numero: 3,
    titulo: { pt: 'Homologação & Integração', en: 'Approval & Onboarding' },
    descricao: {
      pt: 'Homologação final da lista e integração na IES.',
      en: 'Final approval of the list and onboarding at the institution.',
    },
    fase: { pt: 'Posse & início', en: 'Appointment & start' },
  },
];

export const DOCUMENTOS_CANDIDATURA_GERAL_MOCK: DocumentoCandidaturaGeral[] = [
  {
    id: 'cv',
    titulo: { pt: 'Curriculum Vitae Estruturado', en: 'Structured Curriculum Vitae' },
    descricao: {
      pt: 'CV detalhado e assinado com percurso científico e prático.',
      en: 'Detailed, signed CV with scientific and practical background.',
    },
  },
  {
    id: 'certificados',
    titulo: {
      pt: 'Certificados de Habilitações Literárias',
      en: 'Academic Qualification Certificates',
    },
    descricao: {
      pt: 'Diplomas e notas (homologação INAAREES para estrangeiros).',
      en: 'Diplomas and transcripts (INAAREES recognition for foreign degrees).',
    },
  },
  {
    id: 'experiencia',
    titulo: {
      pt: 'Comprovativo de Experiência no Setor Agrário',
      en: 'Proof of Experience in the Agricultural Sector',
    },
    descricao: {
      pt: 'Declarações de serviço e projetos técnicos no setor.',
      en: 'Employment statements and technical projects in the sector.',
    },
  },
  {
    id: 'identificacao',
    titulo: { pt: 'Documento de Identificação Oficial', en: 'Official Identity Document' },
    descricao: {
      pt: 'Cópia válida do BI ou Passaporte.',
      en: 'Valid copy of ID card or passport.',
    },
  },
  {
    id: 'carta',
    titulo: {
      pt: 'Carta de Motivação Académica (Máx. 2 páginas)',
      en: 'Academic Motivation Letter (Max. 2 pages)',
    },
    descricao: {
      pt: 'Máx. 2 páginas com visão para «Ensino em Solo Real».',
      en: 'Max. 2 pages presenting your vision for «Real-Soil Teaching».',
    },
  },
];
