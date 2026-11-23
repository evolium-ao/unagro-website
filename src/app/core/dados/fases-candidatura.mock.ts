import { FaseCandidatura } from '../modelos/fase-candidatura.model';

export const FASES_CANDIDATURA_MOCK: FaseCandidatura[] = [
  {
    id: 'primeira-fase',
    titulo: { pt: '1ª Fase de Candidaturas', en: '1st Application Phase' },
    estado: 'a-decorrer',
    estadoRotulo: { pt: 'A decorrer', en: 'Ongoing' },
    prazos: [
      {
        rotulo: { pt: 'Abertura de Inscrições', en: 'Registration Opens' },
        valor: { pt: '15 de Janeiro', en: 'January 15' },
      },
      {
        rotulo: { pt: 'Exames de Admissão', en: 'Admission Exams' },
        valor: { pt: '20 de Fevereiro', en: 'February 20' },
      },
      {
        rotulo: { pt: 'Matrículas', en: 'Enrollment' },
        valor: { pt: '01 - 15 de Março', en: 'March 01 - 15' },
      },
    ],
  },
  {
    id: 'segunda-fase',
    titulo: { pt: '2ª Fase de Candidaturas', en: '2nd Application Phase' },
    estado: 'brevemente',
    estadoRotulo: { pt: 'Brevemente', en: 'Coming soon' },
    prazos: [
      {
        rotulo: { pt: 'Abertura de Inscrições', en: 'Registration Opens' },
        valor: { pt: '01 de Junho', en: 'June 01' },
      },
      {
        rotulo: { pt: 'Exames de Admissão', en: 'Admission Exams' },
        valor: { pt: '15 de Julho', en: 'July 15' },
      },
      {
        rotulo: { pt: 'Matrículas', en: 'Enrollment' },
        valor: { pt: '01 - 10 de Agosto', en: 'August 01 - 10' },
      },
    ],
  },
];
