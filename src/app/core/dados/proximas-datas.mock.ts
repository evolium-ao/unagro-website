import { ProximaData } from '../modelos/proxima-data.model';

// TODO: apontam todas para a âncora dos cursos de curta duração — falta a página
// de detalhe de cada data no calendário de formações.
const LINK_PROVISORIO = '/formacoes#secao-cursos-curta-duracao';

export const PROXIMAS_DATAS_MOCK: ProximaData[] = [
  {
    id: 'drones-sensoriamento-remoto',
    data: '2026-05-15',
    categoria: { pt: 'Workshop presencial', en: 'In-person workshop' },
    titulo: { pt: 'Drones e Sensoriamento Remoto', en: 'Drones and Remote Sensing' },
    detalhe: {
      pt: 'Campus Cerrado · 09:00 às 18:00',
      en: 'Cerrado Campus · 09:00 to 18:00',
    },
    estado: 'confirmada',
    link: LINK_PROVISORIO,
  },
  {
    id: 'manejo-integrado-de-pragas',
    data: '2026-06-02',
    categoria: { pt: 'Certificação intensiva', en: 'Intensive certification' },
    titulo: {
      pt: 'Manejo Integrado de Pragas (MIP)',
      en: 'Integrated Pest Management (IPM)',
    },
    detalhe: {
      pt: 'Laboratório de Biotecnologia',
      en: 'Biotechnology Laboratory',
    },
    estado: 'confirmada',
    link: LINK_PROVISORIO,
  },
  {
    id: 'gestao-comercial-de-agronegocios',
    data: '2026-07-10',
    categoria: { pt: 'Pós-graduação lato sensu', en: 'Lato sensu postgraduate' },
    titulo: {
      pt: 'Gestão Comercial de Agronegócios',
      en: 'Commercial Management of Agribusiness',
    },
    detalhe: { pt: 'Processo selectivo 2026.2', en: 'Admissions cycle 2026.2' },
    estado: 'prevista',
    link: LINK_PROVISORIO,
  },
];
