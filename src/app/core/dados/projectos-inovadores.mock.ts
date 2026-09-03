import { ProjectoInovador } from '../modelos/projecto-inovador.model';

// TODO: `app.routes.ts` não tem detalhe nem listagem de projectos inovadores — o
// "Apoiar Projeto" aponta para a âncora da própria sessão até essa rota existir.
const LINK_PROVISORIO = '/hub-unagro#secao-projectos-inovadores';

export const PROJECTOS_INOVADORES_MOCK: ProjectoInovador[] = [
  {
    id: 'vertical-farming-luanda',
    titulo: { pt: 'Vertical Farming Luanda', en: 'Vertical Farming Luanda' },
    descricao: {
      pt: 'Projeto piloto para implementar fazendas verticais automatizadas em centros urbanos, reduzindo o custo logístico em 40%.',
      en: 'Pilot project to deploy automated vertical farms in urban centres, cutting logistics costs by 40%.',
    },
    destaque: true,
    imagem_url: '/imagens/estufa-campos.png',
    metaFinanciamento: 120000,
    moeda: 'USD',
    percentagemMeta: 85,
    link: LINK_PROVISORIO,
  },
  {
    id: 'irrismart-iot',
    titulo: { pt: 'IrriSmart IoT', en: 'IrriSmart IoT' },
    descricao: {
      pt: 'Sensores de humidade de baixo custo integrados com IA para irrigação solar inteligente.',
      en: 'Low-cost moisture sensors combined with AI for smart solar-powered irrigation.',
    },
    icone: 'droplet',
    estagio: { pt: 'Protótipo', en: 'Prototype' },
    link: LINK_PROVISORIO,
  },
  {
    id: 'genoma-cafe',
    titulo: { pt: 'Genoma Café', en: 'Genoma Café' },
    descricao: {
      pt: 'Sequenciamento genético para identificar variedades de café resistentes ao calor extremo.',
      en: 'Genetic sequencing to identify coffee varieties resistant to extreme heat.',
    },
    icone: 'flask-conical',
    estagio: { pt: 'Pesquisa', en: 'Research' },
    link: LINK_PROVISORIO,
  },
];
