# Recursos da API já integrados

Registo das integrações com a API da Unagro (regras em `.claude/README.md`, secção
"Dados da API — TanStack Query"). Uma entrada por recurso: onde vivem as três camadas,
o que ficou por resolver do lado da API e o que o site teve de compensar.

## noticias

**Integrado em:** 2026-09-04, para a sessão "Notícias" de `inicio`.

**Camadas:**

- `src/app/core/servicos/noticias.service.ts` — `listar(signal)` e `obterPorId(id, signal)`;
  a interface crua `NoticiaApi` e a função `paraNoticia` ficam neste ficheiro.
- `src/app/core/consultas/noticias.queries.ts` — `noticiasQueries.raiz`, `.lista(servico)`
  e `.porId(servico, id)`. **Primeiro ficheiro da pasta `core/consultas/`.**
- `src/app/pages/inicio/inicio.component.ts` — `injectQuery(() => noticiasQueries.lista(...))`;
  ordenação e paginação em `computed` sobre `consultaNoticias.data()`.
- `src/app/pages/detalhe-noticia/detalhe-noticia.component.ts` — `porId` para o artigo
  (com `enabled`, porque só se chama a API quando o id é inteiro) e `lista` para a coluna
  "Outras notícias".

**Mapeamento** (`NoticiaResource` → `Noticia`): `id` → `String(id)`,
`tipo_noticia` → `categoria`, `data_publicacao` → `data`, `descricao` → `resumo`,
`capa_url` → `imagem`, `conteudo` e `destaque` com o mesmo nome. `created_at`/`updated_at`
não são usados pelo site.

**O que o mock passou a ser:** `core/dados/noticias.mock.ts` deixou de alimentar a página —
é agora `NOTICIAS_FALLBACK` (`NoticiaBruta`, bilingue), conteúdo **de recurso** para quando
a API devolve lista vazia ou falha. Foi pedido explícito: a página de entrada não pode
ficar sem secção de notícias.

**Problemas da API registados (não inventados deste lado):**

1. **`capa_url` com host `localhost`** — `http://localhost:8000/storage/noticias/<ficheiro>`.
   Fora da máquina da API não carrega, e mesmo trocando o host pelo IP o ficheiro dá 404
   (o `storage` não está publicado). O serviço descarta URLs de `localhost`/`127.0.0.1`
   (`capaUtilizavel`) para o cartão cair no espaço reservado em vez de mostrar imagem
   partida; quando o `APP_URL` do Laravel for corrigido volta a funcionar sozinho.
2. **`NoticiaResource` do OpenAPI declara `id` e `destaque` como `string`**, mas a resposta
   manda `number` e `boolean`. Os tipos aqui seguem a resposta real; o mapeamento
   normaliza (`String(id)`, `Boolean(destaque)`).
3. **A API é monolingue (só português)** e não tem `?lang=`. Em inglês, o conteúdo
   editorial da secção sai em português — resolve-se do lado da API, não aqui.
4. **Não há campo equivalente ao `academica`** do antigo mock; o que existe é o
   `tipo_noticia` como texto livre ("Institucional", "Académica", "Aviso técnico",
   "Extensão"), sem lista fechada de valores.

**SSR: o servidor NÃO espera pela query.** O HTML do prerender e do SSR de `/` sai com os
esqueletos e sem notícia nenhuma; a `ng-state` não traz a resposta e o pedido só se
completa no navegador. Verificado com `PendingTasks` visível no bundle do servidor e com
o `listar()` a ser chamado do lado do servidor (`typeof window === 'undefined'`) — o
pedido **é feito**, o que falha é a espera. A hipótese é a registo da tarefa pendente
acontecer dentro da notificação assíncrona do `notifyManager` do query-core, já depois de
o Angular ter dado a aplicação por estável. Contradiz o que o `.claude/README.md` diz em
"SSR — o que já está resolvido"; enquanto não for resolvido, **o conteúdo da API não
aparece no HTML servido** (afecta SEO e primeiro paint das secções ligadas à API).


## laboratorios + agendamento-visitas

**Integrado em:** 2026-09-07, para a sessão "Centros e Laboratórios" de `desenvolvimento`
(listagem) e para o `app-modal-agendar-visita` que ela abre (escrita).

**Camadas:**

- `src/app/core/servicos/laboratorios.service.ts` — `listar(signal)`; a interface crua
  `LaboratorioApi` (mais a `FaculdadeApi` reduzida ao `nome`) e a função `paraUnidade`
  ficam neste ficheiro.
- `src/app/core/consultas/laboratorios.queries.ts` — `laboratoriosQueries.raiz` e
  `.lista(servico)`. **Sem `porId`**: não há página de detalhe de laboratório, e uma
  fábrica que ninguém chama é código morto.
- `src/app/core/servicos/agendamento-visitas.service.ts` — `criar(dados, signal)` para o
  `POST /agendamento-visitas`; a interface crua `AgendamentoVisitaRequest` e a função
  `paraPedido` ficam neste ficheiro.
- `src/app/core/modelos/agendamento-visita.model.ts` — `NovoAgendamentoVisita`, a forma
  do formulário do modal (é o serviço que a traduz para os nomes da API).
- `src/app/pages/desenvolvimento/desenvolvimento.component.ts` —
  `injectQuery(() => laboratoriosQueries.lista(...))`; o `unidades()` passou de `signal`
  com mock a `computed` sobre `consultaUnidades.data()`.
- `src/app/shared/componentes/modal-agendar-visita/modal-agendar-visita.component.ts` —
  `injectMutation<void, ErroApi, NovoAgendamentoVisita>` no `submeter()`.

**Mapeamento** (`LaboratorioResource` → `UnidadeInvestigacao`): `id` → `String(id)`,
`nome` → `nome`, **`faculdade.nome` → `area`** (o selo sobre a fotografia; é o que a API
tem mais perto de uma área), `capa_url` → `imagem_url` (pelo `capaUtilizavel`),
`icone` fixo em `flask-conical` e `link` fixo na própria secção. `descricao`,
`faculdade_id`, `created_at` e `updated_at` não são usados pelo cartão.

**Mapeamento** (`NovoAgendamentoVisita` → `AgendamentoVisitaRequest`):
`unidade_id` → `laboratorio_id` (`Number`), `instituicao` → `organizacao`,
`data` → `data_preferencial`, `hora` → `hora_preferencial`, `motivo` → `motivo_visita`,
`participantes` → `numero_participantes`. Os campos opcionais vazios vão como
`undefined`, para não gravar cadeias vazias.

**O `capaUtilizavel` saiu do `noticias.service.ts`** para `core/api/capa-utilizavel.ts`:
o host `localhost` nas capas é um problema da API, não de um recurso, e os laboratórios
sofrem dele da mesma maneira. O `NoticiasService` passou a importá-lo — comportamento
igual ao que tinha.

**O `UnidadeInvestigacao` mudou de forma.** Era bilingue (`TextoBilingue` em `area` e
`nome`), como convém a um mock; passou a texto simples, que é a regra dos modelos vindos
da API. Arrastou o `app-cartao-unidade` (deixou de chamar `getTraducao` nos dois campos),
o `app-modal-agendar-visita` (`rotulo: unidade.nome`) e o `.spec` do modal. **O
`UNIDADES_MOCK` de `desenvolvimento` desapareceu** — ao contrário das notícias, aqui não
foi pedido conteúdo de recurso: a secção segue os três estados do
`.claude/README.md` (esqueletos → erro → dados), com o novo
`app-cartao-unidade-esqueleto`.

**Escrita verificada contra a API antes de escrever o código** (`POST` com um
`laboratorio_id` inexistente, que falha na regra `exists` sem criar registo): os
obrigatórios são `laboratorio_id`, `nome`, `email`, `data_preferencial` e
`hora_preferencial`, e a API aceita `data_preferencial` em `AAAA-MM-DD` — apesar de o
esquema a declarar `format: date-time` — e `hora_preferencial` em `HH:MM`, que é o que os
campos do formulário dão.

**Problemas da API registados (não inventados deste lado):**

1. **`AgendamentoVisitaResource` declara `id`, `laboratorio_id` e `numero_participantes`
   como `string`**, e o `LaboratorioResource` dá-os como `integer`. Como o site descarta o
   corpo da resposta do `POST`, não chegou a ser preciso normalizar — mas a incoerência
   está lá.
2. **Os 422 do Laravel vêm só em português** ("O campo nome é obrigatório."). O modal
   mostra-os tal e qual, porque dizem exactamente o que falha; em inglês ficam em
   português, como o resto do conteúdo editorial.
