import { Curso } from '../modelos/curso.model';

export const CURSOS_MOCK: Curso[] = [
  {
    id: 'engenharia-agronomica',
    tipo: 'grau',
    faculdade: { pt: 'Faculdade de Ciências Agrárias', en: 'Faculty of Agricultural Sciences' },
    titulo: { pt: 'Engenharia Agronómica', en: 'Agronomic Engineering' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Presencial', en: 'On-campus' },
    resumo: {
      pt: 'Forma engenheiros agrónomos capazes de planear e gerir sistemas de produção agrícola sustentáveis.',
      en: 'Trains agronomic engineers to plan and manage sustainable agricultural production systems.',
    },
    objetivos: [
      { pt: 'Dominar técnicas de produção vegetal e maneio de solos.', en: 'Master crop production and soil management techniques.' },
      { pt: 'Aplicar princípios de agricultura sustentável e de precisão.', en: 'Apply sustainable and precision agriculture principles.' },
      { pt: 'Desenvolver competências de gestão de explorações agrícolas.', en: 'Develop farm management skills.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Botânica Geral', en: 'General Botany' },
        { pt: 'Química Agrícola', en: 'Agricultural Chemistry' },
        { pt: 'Matemática Aplicada', en: 'Applied Mathematics' },
        { pt: 'Introdução à Agronomia', en: 'Introduction to Agronomy' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Ciência do Solo', en: 'Soil Science' },
        { pt: 'Fitopatologia', en: 'Plant Pathology' },
        { pt: 'Fisiologia Vegetal', en: 'Plant Physiology' },
        { pt: 'Estatística Experimental', en: 'Experimental Statistics' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Culturas Anuais', en: 'Annual Crops' },
        { pt: 'Culturas Permanentes', en: 'Permanent Crops' },
        { pt: 'Agricultura de Precisão', en: 'Precision Agriculture' },
        { pt: 'Economia Agrária', en: 'Agricultural Economics' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Extensão Rural', en: 'Rural Extension' },
        { pt: 'Gestão de Explorações Agrícolas', en: 'Farm Management' },
        { pt: 'Estágio Profissional', en: 'Professional Internship' },
        { pt: 'Trabalho de Fim de Curso', en: 'Capstone Project' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Engenheiro Agrónomo', en: 'Agronomic Engineer' },
      { pt: 'Consultor Agrícola', en: 'Agricultural Consultant' },
      { pt: 'Gestor de Explorações', en: 'Farm Manager' },
      { pt: 'Investigador', en: 'Researcher' },
    ],
  },
  {
    id: 'medicina-veterinaria',
    tipo: 'grau',
    faculdade: {
      pt: 'Faculdade de Medicina Veterinária e Zootecnia',
      en: 'Faculty of Veterinary Medicine and Animal Science',
    },
    titulo: { pt: 'Medicina Veterinária', en: 'Veterinary Medicine' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '5 anos', en: '5 years' },
    regime: { pt: 'Presencial', en: 'On-campus' },
    resumo: {
      pt: 'Prepara médicos veterinários para a saúde e bem-estar animal, saúde pública e produção pecuária.',
      en: 'Prepares veterinarians for animal health and welfare, public health and livestock production.',
    },
    objetivos: [
      { pt: 'Diagnosticar e tratar doenças em animais domésticos e de produção.', en: 'Diagnose and treat diseases in domestic and production animals.' },
      { pt: 'Aplicar programas de saúde pública veterinária.', en: 'Apply veterinary public health programmes.' },
      { pt: 'Gerir sistemas de produção pecuária.', en: 'Manage livestock production systems.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Anatomia Veterinária', en: 'Veterinary Anatomy' },
        { pt: 'Bioquímica', en: 'Biochemistry' },
        { pt: 'Histologia', en: 'Histology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Fisiologia Animal', en: 'Animal Physiology' },
        { pt: 'Microbiologia Veterinária', en: 'Veterinary Microbiology' },
        { pt: 'Parasitologia', en: 'Parasitology' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Patologia Clínica', en: 'Clinical Pathology' },
        { pt: 'Farmacologia', en: 'Pharmacology' },
        { pt: 'Semiologia', en: 'Semiology' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Clínica Médica', en: 'Medical Clinic' },
        { pt: 'Clínica Cirúrgica', en: 'Surgical Clinic' },
        { pt: 'Saúde Pública Veterinária', en: 'Veterinary Public Health' },
      ]},
      { ano: 5, titulo: { pt: '5º Ano', en: 'Year 5' }, disciplinas: [
        { pt: 'Estágio Clínico Integrado', en: 'Integrated Clinical Internship' },
        { pt: 'Legislação Veterinária', en: 'Veterinary Legislation' },
        { pt: 'Trabalho de Fim de Curso', en: 'Capstone Project' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Médico Veterinário Clínico', en: 'Clinical Veterinarian' },
      { pt: 'Inspetor Sanitário', en: 'Sanitary Inspector' },
      { pt: 'Gestor Pecuário', en: 'Livestock Manager' },
      { pt: 'Docente e Investigador', en: 'Lecturer and Researcher' },
    ],
  },
  {
    id: 'zootecnia',
    tipo: 'grau',
    faculdade: {
      pt: 'Faculdade de Medicina Veterinária e Zootecnia',
      en: 'Faculty of Veterinary Medicine and Animal Science',
    },
    titulo: { pt: 'Zootecnia', en: 'Animal Science' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Pós-laboral', en: 'Evening' },
    resumo: {
      pt: 'Especializa profissionais em produção, nutrição e melhoramento genético animal.',
      en: 'Specializes professionals in animal production, nutrition and genetic improvement.',
    },
    objetivos: [
      { pt: 'Otimizar sistemas de produção animal.', en: 'Optimize animal production systems.' },
      { pt: 'Formular planos de nutrição animal.', en: 'Formulate animal nutrition plans.' },
      { pt: 'Aplicar técnicas de melhoramento genético.', en: 'Apply genetic improvement techniques.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Anatomia e Fisiologia Animal', en: 'Animal Anatomy and Physiology' },
        { pt: 'Bioquímica Aplicada', en: 'Applied Biochemistry' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Nutrição Animal', en: 'Animal Nutrition' },
        { pt: 'Forragicultura', en: 'Forage Science' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Genética e Melhoramento Animal', en: 'Animal Genetics and Breeding' },
        { pt: 'Produção de Bovinos', en: 'Cattle Production' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Produção de Aves e Suínos', en: 'Poultry and Swine Production' },
        { pt: 'Estágio Profissional', en: 'Professional Internship' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Zootecnista', en: 'Animal Scientist' },
      { pt: 'Técnico de Nutrição Animal', en: 'Animal Nutrition Technician' },
      { pt: 'Gestor de Produção Pecuária', en: 'Livestock Production Manager' },
    ],
  },
  {
    id: 'gestao-agroindustrial',
    tipo: 'grau',
    faculdade: { pt: 'Faculdade de Gestão e Economia Agrária', en: 'Faculty of Agribusiness Management and Economics' },
    titulo: { pt: 'Gestão Agroindustrial', en: 'Agribusiness Management' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Pós-laboral', en: 'Evening' },
    resumo: {
      pt: 'Forma gestores para a indústria agroalimentar, do processamento à comercialização.',
      en: 'Trains managers for the agri-food industry, from processing to commercialization.',
    },
    objetivos: [
      { pt: 'Gerir cadeias de valor agroindustriais.', en: 'Manage agribusiness value chains.' },
      { pt: 'Aplicar princípios de marketing agroalimentar.', en: 'Apply agri-food marketing principles.' },
      { pt: 'Planear operações de processamento e logística.', en: 'Plan processing and logistics operations.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Introdução à Gestão', en: 'Introduction to Management' },
        { pt: 'Microeconomia', en: 'Microeconomics' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Contabilidade Agrícola', en: 'Agricultural Accounting' },
        { pt: 'Tecnologia de Alimentos', en: 'Food Technology' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Marketing Agroalimentar', en: 'Agri-food Marketing' },
        { pt: 'Logística e Cadeia de Abastecimento', en: 'Logistics and Supply Chain' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Gestão Estratégica', en: 'Strategic Management' },
        { pt: 'Estágio Profissional', en: 'Professional Internship' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Gestor Agroindustrial', en: 'Agribusiness Manager' },
      { pt: 'Analista de Cadeias de Valor', en: 'Value Chain Analyst' },
      { pt: 'Consultor de Negócios Agrícolas', en: 'Agribusiness Consultant' },
    ],
  },
  {
    id: 'economia-agraria',
    tipo: 'grau',
    faculdade: { pt: 'Faculdade de Gestão e Economia Agrária', en: 'Faculty of Agribusiness Management and Economics' },
    titulo: { pt: 'Economia Agrária', en: 'Agricultural Economics' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Presencial', en: 'On-campus' },
    resumo: {
      pt: 'Analisa mercados, políticas públicas e desenvolvimento económico do sector rural.',
      en: 'Analyzes markets, public policy and economic development in the rural sector.',
    },
    objetivos: [
      { pt: 'Analisar mercados e preços agrícolas.', en: 'Analyze agricultural markets and prices.' },
      { pt: 'Avaliar políticas públicas para o sector rural.', en: 'Evaluate public policy for the rural sector.' },
      { pt: 'Elaborar estudos de viabilidade económica.', en: 'Prepare economic feasibility studies.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Princípios de Economia', en: 'Principles of Economics' },
        { pt: 'Matemática para Economia', en: 'Mathematics for Economics' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Macroeconomia', en: 'Macroeconomics' },
        { pt: 'Economia Rural', en: 'Rural Economics' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Políticas Agrícolas', en: 'Agricultural Policy' },
        { pt: 'Econometria', en: 'Econometrics' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Desenvolvimento Rural', en: 'Rural Development' },
        { pt: 'Trabalho de Fim de Curso', en: 'Capstone Project' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Economista Agrário', en: 'Agricultural Economist' },
      { pt: 'Analista de Políticas Públicas', en: 'Public Policy Analyst' },
      { pt: 'Investigador', en: 'Researcher' },
    ],
  },
  {
    id: 'engenharia-florestal',
    tipo: 'grau',
    faculdade: { pt: 'Faculdade de Ciências Ambientais e Florestais', en: 'Faculty of Environmental and Forestry Sciences' },
    titulo: { pt: 'Engenharia Florestal', en: 'Forestry Engineering' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Presencial', en: 'On-campus' },
    resumo: {
      pt: 'Forma engenheiros para a gestão sustentável de florestas e recursos madeireiros.',
      en: 'Trains engineers for the sustainable management of forests and timber resources.',
    },
    objetivos: [
      { pt: 'Planear a gestão sustentável de povoamentos florestais.', en: 'Plan the sustainable management of forest stands.' },
      { pt: 'Avaliar impactos ambientais de exploração florestal.', en: 'Assess environmental impacts of forestry operations.' },
      { pt: 'Aplicar técnicas de reflorestação e conservação.', en: 'Apply reforestation and conservation techniques.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Dendrologia', en: 'Dendrology' },
        { pt: 'Ecologia Geral', en: 'General Ecology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Silvicultura', en: 'Silviculture' },
        { pt: 'Pedologia Florestal', en: 'Forest Soil Science' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Gestão de Recursos Florestais', en: 'Forest Resource Management' },
        { pt: 'Tecnologia da Madeira', en: 'Wood Technology' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Ordenamento Florestal', en: 'Forest Planning' },
        { pt: 'Estágio Profissional', en: 'Professional Internship' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Engenheiro Florestal', en: 'Forestry Engineer' },
      { pt: 'Gestor de Áreas Protegidas', en: 'Protected Area Manager' },
      { pt: 'Consultor Ambiental', en: 'Environmental Consultant' },
    ],
  },
  {
    id: 'ciencias-ambientais',
    tipo: 'grau',
    faculdade: { pt: 'Faculdade de Ciências Ambientais e Florestais', en: 'Faculty of Environmental and Forestry Sciences' },
    titulo: { pt: 'Ciências Ambientais', en: 'Environmental Sciences' },
    grau: { pt: 'Licenciatura', en: "Bachelor's Degree" },
    duracao: { pt: '4 anos', en: '4 years' },
    regime: { pt: 'Pós-laboral', en: 'Evening' },
    resumo: {
      pt: 'Prepara profissionais para a avaliação e gestão de impactos ambientais e recursos naturais.',
      en: 'Prepares professionals to assess and manage environmental impacts and natural resources.',
    },
    objetivos: [
      { pt: 'Realizar avaliações de impacto ambiental.', en: 'Conduct environmental impact assessments.' },
      { pt: 'Gerir recursos hídricos e do solo.', en: 'Manage water and soil resources.' },
      { pt: 'Propor soluções de mitigação e adaptação climática.', en: 'Propose climate mitigation and adaptation solutions.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, disciplinas: [
        { pt: 'Química Ambiental', en: 'Environmental Chemistry' },
        { pt: 'Ecologia', en: 'Ecology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, disciplinas: [
        { pt: 'Gestão de Recursos Hídricos', en: 'Water Resource Management' },
        { pt: 'Geoprocessamento', en: 'Geoprocessing' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, disciplinas: [
        { pt: 'Avaliação de Impacto Ambiental', en: 'Environmental Impact Assessment' },
        { pt: 'Alterações Climáticas', en: 'Climate Change' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, disciplinas: [
        { pt: 'Gestão de Resíduos', en: 'Waste Management' },
        { pt: 'Trabalho de Fim de Curso', en: 'Capstone Project' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Consultor Ambiental', en: 'Environmental Consultant' },
      { pt: 'Técnico de Licenciamento Ambiental', en: 'Environmental Licensing Technician' },
      { pt: 'Investigador', en: 'Researcher' },
    ],
  },
  {
    id: 'agricultura-precisao',
    tipo: 'curta-duracao',
    faculdade: { pt: 'Faculdade de Ciências Agrárias', en: 'Faculty of Agricultural Sciences' },
    titulo: { pt: 'Agricultura de Precisão', en: 'Precision Agriculture' },
    grau: { pt: 'Certificado Profissional', en: 'Professional Certificate' },
    duracao: { pt: '3 meses', en: '3 months' },
    regime: { pt: 'Pós-laboral', en: 'Evening' },
    resumo: {
      pt: 'Curso de curta duração sobre tecnologias de sensorização, mapeamento e gestão de dados agrícolas.',
      en: 'Short course on sensing technologies, mapping and agricultural data management.',
    },
    objetivos: [
      { pt: 'Utilizar ferramentas de agricultura de precisão.', en: 'Use precision agriculture tools.' },
      { pt: 'Interpretar dados de sensores e drones agrícolas.', en: 'Interpret data from agricultural sensors and drones.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: 'Módulos', en: 'Modules' }, disciplinas: [
        { pt: 'Fundamentos de Agricultura de Precisão', en: 'Precision Agriculture Fundamentals' },
        { pt: 'Sensorização Remota', en: 'Remote Sensing' },
        { pt: 'Análise de Dados Agrícolas', en: 'Agricultural Data Analysis' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Técnico em Agricultura de Precisão', en: 'Precision Agriculture Technician' },
      { pt: 'Consultor de Tecnologias Agrícolas', en: 'AgTech Consultant' },
    ],
    proximaData: { pt: '15 de outubro de 2026', en: 'October 15, 2026' },
  },
  {
    id: 'gestao-cooperativas',
    tipo: 'curta-duracao',
    faculdade: { pt: 'Faculdade de Gestão e Economia Agrária', en: 'Faculty of Agribusiness Management and Economics' },
    titulo: { pt: 'Gestão de Cooperativas Agrícolas', en: 'Agricultural Cooperative Management' },
    grau: { pt: 'Certificado Profissional', en: 'Professional Certificate' },
    duracao: { pt: '2 meses', en: '2 months' },
    regime: { pt: 'Online', en: 'Online' },
    resumo: {
      pt: 'Capacita gestores e associados de cooperativas em governação, finanças e comercialização coletiva.',
      en: 'Trains cooperative managers and members in governance, finance and collective commercialization.',
    },
    objetivos: [
      { pt: 'Aplicar boas práticas de governação cooperativa.', en: 'Apply good cooperative governance practices.' },
      { pt: 'Gerir finanças e excedentes de cooperativas agrícolas.', en: 'Manage finances and surpluses of agricultural cooperatives.' },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: 'Módulos', en: 'Modules' }, disciplinas: [
        { pt: 'Princípios do Cooperativismo', en: 'Cooperative Principles' },
        { pt: 'Gestão Financeira de Cooperativas', en: 'Cooperative Financial Management' },
        { pt: 'Comercialização Coletiva', en: 'Collective Commercialization' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Gestor de Cooperativa', en: 'Cooperative Manager' },
      { pt: 'Técnico de Extensão Rural', en: 'Rural Extension Technician' },
    ],
    proximaData: { pt: '5 de novembro de 2026', en: 'November 5, 2026' },
  },
];
