import { TextoTraduzido } from '../traducao/texto-traduzido';

/**
 * A notícia antes de localizada: os campos de texto ainda trazem os dois
 * idiomas. O `localizarProfundo` resolve-os para a forma `Noticia`.
 */
export interface NoticiaBruta {
  id: string;
  categoria: TextoTraduzido;
  data: string;
  titulo: TextoTraduzido;
  resumo: TextoTraduzido;
  /** Corpo do artigo; os parágrafos vão separados por `\n\n`, como a API os manda. */
  conteudo?: TextoTraduzido;
  imagem?: string;
  destaque: boolean;
}

/**
 * Conteúdo de recurso da secção de notícias: é o que a página mostra **quando a
 * API não devolve notícia nenhuma** (lista vazia ou pedido falhado). Não é o
 * conteúdo normal da secção — esse vem de `GET /noticias`.
 */
export const NOTICIAS_FALLBACK: NoticiaBruta[] = [
  {
    id: 'laboratorios-biotecnologia',
    categoria: { pt: 'Investigação', en: 'Research' },
    data: '2026-08-24',
    titulo: {
      pt: 'Novos laboratórios de biotecnologia',
      en: 'New biotechnology laboratories',
    },
    resumo: {
      pt: 'A UNAGRO expande a sua infraestrutura de ponta para potenciar a investigação em melhoramento de culturas.',
      en: 'UNAGRO expands its advanced infrastructure to strengthen research in crop improvement.',
    },
    conteudo: {
      pt:
        'A UNAGRO abriu ao trabalho científico dois novos laboratórios de biotecnologia vegetal, equipados para cultura de tecidos, marcadores moleculares e conservação de germoplasma. A área construída acrescenta cerca de 600 metros quadrados à infraestrutura de investigação do campus.\n\n' +
        'O objectivo é encurtar o tempo entre a selecção de material promissor e a sua chegada ao produtor. As primeiras linhas de trabalho concentram-se em variedades de milho e mandioca adaptadas às condições do planalto, com tolerância à seca e resistência às doenças mais frequentes nas explorações familiares.\n\n' +
        'Os laboratórios ficam disponíveis para os projectos de fim de curso e para as teses de mestrado, e abrem também a possibilidade de análises encomendadas por cooperativas e empresas do sector.',
      en:
        'UNAGRO has opened two new plant biotechnology laboratories, equipped for tissue culture, molecular markers and germplasm conservation. The new facilities add roughly 600 square metres to the campus research infrastructure.\n\n' +
        'The goal is to shorten the time between selecting promising material and getting it to the farmer. The first lines of work focus on maize and cassava varieties adapted to highland conditions, with drought tolerance and resistance to the diseases most common on family farms.\n\n' +
        "The laboratories are available for final-year projects and master's theses, and also open the door to analyses commissioned by cooperatives and companies in the sector.",
    },
    imagem: '/imagens/desenvolvimento-card-1.png',
    destaque: true,
  },
  {
    id: 'concurso-inova-agro',
    categoria: { pt: 'Empreendedorismo', en: 'Entrepreneurship' },
    data: '2026-08-18',
    titulo: {
      pt: "Concurso 'Inova Agro' premeia startups inovadoras",
      en: "'Inova Agro' contest rewards innovative startups",
    },
    resumo: {
      pt: 'Jovens empreendedores apresentaram tecnologias disruptivas para o setor.',
      en: 'Young entrepreneurs presented disruptive technologies for the sector.',
    },
    conteudo: {
      pt:
        "A segunda edição do concurso 'Inova Agro' encerrou com a apresentação de dezoito projectos, seis dos quais liderados por estudantes da UNAGRO. As propostas foram avaliadas por um júri de académicos, produtores e investidores.\n\n" +
        'Entre as tecnologias premiadas estão um sistema de monitorização de humidade do solo de baixo custo, uma plataforma de agregação de encomendas para pequenos produtores e um processo de secagem solar para redução de perdas pós-colheita.\n\n' +
        'Os três primeiros classificados entram no programa de incubação da universidade, com acompanhamento técnico durante doze meses e acesso às oficinas e laboratórios do campus.',
      en:
        "The second edition of the 'Inova Agro' contest closed with eighteen projects presented, six of them led by UNAGRO students. The proposals were assessed by a jury of academics, farmers and investors.\n\n" +
        'The award-winning technologies include a low-cost soil moisture monitoring system, an order aggregation platform for smallholders and a solar drying process to cut post-harvest losses.\n\n' +
        "The top three entries join the university's incubation programme, with twelve months of technical support and access to the campus workshops and laboratories.",
    },
    imagem: '/imagens/mulher-no-campo.png',
    destaque: false,
  },
  {
    id: 'acordo-fao-seguranca-alimentar',
    categoria: { pt: 'Parcerias', en: 'Partnerships' },
    data: '2026-08-15',
    titulo: {
      pt: 'Acordo estratégico com a FAO para segurança alimentar',
      en: 'Strategic agreement with FAO for food security',
    },
    resumo: {
      pt: 'Parceria foca a capacitação técnica em zonas rurais.',
      en: 'The partnership focuses on technical training in rural areas.',
    },
    conteudo: {
      pt:
        'A UNAGRO e a FAO assinaram um acordo de cooperação técnica centrado na segurança alimentar das zonas rurais, com duração inicial de três anos. O documento prevê formação de extensionistas, apoio metodológico a inquéritos de campo e partilha de dados.\n\n' +
        'A primeira fase abrange a formação de duzentos técnicos em boas práticas de produção, conservação de solos e gestão da água, com sessões nos municípios onde a universidade já mantém campos de demonstração.\n\n' +
        'O acordo inclui ainda a criação de um núcleo conjunto de análise, encarregado de transformar os dados recolhidos em recomendações práticas para os serviços de extensão e para as cooperativas parceiras.',
      en:
        'UNAGRO and FAO have signed a technical cooperation agreement focused on food security in rural areas, with an initial three-year term. It provides for training extension workers, methodological support for field surveys and data sharing.\n\n' +
        'The first phase covers the training of two hundred technicians in good production practice, soil conservation and water management, with sessions in the municipalities where the university already runs demonstration fields.\n\n' +
        'The agreement also creates a joint analysis unit, tasked with turning the collected data into practical recommendations for extension services and partner cooperatives.',
    },
    imagem: '/imagens/mulher-dra.png',
    destaque: false,
  },
  {
    id: 'centro-inovacao-clima',
    categoria: { pt: 'Clima', en: 'Climate' },
    data: '2026-08-10',
    titulo: {
      pt: 'Centro de inovação para o clima inicia novas pesquisas',
      en: 'Climate innovation centre starts new research',
    },
    resumo: {
      pt: 'Estudos focam a resiliência de culturas tradicionais angolanas face às alterações nos padrões de chuva.',
      en: 'The studies focus on the resilience of traditional Angolan crops to changing rainfall patterns.',
    },
    conteudo: {
      pt:
        'O centro de inovação para o clima da UNAGRO iniciou três estudos de longa duração sobre a resposta das culturas tradicionais angolanas à alteração dos padrões de chuva. Os ensaios decorrem em parcelas instaladas a três altitudes diferentes.\n\n' +
        'O trabalho acompanha massango, massambala e variedades locais de feijão, medindo produtividade, duração do ciclo e comportamento em anos de precipitação irregular. Os dados são cruzados com séries climáticas dos últimos trinta anos.\n\n' +
        'Os resultados intermédios serão publicados anualmente e entregues aos serviços de extensão, com o objectivo de orientar as datas de sementeira e a escolha de variedades em cada região.',
      en:
        "UNAGRO's climate innovation centre has started three long-term studies on how traditional Angolan crops respond to changing rainfall patterns. The trials run on plots set up at three different altitudes.\n\n" +
        'The work follows pearl millet, sorghum and local bean varieties, measuring yield, cycle length and behaviour in years of irregular rainfall. The data is cross-referenced with climate series from the past thirty years.\n\n' +
        'Interim results will be published annually and handed to the extension services, with the aim of guiding sowing dates and variety choice in each region.',
    },
    imagem: '/imagens/mulher-cientista.png',
    destaque: false,
  },
];
