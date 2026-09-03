import { Startup } from '../modelos/startup.model';

// TODO: não existe página de detalhe de startup nem listagem própria em
// `app.routes.ts` — todos os "Saiba Mais" apontam para a âncora da própria
// sessão até essa rota existir.
const LINK_PROVISORIO = '/hub-unagro#secao-startups';

export const STARTUPS_MOCK: Startup[] = [
  {
    id: 'aerograin-ai',
    categoria: { pt: 'Drones & GIS', en: 'Drones & GIS' },
    nome: { pt: 'AeroGrain AI', en: 'AeroGrain AI' },
    descricao: {
      pt: 'Mapeamento espectral de alta precisão para detecção precoce de pragas e deficiências nutricionais.',
      en: 'High-precision spectral mapping for early detection of pests and nutritional deficiencies.',
    },
    link: LINK_PROVISORIO,
    imagem_url: '/imagens/drono-no-campo.png',
  },
  {
    id: 'biofertil-labs',
    categoria: { pt: 'Biotech', en: 'Biotech' },
    nome: { pt: 'BioFertil Labs', en: 'BioFertil Labs' },
    descricao: {
      pt: 'Fertilizantes orgânicos inteligentes baseados em microbiologia local para restauração de solos degradados.',
      en: 'Smart organic fertilisers based on local microbiology for the restoration of degraded soils.',
    },
    link: LINK_PROVISORIO,
    imagem_url: '/imagens/baldes-no-campo.png',
  },
  {
    id: 'agrotrade-flow',
    categoria: { pt: 'Fintech / Cadeia de valor', en: 'Fintech / Supply chain' },
    nome: { pt: 'AgroTrade Flow', en: 'AgroTrade Flow' },
    descricao: {
      pt: 'Plataforma blockchain para rastreabilidade e financiamento simplificado para pequenos produtores.',
      en: 'Blockchain platform for traceability and simplified financing for smallholder farmers.',
    },
    link: LINK_PROVISORIO,
    imagem_url: '/imagens/estrageia-do-campo.png',
  },
];
