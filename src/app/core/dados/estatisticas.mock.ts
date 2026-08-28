import { Estatistica } from '../modelos/estatistica.model';

export const ESTATISTICAS_INSTITUCIONAIS_MOCK: Estatistica[] = [
  {
    id: 'parceitos',
    valor: '+20',
    rotulo: { pt: 'Parceiros institucionais', en: 'Institutional Partners' },
    icone: 'briefcase',
  },
  {
    id: 'faculdades',
    valor: '4',
    rotulo: { pt: 'Faculdades Especializadas', en: 'Specialized Faculties' },
    icone: 'building-2',
  },
  {
    id: 'estacao-experimental',
    valor: '5Ha',
    rotulo: { pt: 'Estação Experimental', en: 'Experimental Station' },
    icone: 'map',
  },
  {
    id: 'estudantes',
    valor: '190',
    rotulo: { pt: 'Estudantes Matriculados', en: 'Enrolled Students' },
    icone: 'graduation-cap',
  },
  {
    id: 'projetos',
    valor: '29',
    rotulo: { pt: 'Projetos Desenvolvidos', en: 'Projects Developed' },
    icone: 'flask-conical',
  },
];

export const ESTATISTICAS_IMPACTO_ALUMNI_MOCK: Estatistica[] = [
  {
    id: 'graduados',
    valor: '+3000',
    rotulo: { pt: 'Graduados', en: 'Graduates' },
    icone: 'graduation-cap',
  },
  {
    id: 'empregabilidade',
    valor: '92%',
    rotulo: { pt: 'Empregabilidade em 1 Ano', en: 'Employment Within 1 Year' },
    icone: 'briefcase',
  },
  {
    id: 'paises',
    valor: '12',
    rotulo: { pt: 'Países com Alumni UNAGRO', en: 'Countries with UNAGRO Alumni' },
    icone: 'globe',
  },
  {
    id: 'empresas-fundadas',
    valor: '+150',
    rotulo: { pt: 'Empresas Fundadas por Alumni', en: 'Companies Founded by Alumni' },
    icone: 'rocket',
  },
  {
    id: 'empresas-fundadas',
    valor: '+150',
    rotulo: { pt: 'Empresas Fundadas por Alumni', en: 'Companies Founded by Alumni' },
    icone: 'rocket',
  },
];
