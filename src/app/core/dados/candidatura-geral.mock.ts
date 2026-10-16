import {
  AreaCandidaturaGeral,
  DestaqueCandidaturaGeral,
  DocumentoCandidaturaGeral,
  EtapaNumeradaCandidaturaGeral,
  GrauAcademicoCandidaturaGeral,
  OpcaoCandidaturaGeral,
  OpcaoTempoCandidaturaGeral,
} from '../modelos/candidatura-geral.model';

/** Fim do prazo de submissão, na hora de Luanda (GMT+1). */
export const PRAZO_CANDIDATURA_GERAL = '2026-10-31T23:59:00+01:00';

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

export const CRITERIOS_CANDIDATURA_GERAL_MOCK: EtapaNumeradaCandidaturaGeral[] = [
  {
    id: 'perfil-academico',
    numero: 1,
    titulo: { pt: 'Perfil Académico', en: 'Academic Profile' },
    descricao: {
      pt: 'Licenciados/Mestres/Doutorados',
      en: 'Bachelor’s/Master’s/Doctoral graduates',
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
      pt: 'Habilitações Literárias',
      en: 'Academic Qualifications',
    },
    descricao: {
      pt: 'Diplomas e certificados homologados pelo INAAREES',
      en: 'Diplomas and certificates recognised by INAAREES',
    },
  },
  {
    id: 'experiencia',
    titulo: {
      pt: 'Comprovativo de Experiência no Setor Agrário (Se aplicável)',
      en: 'Proof of Experience in the Agricultural Sector (If applicable)',
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
      pt: 'Cópia válida do BI ou passaporte (para estrangeiros)',
      en: 'Valid copy of ID card or passport (for foreign nationals)',
    },
  },
  {
    id: 'carta',
    titulo: {
      pt: 'Carta de motivação Académica (Máx. 1 página com 420 palavras, Fonte: Times New Roman 12)',
      en: 'Academic Motivation Letter (Max. 1 page with 420 words, Font: Times New Roman 12)',
    },
    descricao: {
      pt: 'Máx. 1 página com visão para «Ensino em Solo Real».',
      en: 'Max. 1 page presenting your vision for «Real-Soil Teaching».',
    },
  },
];

export const GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK: GrauAcademicoCandidaturaGeral[] = [
  {
    id: 'licenciatura',
    icone: 'award',
    rotulo: { pt: 'Licenciatura', en: "Bachelor's" },
    sigla: { pt: 'BSc/BA', en: 'BSc/BA' },
  },
  {
    id: 'mestrado',
    icone: 'graduation-cap',
    rotulo: { pt: 'Mestrado', en: "Master's" },
    sigla: { pt: 'MSc/MA', en: 'MSc/MA' },
  },
  { id: 'doutoramento', icone: 'badge-check', rotulo: { pt: 'Doutoramento', en: 'Doctorate' }, sigla: { pt: 'PhD', en: 'PhD' } },
  {
    id: 'pos-doutoramento',
    icone: 'flask-conical',
    rotulo: { pt: 'Pós-Doutoramento', en: 'Postdoctorate' },
    sigla: { pt: 'Post-Doc', en: 'Post-Doc' },
  },
];

/** Intervalos de anos de cada experiência profissional (etapa 2, secção 3). */
export const INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK: OpcaoTempoCandidaturaGeral[] = [
  { id: 'menos-1', min: 0, max: 1, rotulo: { pt: 'Menos de 1 ano', en: 'Less than 1 year' } },
  { id: '1-3', min: 1, max: 3, rotulo: { pt: 'De 1 a 3 anos', en: '1 to 3 years' } },
  { id: '4-7', min: 4, max: 7, rotulo: { pt: 'De 4 a 7 anos', en: '4 to 7 years' } },
  { id: '8-12', min: 8, max: 12, rotulo: { pt: 'De 8 a 12 anos', en: '8 to 12 years' } },
  // `min` é inclusivo: "mais de 12" começa nos 13.
  { id: 'mais-12', min: 13, max: null, rotulo: { pt: 'Mais de 12 anos', en: 'More than 12 years' } },
];

