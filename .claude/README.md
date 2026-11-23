# Regras do projecto

## Traduções

Evita `traducao.t()` para textos ou frases pequenas — em vez disso usa
`traducao.getTraducao([pt, en])`. As chaves de dicionário ficam para texto
estrutural e reutilizado.

## Modelos de dados vindos da API

As interfaces em `core/modelos/*.model.ts` que espelham uma linha da API (ex.:
`Projeto`) só têm campos de **texto simples** (`string`) — nunca `TextoBilingue`
nem `TextoTraduzido`. A API real devolve o texto já traduzido, não um par
bilingue, e a interface tem de espelhar essa forma.

O mock que simula essa API guarda os dois idiomas num tipo "bruto" à parte
(ex.: `ProjetoBruto`, com campos `TextoBilingue`), no ficheiro `dados/*.mock.ts`.
É o `*.service.ts` correspondente que traduz do bruto para a forma da API, com
`traducao.getTraducao(...)` dentro de um `computed` — o mesmo sítio onde, mais
tarde, entraria a chamada HTTP:

```ts
// core/dados/projetos.mock.ts — dados brutos, bilingues
export interface ProjetoBruto {
  titulo: TextoBilingue;
  // ...
}
export const PROJETOS_MOCK: ProjetoBruto[] = [{ titulo: ['Título', 'Title'] /* ... */ }];

// core/servicos/projetos.service.ts — traduz para a forma da API
readonly projetos = computed<Projeto[]>(() =>
  PROJETOS_MOCK.map((projeto) => ({
    ...projeto,
    titulo: this.traducao.getTraducao(projeto.titulo),
  })),
);
```

Os componentes que consomem o serviço recebem sempre texto já resolvido — não
chamam `getTraducao` para dados vindos da API. A excepção são rótulos de UI que
não vêm do serviço (ex.: `ROTULOS_CATEGORIA_PROJECTO`, os nomes dos filtros):
esses continuam `TextoBilingue`, resolvidos com `getTraducao` onde são usados.

## Animações — sempre com Motion

**Toda a animação do site é feita com o Motion (pacote `motion`).** Não escrevas
`transition-*`/`animate-*` do Tailwind nem `@keyframes` para animar entradas,
revelações ao scroll, ou reacções a interacção. Única excepção: a pulsação dos
esqueletos de carregamento, que continua a ser `animate-pulse` do Tailwind —
é um ciclo infinito e em CSS não custa nada.

### Entrada de cartões e listas

Usa a diretiva `appRevelarAoScroll`
(`src/app/shared/diretivas/revelar-ao-scroll.directive.ts`): revela o elemento de
baixo para cima quando ele entra no ecrã. O valor é a posição no lote e multiplica
o atraso, o que dá a cascata:

```html
@for (item of itensVisiveis(); track item.id) {
  <app-cartao-x [x]="item" [appRevelarAoScroll]="$index % itensPorPagina" />
}
```

O `% itensPorPagina` é o que faz a cascata **reiniciar em cada lote**: sem ele o
atraso cresce sem fim e a quinta página entraria com segundos de espera. Cartões
criados depois animam sozinhos, porque cada um traz a sua instância da diretiva.

### Ao escrever animação nova

- Importa o Motion **dinamicamente dentro de `afterNextRender`**
  (`const { animate } = await import('motion')`). Mantém-no fora do bundle do
  servidor e garante que só corre no navegador.
- Respeita `prefers-reduced-motion: reduce` — nesse caso não animes, mostra.
- Deixa sempre uma salvaguarda que revela o conteúdo se a animação não chegar a
  correr. Conteúdo escondido à espera de JS que falhou é conteúdo perdido.
- Não escondas conteúdo no HTML renderizado no servidor: esconde-o no navegador,
  antes da primeira pintura, para o prerender continuar a ter texto.

## Esqueletos de carregamento

