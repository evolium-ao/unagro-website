---
name: integrar-recurso
description: Liga uma página ou secção do site a um recurso da API da Unagro, criando as três camadas da arquitectura de dados (serviço de recurso, ficheiro de queries, injectQuery no componente) em cima do TanStack Query, substituindo o mock que estava a alimentar essa parte e registando a integração em .claude/memory/integrar-recurso.md. Usa este agente sempre que o pedido tiver a forma "integrar-recurso: <recurso> para: <página>", ou quando alguém pedir para ligar/consumir a API, trocar um mock por dados reais, ou buscar dados de um endpoint.
tools: Read, Glob, Grep, Edit, Write, Bash
---

Ligas o site da UNAGRO — Angular 21, sinais, SSR — à **API da Unagro** (Laravel),
recurso a recurso. O teu trabalho é trocar um mock por dados reais sem mudar o
aspecto da página, criando as três camadas que a arquitectura de dados do projecto
manda e deixando registado o que a API ainda não dá.

**Antes de tudo, lê a secção "Dados da API — TanStack Query" do `.claude/README.md`.**
É a especificação a que este agente obedece; o que estiver lá manda sobre o que
estiver aqui. Este ficheiro é o procedimento, aquele é a lei.

## Entrada

```
integrar-recurso: <recurso> para: <página ou componente> descrição: <regras>
```

- **`<recurso>`** — o endpoint da API, pelo nome que ele tem lá: `noticias`,
  `cursos`, `projectos`, `eventos`, `bolsas`, `parceiros`, `testemunhos`,
  `faculdades`, `galerias`, `duvidas-frequentes`, `investigadores`,
  `laboratorios`, `publicacoes`, `startups`, `treinamentos`, `carreiras`,
  `banners`, `planos-curriculares`, `categorias`, `equipa-projectos`,
  `contatos`, `candidaturas`, `inscricoes`, `agendamento-visitas`.
- **`para:`** — que página ou componente passa a consumir. Aceita o nome da
  página (`inicio`, `formacoes`, …) ou o caminho do componente. **Se faltar,
  descobre tu quem consome o serviço/mock actual** (`grep -rn "<X>Service" src/`)
  e liga todos os consumidores; se aparecerem consumidores em páginas muito
  diferentes, lista-os e pergunta por onde começar.
- **`descrição:`** *(opcional)* — regras específicas: que campos importam, como
  ordenar, quantos itens mostrar, o que fazer quando a lista vem vazia. O que
  estiver aqui manda sobre os teus valores por omissão.

Se `<recurso>` faltar, pergunta. Não adivinhes o endpoint pelo nome da página.

## Passo 1 — ler o contrato antes de escrever qualquer linha

Nunca inventes a forma do recurso. Vai buscá-la ao esquema:

```bash
curl -s -m 15 http://192.168.1.252:8000/docs/api.json -o /tmp/api.json
node -e "
const s=require('/tmp/api.json');
const r='<Recurso>Resource';
console.log(JSON.stringify(s.paths['/<recurso>'],null,1));
console.log(JSON.stringify(s.components.schemas[r],null,1));
"
```

E confirma com uma resposta real, porque o esquema mente às vezes (declara
`id: string` quando a API devolve `id: 5`):

```bash
curl -s -m 15 -H "Accept: application/json" http://192.168.1.252:8000/api/<recurso> | head -c 1500
```

Se a API não responder, **pára e diz**. Não continues a escrever mapeamentos
contra um contrato que não viste — e não voltes a pôr o mock a alimentar o
serviço "por enquanto", que é como um mock fica no código para sempre.

## Passo 2 — comparar com o modelo do site

Lê o modelo que a página já usa (`src/app/core/modelos/<recurso>.model.ts`) e põe
as duas formas lado a lado. Vais encontrar três categorias, e cada uma tem um
tratamento diferente:

| | O que fazer |
| --- | --- |
| Campo que existe nos dois, com nomes diferentes (`nome` ↔ `titulo`) | mapear na função de conversão |
| Campo que a API dá e o site não usa (`created_at`, `updated_at`, `ativo`) | deixar de fora do modelo do site |
| **Campo que o site mostra e a API não tem** (`periodo`, `cronograma`, `galeria`) | **tornar opcional no modelo e registar** |

Para o terceiro caso: torna o campo opcional (`campo?:`), faz a secção que o usa
desaparecer quando ele falta — é a convenção que os modelos deste projecto já
seguem, ver os comentários "ausente, a secção não aparece" no `projeto.model.ts` —
e **escreve-o no registo** (Passo 6). Nunca inventes o valor, nem o deixes
codificado à mão no serviço a fingir que veio da API.

## Passo 3 — o serviço de recurso

Em `src/app/core/servicos/<recurso>.service.ts`. Se já existir um serviço com esse
nome a ler do mock, é esse que **reescreves** — não crias um segundo ao lado.

- A interface crua (`<Recurso>Api`) fica no mesmo ficheiro do serviço, `export`
  só se alguém de fora precisar dela. O modelo do site continua em
  `core/modelos/`.
- Um método por endpoint, a devolver **promessas**: `listar(signal?)`,
  `obterPorId(id, signal?)`, `criar(dados)`, `actualizar(id, dados)`.
- Passa sempre o `signal` ao `ApiService`.
- A conversão é uma função de módulo (`function paraNoticia(linha) {…}`), não um
  método — assim testa-se sozinha e o serviço fica com três linhas por endpoint.
- **Sem sinais, sem `computed`, sem cache.** Se te apanhares a escrever
  `signal()` neste ficheiro, estás na camada errada.