/** A partir daqui a docência entra como "N anos ou mais" (pedido do cliente). */
export const ANOS_DOCENCIA_EM_ABERTO = 5;

/** Anos de cada experiência docente (etapa 2, secção 2): "1 ano" … "4 anos" e "5 anos ou mais". */
export const TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK: OpcaoTempoCandidaturaGeral[] = [
  ...Array.from({ length: ANOS_DOCENCIA_EM_ABERTO - 1 }, (_, i) => {
    const anos = i + 1;
    return {
      id: String(anos),
      min: anos,
      max: anos,
      rotulo: anos === 1 ? { pt: '1 ano', en: '1 year' } : { pt: `${anos} anos`, en: `${anos} years` },
    };
  }),
  {
    id: `${ANOS_DOCENCIA_EM_ABERTO}-ou-mais`,
    min: ANOS_DOCENCIA_EM_ABERTO,
    max: null,
    rotulo: {
      pt: `${ANOS_DOCENCIA_EM_ABERTO} anos ou mais`,
      en: `${ANOS_DOCENCIA_EM_ABERTO} years or more`,
    },
  },
];

/** Áreas de trabalho da experiência profissional — seguem os departamentos da oferta curricular. */
export const AREAS_TRABALHO_CANDIDATURA_GERAL_MOCK: OpcaoCandidaturaGeral[] = [
  { id: 'producao-vegetal', rotulo: { pt: 'Agronomia e Produção Vegetal', en: 'Agronomy and Crop Production' } },
  { id: 'producao-animal', rotulo: { pt: 'Zootecnia e Produção Animal', en: 'Animal Science and Livestock Production' } },
  { id: 'mecanizacao', rotulo: { pt: 'Mecanização e Agricultura de Precisão', en: 'Mechanisation and Precision Agriculture' } },
  { id: 'aquacultura', rotulo: { pt: 'Piscicultura e Produção Aquática', en: 'Fish Farming and Aquaculture' } },
  { id: 'agro-industria', rotulo: { pt: 'Processamento Agro-Industrial', en: 'Agro-Industrial Processing' } },
  { id: 'logistica', rotulo: { pt: 'Logística e Cadeia de Abastecimento', en: 'Logistics and Supply Chain' } },
  { id: 'qualidade', rotulo: { pt: 'Qualidade e Segurança Alimentar', en: 'Food Quality and Safety' } },
  { id: 'gestao', rotulo: { pt: 'Gestão e Administração de Empresas', en: 'Business Management and Administration' } },
  { id: 'economia-agraria', rotulo: { pt: 'Economia Agrária e Desenvolvimento Rural', en: 'Agricultural Economics and Rural Development' } },
  { id: 'comercio', rotulo: { pt: 'Comércio Internacional', en: 'International Trade' } },
  { id: 'financas', rotulo: { pt: 'Contabilidade e Finanças', en: 'Accounting and Finance' } },
  { id: 'florestas', rotulo: { pt: 'Ciências Florestais e Ambiente', en: 'Forestry and Environment' } },
  { id: 'investigacao', rotulo: { pt: 'Investigação Agrária (I&D)', en: 'Agricultural Research (R&D)' } },
  { id: 'extensao', rotulo: { pt: 'Extensão Rural e Consultoria', en: 'Rural Extension and Consultancy' } },
  { id: 'outra', rotulo: { pt: 'Outra', en: 'Other' } },
];

/**
 * Países da formação académica (ISO 3166-1 alfa-2). Os nomes saem do
 * `Intl.DisplayNames` no idioma do site, por isso aqui só vão os códigos.
 */
export const PAISES_CANDIDATURA_GERAL = (
  'AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM ' +
  'CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN ' +
  'HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA ' +
  'MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW ' +
  'PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW ' +
  'TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW'
).split(' ');

/** País pré-seleccionado na formação académica. */
export const PAIS_PADRAO_CANDIDATURA_GERAL = 'AO';
