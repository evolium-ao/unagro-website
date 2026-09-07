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
