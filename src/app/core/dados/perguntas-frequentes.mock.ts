import { PerguntaFrequente } from '../modelos/pergunta-frequente.model';

export const PERGUNTAS_FREQUENTES_MOCK: PerguntaFrequente[] = [
  {
    id: 'quando-abrem-candidaturas',
    pergunta: { pt: 'Quando abrem as candidaturas?', en: 'When do admissions open?' },
    resposta: {
      pt: 'As candidaturas para o ano letivo abrem em Setembro e decorrem até ao preenchimento das vagas disponíveis.',
      en: 'Admissions for the academic year open in September and run until available places are filled.',
    },
  },
  {
    id: 'documentos-necessarios',
    pergunta: { pt: 'Que documentos preciso de entregar?', en: 'What documents do I need to submit?' },
    resposta: {
      pt: 'Certificado de habilitações, bilhete de identidade, 2 fotografias tipo passe e comprovativo de pagamento da taxa de candidatura.',
      en: 'School diploma, ID card, 2 passport-style photos and proof of application fee payment.',
    },
  },
  {
    id: 'exame-admissao',
    pergunta: { pt: 'É necessário fazer exame de admissão?', en: 'Is an admission exam required?' },
    resposta: {
      pt: 'Sim, todos os candidatos realizam um exame de admissão nas áreas de Matemática e Ciências Naturais.',
      en: 'Yes, all applicants take an admission exam in Mathematics and Natural Sciences.',
    },
  },
  {
    id: 'existem-bolsas',
    pergunta: { pt: 'A UNAGRO oferece bolsas de estudo?', en: 'Does UNAGRO offer scholarships?' },
    resposta: {
      pt: 'Sim, existem bolsas de mérito académico e bolsas sociais para estudantes com dificuldades económicas comprovadas.',
      en: 'Yes, there are academic merit scholarships and social scholarships for students with proven financial need.',
    },
  },
  {
    id: 'equivalencias',
    pergunta: { pt: 'Posso transferir-me de outra instituição?', en: 'Can I transfer from another institution?' },
    resposta: {
      pt: 'Sim, mediante análise de equivalência curricular pela secretaria académica da faculdade pretendida.',
      en: 'Yes, subject to a curriculum equivalence review by the academic office of the intended faculty.',
    },
  },
  {
    id: 'valor-propinas',
    pergunta: { pt: 'Qual o valor das propinas?', en: 'What are the tuition fees?' },
    resposta: {
      pt: 'O valor varia consoante a faculdade e o regime de estudo; consulte a tabela atualizada nos serviços académicos.',
      en: 'The amount varies by faculty and study regime; check the updated table with academic services.',
    },
  },
  {
    id: 'alojamento',
    pergunta: { pt: 'A UNAGRO tem residência para estudantes?', en: 'Does UNAGRO have student housing?' },
    resposta: {
      pt: 'Sim, existe residência universitária com vagas limitadas, atribuídas por ordem de candidatura e critério social.',
      en: 'Yes, there is university housing with limited places, allocated by application order and social criteria.',
    },
  },
  {
    id: 'contacto-duvidas',
    pergunta: { pt: 'Onde posso esclarecer outras dúvidas?', en: 'Where can I clarify other questions?' },
    resposta: {
      pt: 'Contacte os Serviços de Admissões através da página de Contactos ou presencialmente no campus.',
      en: 'Contact the Admissions Office through the Contact page or in person on campus.',
    },
  },
];
