import { Curso } from '../modelos/curso.model';

export const CURSOS_MOCK: Curso[] = [
  {
    id: 'engenharia-agronomica',
    tipo: 'grau',
    imagem: '/imagens/image-curso-1.png',
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
      {
        rotulo: { pt: 'Geral', en: 'General' },
        icone: 'target',
        texto: {
          pt: 'Formar engenheiros com sólida base científica e técnica para intervir em todas as fases da cadeia de produção agrícola, promovendo a eficiência e a sustentabilidade.',
          en: 'Train engineers with a solid scientific and technical foundation to work across every stage of the agricultural production chain, driving efficiency and sustainability.',
        },
      },
      {
        rotulo: { pt: 'Inovação', en: 'Innovation' },
        icone: 'bot',
        texto: {
          pt: 'Dominar ferramentas de biotecnologia, mecanização e sistemas de informação geográfica aplicados à gestão de recursos naturais e culturas.',
          en: 'Master biotechnology, mechanization and geographic information systems applied to the management of natural resources and crops.',
        },
      },
      {
        rotulo: { pt: 'Investigação', en: 'Research' },
        icone: 'flask-conical',
        texto: {
          pt: 'Desenvolver competências críticas para a condução de projectos de investigação aplicada que resolvam problemas reais do sector agrícola nacional.',
          en: 'Develop the critical skills to lead applied research projects that solve real problems in the national agricultural sector.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Científicos', en: 'Scientific Foundations' }, disciplinas: [
        { pt: 'Botânica Geral', en: 'General Botany' },
        { pt: 'Química Agrícola', en: 'Agricultural Chemistry' },
        { pt: 'Matemática Aplicada', en: 'Applied Mathematics' },
        { pt: 'Introdução à Agronomia', en: 'Introduction to Agronomy' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Solo e Planta', en: 'Soil and Plant' }, disciplinas: [
        { pt: 'Ciência do Solo', en: 'Soil Science' },
        { pt: 'Fitopatologia', en: 'Plant Pathology' },
        { pt: 'Fisiologia Vegetal', en: 'Plant Physiology' },
        { pt: 'Estatística Experimental', en: 'Experimental Statistics' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Especialização Técnica', en: 'Technical Specialization' }, disciplinas: [
        { pt: 'Culturas Anuais', en: 'Annual Crops' },
        { pt: 'Culturas Permanentes', en: 'Permanent Crops' },
        { pt: 'Agricultura de Precisão', en: 'Precision Agriculture' },
        { pt: 'Economia Agrária', en: 'Agricultural Economics' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Projecto e Profissionalização', en: 'Project and Professional Practice' }, disciplinas: [
        { pt: 'Extensão Rural', en: 'Rural Extension' },
        { pt: 'Gestão de Explorações Agrícolas', en: 'Farm Management' },
        { pt: 'Estágio Profissional', en: 'Professional Internship' },
        { pt: 'Trabalho de Fim de Curso', en: 'Capstone Project' },
      ]},
    ],
    saidasProfissionais: [
      { pt: 'Gestor de Explorações Agrícolas', en: 'Farm Manager' },
      { pt: 'Investigador Científico', en: 'Research Scientist' },
      { pt: 'Consultor em Agrotecnologia', en: 'AgTech Consultant' },
      { pt: 'Perito em Avaliação do Impacto Ambiental', en: 'Environmental Impact Assessment Expert' },
      { pt: 'Gestor de Agroindústrias', en: 'Agro-industry Manager' },
    ],
  },
  {
    id: 'medicina-veterinaria',
    tipo: 'grau',
    imagem: '/imagens/image-curso-2.png',
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
      {
        rotulo: { pt: 'Clínica', en: 'Clinical Practice' },
        icone: 'stethoscope',
        texto: {
          pt: 'Diagnosticar e tratar doenças em animais domésticos e de produção.',
          en: 'Diagnose and treat diseases in domestic and production animals.',
        },
      },
      {
        rotulo: { pt: 'Saúde Pública', en: 'Public Health' },
        icone: 'badge-check',
        texto: {
          pt: 'Aplicar programas de saúde pública veterinária.',
          en: 'Apply veterinary public health programmes.',
        },
      },
      {
        rotulo: { pt: 'Produção Pecuária', en: 'Livestock Production' },
        icone: 'briefcase',
        texto: {
          pt: 'Gerir sistemas de produção pecuária.',
          en: 'Manage livestock production systems.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Morfológicos', en: 'Morphological Foundations' }, disciplinas: [
        { pt: 'Anatomia Veterinária', en: 'Veterinary Anatomy' },
        { pt: 'Bioquímica', en: 'Biochemistry' },
        { pt: 'Histologia', en: 'Histology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Fisiologia e Agentes Infecciosos', en: 'Physiology and Infectious Agents' }, disciplinas: [
        { pt: 'Fisiologia Animal', en: 'Animal Physiology' },
        { pt: 'Microbiologia Veterinária', en: 'Veterinary Microbiology' },
        { pt: 'Parasitologia', en: 'Parasitology' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Diagnóstico e Terapêutica', en: 'Diagnosis and Therapeutics' }, disciplinas: [
        { pt: 'Patologia Clínica', en: 'Clinical Pathology' },
        { pt: 'Farmacologia', en: 'Pharmacology' },
        { pt: 'Semiologia', en: 'Semiology' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Prática Clínica', en: 'Clinical Practice' }, disciplinas: [
        { pt: 'Clínica Médica', en: 'Medical Clinic' },
        { pt: 'Clínica Cirúrgica', en: 'Surgical Clinic' },
        { pt: 'Saúde Pública Veterinária', en: 'Veterinary Public Health' },
      ]},
      { ano: 5, titulo: { pt: '5º Ano', en: 'Year 5' }, tema: { pt: 'Projecto e Profissionalização', en: 'Project and Professional Practice' }, disciplinas: [
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
    imagem: '/imagens/image-curso-3.png',
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
      {
        rotulo: { pt: 'Produção', en: 'Production' },
        icone: 'target',
        texto: {
          pt: 'Otimizar sistemas de produção animal.',
          en: 'Optimize animal production systems.',
        },
      },
      {
        rotulo: { pt: 'Nutrição', en: 'Nutrition' },
        icone: 'sprout',
        texto: {
          pt: 'Formular planos de nutrição animal.',
          en: 'Formulate animal nutrition plans.',
        },
      },
      {
        rotulo: { pt: 'Genética', en: 'Genetics' },
        icone: 'flask-conical',
        texto: {
          pt: 'Aplicar técnicas de melhoramento genético.',
          en: 'Apply genetic improvement techniques.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Biológicos', en: 'Biological Foundations' }, disciplinas: [
        { pt: 'Anatomia e Fisiologia Animal', en: 'Animal Anatomy and Physiology' },
        { pt: 'Bioquímica Aplicada', en: 'Applied Biochemistry' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Nutrição e Forragens', en: 'Nutrition and Forage' }, disciplinas: [
        { pt: 'Nutrição Animal', en: 'Animal Nutrition' },
        { pt: 'Forragicultura', en: 'Forage Science' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Genética e Bovinicultura', en: 'Genetics and Cattle Farming' }, disciplinas: [
        { pt: 'Genética e Melhoramento Animal', en: 'Animal Genetics and Breeding' },
        { pt: 'Produção de Bovinos', en: 'Cattle Production' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Avicultura, Suinicultura e Estágio', en: 'Poultry, Swine and Internship' }, disciplinas: [
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
    imagem: '/imagens/image-curso-1.png',
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
      {
        rotulo: { pt: 'Gestão', en: 'Management' },
        icone: 'target',
        texto: {
          pt: 'Gerir cadeias de valor agroindustriais.',
          en: 'Manage agribusiness value chains.',
        },
      },
      {
        rotulo: { pt: 'Mercado', en: 'Market' },
        icone: 'globe',
        texto: {
          pt: 'Aplicar princípios de marketing agroalimentar.',
          en: 'Apply agri-food marketing principles.',
        },
      },
      {
        rotulo: { pt: 'Operações', en: 'Operations' },
        icone: 'briefcase',
        texto: {
          pt: 'Planear operações de processamento e logística.',
          en: 'Plan processing and logistics operations.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos de Gestão', en: 'Management Foundations' }, disciplinas: [
        { pt: 'Introdução à Gestão', en: 'Introduction to Management' },
        { pt: 'Microeconomia', en: 'Microeconomics' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Contabilidade e Tecnologia Alimentar', en: 'Accounting and Food Technology' }, disciplinas: [
        { pt: 'Contabilidade Agrícola', en: 'Agricultural Accounting' },
        { pt: 'Tecnologia de Alimentos', en: 'Food Technology' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Mercados e Logística', en: 'Markets and Logistics' }, disciplinas: [
        { pt: 'Marketing Agroalimentar', en: 'Agri-food Marketing' },
        { pt: 'Logística e Cadeia de Abastecimento', en: 'Logistics and Supply Chain' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Estratégia e Profissionalização', en: 'Strategy and Professional Practice' }, disciplinas: [
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
    imagem: '/imagens/image-curso-2.png',
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
      {
        rotulo: { pt: 'Mercados', en: 'Markets' },
        icone: 'target',
        texto: {
          pt: 'Analisar mercados e preços agrícolas.',
          en: 'Analyze agricultural markets and prices.',
        },
      },
      {
        rotulo: { pt: 'Políticas', en: 'Policy' },
        icone: 'landmark',
        texto: {
          pt: 'Avaliar políticas públicas para o sector rural.',
          en: 'Evaluate public policy for the rural sector.',
        },
      },
      {
        rotulo: { pt: 'Investigação', en: 'Research' },
        icone: 'flask-conical',
        texto: {
          pt: 'Elaborar estudos de viabilidade económica.',
          en: 'Prepare economic feasibility studies.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Económicos', en: 'Economic Foundations' }, disciplinas: [
        { pt: 'Princípios de Economia', en: 'Principles of Economics' },
        { pt: 'Matemática para Economia', en: 'Mathematics for Economics' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Macroeconomia e Economia Rural', en: 'Macroeconomics and Rural Economics' }, disciplinas: [
        { pt: 'Macroeconomia', en: 'Macroeconomics' },
        { pt: 'Economia Rural', en: 'Rural Economics' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Políticas e Métodos Quantitativos', en: 'Policy and Quantitative Methods' }, disciplinas: [
        { pt: 'Políticas Agrícolas', en: 'Agricultural Policy' },
        { pt: 'Econometria', en: 'Econometrics' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Desenvolvimento Rural e Projecto', en: 'Rural Development and Project' }, disciplinas: [
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
    imagem: '/imagens/image-curso-3.png',
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
      {
        rotulo: { pt: 'Gestão Florestal', en: 'Forest Management' },
        icone: 'trees',
        texto: {
          pt: 'Planear a gestão sustentável de povoamentos florestais.',
          en: 'Plan the sustainable management of forest stands.',
        },
      },
      {
        rotulo: { pt: 'Ambiente', en: 'Environment' },
        icone: 'globe',
        texto: {
          pt: 'Avaliar impactos ambientais de exploração florestal.',
          en: 'Assess environmental impacts of forestry operations.',
        },
      },
      {
        rotulo: { pt: 'Conservação', en: 'Conservation' },
        icone: 'sprout',
        texto: {
          pt: 'Aplicar técnicas de reflorestação e conservação.',
          en: 'Apply reforestation and conservation techniques.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Florestais', en: 'Forestry Foundations' }, disciplinas: [
        { pt: 'Dendrologia', en: 'Dendrology' },
        { pt: 'Ecologia Geral', en: 'General Ecology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Silvicultura e Solos', en: 'Silviculture and Soils' }, disciplinas: [
        { pt: 'Silvicultura', en: 'Silviculture' },
        { pt: 'Pedologia Florestal', en: 'Forest Soil Science' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Recursos e Tecnologia da Madeira', en: 'Resources and Wood Technology' }, disciplinas: [
        { pt: 'Gestão de Recursos Florestais', en: 'Forest Resource Management' },
        { pt: 'Tecnologia da Madeira', en: 'Wood Technology' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Ordenamento e Profissionalização', en: 'Planning and Professional Practice' }, disciplinas: [
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
    imagem: '/imagens/image-curso-1.png',
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
      {
        rotulo: { pt: 'Avaliação', en: 'Assessment' },
        icone: 'clipboard-check',
        texto: {
          pt: 'Realizar avaliações de impacto ambiental.',
          en: 'Conduct environmental impact assessments.',
        },
      },
      {
        rotulo: { pt: 'Recursos', en: 'Resources' },
        icone: 'globe',
        texto: {
          pt: 'Gerir recursos hídricos e do solo.',
          en: 'Manage water and soil resources.',
        },
      },
      {
        rotulo: { pt: 'Clima', en: 'Climate' },
        icone: 'sprout',
        texto: {
          pt: 'Propor soluções de mitigação e adaptação climática.',
          en: 'Propose climate mitigation and adaptation solutions.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: '1º Ano', en: 'Year 1' }, tema: { pt: 'Fundamentos Ambientais', en: 'Environmental Foundations' }, disciplinas: [
        { pt: 'Química Ambiental', en: 'Environmental Chemistry' },
        { pt: 'Ecologia', en: 'Ecology' },
      ]},
      { ano: 2, titulo: { pt: '2º Ano', en: 'Year 2' }, tema: { pt: 'Água e Geoprocessamento', en: 'Water and Geoprocessing' }, disciplinas: [
        { pt: 'Gestão de Recursos Hídricos', en: 'Water Resource Management' },
        { pt: 'Geoprocessamento', en: 'Geoprocessing' },
      ]},
      { ano: 3, titulo: { pt: '3º Ano', en: 'Year 3' }, tema: { pt: 'Impacto e Clima', en: 'Impact and Climate' }, disciplinas: [
        { pt: 'Avaliação de Impacto Ambiental', en: 'Environmental Impact Assessment' },
        { pt: 'Alterações Climáticas', en: 'Climate Change' },
      ]},
      { ano: 4, titulo: { pt: '4º Ano', en: 'Year 4' }, tema: { pt: 'Resíduos e Projecto', en: 'Waste and Project' }, disciplinas: [
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
    imagem: '/imagens/image-curso-2.png',
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
      {
        rotulo: { pt: 'Tecnologia', en: 'Technology' },
        icone: 'bot',
        texto: {
          pt: 'Utilizar ferramentas de agricultura de precisão.',
          en: 'Use precision agriculture tools.',
        },
      },
      {
        rotulo: { pt: 'Dados', en: 'Data' },
        icone: 'search',
        texto: {
          pt: 'Interpretar dados de sensores e drones agrícolas.',
          en: 'Interpret data from agricultural sensors and drones.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: 'Módulos', en: 'Modules' }, tema: { pt: 'Sensorização e Dados', en: 'Sensing and Data' }, disciplinas: [
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
    imagem: '/imagens/image-curso-3.png',
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
      {
        rotulo: { pt: 'Governação', en: 'Governance' },
        icone: 'landmark',
        texto: {
          pt: 'Aplicar boas práticas de governação cooperativa.',
          en: 'Apply good cooperative governance practices.',
        },
      },
      {
        rotulo: { pt: 'Finanças', en: 'Finance' },
        icone: 'briefcase',
        texto: {
          pt: 'Gerir finanças e excedentes de cooperativas agrícolas.',
          en: 'Manage finances and surpluses of agricultural cooperatives.',
        },
      },
    ],
    planoCurricular: [
      { ano: 1, titulo: { pt: 'Módulos', en: 'Modules' }, tema: { pt: 'Cooperativismo e Finanças', en: 'Cooperativism and Finance' }, disciplinas: [
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
