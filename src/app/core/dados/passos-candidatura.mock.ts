import { PassoCandidatura } from '../modelos/passo-candidatura.model';

export const PASSOS_CANDIDATURA_MOCK: PassoCandidatura[] = [
  {
    numero: 1,
    titulo: { pt: 'Escolha o curso', en: 'Choose your course' },
    descricao: { pt: 'Explore a nossa oferta formativa.', en: 'Explore our range of courses.' },
    icone: 'graduation-cap',
  },
  {
    numero: 2,
    titulo: { pt: 'Verifique os requisitos', en: 'Check the requirements' },
    descricao: { pt: 'Consulte os documentos necessários.', en: 'Review the required documents.' },
    icone: 'clipboard-check',
  },
  {
    numero: 3,
    titulo: { pt: 'Preencha o formulário', en: 'Fill in the form' },
    descricao: { pt: 'Submeta os seus dados pessoais.', en: 'Submit your personal details.' },
    icone: 'pencil-line',
  },
  {
    numero: 4,
    titulo: { pt: 'Envie os documentos', en: 'Send your documents' },
    descricao: { pt: 'Upload de BI e certificados.', en: 'Upload your ID and certificates.' },
    icone: 'file-text',
  },
  {
    numero: 5,
    titulo: { pt: 'Aguarde a validação', en: 'Wait for validation' },
    descricao: { pt: 'Análise pela nossa secretaria.', en: "Review by our admissions office." },
    icone: 'clock',
  },
  {
    numero: 6,
    titulo: { pt: 'Faça a matrícula', en: 'Complete your enrollment' },
    descricao: { pt: 'Confirme a sua vaga.', en: 'Confirm your place.' },
    icone: 'circle-check',
  },
];