Cada cartão com carregamento assíncrono tem o seu `*-esqueleto` a acompanhar
(ex.: `cartao-projecto` / `cartao-projecto-esqueleto`), com a mesma moldura e o
mesmo ritmo vertical do cartão real, para a grelha não saltar quando os dados
chegam. O esqueleto é decoração: `aria-hidden="true"`, sem texto nem foco.

## Dados da API — TanStack Query

O site lê os dados da **API da Unagro** (Laravel) através do
[TanStack Query](https://tanstack.com/query/latest/docs/framework/angular/overview),
no adaptador `@tanstack/angular-query-experimental`.

> **A versão está fixada sem `^` de propósito.** O adaptador de Angular ainda é
> experimental e a própria documentação avisa que quebra a compatibilidade em
> releases *minor* **e** *patch*. Não lhe ponhas o `^` de volta; para actualizar,
> muda o número à mão e corre o build.

### A API

|  |  |
| --- | --- |
| Raiz | `http://192.168.1.252:8001/api` — em `environment.apiUrl` |
| Documentação | `http://192.168.1.252:8001/docs/api` — esquema OpenAPI em bruto em `/docs/api.json` |
| Envelope | toda a resposta vem como `{ status, message, data }`; o `ApiService` devolve só o `data` |
| Leitura | os `GET` são **públicos**, sem autenticação |
| Escrita | `POST`/`PUT`/`DELETE` pedem `Authorization: Bearer <token>` (`POST /login`) |
| Erros | Laravel por omissão — `{ message, exception, … }`; o `ErroApi` normaliza isto |

Três coisas que a API **não** faz, e que moldam o código deste lado:

1. **Não tem paginação nem filtros.** `GET /noticias` devolve tudo. Filtrar,
   ordenar e paginar é trabalho deste lado, num `computed` sobre os dados da query.
2. **É monolingue — devolve só português.** Não há parâmetro `?lang=` nem
   `Accept-Language`. A regra de "Modelos de dados vindos da API" acima descreve o
   alvo (texto já traduzido pela API), mas **esta** API ainda não o cumpre: em
   inglês, o conteúdo editorial viria em português. Por isso o site traduz esse
   conteúdo do lado do cliente — ver "Tradução automática do conteúdo da API"
   mais abaixo — em vez de mostrar português com o idioma em inglês.
3. **A forma dos recursos não é a dos modelos do site.** O `ProjectoResource` tem
   `nome`, `categoria_id`, `valor_arrecadado`; o `Projeto` do site tem `titulo`,
   `periodo`, `cronograma`. Traduzir entre as duas formas é o trabalho do serviço
   de recurso (a seguir) — e vai deixar campos do site a descoberto, que se
   **registam** em vez de se inventarem.

### A arquitectura em três camadas

```
ApiService            fala HTTP, desembrulha o envelope, devolve promessas
   ↓
*.service.ts          um método por endpoint; mapeia a forma da API → modelo do site
   ↓
*.queries.ts          queryOptions(): a chave da cache + o queryFn
   ↓
injectQuery()         no componente, dá sinais
```

Cada camada só conhece a de baixo. Nenhum componente injecta o `ApiService`, e
nenhum serviço de recurso sabe o que é uma cache.

#### 1. `core/api/` — a infra-estrutura (está feita; não se mexe por recurso)

- `api.service.ts` — `get`/`post`/`put`/`delete`, com `parametros` e `signal`.
- `resposta-api.ts` — o envelope `{ status, message, data }`.
- `erro-api.ts` — o `ErroApi` que sai de `query.error()`, com `estado`,
  `naoEncontrado` e `errosValidacao` (os 422 do Laravel).
- `cliente-consultas.ts` — o `QueryClient` e os valores por omissão de todas as
  queries: `staleTime` 5 min, `gcTime` 30 min, `retry` 1, sem refetch ao focar a
  janela.

#### 2. `core/servicos/<recurso>.service.ts` — o serviço de recurso

Um método por endpoint. Devolve **promessas** do modelo do site, recebe o `signal`
e passa-o ao `ApiService`. Sem sinais, sem `computed`, sem cache — é uma função de
dados, e é ela que vai directa para o `queryFn`.

```ts
/** Espelha o `NoticiaResource` do OpenAPI — a forma crua, antes do mapeamento. */
interface NoticiaApi {
  id: number;
  titulo: string;
  descricao: string;
  conteudo: string;
  capa_url: string;
  data_publicacao: string;
  tipo_noticia: string;
  destaque: boolean;
}

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly api = inject(ApiService);

  listar(signal?: AbortSignal): Promise<Noticia[]> {
    return this.api
      .get<NoticiaApi[]>('noticias', { signal })
      .then((linhas) => linhas.map(paraNoticia));
  }

  obterPorId(id: number, signal?: AbortSignal): Promise<Noticia> {
    return this.api.get<NoticiaApi>(`noticias/${id}`, { signal }).then(paraNoticia);
  }
}

/** Onde se corrigem nomes de campos e se convertem datas. */
function paraNoticia(linha: NoticiaApi): Noticia {
  return {
    id: String(linha.id),
    titulo: linha.titulo,
    resumo: linha.descricao,
    categoria: linha.tipo_noticia,
    data: linha.data_publicacao,
    destaque: linha.destaque,
  };
}
```

A interface crua (`NoticiaApi`) vive junto do serviço, não em `core/modelos/` — o
que está em `core/modelos/` é a forma do **site**, que é a que os componentes vêem.

#### 3. `core/consultas/<recurso>.queries.ts` — as chaves e as queries

Um objecto com fábricas `queryOptions`. É aqui que as `queryKey` vivem — todas no
mesmo sítio, para se poderem invalidar e pré-carregar de qualquer lado.

**A fábrica recebe o serviço por argumento.** Não chames `inject()` dentro do
`queryFn`: o adaptador não corre o `queryFn` em contexto de injecção, e o
`inject()` rebenta com `NG0203` no primeiro fetch.

```ts
export const noticiasQueries = {
  /** Prefixo de todas as chaves de notícias — invalida a lista e os detalhes de uma vez. */
  raiz: ['noticias'] as const,

  lista: (servico: NoticiasService) =>
    queryOptions<Noticia[], ErroApi>({
      queryKey: [...noticiasQueries.raiz, 'lista'],
      queryFn: ({ signal }) => servico.listar(signal),
    }),

  porId: (servico: NoticiasService, id: number) =>
    queryOptions<Noticia, ErroApi>({
      queryKey: [...noticiasQueries.raiz, 'detalhe', id],
      queryFn: ({ signal }) => servico.obterPorId(id, signal),
    }),
};
```

Dois detalhes que valem os caracteres que custam:

- **O `signal`** que o `queryFn` recebe é o que cancela o pedido quando a query é
  descartada ou refeita — passa-o sempre.
- **O `ErroApi` no segundo parâmetro genérico.** Sem ele, `query.error()` vem
  tipado como `Error` e perdes o `estado`, o `naoEncontrado` e os
  `errosValidacao` no template.

#### 4. No componente — `injectQuery`

```ts
export class NoticiasComponent {
  private readonly servico = inject(NoticiasService);

  readonly noticias = injectQuery(() => noticiasQueries.lista(this.servico));

  /** Filtrar e ordenar é aqui, num computed sobre os dados da query. */
  readonly emDestaque = computed(() => this.noticias.data()?.filter((n) => n.destaque) ?? []);
}
```

`injectQuery` devolve **um objecto cujas propriedades são sinais** — e não um
sinal de um objecto. Escreve-se `noticias.data()`, `noticias.isPending()`,
`noticias.isError()`, `noticias.error()`, `noticias.isFetching()`. Um
`noticias().data()` não compila (`This expression is not callable`), e é o erro
que se comete uma vez por pessoa.

No template, os três estados, com o esqueleto que o cartão já tem:

```html
@if (noticias.isPending()) {
  @for (_ of [1, 2, 3]; track $index) {
    <app-cartao-noticia-esqueleto />
  }
} @else if (noticias.isError()) {
  <p>{{ traducao.getTraducao(['Não foi possível carregar as notícias.', 'Could not load the news.']) }}</p>
} @else {
  @for (noticia of noticias.data(); track noticia.id) {
    <app-cartao-noticia [noticia]="noticia" [appRevelarAoScroll]="$index" />
  }
}
```

O `isPending()` e o `isError()` **estreitam o tipo** dentro do respectivo ramo:
depois de `@else if (noticias.isError())`, o `noticias.error()` já é um `ErroApi`
e não `ErroApi | null` — escreve `noticias.error().estado`, sem `?.`, ou o
compilador avisa-te (NG8107).

O estado de carregamento nunca é página em branco: é o `*-esqueleto` do cartão,
pela mesma razão que ele existe (ver "Esqueletos de carregamento").

#### Parâmetros reactivos

Quando a query depende de um sinal, lê-o **dentro** da função passada ao
`injectQuery` — é isso que faz a query refazer-se quando ele muda. E mete-o na
`queryKey`, senão a cache devolve o resultado da chave anterior:

```ts
readonly id = input.required<string>();
readonly noticia = injectQuery(() => noticiasQueries.porId(this.servico, Number(this.id())));
readonly titulo = computed(() => this.noticia.data()?.titulo ?? '');
```

Para não disparar antes de haver valor, junta `enabled`:

```ts
readonly noticia = injectQuery(() => ({
  ...noticiasQueries.porId(this.servico, Number(this.id())),
  enabled: !!this.id(),
}));
```

#### Escrever — formulários de contacto, candidaturas, inscrições

`injectMutation` para os `POST`, e invalidar o que ficou desactualizado:

```ts
/** `inject(QueryClient)` — o `injectQueryClient()` está deprecado. */
private readonly cliente = inject(QueryClient);

readonly enviar = injectMutation(() => ({
  mutationFn: (dados: NovoContacto) => this.contactosService.criar(dados),
  onSuccess: () => this.cliente.invalidateQueries({ queryKey: contactosQueries.raiz }),
}));

// no submit:      this.enviar.mutate(dados)
// no template:    this.enviar.isPending() / .isError() / .isSuccess()
```

Tal como nas queries, o resultado é um objecto de sinais: `enviar.mutate(…)`,
`enviar.isPending()`. Os erros de validação do Laravel chegam em
`enviar.error()?.errosValidacao`, na forma `{ campo: [mensagens] }`, prontos a
ligar aos campos do formulário.

### SSR — o que já está resolvido, e o que não está

- **O servidor espera pelas queries.** O adaptador liga-se ao `PendingTasks` do
  Angular, por isso o HTML renderizado no servidor já sai com os dados. Não
  precisas de fazer prefetch à mão.
- **O navegador não repete os pedidos.** A cache de transferência do
  `provideClientHydration` (ligada por omissão) manda as respostas dos `GET` no
  HTML, e a hidratação serve-se delas.
- **Cada pedido tem a sua cache.** O `QueryClient` é fornecido por
  `InjectionToken`, não por `new QueryClient()` dentro do `appConfig` — a razão
  está comentada no `cliente-consultas.ts` e é importante: com a segunda forma
  seria uma cache única partilhada por todos os visitantes do servidor.
- **`environment.apiUrl` tem de ser alcançável pelo processo Node**, não só pelo
  navegador — é o Node que faz os pedidos durante o render e o prerender.
- **Aviso conhecido:** os `capa_url`/`imagem_url` que a API devolve apontam para
  `http://localhost:8000/storage/…`. Fora da máquina da API essas imagens não
  carregam — falta corrigir o `APP_URL` do lado do Laravel.

### Tradução automática do conteúdo da API

A API é monolingue (ponto 2 acima). Em vez de mostrar português quando o
idioma escolhido é inglês, o site traduz automaticamente os campos de texto
que vêm da API, usando a **MyMemory** (`api.mymemory.translated.net`) — não
pede chave, e aceita um e-mail opcional em `environment.traducaoEmail` para
subir o limite diário (~1000 → ~10000 palavras).

**As três camadas, em `core/traducao/`:**

- `traducao-automatica.service.ts` — `TraducaoAutomaticaService.traduzirLista(textos, idioma, signal)`,
  uma chamada por texto (em paralelo). Um texto vazio devolve `''` sem chamar a
  API; uma tradução que falhe devolve o texto original — nunca rejeita a lista
  toda por causa de uma frase.
- `traduzir-campos.ts` — `camposParaTraduzir(itens, campos)` achata os campos
  pedidos de uma lista de itens da API numa única lista de strings (a ordem é
  `item0.campo0, item0.campo1, …`); `aplicarTraducao(itens, campos, traduzidos)`
  desfaz o achatamento, devolvendo os itens com os campos traduzidos no lugar
  dos originais. `aplicarTraducaoTextos(originais, traduzidos)` é a mesma ideia
  para uma lista de textos soltos (por exemplo, os parágrafos do corpo de um
  artigo, para não mandar o artigo inteiro numa só chamada).
- `core/consultas/traducao.queries.ts` — `traducaoQueries.lista(servico, textos, idioma)`,
  uma query por lista de textos, com `staleTime`/`gcTime` em `Infinity` (uma
  tradução não fica desactualizada sozinha) e `enabled: idioma !== 'pt'`.

**No componente**, ao lado da query normal do recurso — não a troca, junta-se-lhe:

```ts
private readonly consultaTraducaoEventos = injectQuery(() =>
  traducaoQueries.lista(
    this.servicoTraducaoAutomatica,
    camposParaTraduzir(this.consultaEventos.data() ?? [], CAMPOS_TRADUZIVEIS_EVENTO),
    this.traducao.idioma(),
  ),
);

private readonly eventosTraduzidos = computed(() =>
  aplicarTraducao(this.consultaEventos.data() ?? [], CAMPOS_TRADUZIVEIS_EVENTO, this.consultaTraducaoEventos.data()),
);
```

Os `computed` de filtro, ordenação e paginação que já existiam passam a ler
`eventosTraduzidos()` em vez de `consultaEventos.data()` — o resto do
componente não muda.

**Regras para quando um recurso novo mostra conteúdo da API:**

1. Só os campos de texto que aparecem no ecrã entram em `CAMPOS_TRADUZIVEIS_<recurso>`
   — não traduzir `id`, datas, URLs, nem campos que o site não mostra.
2. **Enquanto o idioma é português, a tradução nem chama a API** (`enabled: idioma !== 'pt'`)
   — não há custo nem pedido extra no caminho mais comum.
3. Um corpo de artigo longo (`conteudo`) traduz-se **parágrafo a parágrafo**
   (`aplicarTraducaoTextos` sobre a lista já dividida), não o texto inteiro
   de uma vez — a MyMemory tem um limite de caracteres por pedido.
4. Uma lista que combina dados da API com conteúdo de recurso local (como o
   `NOTICIAS_FALLBACK` de `inicio`) só traduz o lado da API — o conteúdo de
   recurso já é bilingue por `localizarProfundo`, traduzi-lo outra vez
   inventaria uma segunda tradução em cima da primeira.
5. Como o SSR renderiza sempre em português (`IDIOMA_PADRAO`), a tradução
   nunca corre no servidor nem no prerender — só depois de o visitante trocar
   de idioma no navegador.

### Devtools

Em `ng serve` aparece o botão do TanStack Query no canto da página, com as queries
em cache, o estado de cada uma e os dados que trazem. O `withDevtools` vem do
sub-caminho `@tanstack/angular-query-experimental/devtools`, que em build de
produção resolve para um *stub* vazio — não entra no bundle de produção nem no do
servidor.

### O agente

Não integres recursos à mão: usa o agente **`integrar-recurso`**
(`.claude/agents/integrar-recurso.md`), que lê o esquema OpenAPI, cria as três
camadas e liga a página, seguindo estas regras.
