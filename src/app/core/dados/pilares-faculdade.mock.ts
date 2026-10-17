import { PilarFaculdade } from '../modelos/pilar-faculdade.model';

export const PILARES_FACULDADE_MOCK: PilarFaculdade[] = [
  {
    id: 'ciencias-agrarias',
    nome: { pt: 'Educação em Solo Real', en: 'Education in Real Soil' },
    descricao: {
      pt: 'Aprendizagem prática directamente nos campos experimentais e projectos reais da indústria.',
      en: 'Practical learning directly in the experimental fields and real-world projects of the industry.',
    },
    icone: 'sprout',
  },
  {
    id: 'medicina-veterinaria-zootecnia',
    nome: {
      pt: 'Tecnologia e Inovação',
      en: 'Technology and Innovation',
    },
    descricao: {
      pt: 'Domínio de ferramentas de agricultura de precisão, IoT e gestão inteligente de recursos.',
      en: 'Mastery of precision agriculture tools, IoT and smart resource management.',
    },
    icone: 'stethoscope',
  },
  {
    id: 'gestao-economia-agraria',
    nome: { pt: 'Sustentabilidade', en: 'Sustainability' },
    descricao: {
      pt: 'Foco em modelos de produção resilientes que preservam a biodiversidade de Angola.',
      en: 'Focus on resilient production models that preserve Angola’s biodiversity.',
    },
    icone: 'landmark',
  },
  {
    id: 'ciencias-ambientais-florestais',
    nome: {
      pt: 'Conexão com o Mercado',
      en: 'Market Connection',
    },
    descricao: {
      pt: 'Networking directo com grandes players do agronegócio e estágios garantidos.',
      en: 'Direct networking with major agribusiness players and guaranteed internships.',
    },
    icone: 'trees',
  },
];