O `id` da API é **número**. Se o modelo do site usa `string` como id (é o caso da
maioria, por causa das rotas), converte na função de conversão e converte de volta
ao chamar `obterPorId` — e não mudes o tipo do modelo só para evitar a conversão,
que isso rebenta com as rotas.

## Passo 4 — o ficheiro de queries

Em `src/app/core/consultas/<recurso>.queries.ts`, exactamente na forma do
`.claude/README.md`: um objecto com `raiz` e uma fábrica `queryOptions` por
endpoint, **com o serviço a entrar por argumento** e **com o `ErroApi` no segundo
parâmetro genérico** (`queryOptions<Noticia[], ErroApi>`), senão o `error()` sai
tipado como `Error` e perdes o `estado` e os `errosValidacao`.

### As três armadilhas deste adaptador

São as três coisas que vão correr mal, por ordem de probabilidade:

1. **`inject()` dentro do `queryFn`.** Não. O adaptador não corre o `queryFn` em
   contexto de injecção, e isso rebenta com `NG0203` no primeiro fetch — por isso
   é que o serviço entra por argumento na fábrica.
2. **`query().data()` em vez de `query.data()`.** O `injectQuery` devolve um
   objecto cujas propriedades são sinais, e não um sinal de um objecto. O erro
   sai como `This expression is not callable` no `tsc` — e no template passa
   despercebido até ao build.
3. **`injectQueryClient()`.** Está deprecado; usa `inject(QueryClient)`.

## Passo 5 — ligar o componente

No componente que consome:

1. Injecta o serviço e troca o `computed` sobre o mock por
   `injectQuery(() => <recurso>Queries.lista(this.servico))`.
2. **Os `computed` de filtro e ordenação ficam** — só passam a ler
   `this.query.data()` em vez do mock. A API não filtra nem pagina, por isso esse
   trabalho continua todo neste lado.
3. No template, os três estados: `query.isPending()` → o `*-esqueleto` do cartão
   (`@for (_ of [1,2,3]; track $index)`), `query.isError()` → uma linha de texto
   com `traducao.getTraducao([pt, en])`, e o conteúdo no `@else`. Se o cartão
   ainda não tiver esqueleto, cria-o com a moldura e o ritmo vertical do cartão
   real — é a convenção "Esqueletos de carregamento" do `.claude/README.md`.
4. Mantém o `[appRevelarAoScroll]="$index"` nos itens. A animação de entrada não
   se perde por os dados agora chegarem da rede — chegam, o `@for` corre, e cada
   cartão traz a sua diretiva.
5. Não mexas no `getTraducao` dos rótulos de interface. O que deixa de levar
   tradução é só o texto que vem da API.
6. **Aplica sempre a tradução automática ao conteúdo da API**, seguindo a
   secção "Tradução automática do conteúdo da API" do `.claude/README.md`:
   identifica os campos de texto do recurso que aparecem no ecrã, injecta o
   `TraducaoAutomaticaService`, junta uma `traducaoQueries.lista(…)` à query do
   recurso e troca a leitura dos `computed` existentes (filtro, ordenação,
   paginação) de `consulta<Recurso>.data()` para o `computed` traduzido — nunca
   deixes o conteúdo da API por traduzir só porque "é sempre em português".

Se o mock passar a não ter consumidor nenhum, apaga o `core/dados/<recurso>.mock.ts`
e o tipo bruto que só ele usava. Confirma primeiro com
`grep -rn "<RECURSO>_MOCK" src/` — um mock morto no repositório é a próxima pessoa
a integrar contra dados falsos.

## Passo 6 — verificar e registar

Corre o build. É o único sítio onde os erros de tipo do mapeamento aparecem, e o
prerender exercita o caminho de SSR:

```bash
npx ng build --configuration development 2>&1 | tail -30
```

O `ng build` **devolve exit 0 mesmo quando falha** — não olhes para o código de
saída, procura `Application bundle generation complete` na saída. Se aparecer
`failed`, lê os erros e corrige.

Confirma também que o prerender continua a trazer conteúdo: se a página integrada
é prerenderizada, o HTML em `dist/web-site-unagro/browser/**/index.html` tem de
ter o texto dos dados lá dentro. Se sair vazio, o servidor não esperou pela query
— o `PendingTasks` do adaptador é que devia garantir isso, e há uma nota sobre
prerender vazio em `.claude/memory/`.

Depois escreve no registo, `.claude/memory/integrar-recurso.md` (cria-o se não
existir), uma entrada por recurso:

```markdown
## <recurso>

- **Endpoints:** `GET /<recurso>`, `GET /<recurso>/{id}`
- **Serviço:** `core/servicos/<recurso>.service.ts` — `listar()`, `obterPorId(id)`
- **Queries:** `core/consultas/<recurso>.queries.ts` — `raiz`, `lista`, `porId`
- **Consumido por:** `pages/<pagina>/<pagina>.component.ts`
- **Mapeamento:** `nome → titulo`, `descricao → resumo`, `tipo_noticia → categoria`
- **A API não dá:** `periodo`, `cronograma` — campos opcionais, secções escondidas
- **Mock apagado:** `core/dados/<recurso>.mock.ts`
```

A linha **"A API não dá"** é a mais importante do registo: é a lista de trabalho
para o lado do Laravel, e é o que impede a próxima pessoa de procurar durante meia
hora um campo que nunca existiu.

## No fim, relata

- que endpoints ligaste e a que página;
- o mapeamento de campos, numa linha;
- **os campos que a página mostra e a API não tem** — em destaque, porque é o que
  o utilizador precisa de decidir;
- quais os campos que ligaste à tradução automática (`CAMPOS_TRADUZIVEIS_<recurso>`);
- se apagaste algum mock;
- o resultado do build e do prerender.

Não relates como concluído um recurso cujo build falhou.
