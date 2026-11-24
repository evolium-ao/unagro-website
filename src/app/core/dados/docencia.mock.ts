import { RequisitoDocencia, TitulacaoDocencia, VantagemDocencia } from '../modelos/docencia.model';

export const VANTAGENS_DOCENCIA_MOCK: VantagemDocencia[] = [
  {
    id: 'laboratorios',
    icone: 'flask-conical',
    titulo: { pt: 'Laboratórios de Ponta', en: 'Cutting-edge Laboratories' },
    descricao: {
      pt: 'Acesso exclusivo a instalações de pesquisa biotecnológica e estufas climáticas controladas.',
      en: 'Exclusive access to biotechnology research facilities and climate-controlled greenhouses.',
    },
  },
  {
    id: 'financiamento',
    icone: 'landmark',
    titulo: { pt: 'Financiamento de Pesquisa', en: 'Research Funding' },
    descricao: {
      pt: 'Suporte institucional substancial para projectos de longo prazo e captação de recursos externos.',
      en: 'Substantial institutional support for long-term projects and external fundraising.',
    },
  },
  {
    id: 'rede-internacional',
    icone: 'earth',
    titulo: { pt: 'Rede Internacional', en: 'International Network' },
    descricao: {
      pt: 'Parcerias estabelecidas com as principais universidades e institutos de pesquisa agronómica do mundo.',
      en: 'Established partnerships with the world’s leading universities and agronomic research institutes.',
    },
  },
  {
    id: 'liberdade-academica',
    icone: 'graduation-cap',
    titulo: { pt: 'Liberdade Académica', en: 'Academic Freedom' },
    descricao: {
      pt: 'Encorajamos abordagens interdisciplinares e metodologias de ensino não convencionais.',
      en: 'We encourage interdisciplinary approaches and unconventional teaching methodologies.',
    },
  },
];

export const REQUISITOS_DOCENCIA_MOCK: RequisitoDocencia[] = [
  {
    id: 'doutoramento',
    icone: 'badge-check',
    titulo: { pt: 'Doutorado (Ph.D.)', en: 'Doctorate (Ph.D.)' },
    descricao: {
      pt: 'Título obtido ou em fase de conclusão em Agronomia, Biotecnologia ou áreas afins.',
      en: 'Degree obtained or nearing completion in Agronomy, Biotechnology or related fields.',
    },
  },
  {
    id: 'publicacoes',
    icone: 'square-text',
    titulo: { pt: 'Publicações', en: 'Publications' },
    descricao: {
      pt: 'Histórico robusto de publicações em periódicos internacionais revisados por pares.',
      en: 'Solid track record of publications in peer-reviewed international journals.',
    },
  },
  {
    id: 'linguas',
    icone: 'languages',
    titulo: { pt: 'Proficiência Linguística', en: 'Language Proficiency' },
    descricao: {
      pt: 'Fluência em Português e Inglês (nível académico) é mandatória para leccionar.',
      en: 'Fluency in Portuguese and English (academic level) is mandatory to teach.',
    },
  },
];

export const TITULACOES_DOCENCIA_MOCK: TitulacaoDocencia[] = [
  { id: 'doutoramento', rotulo: { pt: 'Doutoramento (Ph.D.)', en: 'Doctorate (Ph.D.)' } },
  { id: 'pos-doutoramento', rotulo: { pt: 'Pós-doutoramento', en: 'Postdoctorate' } },
  { id: 'agregacao', rotulo: { pt: 'Agregação', en: 'Habilitation' } },
  { id: 'mestrado', rotulo: { pt: 'Mestrado', en: "Master's degree" } },
];
