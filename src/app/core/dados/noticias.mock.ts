import { Noticia } from '../modelos/noticia.model';

export const NOTICIAS_MOCK: Noticia[] = [
  {
    id: 'nova-estacao-experimental',
    categoria: { pt: 'Institucional', en: 'Institutional' },
    data: '2026-08-10',
    titulo: {
      pt: 'UNAGRO inaugura ampliação da Estação Experimental',
      en: 'UNAGRO opens expanded Experimental Station',
    },
    resumo: {
      pt: 'Nova área de 5 hectares reforça a investigação aplicada em produção vegetal e animal.',
      en: 'New 5-hectare area strengthens applied research in crop and animal production.',
    },
    destaque: true,
  },
  {
    id: 'parceria-cooperativas-regionais',
    categoria: { pt: 'Parcerias', en: 'Partnerships' },
    data: '2026-07-28',
    titulo: {
      pt: 'UNAGRO assina protocolo com cooperativas regionais',
      en: 'UNAGRO signs agreement with regional cooperatives',
    },
    resumo: {
      pt: 'Protocolo prevê estágios e transferência de tecnologia agrícola para produtores locais.',
      en: 'Agreement provides for internships and agricultural technology transfer to local producers.',
    },
    destaque: true,
  },
  {
    id: 'resultados-exame-admissao',
    categoria: { pt: 'Académico', en: 'Academic' },
    data: '2026-08-05',
    titulo: {
      pt: 'Divulgados resultados do exame de admissão 2026',
      en: '2026 admission exam results released',
    },
    resumo: {
      pt: 'Candidatos podem consultar a lista de admitidos no Espaço do Estudante.',
      en: 'Applicants can check the list of admitted candidates in the Student Hub.',
    },
    academica: true,
  },
  {
    id: 'calendario-segundo-semestre',
    categoria: { pt: 'Académico', en: 'Academic' },
    data: '2026-08-01',
    titulo: {
      pt: 'Publicado calendário académico do 2º semestre',
      en: '2nd semester academic calendar published',
    },
    resumo: {
      pt: 'Consulte as datas de início de aulas, exames e pausas letivas.',
      en: 'Check the dates for classes, exams and academic breaks.',
    },
    academica: true,
  },
  {
    id: 'manutencao-plataforma',
    categoria: { pt: 'Aviso', en: 'Notice' },
    data: '2026-07-20',
    titulo: {
      pt: 'Manutenção programada da plataforma académica',
      en: 'Scheduled maintenance of the academic platform',
    },
    resumo: {
      pt: 'A intranet ficará indisponível durante a madrugada de sábado para atualizações.',
      en: 'The intranet will be unavailable overnight on Saturday for updates.',
    },
    academica: true,
  },
  {
    id: 'premio-investigacao-agraria',
    categoria: { pt: 'Investigação', en: 'Research' },
    data: '2026-06-15',
    titulo: {
      pt: 'Projeto da UNAGRO vence prémio nacional de investigação agrária',
      en: 'UNAGRO project wins national agricultural research award',
    },
    resumo: {
      pt: 'Estudo sobre variedades resistentes à seca destaca-se entre 40 candidaturas.',
      en: 'Study on drought-resistant varieties stands out among 40 entries.',
    },
  },
  {
    id: 'visita-ministro-agricultura',
    categoria: { pt: 'Institucional', en: 'Institutional' },
    data: '2026-05-30',
    titulo: {
      pt: 'Ministério da Agricultura visita instalações da UNAGRO',
      en: 'Ministry of Agriculture visits UNAGRO facilities',
    },
    resumo: {
      pt: 'Visita reforça diálogo entre a academia e as políticas públicas do sector.',
      en: 'Visit strengthens dialogue between academia and public policy in the sector.',
    },
  },
  {
    id: 'feira-agropecuaria-2026',
    categoria: { pt: 'Extensão', en: 'Outreach' },
    data: '2026-05-10',
    titulo: {
      pt: 'Estudantes da UNAGRO participam na Feira Agropecuária Nacional',
      en: 'UNAGRO students take part in the National Agricultural Fair',
    },
    resumo: {
      pt: 'Delegação apresentou projetos de investigação e produtos da estação experimental.',
      en: 'Delegation presented research projects and products from the experimental station.',
    },
  },
];