3. **`GET /agendamento-visitas` pede autenticação** (`Não autenticado.`), pelo que não há
   nada para invalidar depois do `POST` — o site nunca lê a lista.
4. **A tabela de laboratórios tem duplicados**: os ids 1–5 e 6–10 são os mesmos cinco
   nomes repetidos. Não é problema do site; a tira mostra o que a API mandar.
5. **Não há campo de área nem de ícone no laboratório.** O selo usa o nome da faculdade e
   o ícone é o mesmo para todos.

**SSR: continua a não esperar pela query** — o prerender de `/desenvolvimento` sai com os
três `app-cartao-unidade-esqueleto` e sem laboratório nenhum, exactamente como acontece
com as notícias em `/`. Verificado no `dist` depois do build.


## candidaturas (docentes)

**Integrado em:** 2026-09-07, para o formulário de `/candidaturas/docentes`
(`app-formulario-docente`). Só escrita — o site nunca lê a lista.

**Camadas:**

- `src/app/core/servicos/candidatura-docentes.service.ts` — `criar(dados, signal)` para o
  `POST /candidaturas`; a função `paraPedido` (que monta o `FormData`) fica neste ficheiro.
  **O nome do ficheiro não é `candidaturas.service.ts` de propósito**: esse já existe e é o
  conteúdo (mock) da página `/candidaturas`, que não fala com a API.
- `src/app/core/modelos/candidatura-docente.model.ts` — `NovaCandidaturaDocente`, a forma do
  formulário (é o serviço que a traduz para os nomes da API).
- `src/app/pages/candidatura-docentes/formulario/formulario-docente.component.ts` —
  `injectMutation<void, ErroApi, NovaCandidaturaDocente>` no `submeter()`.
- **Sem ficheiro em `core/consultas/`**: não há `GET` nenhum deste lado, e uma chave de cache
  que ninguém usa é código morto (mesma decisão do `agendamento-visitas`).

**O corpo vai em `multipart/form-data`**, não em JSON — leva o PDF do currículo. O
`ApiService.post` já aceita um `FormData` tal e qual; o `HttpClient` põe o `Content-Type`
com o *boundary* sozinho, e **não se lhe deve pôr o cabeçalho à mão**.

**Mapeamento** (`NovaCandidaturaDocente` → `CandidaturaRequest`): `nome` → `nome_completo`,
`email` → `email`, `telefone` → `telefone`, `perfil` → `linkedin_url`,
`titulacao` → `maior_titulo`, `universidade` → `universidade_origem`,
`area` → `area_estudo_principal`, `linhasPesquisa` → `desc_areas_pesquisas`,
`carta` → `desc_motivacao`, `curriculo` → `curriculo`. Os opcionais vazios **não entram no
`FormData`**, para não gravar cadeias vazias.

**O `maior_titulo` vai em português, sempre.** O select guarda o `id` da titulação
(`doutoramento`, `agregacao`, …) e a API guarda texto livre e é monolingue — o novo
`DocenciaService.rotuloTitulacaoEmPortugues(id)` lê o `rotulo.pt` do mock, para o backoffice
receber a mesma cadeia mesmo quando o candidato preenche o formulário em inglês.

**Escrita verificada contra a API antes de escrever o código**, sempre com pedidos que
falham a validação (não criam registo):

1. Obrigatórios: **só `nome_completo` e `email`**. Tudo o resto é opcional.
2. `curriculo`: **`pdf`, `doc` ou `docx`, até 5120 KB**. O formulário dizia "PDF até 10MB" e
   validava a 10 — passou a **5MB** (`TAMANHO_MAXIMO_CV_MB`), e o texto do `app-campo-upload`
   acompanhou. Continua a aceitar só PDF, que é o que a etiqueta promete.
3. Os nomes dos oito campos opcionais foram confirmados um a um, mandando valores que violam
   as regras deles (300 caracteres nos `max:255`, arrays nos `string`): o Laravel **ignora em
   silêncio** um campo com o nome errado, por isso o 422 nomeado é a única prova de que a
   chave chega. Todos responderam.
4. Os campos de 255 ganharam `Validators.maxLength(255)` (`MAXIMO_TEXTO_CURTO`) — falhar no
   formulário poupa uma ida ao servidor.

**Erros e sucesso, no formulário:** a falha do `POST` aparece numa faixa vermelha por baixo do
último passo (não num modal), com o formulário ainda preenchido; os 422 do Laravel mostram-se
tal e qual, e chegam **só em português**. O ecrã de confirmação, que antes aparecia no clique,
só aparece agora no `onSuccess` — o `submetido` deixou de ser uma promessa vazia. O
`recomecar()` faz também `enviar.reset()`.

**Problemas da API registados (não inventados deste lado):**

1. **`linkedin_url` não valida URL** — só `max:255`. Passa qualquer texto.
2. **`GET`/`PUT`/`DELETE /candidaturas` pedem autenticação** (herdam o `security` global);
   público é só o `POST`. Não há nada para invalidar depois da submissão, e um registo criado
   por engano não se apaga a partir do site.
