import { EntradaCalendario } from '../modelos/entrada-calendario.model';

export const CALENDARIO_ACADEMICO_MOCK: EntradaCalendario[] = [
  {
    id: 'abertura-candidaturas',
    data: { pt: '1 a 30 de Setembro de 2026', en: 'September 1–30, 2026' },
    evento: { pt: 'Período de candidaturas', en: 'Application period' },
  },
  {
    id: 'exame-admissao',
    data: { pt: '10 de Outubro de 2026', en: 'October 10, 2026' },
    evento: { pt: 'Exame de admissão', en: 'Admission exam' },
  },
  {
    id: 'resultados-admissao',
    data: { pt: '24 de Outubro de 2026', en: 'October 24, 2026' },
    evento: { pt: 'Divulgação de resultados', en: 'Results announcement' },
  },
  {
    id: 'matriculas',
    data: { pt: '26 a 31 de Outubro de 2026', en: 'October 26–31, 2026' },
    evento: { pt: 'Período de matrículas', en: 'Enrollment period' },
  },
  {
    id: 'inicio-aulas',
    data: { pt: '9 de Novembro de 2026', en: 'November 9, 2026' },
    evento: { pt: 'Início das aulas', en: 'Start of classes' },
  },
];
