import { HistoriaAlumni } from '../modelos/historia-alumni.model';

export const HISTORIAS_ALUMNI_MOCK: HistoriaAlumni[] = [
  {
    id: 'ines-capitao',
    nome: 'Inês Capitão',
    curso: { pt: 'Engenharia Agronómica', en: 'Agronomic Engineering' },
    anoConclusao: 2018,
    cargoAtual: { pt: 'Diretora Técnica de Cooperativa Agrícola', en: 'Technical Director at an Agricultural Cooperative' },
    testemunho: {
      pt: 'A UNAGRO deu-me as bases técnicas e a rede de contactos que me permitiram liderar hoje uma cooperativa com mais de 300 associados.',
      en: 'UNAGRO gave me the technical foundation and network that let me lead a cooperative with over 300 members today.',
    },
  },
  {
    id: 'joao-baptista',
    nome: 'João Baptista',
    curso: { pt: 'Medicina Veterinária', en: 'Veterinary Medicine' },
    anoConclusao: 2015,
    cargoAtual: { pt: 'Fundador de Clínica Veterinária Regional', en: 'Founder of a Regional Veterinary Clinic' },
    testemunho: {
      pt: 'O estágio clínico integrado deu-me confiança para abrir a minha própria clínica logo após a graduação.',
      en: 'The integrated clinical internship gave me the confidence to open my own clinic right after graduation.',
    },
  },
  {
    id: 'marta-sanjinji',
    nome: 'Marta Sanjinji',
    curso: { pt: 'Gestão Agroindustrial', en: 'Agribusiness Management' },
    anoConclusao: 2020,
    cargoAtual: { pt: 'Gestora de Exportações numa Agroindústria', en: 'Export Manager at an Agri-food Company' },
    testemunho: {
      pt: 'As disciplinas de logística e marketing agroalimentar prepararam-me diretamente para o mercado internacional.',
      en: 'The logistics and agri-food marketing courses prepared me directly for the international market.',
    },
  },
  {
    id: 'pedro-muatxinene',
    nome: 'Pedro Muatxinene',
    curso: { pt: 'Engenharia Florestal', en: 'Forestry Engineering' },
    anoConclusao: 2017,
    cargoAtual: { pt: 'Coordenador de Projetos de Conservação', en: 'Conservation Projects Coordinator' },
    testemunho: {
      pt: 'Hoje coordeno projetos de restauro florestal em três províncias, aplicando o que aprendi na UNAGRO.',
      en: 'Today I coordinate forest restoration projects in three provinces, applying what I learned at UNAGRO.',
    },
  },
  {
    id: 'sofia-katumbela',
    nome: 'Sofia Katumbela',
    curso: { pt: 'Economia Agrária', en: 'Agricultural Economics' },
    anoConclusao: 2019,
    cargoAtual: { pt: 'Analista de Políticas Públicas', en: 'Public Policy Analyst' },
    testemunho: {
      pt: 'A formação em políticas agrícolas abriu-me portas para trabalhar diretamente com o Ministério da Agricultura.',
      en: 'The agricultural policy training opened doors for me to work directly with the Ministry of Agriculture.',
    },
  },
  {
    id: 'ricardo-tchissingui',
    nome: 'Ricardo Tchissingui',
    curso: { pt: 'Zootecnia', en: 'Animal Science' },
    anoConclusao: 2016,
    cargoAtual: { pt: 'Diretor de Produção numa Empresa Avícola', en: 'Production Director at a Poultry Company' },
    testemunho: {
      pt: 'A UNAGRO ensinou-me a pensar em produtividade e bem-estar animal ao mesmo tempo — isso mudou a minha carreira.',
      en: 'UNAGRO taught me to think about productivity and animal welfare at the same time — that changed my career.',
    },
  },
];
