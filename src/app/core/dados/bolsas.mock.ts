import { Bolsa } from '../modelos/bolsa.model';

export const BOLSAS_MOCK: Bolsa[] = [
  {
    id: 'merito-academico',
    nome: { pt: 'Bolsa de Mérito Académico', en: 'Academic Merit Scholarship' },
    cobertura: { pt: '50% do valor das propinas', en: '50% of tuition fees' },
    requisitos: { pt: 'Média final de acesso igual ou superior a 16 valores.', en: 'Final admission average of 16 points or higher.' },
  },
  {
    id: 'apoio-social',
    nome: { pt: 'Bolsa de Apoio Social', en: 'Social Support Scholarship' },
    cobertura: { pt: 'Até 100% do valor das propinas', en: 'Up to 100% of tuition fees' },
    requisitos: { pt: 'Comprovativo de rendimento familiar e aprovação do exame de admissão.', en: 'Proof of household income and admission exam approval.' },
  },
  {
    id: 'excelencia-investigacao',
    nome: { pt: 'Bolsa de Excelência em Investigação', en: 'Research Excellence Scholarship' },
    cobertura: { pt: 'Propinas e apoio a material de investigação', en: 'Tuition fees and research materials support' },
    requisitos: { pt: 'Participação ativa num projeto de investigação da UNAGRO.', en: 'Active participation in a UNAGRO research project.' },
  },
];
