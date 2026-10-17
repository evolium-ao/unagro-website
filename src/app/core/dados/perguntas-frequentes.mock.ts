import { PerguntaFrequente } from '../modelos/pergunta-frequente.model';

export const PERGUNTAS_FREQUENTES_MOCK: PerguntaFrequente[] = [
  {
    id: 'metodos-pagamento',
    pergunta: {
      pt: 'Quais são os métodos de pagamento aceites?',
      en: 'Which payment methods are accepted?',
    },
    resposta: {
      pt: 'Aceitamos pagamentos via Multicaixa Express, Transferência Bancária (apresentando comprovativo no portal) e Depósito Directo.',
      en: 'We accept payments via Multicaixa Express, bank transfer (submitting the receipt in the portal) and direct deposit.',
    },
  },
  {
    id: 'exame-admissao',
    pergunta: {
      pt: 'É obrigatório realizar exame de admissão?',
      en: 'Is the admission exam mandatory?',
    },
    resposta: {
      pt: 'Sim, todos os candidatos realizam um exame de admissão nas áreas de Matemática e Ciências Naturais.',
      en: 'Yes, all applicants take an admission exam in Mathematics and Natural Sciences.',
    },
  },
  {
    id: 'mais-do-que-um-curso',
    pergunta: {
      pt: 'Posso candidatar-me a mais do que um curso?',
      en: 'Can I apply for more than one course?',
    },
    resposta: {
      pt: 'Sim. Pode indicar até três opções de curso por ordem de preferência no formulário de candidatura.',
      en: 'Yes. You may list up to three course options in order of preference on the application form.',
    },
  },
];
