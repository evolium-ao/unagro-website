import { Projeto } from '../modelos/projeto.model';

export const PROJETOS_MOCK: Projeto[] = [
  {
    id: 'variedades-resistentes-seca',
    titulo: { pt: 'Variedades de Milho Resistentes à Seca', en: 'Drought-Resistant Maize Varieties' },
    faculdade: { pt: 'Faculdade de Ciências Agrárias', en: 'Faculty of Agricultural Sciences' },
    resumo: {
      pt: 'Seleção e teste de variedades de milho com maior tolerância a períodos de seca prolongada.',
      en: 'Selection and testing of maize varieties with greater tolerance to prolonged drought periods.',
    },
    desafio: {
      pt: 'As secas recorrentes reduzem drasticamente a produtividade do milho nas comunidades rurais, ameaçando a segurança alimentar.',
      en: 'Recurring droughts drastically reduce maize productivity in rural communities, threatening food security.',
    },
    solucoes: [
      { pt: 'Ensaios de campo com 12 variedades na estação experimental.', en: 'Field trials with 12 varieties at the experimental station.' },
      { pt: 'Seleção participativa com produtores locais.', en: 'Participatory selection with local farmers.' },
      { pt: 'Distribuição de sementes melhoradas para multiplicação.', en: 'Distribution of improved seeds for multiplication.' },
    ],
    cronograma: [
      { data: { pt: 'Ano 1', en: 'Year 1' }, titulo: { pt: 'Ensaios de campo', en: 'Field trials' }, descricao: { pt: 'Instalação e acompanhamento dos ensaios na estação experimental.', en: 'Setup and monitoring of trials at the experimental station.' } },
      { data: { pt: 'Ano 2', en: 'Year 2' }, titulo: { pt: 'Seleção participativa', en: 'Participatory selection' }, descricao: { pt: 'Avaliação conjunta com produtores das variedades mais promissoras.', en: 'Joint evaluation with farmers of the most promising varieties.' } },
      { data: { pt: 'Ano 3', en: 'Year 3' }, titulo: { pt: 'Multiplicação de sementes', en: 'Seed multiplication' }, descricao: { pt: 'Produção de sementes certificadas para distribuição.', en: 'Production of certified seeds for distribution.' } },
    ],
    numeroImagensGaleria: 4,
  },
  {
    id: 'saude-reprodutiva-bovinos',
    titulo: { pt: 'Saúde Reprodutiva em Rebanhos Bovinos', en: 'Reproductive Health in Cattle Herds' },
    faculdade: { pt: 'Faculdade de Medicina Veterinária e Zootecnia', en: 'Faculty of Veterinary Medicine and Animal Science' },
    resumo: {
      pt: 'Diagnóstico e acompanhamento reprodutivo para reduzir a mortalidade neonatal em bovinos.',
      en: 'Reproductive diagnosis and monitoring to reduce neonatal mortality in cattle.',
    },
    desafio: {
      pt: 'Elevadas taxas de mortalidade neonatal reduzem a rentabilidade das explorações pecuárias da região.',
      en: 'High neonatal mortality rates reduce the profitability of livestock farms in the region.',
    },
    solucoes: [
      { pt: 'Protocolo de acompanhamento reprodutivo em 8 explorações piloto.', en: 'Reproductive monitoring protocol in 8 pilot farms.' },
      { pt: 'Formação de produtores em maneio sanitário.', en: 'Training of farmers in sanitary management.' },
    ],
    cronograma: [
      { data: { pt: 'Fase 1', en: 'Phase 1' }, titulo: { pt: 'Diagnóstico inicial', en: 'Initial diagnosis' }, descricao: { pt: 'Levantamento sanitário dos rebanhos participantes.', en: 'Health survey of participating herds.' } },
      { data: { pt: 'Fase 2', en: 'Phase 2' }, titulo: { pt: 'Intervenção e acompanhamento', en: 'Intervention and monitoring' }, descricao: { pt: 'Aplicação do protocolo reprodutivo e formação dos produtores.', en: 'Application of the reproductive protocol and farmer training.' } },
    ],
    numeroImagensGaleria: 3,
  },
  {
    id: 'cooperativas-cadeia-valor',
    titulo: { pt: 'Fortalecimento de Cooperativas na Cadeia de Valor', en: 'Strengthening Cooperatives in the Value Chain' },
    faculdade: { pt: 'Faculdade de Gestão e Economia Agrária', en: 'Faculty of Agribusiness Management and Economics' },
    resumo: {
      pt: 'Apoio à gestão e comercialização coletiva de cooperativas de pequenos produtores.',
      en: 'Support for the management and collective marketing of smallholder cooperatives.',
    },
    desafio: {
      pt: 'Pequenos produtores vendem a preços baixos por falta de organização coletiva e acesso a mercados.',
      en: 'Smallholder farmers sell at low prices due to lack of collective organization and market access.',
    },
    solucoes: [
      { pt: 'Diagnóstico organizacional de 6 cooperativas.', en: 'Organizational diagnosis of 6 cooperatives.' },
      { pt: 'Plano de comercialização coletiva com compradores institucionais.', en: 'Collective marketing plan with institutional buyers.' },
    ],
    cronograma: [
      { data: { pt: 'Etapa 1', en: 'Stage 1' }, titulo: { pt: 'Diagnóstico', en: 'Diagnosis' }, descricao: { pt: 'Avaliação da governação e capacidade comercial das cooperativas.', en: 'Assessment of governance and commercial capacity of cooperatives.' } },
      { data: { pt: 'Etapa 2', en: 'Stage 2' }, titulo: { pt: 'Implementação', en: 'Implementation' }, descricao: { pt: 'Estabelecimento de acordos comerciais e capacitação em gestão.', en: 'Establishment of commercial agreements and management training.' } },
    ],
    numeroImagensGaleria: 3,
  },
  {
    id: 'restauro-areas-degradadas',
    titulo: { pt: 'Restauro de Áreas Florestais Degradadas', en: 'Restoration of Degraded Forest Areas' },
    faculdade: { pt: 'Faculdade de Ciências Ambientais e Florestais', en: 'Faculty of Environmental and Forestry Sciences' },
    resumo: {
      pt: 'Reflorestação com espécies nativas em áreas afetadas por desmatamento.',
      en: 'Reforestation with native species in areas affected by deforestation.',
    },
    desafio: {
      pt: 'Áreas degradadas perdem capacidade produtiva e aumentam a erosão do solo na região.',
      en: 'Degraded areas lose productive capacity and increase soil erosion in the region.',
    },
    solucoes: [
      { pt: 'Viveiro de mudas de espécies nativas.', en: 'Nursery for native species seedlings.' },
      { pt: 'Plantio comunitário com monitorização de sobrevivência.', en: 'Community planting with survival monitoring.' },
    ],
    cronograma: [
      { data: { pt: 'Ano 1', en: 'Year 1' }, titulo: { pt: 'Produção de mudas', en: 'Seedling production' }, descricao: { pt: 'Instalação do viveiro e produção das primeiras mudas.', en: 'Nursery setup and production of the first seedlings.' } },
      { data: { pt: 'Ano 2', en: 'Year 2' }, titulo: { pt: 'Plantio e monitorização', en: 'Planting and monitoring' }, descricao: { pt: 'Plantio nas áreas piloto e acompanhamento da taxa de sobrevivência.', en: 'Planting in pilot areas and survival rate monitoring.' } },
    ],
    numeroImagensGaleria: 5,
  },
];
