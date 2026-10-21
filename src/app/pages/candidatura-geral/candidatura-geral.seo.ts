import { PRAZO_CANDIDATURA_GERAL } from '../../core/dados/candidatura-geral.mock';
import { environment } from '../../../environments/environment';

const ORIGEM = new URL(environment.siteUrl).origin;
const URL_CONVOCATORIA = `${ORIGEM}/candidatura-geral`;

/**
 * Dados estruturados (JSON-LD) da convocatória, lidos pelo `SeoService` a partir
 * do `data.dadosEstruturados` da rota. O `JobPosting` torna a página elegível
 * para o Google for Jobs — valida-se no Rich Results Test do Google.
 */
export const DADOS_ESTRUTURADOS_CANDIDATURA_GERAL = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${ORIGEM}/#organizacao`,
      name: 'AgroSophia',
      legalName: 'AGROSOPHIA, Lda.',
      url: ORIGEM,
      logo: `${ORIGEM}/icone-512.png`,
      email: 'agrosophia@yahoo.com',
      address: { '@type': 'PostalAddress', addressRegion: 'Icolo e Bengo', addressCountry: 'AO' },
    },
    {
      '@type': 'WebPage',
      '@id': `${URL_CONVOCATORIA}#pagina`,
      url: URL_CONVOCATORIA,
      name: 'Processo de Candidatura para Docentes | AgroSophia',
      inLanguage: 'pt-AO',
      primaryImageOfPage: `${ORIGEM}/imagens/og-candidatura-geral-v1.jpg`,
      publisher: { '@id': `${ORIGEM}/#organizacao` },
    },
    {
      '@type': 'JobPosting',
      title: 'Docentes, investigadores e especialistas no sector do agronegócio',
      description:
        '<p>A AGROSOPHIA, Lda. procura docentes, investigadores e especialistas no sector do agronegócio para desenvolver um projecto institucional com sede no Icolo e Bengo (50 km de Luanda), virado para o ensino superior e a prática do agronegócio. Os Mestres e Doutores serão preferenciados.</p>' +
        '<ul><li>Perfil académico: Licenciados, Mestres ou Doutorados.</li>' +
        '<li>Aptidão para aulas práticas em campo e ensaios experimentais («Ensino em Solo Real»).</li>' +
        '<li>Investigação aplicada e artigos indexados focados nos desafios africanos.</li></ul>' +
        '<p>Candidaturas até 15 de Novembro de 2026, às 23h59.</p>',
      datePosted: '2026-09-30',
      validThrough: PRAZO_CANDIDATURA_GERAL,
      directApply: true,
      url: URL_CONVOCATORIA,
      image: `${ORIGEM}/imagens/og-candidatura-geral-v1.jpg`,
      industry: 'Agronegócio',
      occupationalCategory: 'Docente do ensino superior',
      educationRequirements: [
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'bachelor degree' },
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'postgraduate degree' },
      ],
      // Por extenso e não só o `@id`: o Google for Jobs lê o nome e o logótipo daqui.
      hiringOrganization: {
        '@type': 'Organization',
        '@id': `${ORIGEM}/#organizacao`,
        name: 'AgroSophia',
        sameAs: ORIGEM,
        logo: `${ORIGEM}/icone-512.png`,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Icolo e Bengo',
          addressRegion: 'Icolo e Bengo',
          addressCountry: 'AO',
        },
      },
    },
  ],
};
