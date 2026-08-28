import { Evento } from '../modelos/evento.model';

export const EVENTOS_MOCK: Evento[] = [
  {
    id: 'congresso-agricultura-sustentavel',
    titulo: {
      pt: 'Congresso Internacional de Agricultura Sustentável',
      en: 'International Conference on Sustainable Agriculture',
    },
    categoria: { pt: 'Congresso', en: 'Conference' },
    ambito: 'internacional',
    local: { pt: 'Auditório Principal da UNAGRO', en: 'UNAGRO Main Auditorium' },
    dataInicio: '2026-09-18T09:00:00',
    dataFim: '2026-09-20T18:00:00',
    descricao: {
      pt: 'Encontro com investigadores de várias universidades africanas sobre inovação agrícola.',
      en: 'Gathering of researchers from several African universities on agricultural innovation.',
    },
    destaque: true,
  },
  {
    id: 'semana-da-veterinaria',
    titulo: { pt: 'Semana da Medicina Veterinária', en: 'Veterinary Medicine Week' },
    categoria: { pt: 'Académico', en: 'Academic' },
    ambito: 'nacional',
    local: { pt: 'Campus da UNAGRO', en: 'UNAGRO Campus' },
    dataInicio: '2026-09-05T08:30:00',
    descricao: {
      pt: 'Palestras, workshops clínicos e visitas técnicas para estudantes de Medicina Veterinária.',
      en: 'Lectures, clinical workshops and technical visits for Veterinary Medicine students.',
    },
  },
  {
    id: 'feira-emprego-agropecuario',
    titulo: { pt: 'Feira de Emprego Agropecuário', en: 'Agricultural Careers Fair' },
    categoria: { pt: 'Empregabilidade', en: 'Careers' },
    ambito: 'nacional',
    local: { pt: 'Pavilhão Multiusos', en: 'Multipurpose Pavilion' },
    dataInicio: '2026-10-02T09:00:00',
    descricao: {
      pt: 'Empresas do sector agropecuário apresentam oportunidades de estágio e emprego.',
      en: 'Agricultural sector companies present internship and job opportunities.',
    },
  },
  {
    id: 'workshop-agricultura-precisao',
    titulo: { pt: 'Workshop de Agricultura de Precisão', en: 'Precision Agriculture Workshop' },
    categoria: { pt: 'Formação', en: 'Training' },
    ambito: 'internacional',
    local: { pt: 'Estação Experimental', en: 'Experimental Station' },
    dataInicio: '2026-10-20T10:00:00',
    descricao: {
      pt: 'Demonstração de drones e sensores aplicados à agricultura, com especialistas convidados.',
      en: 'Demonstration of drones and sensors applied to agriculture, with guest specialists.',
    },
  },
  {
    id: 'jornadas-cientificas-unagro',
    titulo: { pt: 'Jornadas Científicas da UNAGRO', en: 'UNAGRO Scientific Days' },
    categoria: { pt: 'Investigação', en: 'Research' },
    ambito: 'nacional',
    local: { pt: 'Auditório Principal da UNAGRO', en: 'UNAGRO Main Auditorium' },
    dataInicio: '2026-11-12T09:00:00',
    descricao: {
      pt: 'Apresentação pública dos projetos de investigação desenvolvidos durante o ano.',
      en: 'Public presentation of research projects developed during the year.',
    },
  },
  {
    id: 'cerimonia-graduacao-2026',
    titulo: { pt: 'Cerimónia de Graduação 2026', en: '2026 Graduation Ceremony' },
    categoria: { pt: 'Institucional', en: 'Institutional' },
    ambito: 'nacional',
    local: { pt: 'Pavilhão Multiusos', en: 'Multipurpose Pavilion' },
    dataInicio: '2026-12-11T15:00:00',
    descricao: {
      pt: 'Colação de grau dos finalistas de todas as faculdades da UNAGRO.',
      en: 'Graduation ceremony for final-year students from all UNAGRO faculties.',
    },
  },
];
