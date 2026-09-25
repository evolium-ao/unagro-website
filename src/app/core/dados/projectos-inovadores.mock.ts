import { ProjectoInovador } from '../modelos/projecto-inovador.model';

// TODO (ponto 26): quando a secção consumir os projectos da API com `inovador: true`,
// o `projetoId` passa a ser o próprio `id` do projecto. Até lá, cada entrada aponta
// para um projecto real de `GET /projectos` — é o formulário de interesse desse
// projecto que recebe o "Apoiar Projeto".

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
    projetoId: '1',
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
    projetoId: '2',
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
    projetoId: '3',
  },
];
