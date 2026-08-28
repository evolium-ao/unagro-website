import { PassoCandidatura } from '../modelos/passo-candidatura.model';

export const PASSOS_CANDIDATURA_MOCK: PassoCandidatura[] = [
  {
    numero: 1,
    titulo: { pt: 'Escolher o curso', en: 'Choose your course' },
    descricao: { pt: 'Consulte a oferta formativa e escolha a faculdade e o curso pretendido.', en: 'Browse the course offer and choose your faculty and intended course.' },
    icone: 'search',
  },
  {
    numero: 2,
    titulo: { pt: 'Reunir documentos', en: 'Gather documents' },
    descricao: { pt: 'Prepare o certificado de habilitações, BI e restante documentação exigida.', en: 'Prepare your school diploma, ID and remaining required documents.' },
    icone: 'file-text',
  },
  {
    numero: 3,
    titulo: { pt: 'Submeter candidatura', en: 'Submit application' },
    descricao: { pt: 'Preencha o formulário de candidatura online ou presencialmente no campus.', en: 'Fill in the application form online or in person on campus.' },
    icone: 'send',
  },
  {
    numero: 4,
    titulo: { pt: 'Realizar exame de admissão', en: 'Take the admission exam' },
    descricao: { pt: 'Compareça na data marcada para o exame de Matemática e Ciências Naturais.', en: 'Attend on the scheduled date for the Mathematics and Natural Sciences exam.' },
    icone: 'pencil-line',
  },
  {
    numero: 5,
    titulo: { pt: 'Consultar resultados', en: 'Check results' },
    descricao: { pt: 'A lista de admitidos é publicada no Espaço do Estudante.', en: 'The list of admitted candidates is published in the Student Hub.' },
    icone: 'clipboard-check',
  },
  {
    numero: 6,
    titulo: { pt: 'Efetuar matrícula', en: 'Complete enrollment' },
    descricao: { pt: 'Formalize a matrícula nos serviços académicos e inicie o ano letivo.', en: 'Formalize enrollment with academic services and start the academic year.' },
    icone: 'circle-check',
  },
];
