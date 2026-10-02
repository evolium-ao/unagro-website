# Graph Report - web-site-unagro  (2026-10-01)

## Corpus Check
- Large corpus: 463 files · ~1,718,913 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2034 nodes · 4922 edges · 193 communities (99 shown, 94 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 108 edges (avg confidence: 0.86)
- Token cost: 554,641 input · 0 output

## Community Hubs (Navigation)
- Angular Core & SEO
- Candidaturas Page
- Application Form Sections
- Desenvolvimento Page Data
- Startups Service
- Docentes & Inscrição Pages
- Alumni Page
- Candidatura Geral Mocks
- Candidatura Geral State
- API Client Core
- Formações Page
- Inscrições Service
- Candidatura Início & Curso Detail
- Candidatura Tela Inicio
- Home Page
- Projeto Detail Page
- Admissions Mocks
- Date Utils & Cards
- Translation Pipeline
- Estudantes Page
- Contactos Service
- Sobre Sections
- Query Layer & API Errors
- Eventos Service
- Visit Scheduling
- Shared Component Docs
- Projetos API Mappers
- Share Button & Dropdown
- Package Manifest
- Projetos Mock Data
- Alert Modal Service
- Resource Integration Notes
- Agent Workflow Patterns
- Header Menu
- Select Field V2
- Runtime Dependencies
- Cursos Service
- App Config & Session
- Docência Mocks
- Form Step Templates
- Projetos Service
- Candidatura Docentes Service
- Projeto Model & Timeline
- Review Step (Etapa 4)
- Eventos Page & Cards
- Banner & Button
- Upload Field
- Faculdades Service
- Statistics Mocks
- Sponsors & Deep Localize
- Desenvolvimento Component
- Validation Service
- Footer & i18n Dictionary
- Document Field
- Readme
- Dev Dependencies
- Candidatura Alunos Service
- Login Page
- Org Structure Modal
- Readme (2)
- Dropdown Menu
- Modal Types & Icons
- Routes & Layouts
- Treinamentos Service
- Authentication Service
- Etapa 1 Step
- Alert Modal Docs
- Section Header
- Text Field
- Generic Modals
- Selector Field
- Claude
- Angular Build Options
- Alumni Service
- Notícias Service
- Audit & Technical Reports
- Mosaic Gallery
- Countdown & Event Highlight
- Build Configurations
- SSR Server Config
- Api
- Caixa Confirmacao
- Cartao Vidro
- Grupo Cartoes Selecao
- Revelar Ao Scroll
- Angular
- Banner Destaque
- Proximas Datas
- Etapa 2
- Modal Orgaos Gestao
- Modal Pilares Institucionais
- Modal Events
- Item Estatistica
- Modal Candidatura Submetida
- Criar Banner
- Angular (2)
- Angular (3)
- Package
- Server
- App
- Avisos Intranet
- Perguntas Frequentes
- Dicionario
- Alert Modal
- Alert Modal (2)
- Botao Compartilhar
- Dados Icones
- Item Contacto
- Item Informacao
- Criar Modal
- Projectos Inovadores
- Seo
- Formulario Docente
- Grupo Cartoes Selecao (2)
- Example Modal Generico
- Tira Horizontal
- Angular (4)
- Angular (5)
- Entrar
- Campo Texto
- Wrapper Auth Background
- Passos Formulario
- Bg Candidatura Curso
- Unagro Logo
- Traducao Automatica
- Readme (3)
- Modal Inscricao Evento
- Readme (4)
- Environment
- Index
- Bg Banner Estudante Sessao 1
- Campos Hero Candidatura
- Google
- Agricultura De Precisao
- Avatar Coordenadora Solo
- Avatar Directora Biotecnologia
- Avatar Especialista Engenharia
- Avatar Investigador Mercado
- Baldes No Campo
- Bg Banner Alumni
- Bg Banner Desenvolvimento
- Bg Banner Estudantes
- Bg Banner Eventos
- Bg Banner Inscricao
- Bg Candidatura Docente
- Bg Candidatura Sessao 2
- Campo De Milho 1
- Campo De Milho 2
- Campo De Milho 3
- Campos A Germinar
- Campos De Bananeiras
- Campus Hero
- Conferencia Agronomia
- Cultivo Milho
- Desenvolvimento Card 1
- Desenvolvimento Card 2
- Desenvolvimento Card 3
- Desenvolvimento Projecto 1
- Desenvolvimento Projecto 2
- Desenvolvimento Projecto 3
- Dr Abel Van  Dunem
- Dr Menddes Adao
- Dr Samuel Costa
- Dra Helena Martins
- Drono No Campo
- Eng Ricardo Vieira
- Estrageia Do Campo
- Estudante
- Estudante Noticia Pesquisa
- Estufa Campos
- Feito Em Angola 2022 1
- Forum Melhoramento Genetico
- Francisco Calenga
- Home Grafico
- Homem Do Campo
- Image Curso 1
- Image Curso 2
- Image Curso 3
- Impacto Numerico
- Jovem Agronimos
- Livro Login
- Mindcom 133E51Cc52
- Minplan 
- Minsa
- Mulher Cientista
- Mulher Dra
- Mulher No Campo
- Professor Doutor Augusto
- Recursos Idricos
- Staff Projecto Dr Joao
- Staff Projecto Dr Luis
- Staff Projecto Dr Paulo

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 218 edges
2. `TraducaoService` - 112 edges
3. `IconeComponent` - 104 edges
4. `TextoTraduzido` - 66 edges
5. `BotaoComponent` - 52 edges
6. `@angular/router` - 44 edges
7. `AlertModalService` - 44 edges
8. `@angular/forms` - 43 edges
9. `ContainerPaginaComponent` - 40 edges
10. `@tanstack/angular-query-experimental` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Banner Candidatura (greenhouse researchers photo)` --semantically_similar_to--> `Banner Candidatura (public asset, greenhouse researchers)`  [INFERRED] [semantically similar]
  imagen/banner-candidatura.jpg → public/imagens/banner-candidatura.jpg
- `cabecalho.component.html template` --shares_data_with--> `TraducaoService`  [INFERRED]
  src/app/layout/cabecalho/cabecalho.component.html → src/app/core/traducao/traducao.service.ts
- `rodape.component.html template` --shares_data_with--> `TraducaoService`  [INFERRED]
  src/app/layout/rodape/rodape.component.html → src/app/core/traducao/traducao.service.ts
- `candidatura-docentes.component.html template` --shares_data_with--> `TraducaoService`  [INFERRED]
  src/app/pages/candidatura-docentes/candidatura-docentes.component.html → src/app/core/traducao/traducao.service.ts
- `candidaturas.component.html template` --shares_data_with--> `TraducaoService`  [INFERRED]
  src/app/pages/candidaturas/candidaturas.component.html → src/app/core/traducao/traducao.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Fluxo da arquitectura de dados em três camadas** — _claude_readme_apiservice, _claude_readme_servico_recurso, _claude_readme_queryoptions_factories, _claude_readme_injectquery, _claude_readme_erroapi [EXTRACTED 1.00]
- **Infra-estrutura de modais (AlertModalService, moldura, dados)** — _claude_agents_criar_modal_alertmodalservice, _claude_agents_criar_modal_modal_generico, _claude_agents_criar_modal_modaldataservice, _claude_agents_criar_modal_criarerrosformulario [EXTRACTED 1.00]
- **Agentes de implementação do site UNAGRO** — _claude_agents_criar_banner_agente, _claude_agents_criar_modal_agente, _claude_agents_criar_sessao_agente, _claude_agents_integrar_recurso_agente [INFERRED 0.85]
- **Multi-step forms using app-passos-formulario** — src_app_pages_candidatura_docentes_formulario_formulario_docente_component_template, src_app_pages_inscricao_formulario_formulario_inscricao_component_template, src_app_pages_candidatura_geral_formulario_formulario_candidatura_component_template, src_app_shared_componentes_passos_formulario_passos_formulario_component_passosformulariocomponent [EXTRACTED 1.00]
- **Candidatura geral wizard etapas 1-4** — src_app_pages_candidatura_geral_formulario_formulario_candidatura_component_template, src_app_pages_candidatura_geral_formulario_etapa_1_etapa_1_component_template, src_app_pages_candidatura_geral_formulario_etapa_2_etapa_2_component_template, src_app_pages_candidatura_geral_formulario_etapa_3_etapa_3_component_template, src_app_pages_candidatura_geral_formulario_etapa_4_etapa_4_component_template [INFERRED 0.95]
- **Pages using skeleton loading placeholders** — src_app_pages_alumni_alumni_component_template, src_app_pages_candidaturas_candidaturas_component_template, src_app_pages_desenvolvimento_desenvolvimento_component_template, src_app_pages_detalhe_noticia_detalhe_noticia_component_template, src_app_pages_estudantes_estudantes_component_template, src_app_pages_eventos_eventos_component_template, src_app_pages_formacoes_formacoes_component_template, src_app_pages_hub_unagro_hub_unagro_component_template, src_app_pages_inicio_inicio_component_template [EXTRACTED 1.00]
- **AlertModal template data + events flow** — src_app_shared_componentes_alert_modal_template_usage_alertmodalservice, src_app_shared_componentes_alert_modal_template_usage_modaldataservice, src_app_shared_componentes_alert_modal_template_usage_modaleventsservice, src_app_shared_componentes_alert_modal_template_usage_alertoptions [EXTRACTED 1.00]
- **Reactive form field components (ControlValueAccessor + criarErrosFormulario)** — src_app_shared_componentes_input_field_readme_formfieldinputcomponentv2, src_app_shared_componentes_select_field_v2_readme_formfieldselectcomponent, src_app_shared_componentes_caixa_confirmacao_readme_caixaconfirmacaocomponent, src_app_shared_componentes_campo_documento_readme_campodocumentocomponent, src_app_shared_componentes_input_field_readme_controlvalueaccessor, src_app_shared_componentes_input_field_readme_criarerrosformulario [INFERRED 0.85]
- **Modal genérico family (generic, confirmation, alert)** — src_app_shared_componentes_modal_generico_readme_modalgenericocomponent, src_app_shared_componentes_modal_generico_readme_modalconfirmacaocomponent, src_app_shared_componentes_modal_generico_readme_modalalertacomponent [EXTRACTED 1.00]
- **Teacher Application Multi-Step Flow (Landing -> Etapa 1-4 -> Submitted)** — imagen_mockups_candidatura_tela_inicio_image, imagen_mockups_candidatura_docente_etapa_1_image, imagen_mockups_candidatura_docente_etapa_2_image, imagen_mockups_candidatura_docente_etapa_3_image, imagen_mockups_candidatura_docente_etapa_4_image, imagen_mockups_candidatura_docente_finalizada_image [EXTRACTED 1.00]
- **Form Sections Aggregated in Review Step** — imagen_mockups_candidatura_docente_etapa_1_dados_pessoais, imagen_mockups_candidatura_docente_etapa_2_formacao_academica, imagen_mockups_candidatura_docente_etapa_3_dossier_upload, imagen_mockups_candidatura_docente_etapa_4_revisao_resumo [INFERRED 0.85]
- **Development Cards 1-3** — public_imagens_desenvolvimento_card_1_image, public_imagens_desenvolvimento_card_2_image, public_imagens_desenvolvimento_card_3_image [INFERRED 0.85]
- **Development Projects 1-3** — public_imagens_desenvolvimento_projecto_1_image, public_imagens_desenvolvimento_projecto_2_image, public_imagens_desenvolvimento_projecto_3_image [INFERRED 0.85]
- **Corn Field Images 1-3** — public_imagens_campo_de_milho_1_image, public_imagens_campo_de_milho_2_image, public_imagens_campo_de_milho_3_image [INFERRED 0.75]
- **Governo de Angola ministry partner logos** — public_imagens_mindcom_133e51cc52_image, public_imagens_minplan__image, public_imagens_minsa_image [INFERRED 0.85]
- **Project staff portraits** — public_imagens_staff_projecto_dr_paulo_image, public_imagens_staff_projecto_dr_joao_image, public_imagens_staff_projecto_dr_luis_image, public_imagens_staff_projecto_dr_maria_image [INFERRED 0.95]
- **Course card images** — public_imagens_image_curso_1_image, public_imagens_image_curso_2_image, public_imagens_image_curso_3_image [INFERRED 0.95]

## Communities (193 total, 94 thin omitted)

### Community 0 - "Angular Core & SEO"
Cohesion: 0.08
Nodes (18): @angular/core, @angular/platform-browser, @angular/router, EstadoProximaData, PaginaTeste, TraducaoService, LigacaoRodapeCandidatura, RodapeCandidaturaComponent (+10 more)

### Community 1 - "Candidaturas Page"
Cohesion: 0.06
Nodes (25): CandidaturasService, BENEFICIOS_RECRUTAMENTO_BRUTOS, CAMPOS_TRADUZIVEIS_CURSO_OFERTA, CandidaturasComponent, REQUISITOS_BRUTOS, candidaturas.component.html template, ContactosComponent, CartaoBolsaComponent (+17 more)

### Community 2 - "Application Form Sections"
Cohesion: 0.12
Nodes (18): @angular/forms, ErroFnOuTexto, TemaCampoUpload, CLASSES_ROTULO, CLASSES_TEXTO, ErroFnOuTexto, FormFieldInputComponentV2, LeftIconDirective (+10 more)

### Community 3 - "Desenvolvimento Page Data"
Cohesion: 0.05
Nodes (28): CAMPOS_TRADUZIVEIS_INVESTIGADOR, CAMPOS_TRADUZIVEIS_PROJETO, CAMPOS_TRADUZIVEIS_PUBLICACAO, CAMPOS_TRADUZIVEIS_UNIDADE, COLUNAS_LINHA, EixoBruto, EIXOS_BRUTOS, ESQUELETOS_INVESTIGADORES (+20 more)

### Community 4 - "Startups Service"
Cohesion: 0.06
Nodes (24): startupsQueries, Startup, ProjectosInovadoresService, paraStartup(), StartupApi, StartupsService, CAMPOS_TRADUZIVEIS_STARTUP, EstadoSubscricao (+16 more)

### Community 5 - "Docentes & Inscrição Pages"
Cohesion: 0.08
Nodes (23): EstatisticasService, cabecalho.component.html template, CandidaturaDocentesComponent, candidatura-docentes.component.html template, InscricaoComponent, inscricao.component.html template, BarraTopoComponent, CartaoApoioComponent (+15 more)

### Community 6 - "Alumni Page"
Cohesion: 0.08
Nodes (23): AlumniComponent, CAMPOS_TRADUZIVEIS_ALUMNI, MODOS_CONTRIBUICAO_BRUTOS, PilarAlumniBruto, PILARES_ALUMNI_BRUTOS, alumni.component.html template, contactos.component.html template, desenvolvimento.component.html template (+15 more)

### Community 7 - "Candidatura Geral Mocks"
Cohesion: 0.09
Nodes (25): AREAS_CANDIDATURA_GERAL_MOCK, CRITERIOS_CANDIDATURA_GERAL_MOCK, DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK, DOCUMENTOS_CANDIDATURA_GERAL_MOCK, GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK, INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK, PARCEIROS_CANDIDATURA_GERAL_MOCK, PASSOS_CANDIDATURA_GERAL_MOCK (+17 more)

### Community 8 - "Candidatura Geral State"
Cohesion: 0.08
Nodes (15): rxjs, CANDIDATURA_GERAL_ROUTES, CAMPOS_FICHEIRO, CandidaturaGeralEstadoService, LIMITES_DOSSIER_MB, MAXIMO_SINTESE, NumeroEtapa, semFicheiros() (+7 more)

### Community 9 - "API Client Core"
Cohesion: 0.09
Nodes (20): OpcoesPedido, ParametrosPedido, capaUtilizavel(), promessaCancelavel(), RespostaApi, Investigador, InvestigadorApi, InvestigadoresService (+12 more)

### Community 10 - "Formações Page"
Cohesion: 0.07
Nodes (19): CAMPOS_TRADUZIVEIS_TREINAMENTO, EstadoValidacao, FormacoesComponent, PilarBruto, PILARES_CERTIFICACAO, VantagemBruta, VANTAGENS_BRUTAS, CartaoCursoCurtaDuracaoComponent (+11 more)

### Community 11 - "Inscrições Service"
Cohesion: 0.11
Nodes (13): NovaInscricaoCurso, NovaInscricaoEvento, InscricaoEventoRequest, InscricaoRequest, InscricoesService, paraPedido(), paraPedidoEvento(), ModalEntry (+5 more)

### Community 12 - "Candidatura Início & Curso Detail"
Cohesion: 0.09
Nodes (18): CandidaturaGeralInicioComponent, ROTA_ETAPA_1, candidatura-geral-inicio.component.html template, CAMPOS_TRADUZIVEIS_CURSO, FAQ_CURSO_BRUTO, ItemMetodologia, METODOLOGIA_BRUTA, MetricaCurso (+10 more)

### Community 13 - "Candidatura Tela Inicio"
Cohesion: 0.08
Nodes (29): Banner Candidatura (greenhouse researchers photo), Candidatura Docentes Image 1 (researchers in greenhouse, variant), Form Navigation Actions (Guardar Rascunho, Cancelar/Voltar, Avancar), Seccao Area de Candidatura & Vagas (area select, interdisciplinary field), Area Selecionada Summary Card (with Alterar link, vagas), Seccao Dados Pessoais & Contacto (nome, nascimento, BI/passaporte, telefone +244, email), Mockup: Candidatura Docente Etapa 1 (Dados & Area), 4-Step Progress Stepper (Dados & Area, Formacao & Experiencia, Dossier & Declaracao, Revisao & Submissao) (+21 more)

### Community 14 - "Home Page"
Cohesion: 0.09
Nodes (14): eventosQueries, formatarIntervaloDatas(), CAMPOS_TRADUZIVEIS_EVENTO, CAMPOS_TRADUZIVEIS_NOTICIA, InicioComponent, PilarBruto, PILARES_MODELO, HeroImage (+6 more)

### Community 15 - "Projeto Detail Page"
Cohesion: 0.09
Nodes (13): projetosQueries, MembroEquipa, TestemunhoProjeto, PatrocinadoresService, CAMPOS_TRADUZIVEIS_DOCUMENTO, CAMPOS_TRADUZIVEIS_PROJETO, CAMPOS_TRADUZIVEIS_TESTEMUNHO, DetalheProjetoComponent (+5 more)

### Community 16 - "Admissions Mocks"
Cohesion: 0.13
Nodes (13): BOLSAS_MOCK, CALENDARIO_ACADEMICO_MOCK, CANAIS_CONTACTO_ADMISSOES_MOCK, PASSOS_CANDIDATURA_MOCK, DOCUMENTOS_CANDIDATURA_MOCK, REQUISITOS_GERAIS_INSCRICAO_MOCK, REQUISITOS_POR_NIVEL_MOCK, Bolsa (+5 more)

### Community 17 - "Date Utils & Cards"
Cohesion: 0.12
Nodes (13): formatarDataCurta(), formatarTempoRelativo(), LOCAIS, CartaoInvestigadorComponent, CartaoNoticiaComponent, ModoCartaoNoticia, NoticiaExibidaCard, ModoCartaoNoticiaResumo (+5 more)

### Community 18 - "Translation Pipeline"
Cohesion: 0.11
Nodes (15): traducaoQueries, NoticiaBruta, NOTICIAS_FALLBACK, aplicarTraducao(), aplicarTraducaoTextos(), camposParaTraduzir(), CAMPOS_TRADUZIVEIS_NOTICIA, DetalheNoticiaComponent (+7 more)

### Community 19 - "Estudantes Page"
Cohesion: 0.11
Nodes (13): TipoAvisoIntranet, detalhe-noticia.component.html template, CAMPOS_TRADUZIVEIS_NOTICIA, EstudantesComponent, ICONES_AVISO, estudantes.component.html template, TIPOS_NOTICIA_ESTUDANTIL, inicio.component.html template (+5 more)

### Community 20 - "Contactos Service"
Cohesion: 0.11
Nodes (16): NovoContacto, ContatoRequest, ContatosService, paraPedido(), ROTULOS_ASSUNTO_PT, DetalheLocalizacaoBruto, DETALHES_LOCALIZACAO_BRUTOS, InformacaoBruta (+8 more)

### Community 21 - "Sobre Sections"
Cohesion: 0.11
Nodes (13): SobreAbaUnagroComponent, SobreFaculdadesDepartamentosComponent, SobreGovernancaComponent, SobreNossaHistoriaComponent, SobreOrgaosGestaoComponent, SobrePilaresInstitucionaisComponent, ABAS_SOBRE, IdAbaSobre (+5 more)

### Community 22 - "Query Layer & API Errors"
Cohesion: 0.13
Nodes (10): @tanstack/angular-query-experimental, ErroApi, investigadoresQueries, laboratoriosQueries, publicacoesQueries, Publicacao, paraPublicacao(), PublicacaoApi (+2 more)

### Community 23 - "Eventos Service"
Cohesion: 0.15
Nodes (12): AmbitoEvento, AMBITOS_EVENTO, Evento, ROTULOS_AMBITO_EVENTO, AMBITOS_API, EventoApi, EventosService, paraEvento() (+4 more)

### Community 24 - "Visit Scheduling"
Cohesion: 0.14
Nodes (11): NovoAgendamentoVisita, UnidadeInvestigacao, AgendamentoVisitaRequest, AgendamentoVisitasService, paraPedido(), CamposAgendarVisitaComponent, UnidadeVisita, DadosAgendarVisita (+3 more)

### Community 25 - "Shared Component Docs"
Cohesion: 0.11
Nodes (22): Caixa de Confirmação README, CaixaConfirmacaoComponent (app-caixa-confirmacao), Campo Documento README, CampoDocumentoComponent (app-campo-documento), formatarTamanho(bytes), secao-dossier.component (candidatura-geral etapa-3), Dropdown Menu README, DropdownMenuComponent (app-dropdown-menu) (+14 more)

### Community 26 - "Projetos API Mappers"
Cohesion: 0.19
Nodes (21): CategoriaApi, CronogramaApi, EquipaProjectoApi, paraContacto(), paraCronogramaApi(), paraDocumento(), paraDocumentosApi(), paraEquipaApi() (+13 more)

### Community 27 - "Share Button & Dropdown"
Cohesion: 0.12
Nodes (12): CLASSES_GATILHO, RedeCompartilhar, REDES, VarianteBotaoCompartilhar, CLASSES_ICONE, CLASSES_ITEM, CLASSES_PAINEL, DropdownMenuIconName (+4 more)

### Community 28 - "Package Manifest"
Cohesion: 0.10
Nodes (20): name, packageManager, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+12 more)

### Community 29 - "Projetos Mock Data"
Cohesion: 0.16
Nodes (16): ContactoProjetoBruto, DocumentoProjetoBruto, EstatisticaProjetoBruta, EtapaCronogramaBruta, ItemGaleriaBruto, MembroEquipaBruto, ObjetivoProjetoBruto, ProjetoBruto (+8 more)

### Community 31 - "Resource Integration Notes"
Cohesion: 0.14
Nodes (18): app-espaco-imagem (marcador cinzento), app-cartao-evento-foto, app-cartao-investigador, app-cartao-proxima-data, app-cartao-startup, app-selo, capaUtilizavel (core/api/capa-utilizavel.ts), Integração cursos (+10 more)

### Community 32 - "Agent Workflow Patterns"
Cohesion: 0.14
Nodes (16): Agente criar-modal, criarErrosFormulario, field-select-v2, form-input-field, Agente criar-sessao, app-cabecalho-secao, app-cartao-curso-curta-duracao, app-cartao-recurso (+8 more)

### Community 33 - "Header Menu"
Cohesion: 0.16
Nodes (9): CabecalhoComponent, ItemSubmenu, CHAVE_SUBMENU_CURSOS, MENU_PRINCIPAL, ModalMenu, SOBRE_COM_SUBMENU_MODAIS, SUBMENU_SOBRE_MODAIS, ID_MODAL_NOSSA_HISTORIA (+1 more)

### Community 35 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-server, @angular/router (+9 more)

### Community 36 - "Cursos Service"
Cohesion: 0.20
Nodes (11): cursosQueries, AnoCurricular, Curso, ObjetivoCurso, CursoApi, CursosService, FaculdadeCursoApi, paraAnoCurricular() (+3 more)

### Community 37 - "App Config & Session"
Cohesion: 0.21
Nodes (6): @angular/common, appConfig, CLIENTE_CONSULTAS, tokenInterceptor(), Sessao, SessaoService

### Community 38 - "Docência Mocks"
Cohesion: 0.23
Nodes (11): REQUISITOS_DOCENCIA_MOCK, TITULACOES_DOCENCIA_MOCK, VANTAGENS_DOCENCIA_MOCK, FASES_CANDIDATURA_MOCK, RequisitoDocencia, TitulacaoDocencia, VantagemDocencia, EstadoFase (+3 more)

### Community 39 - "Form Step Templates"
Cohesion: 0.14
Nodes (9): formulario-docente.component.html template, PassoAcademicoComponent, PassoDadosPessoaisComponent, formulario-candidatura.component.html template, BlocoFormacaoAcademicaComponent, BlocoMotivacaoDocumentosComponent, FormularioInscricaoComponent, formulario-inscricao.component.html template (+1 more)

### Community 40 - "Projetos Service"
Cohesion: 0.21
Nodes (8): Projeto, paraMapaDeInvestigadores(), paraMapaDePublicacoes(), paraMapaDeTestemunhos(), ProjetosService, Idioma, IDIOMA_PADRAO, IDIOMAS_DISPONIVEIS

### Community 41 - "Candidatura Docentes Service"
Cohesion: 0.19
Nodes (7): NovaCandidaturaDocente, CandidaturaDocentesService, paraPedido(), DocenciaService, CAMPOS_POR_PASSO, EXTENSOES_CV, PassoSubmissaoComponent

### Community 42 - "Projeto Model & Timeline"
Cohesion: 0.14
Nodes (12): CATEGORIAS_PROJECTO, ContactoProjeto, DocumentoProjeto, EstatisticaProjeto, EtapaCronograma, ObjetivoProjeto, ROTULOS_CATEGORIA_PROJECTO, SolucaoProjeto (+4 more)

### Community 43 - "Review Step (Etapa 4)"
Cohesion: 0.16
Nodes (7): BlocoRevisaoComponent, CampoRevisao, DocumentoRevisao, Etapa4Component, etapa-4.component.html template, ROTA_CANDIDATURA_GERAL, formatarTamanho()

### Community 44 - "Eventos Page & Cards"
Cohesion: 0.14
Nodes (6): EventosComponent, CartaoEventoFotoComponent, EventoFotoCartao, FormatoCartaoEventoFoto, CartaoEventoFotoEsqueletoComponent, DadosInscricaoEvento

### Community 45 - "Banner & Button"
Cohesion: 0.18
Nodes (13): ATRASOS_S, BlocoAnimado, CtaBannerDestaque, CURVA_FUNDO, MOLA, CLASSES_PADDING, CLASSES_RAIO, CLASSES_TEXTO (+5 more)

### Community 47 - "Faculdades Service"
Cohesion: 0.23
Nodes (9): faculdadesQueries, CursoFaculdade, Faculdade, CursoApi, FaculdadeApi, FaculdadesService, paraFaculdade(), semCursosDuplicados() (+1 more)

### Community 48 - "Statistics Mocks"
Cohesion: 0.23
Nodes (7): ESTATISTICA_MEMBROS_ALUMNI_MOCK, ESTATISTICAS_IMPACTO_ALUMNI_MOCK, ESTATISTICAS_INSTITUCIONAIS_MOCK, PILARES_FACULDADE_MOCK, Estatistica, PilarFaculdade, AlumniEstatisticasService

### Community 49 - "Sponsors & Deep Localize"
Cohesion: 0.20
Nodes (8): PATROCINADORES_MOCK, Patrocinador, ehTextoTraduzido(), Localizado, localizarProfundo(), SobreLegadoComponent, ValorBruto, VALORES_BRUTOS

### Community 52 - "Footer & i18n Dictionary"
Cohesion: 0.21
Nodes (11): CaminhoDicionario, ItemMenu, ItemMenuFilho, ColunaRodape, COLUNAS_RODAPE, ContactoRodape, CONTACTOS_RODAPE, ItemRodape (+3 more)

### Community 54 - "Readme"
Cohesion: 0.21
Nodes (7): Agente integrar-recurso, Contrato OpenAPI (/docs/api.json), injectQuery no componente, Regras do projecto (.claude/README.md), TanStack Query (@tanstack/angular-query-experimental), Endpoints da API ainda não consumidos, WebSiteUnagro (Angular CLI 21.2.6, Vitest)

### Community 55 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, postcss, prettier, tailwindcss (+5 more)

### Community 56 - "Candidatura Alunos Service"
Cohesion: 0.23
Nodes (6): NovaCandidaturaAluno, CandidaturaAlunosService, paraPedido(), BlocoDadosPessoaisComponent, CAMPOS_PASSO_UM, EXTENSOES_CERTIFICADO

### Community 57 - "Login Page"
Cohesion: 0.22
Nodes (5): CAMPOS_DA_API, entrar.component.html template, BotaoSocialComponent, PainelMarcaAutenticacaoComponent, SeparadorTextoComponent

### Community 58 - "Org Structure Modal"
Cohesion: 0.21
Nodes (6): SobreEstruturaOrganizacionalComponent, ESTRUTURA, EstruturaOrganizacional, ID_MODAL_ESTRUTURA_ORGANIZACIONAL, ModalEstruturaOrganizacionalComponent, NoOrganograma

### Community 59 - "Readme (2)"
Cohesion: 0.20
Nodes (11): Integração candidaturas (docentes), API da Unagro (Laravel), ApiService (core/api/api.service.ts), ErroApi (estado, naoEncontrado, errosValidacao), injectMutation para escrita (POST), Fábricas queryOptions (core/consultas/*.queries.ts), Serviço de recurso (core/servicos/<recurso>.service.ts), Tradução automática do conteúdo da API (MyMemory) (+3 more)

### Community 61 - "Modal Types & Icons"
Cohesion: 0.23
Nodes (8): @ng-icons/core, @ng-icons/iconsax, IconConfig, AlertButton, AlertIcon, ModalReference, slot='footer' content projection, AlertModelTamanho

### Community 62 - "Routes & Layouts"
Cohesion: 0.18
Nodes (6): routes, LayoutAutenticacaoComponent, LayoutCandidaturaComponent, LayoutPrincipalComponent, RodapeComponent, rodape.component.html template

### Community 63 - "Treinamentos Service"
Cohesion: 0.29
Nodes (7): treinamentosQueries, Treinamento, paraCargaHoraria(), paraPreco(), paraTreinamento(), TreinamentoApi, TreinamentosService

### Community 64 - "Authentication Service"
Cohesion: 0.24
Nodes (7): Credenciais, Utilizador, AutenticacaoService, paraSessao(), paraUtilizador(), RespostaLoginApi, UtilizadorApi

### Community 65 - "Etapa 1 Step"
Cohesion: 0.21
Nodes (5): CandidaturaGeralService, Etapa1Component, etapa-1.component.html template, SecaoAreaCandidaturaComponent, SecaoDadosPessoaisComponent

### Community 66 - "Alert Modal Docs"
Cohesion: 0.23
Nodes (11): Exemplo Prático: Modal com Eventos, Evento 'finalisou', ModalPagamentoExpressCounterComponent (exemplo), Alert Modal com Templates Dinâmicos, AgendarSolicitacaoFormComponent (exemplo), AlertModalService, AlertOptions interface, ModalDataService (+3 more)

### Community 67 - "Section Header"
Cohesion: 0.17
Nodes (11): AlinhamentoCabecalhoSecao, CLASSES_ALINHAMENTO, CLASSES_COR_ACAO, CLASSES_DESCRICAO, CLASSES_TAMANHO_DESCRICAO, CLASSES_TITULO, CLASSES_TRACOS, CorAcaoCabecalhoSecao (+3 more)

### Community 69 - "Generic Modals"
Cohesion: 0.18
Nodes (3): ModalAlertaComponent, ModalConfirmacaoComponent, ModalGenericoComponent

### Community 71 - "Claude"
Cohesion: 0.20
Nodes (11): graphify skill trigger (/graphify), graphify reference: add URL and watch folder, graphify reference: extra exports and benchmark, graphify reference: extraction subagent prompt, graphify reference: GitHub clone and cross-repo merge, graphify reference: commit hook and CLAUDE.md integration, graphify reference: query, path, explain, graphify reference: transcribe video and audio (+3 more)

### Community 72 - "Angular Build Options"
Cohesion: 0.18
Nodes (11): options, assets, browser, outputMode, security, server, ssr, styles (+3 more)

### Community 73 - "Alumni Service"
Cohesion: 0.33
Nodes (5): alumniQueries, Alumni, AlumniApi, AlumniService, paraAlumni()

### Community 74 - "Notícias Service"
Cohesion: 0.33
Nodes (5): noticiasQueries, Noticia, NoticiaApi, NoticiasService, paraNoticia()

### Community 75 - "Audit & Technical Reports"
Cohesion: 0.31
Nodes (10): app-cartao-publicacao, BackOffice para gestão de informações (inexistente), UNAGRO - Pontos de Reajustes, Auditoria do projeto unagro-frontend, autenticadoGuard (desfeito em /estudantes), Projetos — o que falta (galeriaProjectos, financiamento, ativo/destaque), token.interceptor.ts (Authorization Bearer), app-botao com suporte a URL externo e download (+2 more)

### Community 76 - "Mosaic Gallery"
Cohesion: 0.24
Nodes (3): ItemGaleria, CLASSES_CELULA_MOSAICO, GaleriaMosaicoComponent

### Community 77 - "Countdown & Event Highlight"
Cohesion: 0.27
Nodes (4): EventoDestaqueCartao, ContadorRegressivoComponent, RotulosContadorRegressivo, VarianteContador

### Community 78 - "Build Configurations"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 79 - "SSR Server Config"
Cohesion: 0.31
Nodes (5): @angular/ssr, config, serverConfig, ROTAS_ESTATICAS, serverRoutes

### Community 82 - "Cartao Vidro"
Cohesion: 0.25
Nodes (6): HistoriaAlumniCartao, CartaoVidroComponent, CLASSES_CAIXA, CLASSES_TEXTO, CLASSES_TITULO, TamanhoCartaoVidro

### Community 85 - "Angular"
Cohesion: 0.25
Nodes (8): style, type, type, type, @schematics/angular:component, @schematics/angular:directive, @schematics/angular:service, schematics

### Community 87 - "Proximas Datas"
Cohesion: 0.32
Nodes (3): PROXIMAS_DATAS_MOCK, ProximaData, ProximasDatasService

### Community 88 - "Etapa 2"
Cohesion: 0.32
Nodes (4): Etapa2Component, etapa-2.component.html template, SecaoExperienciaComponent, SecaoFormacaoAcademicaComponent

### Community 89 - "Modal Orgaos Gestao"
Cohesion: 0.32
Nodes (4): ID_MODAL_ORGAOS_GESTAO, MembroGestao, MEMBROS_GESTAO, ModalOrgaosGestaoComponent

### Community 90 - "Modal Pilares Institucionais"
Cohesion: 0.32
Nodes (4): ID_MODAL_PILARES, ModalPilaresInstitucionaisComponent, PILARES, PilarInstitucional

### Community 92 - "Item Estatistica"
Cohesion: 0.25
Nodes (7): CLASSES_RAIZ, CLASSES_ROTULO, CLASSES_TAMANHO_ROTULO, CLASSES_TAMANHO_VALOR, CLASSES_VALOR, FormatoItemEstatistica, TemaItemEstatistica

### Community 94 - "Criar Banner"
Cohesion: 0.29
Nodes (7): Agente criar-banner, app-banner-destaque, app-container-banner-faixa-estatistica, EstatisticasService.institucionais, app-cartao-vidro, app-item-estatistica, Indicadores dinâmicos vindos da API (pendente)

### Community 95 - "Angular (2)"
Cohesion: 0.29
Nodes (6): cli, packageManager, newProjectRoot, projects, $schema, version

### Community 96 - "Angular (3)"
Cohesion: 0.29
Nodes (7): serve, test, builder, configurations, defaultConfiguration, builder, architect

### Community 97 - "Package"
Cohesion: 0.29
Nodes (7): scripts, build, ng, serve:ssr:web-site-unagro, start, test, watch

### Community 98 - "Server"
Cohesion: 0.29
Nodes (5): express, angularApp, app, browserDistFolder, reqHandler

### Community 99 - "App"
Cohesion: 0.38
Nodes (3): App, router-outlet (root route host), app.html template

### Community 100 - "Avisos Intranet"
Cohesion: 0.38
Nodes (3): AVISOS_INTRANET_MOCK, AvisoIntranet, IntranetService

### Community 101 - "Perguntas Frequentes"
Cohesion: 0.38
Nodes (3): PERGUNTAS_FREQUENTES_MOCK, PerguntaFrequente, PerguntasFrequentesService

### Community 102 - "Dicionario"
Cohesion: 0.38
Nodes (4): Dicionario, UniaoChaves, en, pt

### Community 107 - "Item Contacto"
Cohesion: 0.29
Nodes (6): CLASSES_DETALHE, CLASSES_EMBLEMA, CLASSES_ROTULO, CLASSES_VALOR, FormatoItemContacto, TemaItemContacto

### Community 108 - "Item Informacao"
Cohesion: 0.29
Nodes (6): CLASSES_DESCRICAO, CLASSES_EMBLEMA, CLASSES_FILA, CLASSES_TITULO, FormatoItemInformacao, TAMANHO_ICONE

### Community 109 - "Criar Modal"
Cohesion: 0.33
Nodes (6): AlertModalService, app-modal-generico (moldura), ModalDataService, app-grupo-cartoes-selecao, app-modal-agendar-visita, Selecionar laboratório no agendamento de visita (resolvido)

### Community 110 - "Projectos Inovadores"
Cohesion: 0.47
Nodes (3): PROJECTOS_INOVADORES_MOCK, ProjectoInovador, ANCORA_FORMULARIO_INTERESSE

### Community 113 - "Grupo Cartoes Selecao (2)"
Cohesion: 0.33
Nodes (5): CLASSES_BOTAO, CLASSES_COLUNAS, CLASSES_LEGENDA, OpcaoCartaoSelecao, VarianteGrupoCartoes

### Community 116 - "Angular (4)"
Cohesion: 0.40
Nodes (5): development, buildTarget, extractLicenses, optimization, sourceMap

### Community 117 - "Angular (5)"
Cohesion: 0.40
Nodes (5): web-site-unagro, prefix, projectType, root, sourceRoot

### Community 121 - "Passos Formulario"
Cohesion: 0.40
Nodes (4): CLASSES_FORMA, CLASSES_LINHA, DisposicaoPassos, FormaDistintivoPassos

### Community 122 - "Bg Candidatura Curso"
Cohesion: 0.50
Nodes (4): Course Application BG (researchers in greenhouse), Faculty Application Photo (researchers in greenhouse), Courses Hero Mockup (Engenharia Agronomica), Students in Agricultural Lab (greenhouse)

### Community 123 - "Unagro Logo"
Cohesion: 0.50
Nodes (4): Staff projecto Dra. Maria - portrait in UNAGRO polo in field, UNAGRO favicon - university crest, UNAGRO logo (png) - crest with UNAGRO wordmark, UNAGRO logo (jpg) - crest Universidade de Agronegocio de Kiberi, 'Ciencia, Inovacao, Sustentabilidade'

### Community 125 - "Readme (3)"
Cohesion: 0.83
Nodes (4): Modal Genérico Reutilizável README, ModalAlertaComponent, ModalConfirmacaoComponent, ModalGenericoComponent (app-modal-generico)

### Community 130 - "Index"
Cohesion: 0.67
Nodes (3): index.html (WebSiteUnagro shell), app-root, Google Fonts (Quicksand, Raleway, Inter)

## Ambiguous Edges - Review These
- `barra-topo.component.ts` → `DropdownMenuComponent (app-dropdown-menu)`  [AMBIGUOUS]
  src/app/shared/componentes/barra-topo/barra-topo.component.html · relation: conceptually_related_to
- `Modelos vindos da API só com texto simples` → `Dados prontos para a API (modelo, mock, serviço, página)`  [AMBIGUOUS]
  .claude/agents/criar-sessao.md · relation: conceptually_related_to
- `Arquitectura de dados em três camadas` → `Dados prontos para a API (modelo, mock, serviço, página)`  [AMBIGUOUS]
  .claude/agents/criar-sessao.md · relation: conceptually_related_to

## Knowledge Gaps
- **459 isolated node(s):** `$schema`, `version`, `packageManager`, `newProjectRoot`, `projectType` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 861 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **94 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `barra-topo.component.ts` and `DropdownMenuComponent (app-dropdown-menu)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Modelos vindos da API só com texto simples` and `Dados prontos para a API (modelo, mock, serviço, página)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Arquitectura de dados em três camadas` and `Dados prontos para a API (modelo, mock, serviço, página)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `@angular/core` connect `Angular Core & SEO` to `Candidaturas Page`, `Application Form Sections`, `Desenvolvimento Page Data`, `Startups Service`, `Docentes & Inscrição Pages`, `Alumni Page`, `Candidatura Geral Mocks`, `Candidatura Geral State`, `API Client Core`, `Formações Page`, `Inscrições Service`, `Candidatura Início & Curso Detail`, `Home Page`, `Projeto Detail Page`, `Admissions Mocks`, `Date Utils & Cards`, `Translation Pipeline`, `Estudantes Page`, `Contactos Service`, `Sobre Sections`, `Query Layer & API Errors`, `Eventos Service`, `Visit Scheduling`, `Projetos API Mappers`, `Share Button & Dropdown`, `Package Manifest`, `Header Menu`, `Cursos Service`, `App Config & Session`, `Docência Mocks`, `Candidatura Docentes Service`, `Projeto Model & Timeline`, `Review Step (Etapa 4)`, `Eventos Page & Cards`, `Banner & Button`, `Faculdades Service`, `Statistics Mocks`, `Sponsors & Deep Localize`, `Footer & i18n Dictionary`, `Candidatura Alunos Service`, `Login Page`, `Org Structure Modal`, `Modal Types & Icons`, `Routes & Layouts`, `Treinamentos Service`, `Authentication Service`, `Etapa 1 Step`, `Section Header`, `Generic Modals`, `Alumni Service`, `Notícias Service`, `Mosaic Gallery`, `Countdown & Event Highlight`, `SSR Server Config`, `Cartao Vidro`, `Proximas Datas`, `Etapa 2`, `Modal Orgaos Gestao`, `Modal Pilares Institucionais`, `Modal Events`, `Item Estatistica`, `App`, `Avisos Intranet`, `Perguntas Frequentes`, `Item Contacto`, `Item Informacao`, `Projectos Inovadores`, `Grupo Cartoes Selecao (2)`, `Example Modal Generico`, `Tira Horizontal`, `Campo Texto`, `Wrapper Auth Background`, `Passos Formulario`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Why does `TraducaoService` connect `Angular Core & SEO` to `Candidaturas Page`, `Application Form Sections`, `Desenvolvimento Page Data`, `Startups Service`, `Docentes & Inscrição Pages`, `Alumni Page`, `Candidatura Geral Mocks`, `Candidatura Geral State`, `Formações Page`, `Inscrições Service`, `Candidatura Início & Curso Detail`, `Home Page`, `Projeto Detail Page`, `Admissions Mocks`, `Date Utils & Cards`, `Translation Pipeline`, `Estudantes Page`, `Contactos Service`, `Sobre Sections`, `Query Layer & API Errors`, `Eventos Service`, `Visit Scheduling`, `Share Button & Dropdown`, `Header Menu`, `Docência Mocks`, `Projetos Service`, `Candidatura Docentes Service`, `Projeto Model & Timeline`, `Review Step (Etapa 4)`, `Eventos Page & Cards`, `Statistics Mocks`, `Sponsors & Deep Localize`, `Footer & i18n Dictionary`, `Candidatura Alunos Service`, `Login Page`, `Org Structure Modal`, `Routes & Layouts`, `Mosaic Gallery`, `Countdown & Event Highlight`, `Proximas Datas`, `Modal Orgaos Gestao`, `Modal Pilares Institucionais`, `Avisos Intranet`, `Perguntas Frequentes`, `Projectos Inovadores`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `IconeComponent` connect `Docentes & Inscrição Pages` to `Angular Core & SEO`, `Candidaturas Page`, `Application Form Sections`, `Desenvolvimento Page Data`, `Startups Service`, `Alumni Page`, `Candidatura Geral State`, `Formações Page`, `Inscrições Service`, `Candidatura Início & Curso Detail`, `Home Page`, `Date Utils & Cards`, `Translation Pipeline`, `Estudantes Page`, `Contactos Service`, `Query Layer & API Errors`, `Eventos Service`, `Visit Scheduling`, `Share Button & Dropdown`, `Header Menu`, `Form Step Templates`, `Review Step (Etapa 4)`, `Eventos Page & Cards`, `Banner & Button`, `Sponsors & Deep Localize`, `Footer & i18n Dictionary`, `Login Page`, `Org Structure Modal`, `Routes & Layouts`, `Section Header`, `Mosaic Gallery`, `Countdown & Event Highlight`, `Modal Orgaos Gestao`, `Modal Pilares Institucionais`, `Item Contacto`, `Item Informacao`, `Grupo Cartoes Selecao (2)`, `Passos Formulario`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `TraducaoService` (e.g. with `cabecalho.component.html template` and `rodape.component.html template`) actually correct?**
  _`TraducaoService` has 9 INFERRED edges - model-reasoned connections that need verification._