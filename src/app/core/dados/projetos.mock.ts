import { CategoriaProjecto, EstadoEtapaCronograma } from '../modelos/projeto.model';
import { TextoBilingue } from '../traducao/texto-bilingue';

interface EtapaCronogramaBruta {
  id: string;
  titulo: TextoBilingue;
  periodo?: TextoBilingue;
  descricao: TextoBilingue;
  estado: EstadoEtapaCronograma;
}

interface EstatisticaProjetoBruta {
  id: string;
  valor: TextoBilingue;
  rotulo: TextoBilingue;
}

interface ObjetivoProjetoBruto {
  id: string;
  icone: string;
  titulo: TextoBilingue;
  descricao: TextoBilingue;
}

/** Um componente da solução implementada — mesma forma de um objectivo. */
type SolucaoProjetoBruta = ObjetivoProjetoBruto;

/**
 * Uma fotografia da galeria, na forma bruta. A `url` já vem sem o `public/`;
 * um item sem `url` sai como marcador cinzento em vez de dar 404.
 */
interface ItemGaleriaBruto {
  id: string;
  url?: string;
  legenda?: TextoBilingue;
}

/**
 * Um membro da equipa, na forma bruta: o nome próprio não se traduz, o cargo
 * sim. A `foto_url` já vem sem o `public/`.
 */
interface MembroEquipaBruto {
  id: string;
  nome: string;
  cargo: TextoBilingue;
  foto_url?: string;
}

/**
 * Um ficheiro publicado, na forma bruta. O nome do ficheiro traduz-se; a `url`
 * fica **em falta** de propósito enquanto não houver PDF no servidor.
 */
interface DocumentoProjetoBruto {
  id: string;
  titulo: TextoBilingue;
  url?: string;
}

/**
 * Um testemunho, na forma bruta: o nome de quem fala não se traduz, a citação e
 * o papel sim. A `foto` já vem sem o `public/`.
 */
interface TestemunhoProjetoBruto {
  id: string;
  citacao: TextoBilingue;
  autor: string;
  papel: TextoBilingue;
  foto?: string;
}

/**
 * Contactos do projecto, na forma bruta. Endereço de e-mail e telefone são
 * literais; só a localização de campo se escreve nos dois idiomas.
 */
interface ContactoProjetoBruto {
  email: string;
  telefone: string;
  localizacao: TextoBilingue;
}

/**
 * Forma bruta (bilingue) do projecto, antes de passar por `getTraducao`. É o
 * `ProjetosService` que a traduz para a forma da API (`Projeto`, só texto).
 */
export interface ProjetoBruto {
  id: string;
  categoria: CategoriaProjecto;
  titulo: TextoBilingue;
  faculdade: TextoBilingue;
  estado: TextoBilingue;
  local: TextoBilingue;
  periodo: TextoBilingue;
  areaTematica: TextoBilingue;
  resumo: TextoBilingue;
  resultado_principal: TextoBilingue;
  imagem_url: string;
  contexto?: TextoBilingue;
  desafio: TextoBilingue;
  estatisticasContexto?: EstatisticaProjetoBruta[];
  imagem_contexto_url?: string;
  objetivoGeral?: TextoBilingue;
  objetivosEspecificos?: ObjetivoProjetoBruto[];
  descricaoSolucao?: TextoBilingue;
  solucoes?: SolucaoProjetoBruta[];
  estatisticasImpacto?: EstatisticaProjetoBruta[];
  cronograma?: EtapaCronogramaBruta[];
  galeria?: ItemGaleriaBruto[];
  equipa?: MembroEquipaBruto[];
  documentos?: DocumentoProjetoBruto[];
  testemunhos?: TestemunhoProjetoBruto[];
  contacto?: ContactoProjetoBruto;
}

