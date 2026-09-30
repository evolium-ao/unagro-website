export interface Dicionario {
  nav: {
    inicio: string;
    sobre: string;
    sobreUnagro: string;
    candidaturas: string;
    cursos: string;
    estudantes: string;
    desenvolvimento: string;
    eventos: string;
    formacoes: string;
    hub: string;
    contactos: string;
    alumni: string;
    /** Itens do submenu de "Sobre a UNAGRO". */
    sobreMenu: {
      nossaHistoria: string;
      pilares: string;
      orgaosGestao: string;
      estruturaOrganizacional: string;
      faculdadesDepartamentos: string;
      abaUnagro: string;
      governanca: string;
    };
    /** Itens do submenu de "Candidaturas". */
    candidaturasMenu: {
      estudantes: string;
      docentes: string;
      maisInformacoes: string;
    };
  };
  comum: {
    verMais: string;
    lerMais: string;
    lerArtigo: string;
    saberMais: string;
    emDestaque: string;
    eventoComecaEm: string;
    anterior: string;
    seguinte: string;
    verDetalhes: string;
    inscreverSe: string;
    enviar: string;
    enviarMensagem: string;
    voltarInicio: string;
    selecionarIdioma: string;
    pesquisar: string;
    abrirMenu: string;
    fecharMenu: string;
    campoObrigatorio: string;
    emailInvalido: string;
    envioComSucesso: string;
    envioComErro: string;
    aCarregar: string;
    publicado: string;
    verTodasNoticias: string;
    entrar: string;
    compartilhar: string;
    copiarLink: string;
    linkCopiado: string;
  };
  rodape: {
    lema: string;
    universidadeTitulo: string;
    servicosTitulo: string;
    contactoTitulo: string;
    reitoria: string;
    departamentos: string;
    portalEstudante: string;
    processoAdmissao: string;
    apoioEstudante: string;
    bolsasEstudo: string;
    assinatura: string;
    termosUso: string;
    privacidade: string;
    cookies: string;
    acessibilidade: string;
  };
  eventos: {
    nacional: string;
    internacional: string;
  };
  paginas: {
    contactos: {
      titulo: string;
      subtitulo: string;
      formTitulo: string;
      campoNome: string;
      campoEmail: string;
      campoAssunto: string;
      campoMensagem: string;
      assuntoPlaceholder: string;
      assuntoGeral: string;
      assuntoCandidaturas: string;
      assuntoCursos: string;
      assuntoImprensa: string;
      localizacaoTitulo: string;
      moradaTitulo: string;
      telefoneTitulo: string;
      emailTitulo: string;
      horarioTitulo: string;
      horarioValor: string;
    };
    sobre: {
      titulo: string;
      subtitulo: string;
      missaoTitulo: string;
      missaoTexto: string;
      visaoTitulo: string;
      visaoTexto: string;
      valoresTitulo: string;
      historiaTitulo: string;
      historiaTexto: string;
    };
    desenvolvimento: {
      titulo: string;
      subtitulo: string;
      eixosTitulo: string;
      projetosTitulo: string;
      projetosTexto: string;
    };
    hub: {
      titulo: string;
      subtitulo: string;
      servicosTitulo: string;
      participarTitulo: string;
      participarTexto: string;
      participarBotao: string;
    };
    detalheProjeto: {
      desafioTitulo: string;
      solucaoTitulo: string;
      cronogramaTitulo: string;
      galeriaTitulo: string;
      contactoTitulo: string;
      contactoDescricao: string;
      naoEncontrado: string;
    };
    estudantes: {
      titulo: string;
      subtitulo: string;
      heroSelo: string;
      heroTitulo: string;
      heroTituloDestaque: string;
      heroSubtitulo: string;
      heroCtaCursos: string;
      heroCtaHorarios: string;
      intranetSecaoTitulo: string;
      intranetSecaoDescricao: string;
      intranetCartaoSelo: string;
      intranetCartaoTitulo: string;
      intranetCartaoDescricao: string;
      intranetCartaoCta: string;
      intranetTitulo: string;
      intranetDescricao: string;
      intranetBotao: string;
      intranetAviso: string;
      avisosTitulo: string;
      noticiasTitulo: string;
      noticiasDescricao: string;
    };
    alumni: {
      titulo: string;
      subtitulo: string;
      sobreTitulo: string;
      sobreTexto: string;
      impactoTitulo: string;
      historiasTitulo: string;
      doacaoTitulo: string;
      doacaoDescricao: string;
      campoNome: string;
      campoEmail: string;
      campoValor: string;
      campoMensagem: string;
      botaoDoar: string;
    };
    candidaturas: {
      titulo: string;
      subtitulo: string;
      passosTitulo: string;
      passosSubtitulo: string;
      ofertaTitulo: string;
      ofertaSubtitulo: string;
      filtroFaculdadeRotulo: string;
      filtroGrauRotulo: string;
      filtroRegimeRotulo: string;
      requisitosTitulo: string;
      requisitosDescricao: string;
      calendarioTitulo: string;
      calendarioSubtitulo: string;
      portalTitulo: string;
      portalDescricao: string;
      portalBotaoContinuar: string;
      portalBotaoEstado: string;
      recrutamentoSelo: string;
      recrutamentoTitulo: string;
      recrutamentoDescricao: string;
      recrutamentoBotao: string;
      bolsasTitulo: string;
      bolsasDescricao: string;
      bolsasLink: string;
      faqTitulo: string;
      secretariaTitulo: string;
      secretariaDescricao: string;
    };
    candidaturaDocentes: {
      heroSelo: string;
      heroTitulo: string;
      heroSubtitulo: string;
      heroCtaCandidatar: string;
      heroCtaBrochura: string;
      porqueTitulo: string;
      porqueDescricao: string;
      requisitosTitulo: string;
      duvidasTexto: string;
      duvidasLink: string;
    };
    detalheCurso: {
      heroSelo: string;
      heroCtaCandidatar: string;
      heroCtaPlano: string;
      secao1Titulo: string;
      /** Contém o marcador `{curso}`, substituído pelo título do curso aberto. */
      secao1Paragrafo1: string;
      secao1Paragrafo2: string;
      inscricoesTitulo: string;
      inscricoesDetalhe: string;
      inscricoesBotao: string;
      objetivosTitulo: string;
      objetivosDescricao: string;
      planoCurricularTitulo: string;
      planoCurricularDescricao: string;
      metodologiaTitulo: string;
      requisitosAdmissaoTitulo: string;
      faqTitulo: string;
      ctaFinalTitulo: string;
      /** Contém o marcador `{curso}`, substituído pelo título do curso aberto. */
      ctaFinalDescricao: string;
      saidasTitulo: string;
      saidasDescricao: string;
      naoEncontrado: string;
      naoEncontradoDescricao: string;
      naoEncontradoBotao: string;
      metricaDuracao: string;
      metricaGrau: string;
      metricaDisciplinas: string;
      metricaRegime: string;
      metricaProximaData: string;
      ctaTitulo: string;
      ctaDescricao: string;
      ctaBotaoContactar: string;
      outrosCursosTitulo: string;
      outrosCursosDescricao: string;
    };
    formacoes: {
      titulo: string;
      subtitulo: string;
      cursosTitulo: string;
      vantagensTitulo: string;
      datasTitulo: string;
      validarTitulo: string;
      validarDescricao: string;
      validarCampoCodigo: string;
      validarBotao: string;
      validarSucesso: string;
      validarErro: string;
    };
    eventos: {
      titulo: string;
      subtitulo: string;
      filtroTitulo: string;
      filtroTodas: string;
      proximosTitulo: string;
      contadorTitulo: string;
      contadorDias: string;
      contadorHoras: string;
      contadorMinutos: string;
      contadorSegundos: string;
      semEventos: string;
    };
    inicio: {
      heroTitulo: string;
      heroSubtitulo: string;
      heroBadge: string;
      heroCtaCandidatar: string;
      heroCtaCursos: string;
      pilaresTitulo: string;
      pilaresSubtitulo: string;
      noticiasTitulo: string;
      noticiasSubtitulo: string;
      eventoTitulo: string;
      ctaFinalTitulo: string;
      ctaFinalSubtitulo: string;
      ctaFinalBotao: string;
    };
  };
  /** Conteúdos apresentados em modais (fora do fluxo das páginas). */
  modais: {
    nossaHistoria: {
      selo: string;
      titulo: string;
      paragrafoUm: string;
      paragrafoDois: string;
      destaqueTitulo: string;
      destaqueTexto: string;
      fechar: string;
    };
  };
  rotas: {
    inicio: { titulo: string; descricao: string };
    sobre: { titulo: string; descricao: string };
    desenvolvimento: { titulo: string; descricao: string };
    hub: { titulo: string; descricao: string };
    candidaturas: { titulo: string; descricao: string };
    candidaturaDocentes: { titulo: string; descricao: string };
    candidaturaGeral: { titulo: string; descricao: string };
    candidaturaGeralFormulario: { titulo: string; descricao: string };
    inscricao: { titulo: string; descricao: string };
    detalheCurso: { titulo: string; descricao: string };
    estudantes: { titulo: string; descricao: string };
    detalheProjeto: { titulo: string; descricao: string };
    detalheNoticia: { titulo: string; descricao: string };
    eventos: { titulo: string; descricao: string };
    formacoes: { titulo: string; descricao: string };
    contactos: { titulo: string; descricao: string };
    alumni: { titulo: string; descricao: string };
    entrar: { titulo: string; descricao: string };
    registo: { titulo: string; descricao: string };
    naoEncontrada: { titulo: string; descricao: string };
  };
}

type UniaoChaves<T, Prefixo extends string> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefixo}${K}`
    : UniaoChaves<T[K], `${Prefixo}${K}.`>;
}[keyof T & string];

export type CaminhoDicionario = UniaoChaves<Dicionario, ''>;
