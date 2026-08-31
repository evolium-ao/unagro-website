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
      intranetTitulo: string;
      intranetDescricao: string;
      intranetBotao: string;
      intranetAviso: string;
      avisosTitulo: string;
      noticiasTitulo: string;
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
      bolsasTitulo: string;
      faqTitulo: string;
    };
    detalheCurso: {
      objetivosTitulo: string;
      planoCurricularTitulo: string;
      saidasTitulo: string;
      naoEncontrado: string;
      metricaDuracao: string;
      metricaGrau: string;
      metricaDisciplinas: string;
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
  rotas: {
    inicio: { titulo: string; descricao: string };
    sobre: { titulo: string; descricao: string };
    desenvolvimento: { titulo: string; descricao: string };
    hub: { titulo: string; descricao: string };
    candidaturas: { titulo: string; descricao: string };
    detalheCurso: { titulo: string; descricao: string };
    estudantes: { titulo: string; descricao: string };
    detalheProjeto: { titulo: string; descricao: string };
    eventos: { titulo: string; descricao: string };
    formacoes: { titulo: string; descricao: string };
    contactos: { titulo: string; descricao: string };
    alumni: { titulo: string; descricao: string };
    naoEncontrada: { titulo: string; descricao: string };
  };
}

type UniaoChaves<T, Prefixo extends string> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefixo}${K}`
    : UniaoChaves<T[K], `${Prefixo}${K}.`>;
}[keyof T & string];

export type CaminhoDicionario = UniaoChaves<Dicionario, ''>;
