import { TextoTraduzido } from '../../../core/traducao/texto-traduzido';

/** Erro do grupo da etapa 3 (soma dos anexos), que não pertence a nenhum campo. */
export const CHAVE_DOSSIER_TOTAL = 'dossierMuitoGrande';

/**
 * Nome de cada campo do formulário, como aparece no rótulo da etapa — é o que
 * o modal "Reveja o formulário" lista quando falta preencher algum.
 */
export const ROTULOS_CAMPOS: Record<string, TextoTraduzido> = {
  // Etapa 1
  nome: { pt: 'Nome Completo', en: 'Full Name' },
  nascimento: { pt: 'Data de Nascimento', en: 'Date of Birth' },
  documento: { pt: 'N.º de Bilhete de Identidade / Passaporte', en: 'ID Card / Passport No.' },
  telefone: { pt: 'Contacto Telefónico Principal', en: 'Main Phone Number' },
  email: { pt: 'E-mail Principal de Correspondência', en: 'Main Correspondence E-mail' },
  disciplinas: { pt: 'Área de Candidatura & Vagas (disciplinas)', en: 'Application Area & Vacancies (courses)' },
  // Etapa 2
  grau: { pt: 'Grau Académico Mais Elevado Concluído', en: 'Highest Academic Degree Completed' },
  universidade: { pt: 'Universidade', en: 'University' },
  faculdade: { pt: 'Faculdade', en: 'Faculty' },
  curso: { pt: 'Curso', en: 'Degree programme' },
  pais: { pt: 'País', en: 'Country' },
  identificadorInvestigador: { pt: 'Identificador de Investigador', en: 'Researcher Identifier' },
  // Etapa 3
  curriculo: { pt: 'Curriculum Vitae Circunstanciado', en: 'Detailed Curriculum Vitae' },
  certificados: {
    pt: 'Certificado(s) de Habilitações Literárias & Equivalência',
    en: 'Academic Qualification Certificate(s) & Equivalence',
  },
  certificadosAdicionais: { pt: 'Certificados Adicionais', en: 'Additional Certificates' },
  comprovativos: { pt: 'Comprovativos de Docência / I&D / Prática Agrícola', en: 'Proof of Teaching / R&D / Agricultural Practice' },
  carta: { pt: 'Carta de Motivação & Enquadramento Institucional', en: 'Motivation Letter & Institutional Fit' },
  compromissoHonra: { pt: 'Declaração sob compromisso de honra', en: 'Declaration on my honour' },
  consentimentoDados: { pt: 'Consentimento para tratamento de dados pessoais', en: 'Consent to personal data processing' },
  [CHAVE_DOSSIER_TOTAL]: { pt: 'Tamanho total do dossier documental', en: 'Total size of the document dossier' },
};

/** Um campo por corrigir: `vazio` (obrigatório por preencher) ou `invalido` (preenchido, mas errado). */
export interface CampoEmFalta {
  chave: string;
  motivo: 'vazio' | 'invalido';
}

/**
 * Onde está o campo na página: o elemento com `formControlName` (o Angular
 * mantém o atributo no DOM) ou, para o erro do total do dossier, a secção.
 */
export function seletorCampo(chave: string): string {
  if (chave === CHAVE_DOSSIER_TOTAL) {
    return '#secao-dossier';
  }
  // As caixas dos certificados adicionais usam `[formControl]`, sem nome no DOM.
  return chave === 'certificadosAdicionais' ? '#certificados-dossier' : `[formcontrolname="${chave}"]`;
}

/**
 * Desce até ao campo e põe-lhe o foco (o primeiro elemento focável lá dentro:
 * input, select, botão de upload…). Só no browser.
 */
export function irParaCampo(chave: string): void {
  const alvo = document.querySelector<HTMLElement>(seletorCampo(chave));
  if (!alvo) {
    return;
  }
  alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const focavel = alvo.matches('input, textarea, button')
    ? alvo
    : alvo.querySelector<HTMLElement>('input:not([type=hidden]):not([type=file]), textarea, button:not([disabled])');
  // `preventScroll`: o scroll suave acima já leva o campo ao centro.
  focavel?.focus({ preventScroll: true });
}