export const PROJETOS_MOCK: ProjetoBruto[] = [
  {
    id: 'variedades-resistentes-seca',
    categoria: 'agricultura',
    titulo: ['Variedades de Milho Resistentes à Seca', 'Drought-Resistant Maize Varieties'],
    faculdade: ['Faculdade de Ciências Agrárias', 'Faculty of Agricultural Sciences'],
    estado: ['EM EXECUÇÃO', 'IN PROGRESS'],
    local: ['Malanje, Angola', 'Malanje, Angola'],
    periodo: ['Janeiro 2025 – Dezembro 2027', 'January 2025 – December 2027'],
    areaTematica: ['Melhoramento de Culturas', 'Crop Improvement'],
    resumo: [
      'Seleção e teste de variedades de milho com maior tolerância a períodos de seca prolongada.',
      'Selection and testing of maize varieties with greater tolerance to prolonged drought periods.',
    ],
    resultado_principal: ['+35% Resistência à Seca', '+35% Drought Resistance'],
    imagem_url: '/imagens/desenvolvimento-projecto-1.png',
    contexto: [
      'As planícies de Malanje concentram uma parte importante da produção nacional de milho, sustentada por famílias que semeiam em sequeiro e dependem inteiramente da chuva. Nas últimas campanhas, o atraso das primeiras chuvas e os veranicos prolongados deixaram lavras inteiras sem colheita.',
      'The Malanje plains account for a significant share of national maize production, sustained by families who sow rain-fed crops and depend entirely on rainfall. In recent seasons, late first rains and prolonged dry spells have left entire fields without a harvest.',
    ],
    desafio: [
      'As secas recorrentes reduzem drasticamente a produtividade do milho nas comunidades rurais, ameaçando a segurança alimentar.',
      'Recurring droughts drastically reduce maize productivity in rural communities, threatening food security.',
    ],
    estatisticasContexto: [
      {
        id: 'quebra-producao',
        valor: ['-40%', '-40%'],
        rotulo: ['Quebra de produção', 'Yield loss'],
      },
      {
        id: 'epocas-seca',
        valor: ['3 Épocas', '3 Seasons'],
        rotulo: ['Seca consecutiva', 'Consecutive drought'],
      },
    ],
    objetivoGeral: [
      'Disponibilizar aos produtores de Malanje variedades de milho capazes de completar o ciclo mesmo em campanhas de chuva irregular, garantindo colheita nas famílias que dependem do sequeiro.',
      'Provide Malanje farmers with maize varieties able to complete their cycle even in seasons of irregular rainfall, securing a harvest for the families who depend on rain-fed farming.',
    ],
    objetivosEspecificos: [
      {
        id: 'selecao-varietal',
        icone: 'sprout',
        titulo: ['Seleção Varietal', 'Varietal Selection'],
        descricao: [
          'Avaliar 12 variedades em ensaios de campo ao longo de três campanhas.',
          'Evaluate 12 varieties in field trials over three growing seasons.',
        ],
      },
      {
        id: 'uso-agua',
        icone: 'droplet',
        titulo: ['Uso da Água', 'Water Use'],
        descricao: [
          'Reduzir em 30% a água necessária por tonelada de grão produzida.',
          'Cut the water needed per tonne of grain produced by 30%.',
        ],
      },
      {
        id: 'selecao-participativa',
        icone: 'users',
        titulo: ['Seleção Participativa', 'Participatory Selection'],
        descricao: [
          'Envolver 200 produtores na escolha das variedades finais.',
          'Involve 200 farmers in choosing the final varieties.',
        ],
      },
      {
        id: 'semente-certificada',
        icone: 'award',
        titulo: ['Semente Certificada', 'Certified Seed'],
        descricao: [
          'Multiplicar e certificar duas variedades até ao fim do projecto.',
          'Multiply and certify two varieties by the end of the project.',
        ],
      },
    ],
    descricaoSolucao: [
      'Combinamos sabedoria tradicional angolana com as mais recentes inovações globais em agrotecnologia.',
      'We combine traditional Angolan wisdom with the latest global innovations in agrotechnology.',
    ],
    solucoes: [
      {
        id: 'irrigacao-inteligente',
        icone: 'droplet',
        titulo: ['Irrigação Inteligente', 'Smart Irrigation'],
        descricao: [
          'Sistemas de rega gota-a-gota controlados por IA para redução de 40% no desperdício hídrico.',
          'AI-controlled drip irrigation systems that cut water waste by 40%.',
        ],
      },
      {
        id: 'mapeamento-solo',
        icone: 'map',
        titulo: ['Mapeamento do Solo', 'Soil Mapping'],
        descricao: [
          'Mapeamento espectral via drones para análise nutricional em tempo real de cada parcela.',
          'Drone spectral mapping for real-time nutritional analysis of every plot.',
        ],
      },
      {
        id: 'atividades',
        icone: 'sprout',
        titulo: ['Atividades', 'Activities'],
        descricao: [
          'Rotação intensiva de culturas e introdução de bio-fertilizantes produzidos localmente.',
          'Intensive crop rotation and the introduction of locally produced bio-fertilisers.',
        ],
      },
      {
        id: 'equipamento',
        icone: 'wrench',
        titulo: ['Equipamento', 'Equipment'],
        descricao: [
          'Frota de tratores autónomos e estufas inteligentes com climatização solar passiva.',
          'A fleet of autonomous tractors and smart greenhouses with passive solar climate control.',
        ],
      },
    ],
    estatisticasImpacto: [
      {
        id: 'familias-abrangidas',
        valor: ['340+', '340+'],
        rotulo: ['Famílias abrangidas', 'Households reached'],
      },
      {
        id: 'area-ensaio',
        valor: ['18Ha', '18Ha'],
        rotulo: ['Área de ensaio', 'Trial area'],
      },
      {
        id: 'resistencia-seca',
        valor: ['+35%', '+35%'],
        rotulo: ['Resistência à seca', 'Drought resistance'],
      },
      {
        id: 'investimento-variedades',
        valor: ['1.2M', '1.2M'],
        rotulo: ['Investimento (USD)', 'Investment (USD)'],
      },
    ],
    cronograma: [
      {
        id: 'planeamento',
        periodo: ['Q1 2025', 'Q1 2025'],
        titulo: ['Planeamento', 'Planning'],
        descricao: [
          'Licenciamento e montagem da estação experimental.',
          'Licensing and setup of the experimental station.',
        ],
        estado: 'concluida',
      },
      {
        id: 'investigacao',
        periodo: ['Q3 2025', 'Q3 2025'],
        titulo: ['Investigação', 'Research'],
        descricao: [
          'Caracterização do germoplasma e ensaios de campo.',
          'Germplasm characterisation and field trials.',
        ],
        estado: 'concluida',
      },
      {
        id: 'implementacao',
        titulo: ['Implementação', 'Implementation'],
        descricao: [
          'Seleção participativa das variedades com os produtores.',
          'Participatory selection of varieties with the farmers.',
        ],
        estado: 'atual',
      },
      {
        id: 'monitorizacao',
        periodo: ['Q2 2027', 'Q2 2027'],
        titulo: ['Monitorização', 'Monitoring'],
        descricao: [
          'Avaliação da produtividade e da tolerância ao veranico.',
          'Assessment of yield and tolerance to dry spells.',
        ],
        estado: 'futura',
      },
      {
        id: 'encerramento',
        periodo: ['Q4 2027', 'Q4 2027'],
        titulo: ['Encerramento', 'Closure'],
        descricao: [
          'Multiplicação de sementes certificadas e relatório final.',
          'Certified seed multiplication and final report.',
        ],
        estado: 'futura',
      },
    ],
    imagem_contexto_url: '/imagens/homem-do-campo.png',
    galeria: [
      {
        id: 'estado-inicial',
        url: '/imagens/campos-de-bananeiras.png',
        legenda: ['Estado Inicial (2024)', 'Initial State (2024)'],
      },
      { id: 'plantio-parcelas', url: '/imagens/desenvolvimento-projecto-1.png' },
      { id: 'germinacao-estufa', url: '/imagens/campos-a-germinar.png' },
      { id: 'equipa-viveiro', url: '/imagens/impacto-numerico.png' },
    ],
    equipa: [
      {
        id: 'coordenacao-geral',
        nome: 'Prof. Dr. João Silva',
        cargo: ['Coordenador Geral', 'General Coordinator'],
        foto_url: '/imagens/staff-projecto-dr-joao.png',
      },
      {
        id: 'lideranca-agronomia',
        nome: 'Engª. Maria Bento',
        cargo: ['Líder de Agronomia', 'Agronomy Lead'],
        foto_url: '/imagens/staff-projecto-dr-maria.png',
      },
      {
        id: 'especialista-irrigacao',
        nome: 'Sr. Paulo Kassoma',
        cargo: ['Especialista em Irrigação', 'Irrigation Specialist'],
        foto_url: '/imagens/staff-projecto-dr-Paulo.png',
      },
      {
        id: 'analise-dados-iot',
        nome: 'Dra. Ana Luísa',
        cargo: ['Analista de Dados IoT', 'IoT Data Analyst'],
        foto_url: '/imagens/staff-projecto-dr-luis.png',
      },
    ],
    // TODO: os PDF ainda não estão no servidor — sem `url` cada item fica como bloco
    // não clicável, em vez de apontar para um ficheiro que não existe.
    documentos: [
      {
        id: 'relatorio-tecnico-q1-2025',
        titulo: ['Relatório Técnico Q1 2025.pdf', 'Technical Report Q1 2025.pdf'],
      },
      {
        id: 'estudo-impacto-ambiental',
        titulo: ['Estudo de Impacto Ambiental.pdf', 'Environmental Impact Assessment.pdf'],
      },
      {
        id: 'manual-boas-praticas',
        titulo: [
          'Manual de Boas Práticas Agrícolas.pdf',
          'Good Agricultural Practices Handbook.pdf',
        ],
      },
    ],
    testemunhos: [
      {
        id: 'beneficiario-local',
        citacao: [
          'Este projecto não é apenas sobre plantar sementes, é sobre plantar esperança numa nova geração de agricultores angolanos que agora têm acesso a ferramentas que antes eram um sonho.',
          'This project is not just about planting seeds, it is about planting hope in a new generation of Angolan farmers who now have access to tools that once were a dream.',
        ],
        autor: 'Mateus Kassange',
        papel: ['Beneficiário local', 'Local beneficiary'],
        // TODO: retrato provisório — falta a fotografia do Mateus Kassange.
        foto: '/imagens/homem-do-campo.png',
      },
    ],
    contacto: {
      email: 'milho.malanje@unagro.edu.ao',
      telefone: '+244 923 000 000',
      localizacao: [
        'Estação Experimental de Cangandala, Malanje',
        'Cangandala Experimental Station, Malanje',
      ],
    },
  },
  {
    id: 'saude-reprodutiva-bovinos',
    categoria: 'agricultura',
    titulo: ['Saúde Reprodutiva em Rebanhos Bovinos', 'Reproductive Health in Cattle Herds'],
    faculdade: ['Faculdade de Medicina Veterinária e Zootecnia', 'Faculty of Veterinary Medicine and Animal Science'],
    estado: ['EM EXECUÇÃO', 'IN PROGRESS'],
    local: ['Huambo, Angola', 'Huambo, Angola'],
    periodo: ['Março 2025 – Fevereiro 2027', 'March 2025 – February 2027'],
    areaTematica: ['Sanidade Animal', 'Animal Health'],
    resumo: [
      'Diagnóstico e acompanhamento reprodutivo para reduzir a mortalidade neonatal em bovinos.',
      'Reproductive diagnosis and monitoring to reduce neonatal mortality in cattle.',
    ],
    resultado_principal: ['-25% Mortalidade Neonatal', '-25% Neonatal Mortality'],
    imagem_url: '/imagens/desenvolvimento-projecto-2.png',
    contexto: [
      'A pecuária do Huambo assenta em explorações familiares com rebanhos pequenos, onde cada nascimento pesa directamente no rendimento anual da casa. O acompanhamento veterinário é escasso e a maioria dos criadores nunca teve acesso a um protocolo reprodutivo.',
      'Livestock farming in Huambo rests on family holdings with small herds, where every birth weighs directly on the household income for the year. Veterinary support is scarce and most breeders have never had access to a reproductive protocol.',
    ],
    desafio: [
      'Elevadas taxas de mortalidade neonatal reduzem a rentabilidade das explorações pecuárias da região.',
      'High neonatal mortality rates reduce the profitability of livestock farms in the region.',
    ],
    estatisticasContexto: [
      {
        id: 'vitelos-perdidos',
        valor: ['1 em 4', '1 in 4'],
        rotulo: ['Vitelos perdidos', 'Calves lost'],
      },
      {
        id: 'rede-piloto',
        valor: ['8 Explorações', '8 Farms'],
        rotulo: ['Rede piloto', 'Pilot network'],
      },
    ],
    objetivoGeral: [
      'Reduzir a mortalidade neonatal nos rebanhos familiares do Huambo através de um protocolo de maneio reprodutivo simples, replicável e assumido pelos próprios criadores.',
      'Reduce neonatal mortality in Huambo family herds through a simple, replicable reproductive management protocol owned by the breeders themselves.',
    ],
    objetivosEspecificos: [
      {
        id: 'diagnostico-sanitario',
        icone: 'stethoscope',
        titulo: ['Diagnóstico Sanitário', 'Health Screening'],
        descricao: [
          'Rastrear o estado reprodutivo dos rebanhos de 8 explorações piloto.',
          'Screen the reproductive status of the herds on 8 pilot farms.',
        ],
      },
      {
        id: 'protocolo-maneio',
        icone: 'clipboard-check',
        titulo: ['Protocolo de Maneio', 'Management Protocol'],
        descricao: [
          'Implantar um calendário sanitário anual em todas as explorações.',
          'Roll out an annual health calendar across every participating farm.',
        ],
      },
      {
        id: 'capacitacao-criadores',
        icone: 'graduation-cap',
        titulo: ['Capacitação', 'Training'],
        descricao: [
          'Formar 60 criadores em maneio sanitário e reprodutivo.',
          'Train 60 breeders in herd health and reproductive management.',
        ],
      },
      {
        id: 'taxa-desmame',
        icone: 'trending-up',
        titulo: ['Taxa de Desmame', 'Weaning Rate'],
        descricao: [
          'Elevar a taxa de desmame de 55% para 75% em dois anos.',
          'Raise the weaning rate from 55% to 75% within two years.',
        ],
      },
    ],
    descricaoSolucao: [
      'Combinamos sabedoria tradicional angolana com as mais recentes inovações globais em agrotecnologia.',
      'We combine traditional Angolan wisdom with the latest global innovations in agrotechnology.',
    ],
    solucoes: [
      {
        id: 'irrigacao-inteligente',
        icone: 'droplet',
        titulo: ['Irrigação Inteligente', 'Smart Irrigation'],
        descricao: [
          'Sistemas de rega gota-a-gota controlados por IA para redução de 40% no desperdício hídrico.',
          'AI-controlled drip irrigation systems that cut water waste by 40%.',
        ],
      },
      {
        id: 'mapeamento-solo',
        icone: 'map',
        titulo: ['Mapeamento do Solo', 'Soil Mapping'],
        descricao: [
          'Mapeamento espectral via drones para análise nutricional em tempo real de cada parcela.',
          'Drone spectral mapping for real-time nutritional analysis of every plot.',
        ],
      },
      {
        id: 'atividades',
        icone: 'sprout',
        titulo: ['Atividades', 'Activities'],
        descricao: [
          'Rotação intensiva de culturas e introdução de bio-fertilizantes produzidos localmente.',
          'Intensive crop rotation and the introduction of locally produced bio-fertilisers.',
        ],
      },
      {
        id: 'equipamento',
        icone: 'wrench',
        titulo: ['Equipamento', 'Equipment'],
        descricao: [
          'Frota de tratores autónomos e estufas inteligentes com climatização solar passiva.',
          'A fleet of autonomous tractors and smart greenhouses with passive solar climate control.',
        ],
      },
    ],
    estatisticasImpacto: [
      {
        id: 'exploracoes-rede',
        valor: ['8', '8'],
        rotulo: ['Explorações na rede', 'Farms in the network'],
      },
      {
        id: 'cabecas-acompanhadas',
        valor: ['1.400', '1,400'],
        rotulo: ['Cabeças acompanhadas', 'Head monitored'],
      },
      {
        id: 'mortalidade-neonatal',
        valor: ['-25%', '-25%'],
        rotulo: ['Mortalidade neonatal', 'Neonatal mortality'],
      },
      {
        id: 'investimento-bovinos',
        valor: ['850K', '850K'],
        rotulo: ['Investimento (USD)', 'Investment (USD)'],
      },
    ],
    cronograma: [
      {
        id: 'planeamento',
        periodo: ['Q1 2025', 'Q1 2025'],
        titulo: ['Planeamento', 'Planning'],
        descricao: [
          'Seleção das explorações e acordos com os criadores.',
          'Selection of farms and agreements with the breeders.',
        ],
        estado: 'concluida',
      },
      {
        id: 'investigacao',
        periodo: ['Q3 2025', 'Q3 2025'],
        titulo: ['Investigação', 'Research'],
        descricao: [
          'Diagnóstico sanitário e reprodutivo do rebanho piloto.',
          'Health and reproductive diagnosis of the pilot herd.',
        ],
        estado: 'concluida',
      },
      {
        id: 'implementacao',
        titulo: ['Implementação', 'Implementation'],
        descricao: [
          'Aplicação do protocolo de maneio e capacitação dos criadores.',
          'Rollout of the management protocol and breeder training.',
        ],
        estado: 'atual',
      },
      {
        id: 'monitorizacao',
        periodo: ['Q3 2026', 'Q3 2026'],
        titulo: ['Monitorização', 'Monitoring'],
        descricao: [
          'Acompanhamento das taxas de desmame e de fertilidade.',
          'Tracking of weaning and fertility rates.',
        ],
        estado: 'futura',
      },
      {
        id: 'encerramento',
        periodo: ['Q1 2027', 'Q1 2027'],
        titulo: ['Encerramento', 'Closure'],
        descricao: [
          'Manual de maneio replicável e relatório final.',
          'Replicable management handbook and final report.',
        ],
        estado: 'futura',
      },
    ],
    galeria: [
      {
        id: 'rebanho-inicial',
        url: '/imagens/homem-do-campo.png',
        legenda: ['Estado Inicial (2024)', 'Initial State (2024)'],
      },
      { id: 'recolha-leite', url: '/imagens/baldes-no-campo.png' },
      { id: 'pastagem-melhorada', url: '/imagens/estufa-campos.png' },
      { id: 'acompanhamento-tecnico', url: '/imagens/desenvolvimento-projecto-2.png' },
    ],
    equipa: [
      {
        id: 'coordenacao-geral',
        nome: 'Prof. Dr. Aurélio Chivela',
        cargo: ['Coordenador Geral', 'General Coordinator'],
        foto_url: '/imagens/staff-projecto-dr-joao.png',
      },
      {
        id: 'lideranca-sanidade',
        nome: 'Dra. Teresa Muanza',
        cargo: ['Líder de Sanidade Animal', 'Animal Health Lead'],
        foto_url: '/imagens/staff-projecto-dr-maria.png',
      },
      {
        id: 'especialista-reproducao',
        nome: 'Sr. Domingos Bumba',
        cargo: ['Especialista em Reprodução', 'Reproduction Specialist'],
        foto_url: '/imagens/staff-projecto-dr-Paulo.png',
      },
      {
        id: 'analise-dados-zootecnicos',
        nome: 'Eng.º Nelson Kapuka',
        cargo: ['Analista de Dados Zootécnicos', 'Livestock Data Analyst'],
        foto_url: '/imagens/staff-projecto-dr-luis.png',
      },
    ],
    imagem_contexto_url: '/imagens/homem-do-campo.png',
    documentos: [
      {
        id: 'protocolo-diagnostico-reprodutivo',
        titulo: [
          'Protocolo de Diagnóstico Reprodutivo.pdf',
          'Reproductive Diagnosis Protocol.pdf',
        ],
      },
      {
        id: 'relatorio-sanitario-2025',
        titulo: ['Relatório Sanitário Semestral 2025.pdf', 'Half-Year Herd Health Report 2025.pdf'],
      },
      {
        id: 'manual-manejo-bezerro',
        titulo: ['Manual de Manejo do Bezerro.pdf', 'Calf Management Handbook.pdf'],
      },
    ],
    testemunhos: [
      {
        id: 'criador-parceiro',
        citacao: [
          'Antes perdíamos bezerros todas as campanhas sem saber a razão. Com o acompanhamento da equipa aprendemos a ler os sinais do rebanho e hoje cada nascimento conta para a família.',
          'We used to lose calves every season without knowing why. With the team following our herd we learned to read its signs, and today every birth counts for the family.',
        ],
        autor: 'Domingos Chivukuvuku',
        papel: ['Criador de gado parceiro', 'Partner cattle farmer'],
      },
    ],
    contacto: {
      email: 'bovinos.huambo@unagro.edu.ao',
      telefone: '+244 923 000 120',
      localizacao: ['Centro Veterinário do Huambo, Huambo', 'Huambo Veterinary Centre, Huambo'],
    },
  },
  {
    id: 'cooperativas-cadeia-valor',
    categoria: 'infraestrutura',
    titulo: ['Fortalecimento de Cooperativas na Cadeia de Valor', 'Strengthening Cooperatives in the Value Chain'],
    faculdade: ['Faculdade de Gestão e Economia Agrária', 'Faculty of Agribusiness Management and Economics'],
    estado: ['EM EXECUÇÃO', 'IN PROGRESS'],
    local: ['Luanda, Angola', 'Luanda, Angola'],
    periodo: ['Janeiro 2025 – Dezembro 2026', 'January 2025 – December 2026'],
    areaTematica: ['Agronegócio e Cooperativismo', 'Agribusiness and Cooperatives'],
    resumo: [
      'Apoio à gestão e comercialização coletiva de cooperativas de pequenos produtores.',
      'Support for the management and collective marketing of smallholder cooperatives.',
    ],
    resultado_principal: ['6 Cooperativas Apoiadas', '6 Cooperatives Supported'],
    imagem_url: '/imagens/desenvolvimento-projecto-3.png',
    contexto: [
      'Nos arredores de Luanda, centenas de pequenos produtores abastecem diariamente os mercados urbanos, mas fazem-no isoladamente e sem contratos. Sem armazenamento nem transporte próprio, vendem à porta da lavra ao primeiro comprador que aparece.',
      'On the outskirts of Luanda, hundreds of smallholders supply the urban markets every day, yet they do so in isolation and without contracts. With no storage or transport of their own, they sell at the farm gate to the first buyer who turns up.',
    ],
    desafio: [
      'Pequenos produtores vendem a preços baixos por falta de organização coletiva e acesso a mercados.',
      'Smallholder farmers sell at low prices due to lack of collective organization and market access.',
    ],
    estatisticasContexto: [
      {
        id: 'margem-perdida',
        valor: ['60%', '60%'],
        rotulo: ['Margem perdida', 'Margin lost'],
      },
      {
        id: 'rede-cooperativas',
        valor: ['6 Cooperativas', '6 Cooperatives'],
        rotulo: ['Rede de apoio', 'Support network'],
      },
    ],
    objetivoGeral: [
      'Organizar os pequenos produtores dos arredores de Luanda em cooperativas capazes de negociar em conjunto, conservar a produção e vender directamente a compradores institucionais.',
      'Organise smallholders on the outskirts of Luanda into cooperatives able to negotiate together, store their produce and sell directly to institutional buyers.',
    ],
    objetivosEspecificos: [
      {
        id: 'governacao',
        icone: 'briefcase',
        titulo: ['Governação', 'Governance'],
        descricao: [
          'Rever os estatutos e o modelo de gestão de 6 cooperativas.',
          'Overhaul the by-laws and management model of 6 cooperatives.',
        ],
      },
      {
        id: 'centros-agregacao',
        icone: 'building-2',
        titulo: ['Armazenamento', 'Storage'],
        descricao: [
          'Instalar dois centros de agregação com câmara de frio.',
          'Set up two aggregation centres with cold storage.',
        ],
      },
      {
        id: 'margem-produtor',
        icone: 'chart-column',
        titulo: ['Margem do Produtor', 'Farmer Margin'],
        descricao: [
          'Aumentar em 30% o preço recebido à porta da lavra.',
          'Increase the farm-gate price received by 30%.',
        ],
      },
      {
        id: 'contratos-institucionais',
        icone: 'file-check',
        titulo: ['Contratos', 'Contracts'],
        descricao: [
          'Assegurar 10 contratos anuais com compradores institucionais.',
          'Secure 10 annual contracts with institutional buyers.',
        ],
      },
    ],
    descricaoSolucao: [
      'Combinamos sabedoria tradicional angolana com as mais recentes inovações globais em agrotecnologia.',
      'We combine traditional Angolan wisdom with the latest global innovations in agrotechnology.',
    ],
    solucoes: [
      {
        id: 'irrigacao-inteligente',
        icone: 'droplet',
        titulo: ['Irrigação Inteligente', 'Smart Irrigation'],
        descricao: [
          'Sistemas de rega gota-a-gota controlados por IA para redução de 40% no desperdício hídrico.',
          'AI-controlled drip irrigation systems that cut water waste by 40%.',
        ],
      },
      {
        id: 'mapeamento-solo',
        icone: 'map',
        titulo: ['Mapeamento do Solo', 'Soil Mapping'],
        descricao: [
          'Mapeamento espectral via drones para análise nutricional em tempo real de cada parcela.',
          'Drone spectral mapping for real-time nutritional analysis of every plot.',
        ],
      },
      {
        id: 'atividades',
        icone: 'sprout',
        titulo: ['Atividades', 'Activities'],
        descricao: [
          'Rotação intensiva de culturas e introdução de bio-fertilizantes produzidos localmente.',
          'Intensive crop rotation and the introduction of locally produced bio-fertilisers.',
        ],
      },
      {
        id: 'equipamento',
        icone: 'wrench',
        titulo: ['Equipamento', 'Equipment'],
        descricao: [
          'Frota de tratores autónomos e estufas inteligentes com climatização solar passiva.',
          'A fleet of autonomous tractors and smart greenhouses with passive solar climate control.',
        ],
      },
    ],
    estatisticasImpacto: [
      {
        id: 'cooperativas-apoiadas',
        valor: ['6', '6'],
        rotulo: ['Cooperativas apoiadas', 'Cooperatives supported'],
      },
      {
        id: 'produtores-associados',
        valor: ['480+', '480+'],
        rotulo: ['Produtores associados', 'Member farmers'],
      },
      {
        id: 'margem-produtor-impacto',
        valor: ['+40%', '+40%'],
        rotulo: ['Margem no produtor', 'Farmer margin'],
      },
      {
        id: 'investimento-cooperativas',
        valor: ['1.5M', '1.5M'],
        rotulo: ['Investimento (USD)', 'Investment (USD)'],
      },
    ],
    cronograma: [
      {
        id: 'planeamento',
        periodo: ['Q1 2025', 'Q1 2025'],
        titulo: ['Planeamento', 'Planning'],
        descricao: [
          'Mapeamento das cooperativas e desenho do programa.',
          'Mapping of the cooperatives and programme design.',
        ],
        estado: 'concluida',
      },
      {
        id: 'investigacao',
        periodo: ['Q2 2025', 'Q2 2025'],
        titulo: ['Investigação', 'Research'],
        descricao: [
          'Diagnóstico da governação e das rotas de comercialização.',
          'Diagnosis of governance and marketing routes.',
        ],
        estado: 'concluida',
      },
      {
        id: 'implementacao',
        titulo: ['Implementação', 'Implementation'],
        descricao: [
          'Centros de agregação e formação em gestão coletiva.',
          'Aggregation centres and training in collective management.',
        ],
        estado: 'atual',
      },
      {
        id: 'monitorizacao',
        periodo: ['Q2 2026', 'Q2 2026'],
        titulo: ['Monitorização', 'Monitoring'],
        descricao: [
          'Avaliação da margem no produtor e dos contratos assinados.',
          'Assessment of farmer margin and signed contracts.',
        ],
        estado: 'futura',
      },
      {
        id: 'encerramento',
        periodo: ['Q4 2026', 'Q4 2026'],
        titulo: ['Encerramento', 'Closure'],
        descricao: [
          'Transferência da gestão às cooperativas e relatório final.',
          'Handover of management to the cooperatives and final report.',
        ],
        estado: 'futura',
      },
    ],
    galeria: [
      {
        id: 'armazem-antes',
        url: '/imagens/desenvolvimento-projecto-3.png',
        legenda: ['Estado Inicial (2024)', 'Initial State (2024)'],
      },
      { id: 'recolha-cooperativa', url: '/imagens/baldes-no-campo.png' },
      { id: 'formacao-associados', url: '/imagens/impacto-numerico.png' },
      { id: 'escoamento-producao', url: '/imagens/campos-de-bananeiras.png' },
    ],
    equipa: [
      {
        id: 'coordenacao-geral',
        nome: 'Prof.ª Dra. Ivone Sacala',
        cargo: ['Coordenadora Geral', 'General Coordinator'],
        foto_url: '/imagens/staff-projecto-dr-maria.png',
      },
      {
        id: 'lideranca-economia-agraria',
        nome: 'Dr. Bernardo Ndala',
        cargo: ['Líder de Economia Agrária', 'Agricultural Economics Lead'],
        foto_url: '/imagens/staff-projecto-dr-joao.png',
      },
      {
        id: 'especialista-cooperativismo',
        nome: 'Sr. Alberto Chissola',
        cargo: ['Especialista em Cooperativismo', 'Cooperative Development Specialist'],
        foto_url: '/imagens/staff-projecto-dr-Paulo.png',
      },
      {
        id: 'analise-cadeias-valor',
        nome: 'Eng.ª Luzia Ferraz',
        cargo: ['Analista de Cadeias de Valor', 'Value Chain Analyst'],
        foto_url: '/imagens/staff-projecto-dr-luis.png',
      },
    ],
    imagem_contexto_url: '/imagens/homem-do-campo.png',
    documentos: [
      {
        id: 'diagnostico-gestao-cooperativas',
        titulo: [
          'Diagnóstico de Gestão das Cooperativas.pdf',
          'Cooperative Management Assessment.pdf',
        ],
      },
      {
        id: 'guia-comercializacao-coletiva',
        titulo: ['Guia de Comercialização Coletiva.pdf', 'Collective Marketing Guide.pdf'],
      },
      {
        id: 'relatorio-financeiro-2025',
        titulo: ['Relatório Financeiro Anual 2025.pdf', 'Annual Financial Report 2025.pdf'],
      },
    ],
    testemunhos: [
      {
        id: 'presidente-cooperativa',
        citacao: [
          'Vendíamos cada um por sua conta e aceitávamos o preço que nos davam. Depois da formação passámos a negociar em conjunto e a cooperativa deixou de ser um nome no papel.',
          'We each used to sell on our own and accept whatever price we were offered. After the training we began negotiating together, and the cooperative stopped being just a name on paper.',
        ],
        autor: 'Esperança Nzuzi',
        papel: ['Presidente de cooperativa', 'Cooperative chairwoman'],
      },
    ],
    contacto: {
      email: 'cooperativas.quiminha@unagro.edu.ao',
      telefone: '+244 923 000 240',
      localizacao: ['Sector 4, Quiminha, Luanda', 'Sector 4, Quiminha, Luanda'],
    },
  },
  {
    id: 'restauro-areas-degradadas',
    categoria: 'meio_ambiente',
    titulo: ['Restauro de Áreas Florestais Degradadas', 'Restoration of Degraded Forest Areas'],
    faculdade: ['Faculdade de Ciências Ambientais e Florestais', 'Faculty of Environmental and Forestry Sciences'],
    estado: ['CONCLUÍDO', 'COMPLETED'],
    local: ['Uíge, Angola', 'Uíge, Angola'],
    periodo: ['Fevereiro 2023 – Janeiro 2025', 'February 2023 – January 2025'],
    areaTematica: ['Agricultura Sustentável', 'Sustainable Agriculture'],
    resumo: [
      'Reflorestação com espécies nativas em áreas afetadas por desmatamento.',
      'Reforestation with native species in areas affected by deforestation.',
    ],
    resultado_principal: ['50k Árvores Plantadas', '50k Trees Planted'],
    imagem_url: '/imagens/desenvolvimento-projecto-1.png',
    contexto: [
      'Localizada no coração da província de Luanda, a Fazenda da Quiminha foi outrora um símbolo de prosperidade agrícola. Contudo, décadas de obsolescência técnica e falta de investimento transformaram este vasto território num mosaico de terras áridas e infraestruturas em ruína.',
      'Located in the heart of Luanda province, the Quiminha Farm was once a symbol of agricultural prosperity. Decades of technical obsolescence and lack of investment, however, turned this vast territory into a patchwork of arid land and crumbling infrastructure.',
    ],
    desafio: [
      'O desafio principal reside em reverter este ciclo, não apenas reativando a terra, mas regenerando o solo através de práticas biológicas que garantam a sustentabilidade a longo prazo num clima cada vez mais imprevisível.',
      'The main challenge lies in reversing this cycle — not merely bringing the land back into use, but regenerating the soil through biological practices that secure long-term sustainability in an increasingly unpredictable climate.',
    ],
    estatisticasContexto: [
      {
        id: 'erosao-solo',
        valor: ['45%', '45%'],
        rotulo: ['Erosão do solo', 'Soil erosion'],
      },
      {
        id: 'inatividade-tecnica',
        valor: ['12 Anos', '12 Years'],
        rotulo: ['Inatividade técnica', 'Technical inactivity'],
      },
    ],
    imagem_contexto_url: '/imagens/homem-do-campo.png',
    objetivoGeral: [
      'Transformar a Fazenda da Quiminha num hub agroindustrial auto-sustentável e resiliente, servindo como modelo nacional para a segurança alimentar em Angola.',
      'Turn the Quiminha Farm into a self-sustaining, resilient agro-industrial hub that serves as a national model for food security in Angola.',
    ],
    objetivosEspecificos: [
      {
        id: 'recuperacao-areas',
        icone: 'trees',
        titulo: ['Recuperação de Áreas', 'Land Recovery'],
        descricao: [
          'Reabilitar 500 hectares de solos degradados em 24 meses.',
          'Rehabilitate 500 hectares of degraded soil within 24 months.',
        ],
      },
      {
        id: 'produtividade',
        icone: 'trending-up',
        titulo: ['Produtividade', 'Productivity'],
        descricao: [
          'Otimizar os ciclos de cultivo para 3 colheitas anuais.',
          'Optimise the cropping cycles to three harvests per year.',
        ],
      },
      {
        id: 'capacitacao',
        icone: 'graduation-cap',
        titulo: ['Capacitação', 'Training'],
        descricao: [
          'Formar 150 técnicos locais em agricultura digital.',
          'Train 150 local technicians in digital agriculture.',
        ],
      },
      {
        id: 'tecnologia',
        icone: 'server',
        titulo: ['Tecnologia', 'Technology'],
        descricao: [
          'Implementar uma rede de sensores IoT em toda a extensão.',
          'Deploy an IoT sensor network across the entire estate.',
        ],
      },
    ],
    descricaoSolucao: [
      'Combinamos sabedoria tradicional angolana com as mais recentes inovações globais em agrotecnologia.',
      'We combine traditional Angolan wisdom with the latest global innovations in agrotechnology.',
    ],
    solucoes: [
      {
        id: 'irrigacao-inteligente',
        icone: 'droplet',
        titulo: ['Irrigação Inteligente', 'Smart Irrigation'],
        descricao: [
          'Sistemas de rega gota-a-gota controlados por IA para redução de 40% no desperdício hídrico.',
          'AI-controlled drip irrigation systems that cut water waste by 40%.',
        ],
      },
      {
        id: 'mapeamento-solo',
        icone: 'map',
        titulo: ['Mapeamento do Solo', 'Soil Mapping'],
        descricao: [
          'Mapeamento espectral via drones para análise nutricional em tempo real de cada parcela.',
          'Drone spectral mapping for real-time nutritional analysis of every plot.',
        ],
      },
      {
        id: 'atividades',
        icone: 'sprout',
        titulo: ['Atividades', 'Activities'],
        descricao: [
          'Rotação intensiva de culturas e introdução de bio-fertilizantes produzidos localmente.',
          'Intensive crop rotation and the introduction of locally produced bio-fertilisers.',
        ],
      },
      {
        id: 'equipamento',
        icone: 'wrench',
        titulo: ['Equipamento', 'Equipment'],
        descricao: [
          'Frota de tratores autónomos e estufas inteligentes com climatização solar passiva.',
          'A fleet of autonomous tractors and smart greenhouses with passive solar climate control.',
        ],
      },
    ],
    estatisticasImpacto: [
      {
        id: 'beneficiarios-diretos',
        valor: ['500+', '500+'],
        rotulo: ['Beneficiários diretos', 'Direct beneficiaries'],
      },
      {
        id: 'hectares-recuperados',
        valor: ['2Ha', '2Ha'],
        rotulo: ['Recuperados', 'Recovered'],
      },
      {
        id: 'autonomia-hidrica',
        valor: ['85%', '85%'],
        rotulo: ['Autonomia hídrica', 'Water autonomy'],
      },
      {
        id: 'investimento-usd',
        valor: ['2M', '2M'],
        rotulo: ['Investimento (USD)', 'Investment (USD)'],
      },
    ],
    cronograma: [
      {
        id: 'planeamento',
        periodo: ['Q1 2025', 'Q1 2025'],
        titulo: ['Planeamento', 'Planning'],
        descricao: ['Estudos de viabilidade e licenciamento.', 'Feasibility studies and licensing.'],
        estado: 'concluida',
      },
      {
        id: 'investigacao',
        periodo: ['Q2 2025', 'Q2 2025'],
        titulo: ['Investigação', 'Research'],
        descricao: ['Análise geo-espacial e testes de solo.', 'Geospatial analysis and soil testing.'],
        estado: 'concluida',
      },
      {
        id: 'implementacao',
        titulo: ['Implementação', 'Implementation'],
        descricao: ['Construção e plantio inicial.', 'Construction and initial planting.'],
        estado: 'atual',
      },
      {
        id: 'monitorizacao',
        periodo: ['Q2 2026', 'Q2 2026'],
        titulo: ['Monitorização', 'Monitoring'],
        descricao: ["Avaliação de impacto e KPI's.", 'Impact assessment and KPIs.'],
        estado: 'futura',
      },
      {
        id: 'encerramento',
        periodo: ['Q4 2026', 'Q4 2026'],
        titulo: ['Encerramento', 'Closure'],
        descricao: ['Entrega e relatório final.', 'Handover and final report.'],
        estado: 'futura',
      },
    ],
    galeria: [
      {
        id: 'area-degradada',
        url: '/imagens/campos-de-bananeiras.png',
        legenda: ['Estado Inicial (2024)', 'Initial State (2024)'],
      },
      { id: 'viveiro-nativas', url: '/imagens/estufa-campos.png' },
      { id: 'plantio-encostas', url: '/imagens/campo-de-milho-3.png' },
      { id: 'linhas-de-agua', url: '/imagens/recursos-idricos.png' },
    ],
    equipa: [
      {
        id: 'coordenacao-geral',
        nome: 'Prof. Dr. Simão Kalunga',
        cargo: ['Coordenador Geral', 'General Coordinator'],
        foto_url: '/imagens/staff-projecto-dr-joao.png',
      },
      {
        id: 'lideranca-silvicultura',
        nome: 'Eng.ª Rosária Neto',
        cargo: ['Líder de Silvicultura', 'Forestry Lead'],
        foto_url: '/imagens/staff-projecto-dr-maria.png',
      },
      {
        id: 'especialista-conservacao-solos',
        nome: 'Sr. Tomás Mbala',
        cargo: ['Especialista em Conservação de Solos', 'Soil Conservation Specialist'],
        foto_url: '/imagens/staff-projecto-dr-Paulo.png',
      },
      {
        id: 'analise-sensoriamento-remoto',
        nome: 'Dra. Helena Kiala',
        cargo: ['Analista de Sensoriamento Remoto', 'Remote Sensing Analyst'],
        foto_url: '/imagens/staff-projecto-dr-luis.png',
      },
    ],
    documentos: [
      {
        id: 'relatorio-final-restauro',
        titulo: ['Relatório Final de Restauro Florestal.pdf', 'Final Forest Restoration Report.pdf'],
      },
      {
        id: 'estudo-impacto-ambiental',
        titulo: ['Estudo de Impacto Ambiental.pdf', 'Environmental Impact Assessment.pdf'],
      },
      {
        id: 'manual-viveiros-nativas',
        titulo: [
          'Manual de Viveiros de Espécies Nativas.pdf',
          'Native Species Nursery Handbook.pdf',
        ],
      },
    ],
    testemunhos: [
      {
        id: 'autoridade-tradicional',
        citacao: [
          'A encosta que os nossos filhos conheciam pelada voltou a ter sombra e as nascentes voltaram a correr. O que a comunidade plantou com a universidade fica para quem vem depois de nós.',
          'The hillside our children knew bare has shade again, and the springs are flowing once more. What the community planted with the university stays for those who come after us.',
        ],
        autor: 'Bernardo Makengo',
        papel: ['Soba da comunidade de Quitexe', 'Community chief of Quitexe'],
      },
    ],
    contacto: {
      email: 'restauro.uige@unagro.edu.ao',
      telefone: '+244 923 000 360',
      localizacao: ['Viveiro Florestal de Quitexe, Uíge', 'Quitexe Forest Nursery, Uíge'],
    },
  },
];
