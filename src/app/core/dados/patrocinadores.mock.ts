import { Patrocinador } from '../modelos/patrocinador.model';

export const PATROCINADORES_MOCK: Patrocinador[] = [
  {
    id: 'minplan',
    nome: { pt: 'Ministério do Planeamento', en: 'Ministry of Planning' },
    logoUrl: '/imagens/minplan_.png',
  },
  {
    id: 'minsa',
    nome: { pt: 'Ministério da Saúde', en: 'Ministry of Health' },
    logoUrl: '/imagens/minsa.png',
  },
  {
    id: 'mindcom',
    nome: {
      pt: 'Ministério da Indústria e Comércio',
      en: 'Ministry of Industry and Commerce',
    },
    logoUrl: '/imagens/mindcom_133e51cc52.png',
  },
  {
    id: 'feito-em-angola',
    nome: { pt: 'Feito em Angola', en: 'Made in Angola' },
    logoUrl: '/imagens/FEITO-EM-ANGOLA-2022-1.png',
  },
];