3. **Os 422 vêm com as mensagens misturadas**: `nome_completo` responde em português ("O campo
   nome completo é obrigatório.") e `email`/`curriculo` em inglês ("The email field must be a
   valid email address."), na mesma resposta.
4. **O endpoint é genérico (`/candidaturas`)**, mas os campos são todos académicos
   (`maior_titulo`, `universidade_origem`) — não há como distinguir candidaturas de docentes de
   outras, nem campo de estado/fase.
5. **Não há campo para a titulação como lista fechada**, nem equivalente aos passos do
   formulário. O que o site chama "carta de motivação" é o `desc_motivacao`, sem limite de
   tamanho declarado.

**Por verificar: nenhuma candidatura foi criada de facto.** Toda a verificação foi feita com
pedidos que morrem na validação, para não deixar um registo de teste numa base partilhada que
o site não consegue apagar. O caminho de sucesso (201 + ficheiro guardado no `storage`) está
por confirmar com uma submissão real.


## eventos

**Integrado em:** 2026-09-08, para a sessão "Próximos Eventos" de
`pages/eventos/eventos.component.html`. Arrastou também `pages/inicio` (secção
"evento em destaque"), que já consumia o `EventosService` antigo.

**Camadas:**

- `src/app/core/servicos/eventos.service.ts` — `listar(signal)` e
  `obterPorId(id, signal)`; a interface crua `EventoApi` e a função `paraEvento`
  ficam neste ficheiro. **Reescrito**: antes era um `computed` sobre
  `EVENTOS_MOCK` com `localizarProfundo`, sem tocar na API.
- `src/app/core/consultas/eventos.queries.ts` — `eventosQueries.raiz`, `.lista(servico)`
  e `.porId(servico, id)`.
- `src/app/core/modelos/evento.model.ts` — `Evento` passou de campos
  `TextoTraduzido` para texto simples (regra dos modelos vindos da API); ganhou
  `AMBITOS_EVENTO` e `ROTULOS_AMBITO_EVENTO` (rótulos de UI, não dados da API —
  o mesmo padrão do `ROTULOS_CATEGORIA_PROJECTO`).
- `src/app/pages/eventos/eventos.component.ts` — `injectQuery(() => eventosQueries.lista(...))`;
  os `computed` de filtro por âmbito, paginação, destaque/secundários e mensagem
  de lista vazia continuam todos, só que sobre `consultaEventos.data()`.
- `src/app/pages/inicio/inicio.component.ts` — idem, com `eventoPrincipal`
  recalculado (ver abaixo).
- `src/app/shared/componentes/cartao-evento-foto-esqueleto/` — esqueleto novo,
  com os dois formatos (`vertical`/`destaque`) do `app-cartao-evento-foto`.

**Mapeamento** (`EventoResource` → `Evento`): `id` → `String(id)`,
`localizacao` → `local`, `capa_url` → `imagem_url` (via `capaUtilizavel`),
`abrangencia` → `ambito`, com `nacional`/`internacional` inalterados e
**`unagro_prometed` → `unagro`** (a API escreve "prometed", erro tipográfico de
"promovido"). `titulo`/`descricao` mantêm o nome. `created_at`/`updated_at` não
são usados pelo site.

**A API não dá:**

1. **Data do evento.** O `EventoResource` só tem `id`, `capa_url`, `titulo`,
   `descricao`, `localizacao`, `abrangencia`, `created_at`, `updated_at` — nenhum
   campo de data/hora do acontecimento em si. `dataInicio`/`dataFim` ficaram
   **opcionais** no `Evento`, e:
   - no `app-cartao-evento-foto`, o selo de data (ícone de calendário) some
     quando `dataInicio` falta — o que acontece para todos os eventos reais
     de momento;
   - em `pages/inicio`, a secção "evento em destaque" (`app-cartao-evento-destaque`,
     que exige `dataInicio` para a contagem decrescente) só mostra um evento se
     `dataInicio` existir; como nenhum evento da API a tem, a secção cai sempre
     na mensagem "Ainda não há eventos agendados." já prevista no template —
     não se inventou data nenhuma para preencher a contagem.
2. **Sem `destaque`/flag de evento principal.** O antigo mock marcava um evento
   como `destaque: true`; a API não tem equivalente. `pages/inicio` já não
   escolhe por essa flag (o `find` procura o primeiro com `dataInicio`, que por
   agora nunca acontece — ver ponto 1).
3. **Sem categoria/selo textual separado do âmbito.** O mock antigo tinha um
   campo `selo` bilingue independente (ex.: "Cooperativa" para um evento
   `corporacao`); a API só dá `abrangencia`. O selo do cartão passou a ser o
   rótulo traduzido do próprio `ambito` (`ROTULOS_AMBITO_EVENTO`).
4. **Sem âmbito "corporação".** O filtro lateral de `eventos.component.ts` tinha
   uma opção "Corporações" que não corresponde a nenhum valor de `abrangencia`
   da API (só `nacional`, `internacional`, `unagro_prometed`); foi removida da
   barra de filtros em vez de ficar como opção permanentemente vazia.

**Mock apagado:** `core/dados/eventos.mock.ts` (`EVENTOS_MOCK`, bilingue) — só o
`EventosService` antigo o consumia.

**SSR: o servidor não espera pela query**, o mesmo problema já registado para
`noticias` e `laboratorios` acima. Confirmado no `dist`: o prerender de
`/eventos` sai com os `app-cartao-evento-foto-esqueleto` e sem evento nenhum.


## treinamentos

**Integrado em:** 2026-09-08, só para a 1ª sessão de `formacoes`
("Cursos de Curta Duração e Treinamentos Técnicos", grelha de 3 por lote
revelada pelo "Ver mais"). Pedido explícito para não tocar nas restantes
sessões da página nem no `CursosService`/`CURSOS_MOCK` que serve os cursos de
grau (usados por `detalhe-curso`, `candidaturas`, `formulario-inscricao`,
`faculdades-departamentos`, `cabecalho`).

**Camadas:**

- `src/app/core/servicos/treinamentos.service.ts` — `listar(signal)`; a
  interface crua `TreinamentoApi` e a função `paraTreinamento` ficam neste
  ficheiro. **Sem `obterPorId`**: não há página de detalhe de treinamento
  (mesma decisão do `laboratorios.service.ts`) — uma fábrica que ninguém chama
  é código morto.
- `src/app/core/consultas/treinamentos.queries.ts` — `treinamentosQueries.raiz`
  e `.lista(servico)`. Sem `porId`, pela mesma razão.
- `src/app/core/modelos/treinamento.model.ts` — `Treinamento`, campos de texto
  simples (regra dos modelos vindos da API).
- `src/app/pages/formacoes/formacoes.component.ts` —
  `injectQuery(() => treinamentosQueries.lista(...))` só na 1ª sessão; os
  `computed` de lote/paginação (`cursosCurtaVisiveis`, `temMaisCursosCurta`,
  `mostrarBotaoCursosCurta`) continuam todos, só que sobre a lista traduzida.
  `this.cursosService.cursosCurtaDuracao` **deixou de ser lido** — o
  `CursosService`/`CURSOS_MOCK` não foram tocados, porque `cursosGrau` (cursos
  de grau) continua a servir várias outras páginas a partir do mesmo mock.
- `src/app/shared/componentes/cartao-curso-curta-duracao-esqueleto/` —
  esqueleto novo, com a mesma moldura do `app-cartao-curso-curta-duracao`
  (fotografia, selo, carga horária, título, resumo, rodapé com preço e botão).

**Mapeamento** (`TreinamentoResource` → `Treinamento`): `id` → `String(id)`,
`nome` → `titulo`, `descricao` → `resumo` (`''` se `null`), `capa_url` →
`imagem` (via `capaUtilizavel`). **`carga_horaria` e `preco` chegam como texto**
("48 horas", "45000.00"), não como número — `paraCargaHoraria` extrai o
primeiro grupo de dígitos da string, `paraPreco` faz `Number()` directo.
`created_at`/`updated_at`/`data_inicio`/`data_fim` não são usados por este
cartão.

**A API não dá:**

1. **Sem estado de inscrição nem "próxima turma".** O `TreinamentoResource`
   não tem nada equivalente a `estadoInscricao`/`proximaTurma` — só
   `data_inicio`/`data_fim` (datas da edição registada, sem relação clara com
   "há uma próxima turma a abrir"). Os dois campos ficaram **opcionais** em
   `Treinamento`; ausentes, o cartão assume `'abertas'` (mesmo fallback que já
   existia quando o mock não os tinha) e nunca mostra o selo escuro de
   "Próxima Turma". Não se inventou lógica de datas para simular o estado.
2. **Sem página de detalhe própria.** O cartão continua a apontar para
   `/cursos/${id}` (como antes), mas essa rota (`detalhe-curso.component.ts`)
   lê o `CursosService`/`CURSOS_MOCK`, que não tem os ids numéricos da API —
   clicar num treinamento vindo da API cai numa página de curso vazia. Fora do
   âmbito desta integração (a instrução foi não tocar nas outras sessões nem
   no `CursosService`); fica registado como próximo passo: ou a API precisa de
   uma rota de detalhe de treinamento, ou o `detalhe-curso` passa a saber ler
   os dois recursos.

**Ficou por usar (não apagado, por estar fora do âmbito):**
`CursosService.cursosCurtaDuracao`, os cursos com `tipo: 'curta-duracao'` no
`CURSOS_MOCK`, e os campos `cargaHoraria`/`preco`/`estadoInscricao`/
`proximaTurma`/`EstadoInscricao` de `curso.model.ts` deixaram de ter qualquer
consumidor fora do próprio `cursos.service.spec.ts`. Não foram removidos
porque `CURSOS_MOCK` continua a servir `cursosGrau` para outras páginas — mas
convém que quem tratar do recurso `cursos` (graduações) saiba que essa fatia
específica do mock ficou órfã.

**SSR: o servidor não espera pela query**, o mesmo problema já registado para
`noticias`, `laboratorios` e `eventos`. Confirmado no `dist`: o prerender de
`/formacoes` sai com os `app-cartao-curso-curta-duracao-esqueleto` e sem
nenhum dos cinco treinamentos da API.

**Tradução automática:** `titulo` e `resumo` entram em
`CAMPOS_TRADUZIVEIS_TREINAMENTO`, aplicados antes do `cartoesCursosCurta`
(mesma cadeia `traducaoQueries.lista` → `aplicarTraducao`, ver secção
"Tradução automática do conteúdo da API" abaixo).


## startups

**Integrado em:** 2026-09-08, só para a 1ª sessão de `hub-unagro`
("Startups & Incubação", grelha de três cartões). Pedido explícito para não
tocar nas restantes três sessões da página (Projectos Inovadores, Como Apoiar,
Acompanhar Projectos).

**Camadas:**

- `src/app/core/servicos/startups.service.ts` — `listar(signal)` e
  `obterPorId(id, signal)`; a interface crua `StartupApi` e a função
  `paraStartup` ficam neste ficheiro. **Reescrito**: antes era um `computed`
  sobre `STARTUPS_MOCK` com `localizarProfundo`, sem tocar na API.
- `src/app/core/consultas/startups.queries.ts` — `startupsQueries.raiz`,
  `.lista(servico)` e `.porId(servico, id)`.
- `src/app/core/modelos/startup.model.ts` — `Startup` passou de campos
  `TextoTraduzido` (`nome`, `categoria`, `descricao`) para texto simples
  (regra dos modelos vindos da API) e **perdeu o campo `link`** (a API não dá
  destino de detalhe — ver "A API não dá" abaixo).
- `src/app/pages/hub-unagro/hub-unagro.component.ts` —
  `injectQuery(() => startupsQueries.lista(...))`; o cartão continua a receber
  `StartupCartao` (interface do próprio `cartao-startup.component.ts`, com
  `link`), montado num `computed` que junta o `link` fixo da âncora da secção
  aos dados traduzidos da API.
- `src/app/shared/componentes/cartao-startup-esqueleto/` — esqueleto novo, com
  a mesma moldura do `app-cartao-startup` (fotografia, categoria, nome,
  descrição, ligação "Saiba Mais").

**Mapeamento** (`StartupResource` → `Startup`): `id` → `String(id)`, `nome`
mantém o nome, `categoria` e `descricao` com fallback `''` quando `null`,
`capa_url` → `imagem_url` (via `capaUtilizavel`). `data_inicio`, `data_fim`,
`created_at`, `updated_at` não são usados pelo cartão.

**A API não dá:**

1. **Sem destino de detalhe (`link`).** O `StartupResource` não tem nenhum
   campo de URL/rota própria, e `app.routes.ts` não tem listagem nem detalhe
   de startup. O `link` deixou de fazer parte do modelo `Startup` (ao
   contrário do mock antigo, que o guardava por item) — o componente monta o
   `StartupCartao` com o mesmo `linkTodasStartups` usado no "Ver todas"
   (`/hub-unagro#secao-startups`) para todos os cartões, até existir rota de
   detalhe.

**Mock apagado:** `core/dados/startups.mock.ts` (`STARTUPS_MOCK`, bilingue) —
só o `StartupsService` antigo o consumia.

**SSR: o servidor não espera pela query**, o mesmo problema já registado para
`noticias`, `laboratorios`, `eventos` e `treinamentos` acima. Confirmado no
`dist`: o prerender de `/hub-unagro` sai com três
`app-cartao-startup-esqueleto` e sem startup nenhuma da API.

**Tradução automática:** `nome`, `categoria` e `descricao` entram em
`CAMPOS_TRADUZIVEIS_STARTUP`, aplicados antes do `computed` que monta o
`StartupCartao` (mesma cadeia `traducaoQueries.lista` → `aplicarTraducao`, ver
secção "Tradução automática do conteúdo da API" abaixo).


## inscricoes

**Integrado em:** 2026-09-08, para `shared/componentes/modal-inscricao-curso`
(o modal de inscrição num curso de curta duração, aberto por `formacoes`).
Só escrita — o site nunca lê a lista.

**Camadas:**

- `src/app/core/servicos/inscricoes.service.ts` — `criar(dados, signal)` para o
  `POST /inscricoes`; a interface crua `InscricaoRequest` e a função
  `paraPedido` ficam neste ficheiro.
- `src/app/core/modelos/inscricao-curso.model.ts` — `NovaInscricaoCurso`, a
  forma do formulário do modal (é o serviço que a traduz para os nomes da API).
- `src/app/shared/componentes/modal-inscricao-curso/modal-inscricao-curso.component.ts` —
  `injectMutation<void, ErroApi, NovaInscricaoCurso>` no `submeter()`; faixa de
  erro sob o formulário e `aCarregar`/`desativado` no botão de submissão,
  mesmo padrão do `modal-agendar-visita`.
- **Sem ficheiro em `core/consultas/`**: não há `GET` público deste lado
  (`GET /inscricoes` pede autenticação e o site nunca a lê), mesma decisão do
  `agendamento-visitas` e do `candidaturas`.

**Mapeamento** (`NovaInscricaoCurso` → `InscricaoRequest`): `cursoId` →
`curso_id` (`Number`), `nome` → `nome`, `email` → `email`, `telefone` →
`telefone` (`undefined` se vazio, embora o formulário já o exija). Sem campos
do lado do site sem correspondência na API.

**Escrita verificada contra a API antes de escrever o código** (`POST` com
corpos que falham a validação, sem criar registo):

1. Obrigatórios: `curso_id`, `nome`, `email`. `telefone` é opcional do lado
   da API (o formulário já o exige).
2. Os 422 chegam misturados: `curso_id`/`nome` respondem em português ("O
   campo curso id é obrigatório."), `email` em inglês ("The email field must
   be a valid email address.") — mesmo padrão observado em `candidaturas`.

**Problema grave da API registado (não inventado deste lado) — a decidir por
quem administra o Laravel:**

**`curso_id` valida contra a tabela `cursos` (cursos de grau/faculdade), não
contra `treinamentos` (cursos de curta duração).** Confirmado a mandar
`curso_id: 10` (id que só existe em `/cursos`, fora do intervalo 1–5 de
`/treinamentos`) — a validação **passou**; com `curso_id` inexistente em
`cursos` a API responde "O curso indicado não existe.". Não há endpoint
próprio para inscrição em treinamento (só `/inscricoes` e `/inscricoes/{id}`,
ao lado de `/treinamentos` e `/treinamentos/{id}`, sem nada como
`/matriculas` ou `/inscricoes-treinamento`).

O modal deste registo serve exactamente os cursos de curta duração
(`CursoCurtaDuracaoCartao`, alimentados pelo recurso `treinamentos` — ver
secção `treinamentos` abaixo), e o `id` que envia é o `id` do treinamento. Como
os ids de `treinamentos` (1–5) coincidem, por agora, com ids que também
existem em `cursos`, o `POST` **não falha a validação** — mas associa a
inscrição ao curso de grau errado (ex.: inscrever-se no treinamento id 3
regista, do lado da API, uma inscrição no curso de grau id 3, que é uma coisa
diferente). Isto não foi corrigido deste lado porque não há forma de o
corrigir sem um endpoint que aceite `treinamento_id`: fica registado como
trabalho para o Laravel, e o utilizador foi avisado no relatório desta
integração. Nenhuma inscrição real chegou a ser criada (todos os testes
morreram na validação, com e-mail/curso inválidos de propósito).

**SSR:** não aplicável — não há `GET` nem query, o `injectMutation` só corre a
pedido do utilizador.


## investigadores

**Integrado em:** 2026-09-08, só para a 6ª sessão de `desenvolvimento`
(`#secao-investigadores`, "Investigadores Principais" — a fila de quatro
cartões percorrida com as setas do cabeçalho). Pedido explícito para não tocar
nos outros mocks da página: `PROJECTOS_MOCK` (via `ProjetosService`),
`LINHAS_INVESTIGACAO_MOCK`, `PASSOS_METODOLOGIA_MOCK` e `PUBLICACOES_MOCK`
ficaram como estavam.

**Camadas:**

- `src/app/core/servicos/investigadores.service.ts` — `listar(signal)`; a
  interface crua `InvestigadorApi` e as funções `paraInvestigador`/
  `paraEspecialidades` ficam neste ficheiro. **Sem `obterPorId`**: não há
  página de detalhe de investigador (mesma decisão de `laboratorios` e
  `treinamentos`).
- `src/app/core/consultas/investigadores.queries.ts` —
  `investigadoresQueries.raiz` e `.lista(servico)`. Sem `porId`, pela mesma razão.
- `src/app/core/modelos/investigacao.model.ts` — o `Investigador` passou de
  pares bilingues (`cargo: TextoBilingue`, `especialidades: TextoBilingue[]`)
  para texto simples, e `cargo`/`foto_url`/`especialidades` ficaram
  **opcionais** (a API dá-os como anuláveis). O resto do ficheiro
  (`LinhaInvestigacao`, `PassoMetodologia`) continua bilingue, porque continua
  a vir de mock.
- `src/app/pages/desenvolvimento/desenvolvimento.component.ts` —
  `injectQuery(() => investigadoresQueries.lista(...))`; a paginação com as
  setas (`paginaInvestigadores`, `investigadoresVisiveis`,
  `temInvestigadoresAnteriores/Seguintes`, `investigadoresPorPagina`)
  continua igual, só que sobre a lista traduzida em vez do
  `INVESTIGADORES_MOCK`. A animação dos cartões mantém-se como estava
  (`direcaoRevelacao="direita"`, ao contrário do resto do site).
- `src/app/shared/componentes/cartao-investigador/cartao-investigador.component.ts` —
  deixou de chamar `getTraducao` (o texto já chega resolvido) e esconde a linha
  do cargo quando ele falta.
- `src/app/shared/componentes/cartao-investigador-esqueleto/` — esqueleto novo,
  com a mesma moldura branca, a fotografia de bordo a bordo em `aspect-[4/5]` e
  o bloco de texto com `p-4` (nome, cargo e duas pílulas) do cartão real.

**Mapeamento** (`InvestigadorResource` -> `Investigador`): `id` -> `String(id)`,
`nome` mantém o nome, `cargo` -> `cargo` (nulo vira ausente),
**`areas_especializacao` -> `especialidades`** (entradas nulas e vazias
descartadas; lista vazia vira ausente), `foto_url` -> `foto_url` via
`capaUtilizavel`. `equipaProjectos`, `created_at` e `updated_at` não são usados
pelo cartão.

**`foto_url` vem como caminho relativo** (`investigadores/xxx.jpg`, sem host nem
`/storage/`), como já acontece com os `capa_url` dos outros recursos — passa
pelo `capaUtilizavel`, e `http://192.168.1.252:8000/storage/investigadores/...`
responde 200, logo as fotografias carregam.

**A API não dá:**

1. **Nada além de nome, cargo, foto e áreas.** O cartão só mostra estes quatro
   campos, e todos existem — não houve campo do site a ficar a descoberto
   nesta sessão. O que a API tem a mais (`equipaProjectos`, com
   `funcao_no_projecto` e datas por projecto) fica sem uso: não há nada no
   desenho da sessão para o mostrar, e seria a matéria-prima de uma futura
   página de detalhe de investigador ou da equipa de um projecto.
2. **`cargo`, `foto_url` e `areas_especializacao` são anuláveis no esquema** (e
   `areas_especializacao` tem `items: {}`, sem tipo declarado). Nos cinco
   registos actuais chegam todos preenchidos com texto, mas o modelo trata-os
   como opcionais: sem cargo a linha cinzenta desaparece, sem áreas o bloco de
   pílulas desaparece, sem foto o cartão cai no `app-espaco-imagem`.
3. **Sem ordem nem destaque.** `GET /investigadores` devolve por `id`
   descendente (5, 4, 3, 2, 1) e não há campo de ordem, de senioridade nem de
   "principal" — a sessão chama-se "Investigadores Principais" mas mostra
   simplesmente os primeiros quatro da lista que a API mandar.

**Mock apagado:** `INVESTIGADORES_MOCK`, que vivia dentro do próprio
`desenvolvimento.component.ts` (nunca teve ficheiro em `core/dados/`).

**Tradução automática:** `cargo` entra em
`CAMPOS_TRADUZIVEIS_INVESTIGADOR`; o `nome` fica **de fora** de propósito (nome
próprio não se traduz). As `especialidades` são uma lista por investigador e o
`camposParaTraduzir` só sabe achatar campos de texto simples, por isso vão numa
**segunda `traducaoQueries.lista`** com todas as pílulas de todos os
investigadores numa única lista, redistribuídas depois por
`aplicarTraducaoTextos` e um cursor (cada investigador leva de volta tantas
quantas tinha). Padrão a reutilizar quando um recurso tiver campos de lista.

**SSR: o prerender de `/desenvolvimento` passou a trazer os investigadores** —
e não só eles. Ver a nota de campo "2026-09-08: porque o conteúdo da API não
aparecia no HTML do servidor", no fim deste ficheiro: a causa foi encontrada e
corrigida durante esta integração, o que invalida os parágrafos "SSR: o
servidor não espera pela query" das entradas de `noticias`, `laboratorios`,
`eventos`, `treinamentos` e `startups` acima.


## faculdades

**Integrado em:** 2026-09-08, para `pages/sobre/faculdades-departamentos`
("Faculdades e Departamentos", uma das sete abas de `/sobre`). Antes derivava
a lista agrupando `curso.faculdade` (uma string) sobre `CursosService.cursosGrau()`
(`CursosService`/`CURSOS_MOCK`); não foi tocado, porque continua a servir
`detalhe-curso`, `candidaturas`, `formulario-inscricao`, `cabecalho`.

**Camadas:**

- `src/app/core/servicos/faculdades.service.ts` — `listar(signal)`; a
  interface crua `FaculdadeApi` (mais `CursoApi`, reduzida a `id`/`nome`) e a
  função `paraFaculdade` ficam neste ficheiro. **Sem `obterPorId`**: não há
  página de detalhe de faculdade — mesma decisão do `laboratorios.service.ts`.
- `src/app/core/consultas/faculdades.queries.ts` — `faculdadesQueries.raiz` e
  `.lista(servico)`. Sem `porId`, pela mesma razão.
- `src/app/core/modelos/faculdade.model.ts` — `Faculdade` (`id`, `nome`,
  `cursos: CursoFaculdade[]`), campos de texto simples.
- `src/app/pages/sobre/faculdades-departamentos/faculdades-departamentos.component.ts` —
  `injectQuery(() => faculdadesQueries.lista(...))`; o `computed` `faculdades`
  continua a montar ícone-por-posição e a contagem, só que sobre os dados
  (traduzidos) da query em vez do `Map` que agrupava cursos por nome de faculdade.
- `src/app/shared/componentes/cartao-faculdade-esqueleto/` — esqueleto novo,
  com a mesma moldura do cartão inline (ícone, nome, contagem, lista de
  cursos).

**Decisão sobre a relação faculdades↔cursos: já não é preciso cruzar com o
`CursosService`.** Ao contrário do que a descrição do pedido admitia como
hipótese, o `FaculdadeResource` da API **já traz os cursos de cada faculdade
embutidos** (`cursos: CursoResource[]`, reduzido a `id`/`nome` pelo site) — o
mesmo padrão que `LaboratorioResource.faculdade` já mostrava ao contrário
(laboratório → nome da faculdade). Não há relação nenhuma com o
`CursosService`/`CURSOS_MOCK` neste caminho: os cursos de grau que o cartão
lista vêm de dentro da própria resposta de `GET /faculdades`, com o `id`
numérico da API (que já é o mesmo `id` que `GET /cursos` usa), por isso o link
`/cursos/${curso.id}` continua a apontar para a rota existente sem tradução de
id nenhuma.

**Mapeamento** (`FaculdadeResource` → `Faculdade`): `id` → `String(id)`,
`nome` mantém o nome, `cursos[].id` → `String(id)`, `cursos[].nome` →
`cursos[].titulo`. `descricao`, `conteudo`, `capa_url`, `laboratorios`,
`bolsas`, `created_at`, `updated_at` não são usados por este cartão (o cartão
nunca mostrou imagem nem resumo de faculdade).

**A API não dá:**

1. **Ícone.** Continua atribuído por posição (`ICONES_FACULDADE`), como já
   acontecia com o mock — a API não classifica faculdades por área nem lhes
   dá ícone.

**Dois problemas de dados duplicados encontrados e corrigidos do lado do
serviço (não inventados, confirmados em `GET /faculdades`, 2026-09-08):**

1. **A tabela de faculdades tem duplicados, na mesma família de problema já
   registada para `laboratorios`** (ids 1–5 e 6–10 com os cinco nomes
   repetidos) — mas aqui a duplicação é mais grave: os ids 6–10 vêm sempre
   com `cursos`/`laboratorios`/`bolsas` **vazios**, e a API devolve a lista
   por ordem decrescente de id, por isso as cinco faculdades vazias
   apareceriam **primeiro**. Ao contrário da decisão tomada para
   `laboratorios` ("não é problema do site: a tira mostra o que a API
   mandar" — lá a duplicação produz cartões idênticos numa lista plana,
   inofensivo), aqui produziria cartões de faculdade **vazios** (0 cursos,
   sem lista), o que contradiz o propósito da aba. Por isso o
   `FaculdadesService.listar()` agrupa por `nome` e fica com a entrada que
   tiver mais cursos (`semFaculdadesDuplicadas`) — decisão tomada
   conscientemente diferente da de `laboratorios`, e registada aqui para
   quem for arrumar os dados de seed do lado do Laravel.
2. **Dentro de uma mesma faculdade "real" (ids 1–5), o próprio array
   `cursos` também duplica**: cada faculdade tem 2 cursos com o mesmo
   `nome` e `id`s diferentes (ex.: faculdade 1 tem "Licenciatura em
   Agronomia" com `id: 1` e outra vez com `id: 6`). Sem correcção, o cartão
   listaria o mesmo curso duas vezes — visivelmente errado dentro de uma
   única lista, ao contrário do caso anterior. `semCursosDuplicados` agrupa
   por `nome` e fica com o menor `id`.

**Mock:** não havia `core/dados/faculdades.mock.ts` — a lista antiga não vinha
de um mock próprio, era derivada do `cursos.mock.ts`, que continua a existir
para outros consumidores. Nada para apagar.

**Prerender: não aplicável a este caso, mas por uma razão diferente da dos
outros recursos.** `/sobre` mostra sete abas num `@switch`, e só a aba activa
está no DOM; a aba activa por omissão é `nossa-historia`, não
`faculdades-departamentos` (`ABAS_SOBRE[0]`, ver `sobre.component.ts`). Isto
já acontecia com o mock: `app-sobre-faculdades-departamentos` nunca chegou a
ser instanciado no prerender de `/sobre`, muito menos a query que lê agora.
Confirmado no `dist`: `sobre/index.html` tem o título "Faculdades e
Departamentos" do item de menu, mas nem um nome de faculdade nem o esqueleto —
o componente da aba simplesmente não existe nessa árvore. Não há regressão
face ao mock; fica por verificar manualmente num browser (trocar de aba,
trocar de idioma) se, quando a aba está activa no cliente, a query resolve e a
tradução do `nome`/dos títulos de curso funciona — o mesmo "por verificar"
já registado para `treinamentos`/`startups`.

## contatos

**Integrado em:** 2026-09-08, para o formulário de mensagem de
`pages/contactos/contactos.component.ts` (sessão "Envie-nos uma Mensagem").
Só escrita — o site nunca lê a lista.

**Camadas:**

- `src/app/core/servicos/contatos.service.ts` — `criar(dados, signal)` para o
  `POST /contatos`; a interface crua `ContatoRequest` e a função `paraPedido`
  ficam neste ficheiro.
- `src/app/core/modelos/contacto.model.ts` — `NovoContacto`, a forma do
  formulário (é o serviço que a traduz para os nomes da API).
- `src/app/pages/contactos/contactos.component.ts` —
  `injectMutation<void, ErroApi, NovoContacto>` (`envio`) no `enviar()`; faixa
  de erro sob o formulário e `aCarregar`/`desativado` no botão de submissão,
  mesmo padrão do `modal-agendar-visita`/`modal-inscricao-curso`. O antigo
  `estadoEnvio` (sinal com `setTimeout` a fingir o envio) foi removido —
  `envio.isPending()`/`.isSuccess()`/`.isError()` fazem o mesmo papel.
- **Sem ficheiro em `core/consultas/`**: não há `GET` público deste lado
  (`GET /contatos` pede autenticação e o site nunca a lê), mesma decisão do
  `agendamento-visitas`, do `candidaturas` e do `inscricoes`.

**Mapeamento** (`NovoContacto` → `ContatoRequest`): `nome` → `nome`, `email` →
`email`, **`assunto` → `tipo_interesse`** (o `id` do select, `'geral'` |
`'candidaturas'` | `'cursos'` | `'imprensa'`, é traduzido para o rótulo **em
português** antes de seguir — `ROTULOS_ASSUNTO_PT` — porque a API é monolingue
e guarda `tipo_interesse` como texto livre; mesmo padrão do
`DocenciaService.rotuloTitulacaoEmPortugues`), `mensagem` → `mensagem`. Sem
campo do lado do site sem correspondência na API; o `ContatoRequest` também
aceita `data_criacao`, que o formulário não tem e por isso nunca é enviado
(fica para o Laravel preencher).

**Escrita verificada contra a API antes de escrever o código** (`POST` com
corpos que falham a validação, sem criar registo):

1. Obrigatórios: só `nome` e `email`. `tipo_interesse` e `mensagem` são
   opcionais e não têm lista fechada de valores — confirmado a mandar um
   `tipo_interesse` arbitrário (`"valor-arbitrario-xyz"`), que passou a
   validação sem erro.
2. Os 422 de "campo obrigatório" chegam em português: "O campo nome é
   obrigatório.", "O campo email é obrigatório." — mesmo padrão já observado
   em `candidaturas` e `inscricoes`.
3. **As mensagens de "tipo errado" saem sempre em inglês, mesmo quando o
   "obrigatório" do mesmo campo sairia em português**: mandando
   `tipo_interesse`/`mensagem` como número e `data_criacao` como texto
   inválido, a API respondeu "The tipo interesse field must be a string.",
   "The mensagem field must be a string." e "The data criacao field must be a
   valid date." — o site nunca chega a mandar tipos errados (o formulário só
   tem `string`), por isso não é um problema prático, só mais uma
   inconsistência de idioma na mesma família já registada noutros recursos.

**Formulário:** `nome`/`email` ganharam `Validators.maxLength(255)`
(`MAXIMO_TEXTO_CURTO`), a acompanhar o `maxLength` do `ContatoRequest` —
falhar no formulário poupa uma ida ao servidor. `mensagem` não tem
`maxLength` na API (string livre, sem limite declarado), por isso também não
ganhou um no formulário.

**A API não dá:** nada — os quatro campos do formulário (`nome`, `email`,
`assunto`, `mensagem`) têm todos correspondência directa no `ContatoRequest`.

**Por verificar: nenhuma mensagem de contacto foi criada de facto.** Toda a
verificação foi feita com pedidos que morrem na validação ou com tipos
errados, para não deixar um registo de teste numa base partilhada que o site
não consegue apagar (`GET`/`PUT`/`DELETE /contatos` pedem autenticação). O
caminho de sucesso (201) está por confirmar com uma submissão real.

**SSR:** não aplicável — não há `GET` nem query, o `injectMutation` só corre a
pedido do utilizador. Confirmado no `dist`: `/contactos` prerenderiza o
formulário normalmente (não depende de nenhuma query).


## projectos

**Integrado em:** 2026-09-08, para a 1ª sessão de `desenvolvimento`
(`#secao-projectos`, listagem com filtro/pesquisa/paginação) e para
`pages/detalhe-projeto` (a página que cada cartão abre). Pedido explícito e
**diferente do padrão das outras integrações**: em vez de tornar opcional e
esconder o que a API não dá, os campos sem correspondência continuam a vir do
`PROJETOS_MOCK` — o mock não foi apagado, passou a ser a segunda fonte de
dados de todo projecto real.

**Camadas:**

- `src/app/core/servicos/projetos.service.ts` — `listar(idioma, signal)` e
  `obterPorId(id, idioma, signal)`; as interfaces cruas (`ProjetoApi`,
  `CategoriaApi`, `EquipaProjectoApi`, `CronogramaApi`) e a função `paraProjeto`
  ficam neste ficheiro. **Reescrito**: antes era um `computed` sobre
  `PROJETOS_MOCK` com `getTraducao`; agora é assíncrono e junta a API ao mock.
  Também injecta o `InvestigadoresService` (`GET /investigadores`) para
  resolver o nome e a fotografia da equipa — ver "Equipa" abaixo.
- `src/app/core/consultas/projetos.queries.ts` — `projetosQueries.raiz`,
  `.lista(servico, idioma)` e `.porId(servico, id, idioma)`. **O `idioma` entra
  na `queryKey`**, ao contrário dos outros recursos: aqui o próprio serviço
  resolve os campos bilingues do mock (`resolver`, o `getTraducao` sem
  depender de sinais), por isso trocar de idioma só actualiza o ecrã se o
  `queryFn` for chamado outra vez.
- `src/app/pages/desenvolvimento/desenvolvimento.component.ts` —
  `injectQuery(() => projetosQueries.lista(this.projetosService, this.traducao.idioma()))`;
  os `computed` de filtro por categoria, pesquisa e paginação
  (`projectosFiltrados`, `projectosVisiveis`, `esqueletos`/`aCarregar` da
  "Carregar Mais") continuam todos, só que sobre a lista traduzida. Esqueleto
  inicial reaproveita o `app-cartao-projecto-esqueleto` que já existia (antes
  só usado na paginação "Carregar Mais").
- `src/app/pages/detalhe-projeto/detalhe-projeto.component.ts` —
  `injectQuery(() => projetosQueries.porId(...))` com `enabled` (mesmo padrão
  do `detalhe-noticia`: um `id` não-numérico nem chama a API), mais um estado
  "A carregar o projecto…" distinto de "Projecto não encontrado" enquanto o
  pedido está pendente.

**Emparelhamento com o mock — pelo id, não pela posição na lista.** Cada
projecto da API é ligado a `PROJETOS_MOCK[(id - 1) % PROJETOS_MOCK.length]`
(o mock só tem 4 entradas, os ids da API cobrem 20 registos — o resto do id
decide qual entrada empresta contexto, objectivos, solução, galeria,
documentos, testemunhos e contacto). Ser pelo **id** e não pela posição no
array devolvido é o que garante que `listar()` (a grelha) e `obterPorId()` (o
detalhe, chamado sozinho, sem ver a lista) escolhem sempre a mesma entrada do
mock para o mesmo projecto — indispensável para o clique no cartão levar a
uma página de detalhe coerente com o que o cartão mostrou.

**Mapeamento** (`ProjectoResource` → `Projeto`) — campos que a API **dá**:

- `id` → `String(id)`.
- `nome` → `titulo`.
- `descricao` → `resumo` (fallback ao mock só se vier `null`; nos 20 projectos
  actuais nunca vem).
- `status` → `estado`, em maiúsculas (`.toUpperCase()`) — a API manda
  `"activo"`/`"Em execução"`, o modelo já documentava "em maiúsculas".
- **`categoria.nome` → `areaTematica`** — não é o campo óbvio (chama-se
  "categoria" nos dois lados), mas é o que description-mente combina: a API
  dá uma relação com nome livre (`"Segurança Alimentar"`, `"Conservação do
  Solo"`, …) e o `areaTematica` do site é exactamente o metadado temático do
  hero do detalhe.
- `imagem` → `imagem_url`, via `capaUtilizavel` (caminho relativo
  `projectos/xxx.jpg`); fallback à imagem do mock quando vem `null`.
- `equipaProjectos` → `equipa`, quando não vier vazio (ids 1–5 dos dados
  actuais): cada linha traz só `investigador_id` e `funcao_no_projecto` — o
  nome e a fotografia vêm de um segundo pedido a `GET /investigadores`
  (`InvestigadoresService.listar()`, já integrado — ver secção
  `investigadores` acima, que já apontava esta equipa como "matéria-prima de
  uma futura página de detalhe"). `funcao_no_projecto` vai para `cargo`
  (fallback ao cargo académico do investigador se vier `null`).
- `cronogramas` → `cronograma`, quando não vier vazio (nos 20 projectos
  actuais **vem sempre vazio** — nunca exercitado com dados reais; o mapeamento
  (`paraCronogramaApi`, ordena por `ordem`, normaliza `estado` para
  `'concluida'|'atual'|'futura'` com fallback `'futura'`) está escrito
  defensivamente para quando a API o vier a preencher).

**Continua a vir do `PROJETOS_MOCK`, por pedido explícito** (nenhum destes é
"a API não dá — logo esconde-se": aqui esconde-se-ia a maior parte da página
de detalhe, e foi pedido para não acontecer):

`categoria` (o `CategoriaProjecto` fechado dos filtros — a API só tem a
relação livre `categoria.nome`, sem correspondência com
`agricultura`/`meio_ambiente`/`tecnologia`/`infraestrutura`; **o selo do
filtro pode não bater com o tema real do projecto**, é um efeito colateral
conhecido de manter o filtro a funcionar sem inventar uma tabela de
correspondência), `faculdade`, `local`, `periodo`, `resultado_principal`,
`contexto`, `desafio`, `estatisticasContexto`, `imagem_contexto_url`,
`objetivoGeral`, `objetivosEspecificos`, `descricaoSolucao`, `solucoes`,
`estatisticasImpacto`, `galeria`, `documentos`, `testemunhos`, `contacto`, e
`equipa`/`cronograma` nos projectos em que a API os dá vazios.

**A API dá campos que o site não usa:** `categoria_id`, `meta_financeira`,
`valor_arrecadado`, `percentagem_meta`, `tipo_apoio`, `destaque`, `ativo`,
`created_at`, `updated_at`. Não há secção no desenho actual da página para
metas financeiras nem para o selo "em destaque" — fica registado para o dia
em que a faixa "Impacto do Projecto" ou o cartão quiserem mostrar dinheiro
angariado a sério em vez do `resultado_principal` do mock.

**Duplicados na tabela de projectos, mesma família já registada para
`laboratorios`/`faculdades`:** 15 das 20 linhas de `GET /projectos`
partilham o `nome` "Recuperação de Solos Degradados" e são **idênticas em
tudo** (descrição, valores financeiros, `imagem: null`, sem equipa nem
cronograma) — só o `id` e os timestamps mudam. Mostrar os 15 na grelha seria
visivelmente um erro de dados (a mesma "Recuperação de Solos Degradados"
repetida 15 vezes ao lado de 5 projectos reais e distintos), pior do que o
caso de `laboratorios` (lá a duplicação é inofensiva numa tira). `ProjetosService`
agrupa por `nome` e fica com a entrada mais "rica" (com imagem, equipa ou
cronograma) ou, em empate total como aqui, com o menor id
(`semProjectosDuplicados`) — resultado: 6 projectos na grelha (5 reais + 1
representante do grupo duplicado), ordenados por id.

**`/projetos/:id` deixou de ser prerenderizado.** Antes era
`RenderMode.Prerender` com `getPrerenderParams` a ler os 4 ids de
`PROJETOS_MOCK`; como os ids agora vêm da API (numéricos, sem lista fechada
no build), passou a `RenderMode.Server`, tal como já acontecia com
`noticias/:id` — mesmo motivo, mesmo comentário reaproveitado em
`app.routes.server.ts`. O `PROJETOS_MOCK` continua importado (agora só em
`projetos.service.ts`), por isso não foi apagado.

**Tradução automática:** `titulo`, `resumo`, `estado` e `areaTematica` entram
em `CAMPOS_TRADUZIVEIS_PROJETO` (declarado duas vezes — uma em
`desenvolvimento.component.ts` para a grelha, outra em
`detalhe-projeto.component.ts` para o projecto aberto — não há um sítio
partilhado óbvio entre as duas páginas para esta constante de 4 strings).
Na página de detalhe, os **cargos da equipa** (`membro.cargo`) também
traduzem, numa segunda `traducaoQueries.lista` à parte (mesmo padrão das
especialidades de investigador). **Limitação conhecida e aceite:** estes
campos traduzem-se sempre, mesmo nos casos raros em que vieram do mock em vez
da API (`resumo`/`estado`/`areaTematica` quando a API manda `null`, ou a
equipa/cargo de um projecto duplicado sem `equipaProjectos`) — nesse caso o
texto já está em inglês (resolvido pelo `ProjetosService` via `getTraducao`
do mock) e passaria pela MyMemory outra vez. Não acontece com os 20 projectos
actuais (todos têm `descricao`/`status`/`categoria` preenchidos), mas se a
API algum dia devolver esses campos vazios, o resultado da segunda tradução é
imprevisível — fica para quem integrar a próxima alteração de dados
confirmar se ainda é um caso não exercitado.

**SSR: funciona graças à correcção geral registada na nota de campo de
2026-09-08 mais abaixo** (`notifyManager.setScheduler`). Confirmado no
`dist`: o prerender de `/desenvolvimento` traz os três primeiros projectos
reais da API nos cartões (`Variedades de milho tolerantes à seca…`,
`Multiplicação de mandioca livre de viroses`, `Caracterização das raças
bovinas autóctones angolanas`), sem esqueleto nenhum.


## Tradução automática do conteúdo da API

**Adicionado em:** 2026-09-08. Decisão consciente que **substitui** a regra anterior
do `.claude/README.md` ("não inventes tradução no cliente para dados da API") — o
utilizador pediu-a explicitamente depois de reparar que `noticias` e `eventos`
ficavam em português com o idioma trocado para inglês. Descrição completa na
secção "Tradução automática do conteúdo da API" do `.claude/README.md`; aqui fica
só o que aconteceu ao aplicá-la.

**Infra-estrutura nova:**

- `core/api/promessa-cancelavel.ts` — extraído do `ApiService` (era uma função
  privada de `api.service.ts`) para poder ser reutilizado pelo
  `TraducaoAutomaticaService`, que também cancela pedidos pelo `signal`.
- `core/traducao/traducao-automatica.service.ts` — chama a MyMemory
  (`api.mymemory.translated.net`), sem chave de API.
- `core/traducao/traduzir-campos.ts` — `camposParaTraduzir`, `aplicarTraducao`,
  `aplicarTraducaoTextos`.
- `core/consultas/traducao.queries.ts` — `traducaoQueries.lista`.
- `environment.traducaoEmail` (vazio por omissão) — e-mail opcional para a
  MyMemory, sobe o limite diário de ~1000 para ~10000 palavras. **Não se
  preencheu com o e-mail de ninguém**: é uma decisão de quem administra o
  projecto, não do agente.

**Aplicado a (retro-integração dos recursos já ligados):**

- `pages/eventos/eventos.component.ts` — `titulo`, `descricao`, `local`.
- `pages/inicio/inicio.component.ts` — notícias (`titulo`, `resumo`, `categoria`,
  só o lado da API — o `NOTICIAS_FALLBACK` já é bilingue) e o evento em destaque
  (mesmos três campos do evento).
- `pages/detalhe-noticia/detalhe-noticia.component.ts` — `titulo`/`resumo`/`categoria`
  da notícia aberta e da lista "Outras notícias"; o `conteudo` do artigo traduz-se
  **parágrafo a parágrafo** (`aplicarTraducaoTextos`), não de uma vez, por causa do
  limite de caracteres por pedido da MyMemory.
- `pages/desenvolvimento/desenvolvimento.component.ts` — `nome`/`area` das
  unidades de investigação (laboratórios).
- `pages/formacoes/formacoes.component.ts` — `titulo`/`resumo` dos
  treinamentos, só na 1ª sessão (integrado directamente com tradução, não em
  retro-integração — ver secção `treinamentos` acima).
- `pages/hub-unagro/hub-unagro.component.ts` — `nome`/`categoria`/`descricao`
  das startups, só na 1ª sessão (integrado directamente com tradução, não em
  retro-integração — ver secção `startups` acima).

**Por verificar num navegador real:** a tradução em si (chamada de rede à
MyMemory, texto a aparecer trocado ao mudar de idioma) não foi testada num
browser durante esta sessão — só o build/prerender, que correm sempre em
português (`IDIOMA_PADRAO`) e por isso nunca chegam a chamar a MyMemory.
Confirmar manualmente: abrir `/eventos` e `/`, trocar para inglês, e ver se o
texto muda (alguns segundos de atraso são esperados — é um pedido de rede por
frase, sem *loading state* próprio, o texto em português fica visível até a
tradução chegar).

**2026-09-08, à tarde: "os recursos integrados não traduzem ao trocar de
idioma" — não era bug de código, era a quota grátis da MyMemory esgotada.**
`curl "https://api.mymemory.translated.net/get?q=...&langpair=pt|en"`
respondia **HTTP 429** ("YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR
TODAY..."). O `HttpClient` trata qualquer resposta não-2xx como erro, cai no
`catch` de `traduzirTexto` (`traducao-automatica.service.ts`) e devolve o
texto original — exactamente como desenhado ("nunca partir a lista por causa
de uma frase"), só que com a quota esgotada **toda** frase falha, e o
resultado visível é indistinguível de "não traduz". A arquitectura em si
(queryKey com o idioma, `enabled: idioma !== 'pt'`, `aplicarTraducao`/
`aplicarTraducaoTextos`) foi revista em `eventos`, `hub-unagro` e
`faculdades-departamentos` e reage correctamente à troca de idioma — não há
nada para corrigir no código. **Causa provável:** `environment.traducaoEmail`
tinha ficado vazio de propósito (ver acima), por isso o limite diário era o
mais baixo (~1000 palavras), esgotado ao testar os seis recursos ligados
nesta sessão. **Resolvido preenchendo `traducaoEmail` com
`admiro.andre@evolium.ao`** em `environment.ts` e
`environment.production.ts` — confirmado com o mesmo `curl` acrescentando
`&de=admiro.andre@evolium.ao`: passou a responder 200. **Lição:** quando a
tradução automática "não aparece", testar primeiro o próprio endpoint da
MyMemory com `curl` antes de mexer no código Angular — um 429 ali explica
tudo e poupa tempo a vasculhar `injectQuery`/`computed`.

**Problema entretanto encontrado (não relacionado com tradução, mas apanhado ao
mexer nestes ficheiros): `core/dados/eventos.mock.ts` continuava por apagar.**
O registo da integração de `eventos` (secção acima) tinha dito "Mock apagado",
mas o ficheiro ainda lá estava, com a forma bilingue antiga (`{pt, en}`), e
partiu o build assim que se tentou compilar de novo (`Evento.titulo` já não
aceita esse tipo). Apagado agora. **Lição:** o relatório de um agente sobre o
que fez não é garantia de que aconteceu — vale a pena confirmar com
`git status`/`ls` antes de dar como adquirido.

## Notas de campo

**2026-09-04, ~13h50: a tabela de notícias da API ficou vazia.** `GET /noticias` devolve
`data: []` e os ids 1 a 5 (que existiam uma hora antes) dão 404. Não é um problema do
site: com a lista vazia, a secção da página inicial e a coluna "Outras notícias" passam
ao conteúdo de recurso, que é o comportamento pedido. Convém confirmar do lado do Laravel
se a base foi reposta ou remigrada.

**2026-09-04, ~15h45: resolvido do lado da API.** A tabela voltou a ter as 5 notícias e o
`capa_url` passou a vir com o host correcto (`http://192.168.1.252:8000/storage/...`) em
vez de `localhost` — as fotografias já carregam no site. O guarda `capaUtilizavel` do
`NoticiasService` deixou de disparar sozinho, como estava previsto; fica lá para o caso
de o `APP_URL` voltar a apontar para `localhost`.

**2026-09-08: a API passou a devolver `capa_url` como caminho relativo** (`eventos/xxx.jpg`,
`noticias/xxx.jpg`, `laboratorios/xxx.jpg` — sem host nem `/storage/`), em vez do URL
absoluto de antes. Todas as imagens dos três recursos ficaram partidas ao mesmo tempo,
porque os três passam pelo mesmo `capaUtilizavel` (`core/api/capa-utilizavel.ts`), que só
sabia tratar URLs absolutos (guardando o caso `localhost`) e devolvia o caminho relativo
tal e qual — o `<img src>` ficava `eventos/xxx.jpg`, relativo à página, em vez do ficheiro
no `storage`. **Corrigido no próprio `capaUtilizavel`**: quando o valor não começa por
`http(s)://`, prefixa-se com `environment.apiUrl` sem o `/api` final mais `/storage`
(`RAIZ_STORAGE`). Continua a aceitar o caso absoluto (incluindo o guarda de `localhost`)
para não regredir se a API voltar a mandar URL completo. **Corrige-se aqui e não em cada
serviço** pela mesma razão do guarda de `localhost`: é um problema da API, comum a todos
os recursos com imagem — só falta aplicar quando um recurso novo tiver `capa_url` e ainda
não usar esta função.


**2026-09-08: porque o conteúdo da API não aparecia no HTML do servidor — causa
encontrada e corrigida.** Todas as entradas acima até `startups` registaram o mesmo
sintoma: o prerender e o SSR saíam com os esqueletos e sem dados, apesar de o pedido
ser feito do lado do servidor e responder. **A causa não é o `PendingTasks` do
adaptador — é o agendador do `notifyManager` do `query-core`.** Ele avisa os
subscritores (e portanto escreve os sinais do `injectQuery`) dentro de um
`setTimeout(cb, 0)` (`defaultScheduler` = `systemSetTimeoutZero`, query-core 5.102).
Quando um `GET` termina, a tarefa pendente que o `HttpClient` registou é libertada
no mesmo instante; se não houver outro pedido em voo, o Angular dá a aplicação por
estável e serializa o HTML **antes** de esse `setTimeout` correr. Foi confirmado com
`console.log` datado nos dois serviços de `/desenvolvimento`: os laboratórios
(a responder primeiro) apareciam no HTML e os investigadores (a responder 300 ms
depois, já sem ninguém a segurar a estabilidade) não — **quem perdia era sempre a
última query a responder**, o que explica páginas de uma só query saírem
completamente vazias.

**Corrigido em `src/app/app.config.server.ts`** (só no servidor), com um
`provideEnvironmentInitializer` que faz
`notifyManager.setScheduler((avisar) => queueMicrotask(avisar))`: o sinal passa a ser
escrito antes de o Angular avaliar a estabilidade, a vista fica suja e o agendador de
detecção de mudanças registra a sua própria tarefa pendente, pelo que o render espera
pelo ciclo que põe os dados no HTML. **Não guarda estado nenhum por pedido** — o
`notifyManager` é global ao processo Node e não pode conhecer o `PendingTasks` de um
visitante em particular, por isso a correcção é só de agendamento (a alternativa,
segurar uma tarefa pendente por notificação, vazaria a instância de um pedido para o
seguinte). No navegador fica o `setTimeout` por omissão, que agrupa melhor os avisos.

Verificado no `dist` do mesmo build: `/desenvolvimento` (investigadores e
laboratórios), `/` (notícias), `/eventos`, `/formacoes` (treinamentos) e
`/hub-unagro` (startups) passaram todos a sair **sem um único esqueleto** e com o
conteúdo da API no HTML. Quem integrar um recurso novo já pode contar com o
prerender: se sair vazio, é problema desse recurso e não desta corrida.
