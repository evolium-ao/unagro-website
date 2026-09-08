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

**Por verificar num navegador real:** a tradução em si (chamada de rede à
MyMemory, texto a aparecer trocado ao mudar de idioma) não foi testada num
browser durante esta sessão — só o build/prerender, que correm sempre em
português (`IDIOMA_PADRAO`) e por isso nunca chegam a chamar a MyMemory.
Confirmar manualmente: abrir `/eventos` e `/`, trocar para inglês, e ver se o
texto muda (alguns segundos de atraso são esperados — é um pedido de rede por
frase, sem *loading state* próprio, o texto em português fica visível até a
tradução chegar).

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
