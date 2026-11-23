import { DocumentoCandidatura, RequisitosPorNivel } from '../modelos/requisito-candidatura.model';

export const DOCUMENTOS_CANDIDATURA_MOCK: DocumentoCandidatura[] = [
  {
    id: 'documentacao-academica',
    icone: 'file-text',
    titulo: { pt: 'Documentação Académica', en: 'Academic Documents' },
    descricao: {
      pt: 'Certificado de Habilitações com notas discriminadas.',
      en: 'School certificate with itemized grades.',
    },
  },
  {
    id: 'identificacao',
    icone: 'id-card',
    titulo: { pt: 'Identificação', en: 'Identification' },
    descricao: {
      pt: 'BI ou Passaporte válido (original e fotocópia).',
      en: 'Valid ID card or passport (original and photocopy).',
    },
  },
  {
    id: 'fotografias',
    icone: 'camera',
    titulo: { pt: 'Fotografias', en: 'Photographs' },
    descricao: {
      pt: '2 fotografias tipo passe actualizadas (fundo branco).',
      en: '2 recent passport-style photographs (white background).',
    },
  },
];

export const REQUISITOS_POR_NIVEL_MOCK: RequisitosPorNivel[] = [
  {
    id: 'licenciatura',
    rotulo: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    criterios: [
      { pt: '12ª Classe concluída ou equivalente', en: '12th grade completed or equivalent' },
      { pt: 'Aprovação no exame de admissão (se aplicável)', en: 'Admission exam approval (if applicable)' },
      { pt: 'Idade mínima de 17 anos', en: 'Minimum age of 17' },
      { pt: 'Pagamento da taxa de candidatura', en: 'Payment of the application fee' },
    ],
    nota: {
      pt: 'Nota: Candidatos estrangeiros devem apresentar documentos autenticados pelo consulado e traduzidos se necessário.',
      en: 'Note: International applicants must submit documents authenticated by the consulate and translated if necessary.',
    },
  },
  {
    id: 'pos-graduacao',
    rotulo: { pt: 'Pós-graduação', en: 'Postgraduate' },
    criterios: [
      { pt: 'Licenciatura concluída em área afim', en: "Completed bachelor's degree in a related field" },
      { pt: 'Certificado de licenciatura com média final', en: 'Degree certificate with final average grade' },
      { pt: 'Curriculum Vitae actualizado', en: 'Up-to-date curriculum vitae' },
      { pt: 'Carta de motivação', en: 'Motivation letter' },
      { pt: 'Pagamento da taxa de candidatura', en: 'Payment of the application fee' },
    ],
    nota: {
      pt: 'Nota: Candidatos com formação obtida no estrangeiro devem apresentar a equivalência emitida pelo Ministério do Ensino Superior.',
      en: 'Note: Applicants who studied abroad must provide the equivalence issued by the Ministry of Higher Education.',
    },
  },
];

/**
 * Requisitos gerais mostrados no painel lateral do formulário de inscrição.
 * Partilham a forma dos documentos de candidatura (ícone, título e descrição curta).
 */
export const REQUISITOS_GERAIS_INSCRICAO_MOCK: DocumentoCandidatura[] = [
  {
    id: 'certificado-ensino-medio',
    icone: 'graduation-cap',
    titulo: { pt: 'Certificado de Ensino Médio', en: 'Secondary Education Certificate' },
    descricao: {
      pt: 'Documento oficial comprovativo da conclusão do ensino médio ou equivalente internacional.',
      en: 'Official document proving completion of secondary education or an international equivalent.',
    },
  },
  {
    id: 'media-minima',
    icone: 'award',
    titulo: { pt: 'Média Mínima de 14 Valores', en: 'Minimum Average of 14 Points' },
    descricao: {
      pt: 'Histórico escolar que demonstre excelência académica nas disciplinas de base científica.',
      en: 'School transcript showing academic excellence in core science subjects.',
    },
  },
  {
    id: 'documento-identificacao',
    icone: 'id-card',
    titulo: { pt: 'Documento de Identificação', en: 'Identification Document' },
    descricao: {
      pt: 'Cópia actualizada do bilhete de identidade nacional ou passaporte válido.',
      en: 'Up-to-date copy of the national ID card or a valid passport.',
    },
  },
  {
    id: 'proficiencia-linguistica',
    icone: 'languages',
    titulo: { pt: 'Proficiência Linguística', en: 'Language Proficiency' },
    descricao: {
      pt: 'Para estudantes internacionais, comprovativo de proficiência na língua de instrução.',
      en: 'For international students, proof of proficiency in the language of instruction.',
    },
  },
];
