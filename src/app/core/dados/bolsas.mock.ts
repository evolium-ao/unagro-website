import { Bolsa } from '../modelos/bolsa.model';

export const BOLSAS_MOCK: Bolsa[] = [
  {
    id: 'merito-agro',
    nome: { pt: 'Bolsa Mérito Agro', en: 'Agro Merit Scholarship' },
    descricao: {
      pt: 'Isenção total de propinas para alunos com média superior a 16 valores no ensino secundário.',
      en: 'Full tuition waiver for students with a secondary school average above 16 points.',
    },
    cobertura: { pt: 'Isenção total de propinas', en: 'Full tuition waiver' },
    requisitos: {
      pt: 'Média final de acesso igual ou superior a 16 valores.',
      en: 'Final admission average of 16 points or higher.',
    },
  },
  {
    id: 'apoio-social',
    nome: { pt: 'Apoio Social', en: 'Social Support' },
    descricao: {
      pt: 'Reduções parciais para candidatos em situação de vulnerabilidade socioeconómica comprovada.',
      en: 'Partial reductions for applicants with proven socioeconomic vulnerability.',
    },
    cobertura: { pt: 'Até 100% do valor das propinas', en: 'Up to 100% of tuition fees' },
    requisitos: {
      pt: 'Comprovativo de rendimento familiar e aprovação do exame de admissão.',
      en: 'Proof of household income and admission exam approval.',
    },
  },
];
