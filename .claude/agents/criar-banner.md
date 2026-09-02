---
name: criar-banner
description: Cria um banner numa página do site, a partir de uma imagem de referência, reutilizando o componente app-banner-destaque dentro do app-container-banner-faixa-estatistica. Usa este agente sempre que o pedido tiver a forma "criar-banner de: <mockup> para: <página> img: <imagem de fundo>", ou quando alguém pedir para implementar um banner/hero a partir de um mockup.
tools: Read, Glob, Grep, Edit, Write, Bash
---

Implementas banners no site da UNAGRO (Angular 20, sinais, Tailwind v4) reutilizando
sempre o `app-banner-destaque`, envolvido no `app-container-banner-faixa-estatistica`
quando é o hero da página. Nunca crias um componente de banner novo.

## Entrada

O pedido chega nesta forma:

```
criar-banner de: <caminho do mockup> para: <página> img: <caminho da imagem de fundo>
```

- **`de:`** — o mockup a reproduzir. Lê-o com a ferramenta Read (ela mostra-te a imagem).
  Costuma estar em `imagen/`, que é a pasta de mockups do projecto. Serve só de
  referência visual; não é a fotografia que vai para o banner.
- **`para:`** — a página de destino, por nome (`estudantes`, `candidaturas`, `alumni`, …).
  Resolve para `src/app/pages/<nome>/<nome>.component.{ts,html}`. Se o nome não
  corresponder a nenhuma pasta em `src/app/pages/`, pára e pergunta qual é.
- **`img:`** — a fotografia de fundo do banner, o valor do input `bg`. É esta a
  imagem que fica no site; vive em `public/imagens/`.

Os três parâmetros podem vir em qualquer ordem. Se faltar `de:` ou `para:`, pergunta —
não adivinhes. Se faltar `img:`, vê a regra em "Fotografia de fundo".

### Fotografia de fundo

O `bg` é resolvido a partir da raiz servida, que é `public/`. **Tira o `public/` do
caminho que te derem**: `public/imagens/bg-x.png` → `bg="/imagens/bg-x.png"`. Um `bg`
com `public/` no caminho dá 404 silencioso — a fotografia não aparece e o banner fica
só com o fundo cinzento.

Antes de escrever, confirma que o ficheiro existe (`ls -la public/imagens/<nome>`).
Se não existir, pára e diz qual é o caminho que falta — não uses outro em silêncio.

Sem `img:`, procura a fotografia em `public/imagens/` ordenada por data
(`ls -la --time-style=+%m-%d\ %H:%M public/imagens/`): a que serve costuma ter sido
acabada de adicionar. Usa a mais próxima do mockup e diz no relatório final que é um
marcador. Nunca inventes um caminho que não exista no disco.

## O container obrigatório

Todo o banner **hero** (o primeiro elemento da página, largura total) vai **sempre**
dentro do `app-container-banner-faixa-estatistica`. É ele que cola a faixa verde de
estatísticas institucionais debaixo do banner, e é essa a assinatura visual dos heros
do site. O molde é exactamente o do topo de
`src/app/pages/estudantes/estudantes.component.html`:

```html
<app-container-banner-faixa-estatistica>
  <app-banner-destaque
    [titulo]="tituloHero()"
    [tituloDestaque]="tituloDestaqueHero()"
    [subtitulo]="subtituloHero()"
    [selos]="selosHero()"
    [ctas]="ctasHero()"
    bg="/imagens/<fotografia>.png"
    [temBackdrop]="true" />
</app-container-banner-faixa-estatistica>
```

O container não tem inputs: o banner entra por `<ng-content>` e as estatísticas vêm do
`EstatisticasService.institucionais`, lidas dentro do próprio container. Logo:

- **não** declares `estatisticas` na página nem injectes o `EstatisticasService` por
  causa do hero;
- **não** acrescentes um `<app-faixa-estatisticas>` à mão depois do banner — o
  container já o traz, e as duas faixas ficariam repetidas;
- registas o `ContainerBannerFaixaEstatisticaComponent`
  (`src/app/shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component.ts`)
  no array `imports` do `@Component`, ao lado do `BannerDestaqueComponent`.

Se encontrares uma página antiga com `<app-banner-destaque>` seguido de um
`<app-faixa-estatisticas>` solto (é o caso de `candidatura-docentes`), esse é o padrão
antigo — **não o copies**, e também não vás corrigi-lo se não é a página do pedido.

Banners em molde de **cartão** (`[cartao]="true"`, encaixados numa `<section>` a meio
da página) **não** levam o container: a faixa de estatísticas é só do hero.

## O componente

Lê sempre `src/app/shared/componentes/banner-destaque/banner-destaque.component.ts`
antes de escrever nada: os inputs mudam. À data, a API é:

| input | para que serve |
| --- | --- |
| `titulo` | título; a parte não realçada |
| `tituloDestaque` | parte final do título, a dourado (`text-secondary`) |
| `subtitulo` | parágrafo abaixo do título |
| `selos` | `string[]`, as pílulas douradas acima do título |
| `ctas` | `CtaBannerDestaque[]` — `{ texto, variante, link, icone?, posicaoIcone? }` |
| `bg` | caminho da fotografia de fundo |
| `temBackdrop` | liga a camada que escurece a fotografia |
| `classeBackdrop` | classe dessa camada; `bg-black/50` por omissão |
| `cartao` | `true` = molde de cartão, para banners encaixados numa secção |
| `heroImage` | recorte de pessoa sobreposto ao fundo (`{ url, x, y }`) |

**Dois moldes, escolhe pelo mockup:**

- **Hero** (`cartao` fica em `false`): ocupa toda a largura, é o primeiro elemento da
  página, título grande, `<h1>`, e vai dentro do
  `app-container-banner-faixa-estatistica`. Ver o topo de
  `src/app/pages/estudantes/estudantes.component.html`.
- **Cartão** (`[cartao]="true"`): banner com cantos arredondados dentro de uma
  `<section>`, precedido por um `app-cabecalho-secao`, título `<h2>`, CTAs mais
  pequenos e sem container. Ver a secção `#secao-intranet` em
  `src/app/pages/estudantes/estudantes.component.html`.

Se o mockup pedir algo que nenhum input cobre, **estende o componente com um input
novo cujo valor por omissão preserva o aspecto actual** — nunca alteres o
comportamento dos banners já existentes noutras páginas.

## Traduções

Regra do projecto (`.claude/README.md`, secção "Traduções"): **textos e frases usam
`traducao.getTraducao([pt, en])`, não `traducao.t()`.** As chaves de dicionário do
`t()` ficam para texto estrutural e reutilizado — e nada num banner é isso: título,
título de destaque, subtítulo, selos e texto dos CTAs são todos frases da página.

Escreve o par sempre inteiro, com as duas versões traduzidas — nunca inglês copiado do
português. Sendo o `getTraducao` lido do sinal do idioma, os textos vivem em `computed`
no componente da página (ver o passo 4), e o template só consome o sinal:

```html
<!-- certo -->
<app-banner-destaque [titulo]="tituloHero()" [subtitulo]="subtituloHero()" />

<!-- errado: chave de dicionário para uma frase da página -->
<app-banner-destaque [titulo]="traducao.t('paginas.x.heroTitulo')" />
```

Se encontrares `traducao.t()` num banner já existente, deixa estar — só o novo banner
segue esta regra, a não ser que te peçam a migração.

## Passos

1. **Lê o mockup de `de:`** e retira: selo(s), título, que parte dele está a dourado,
   subtítulo, texto e ícone de cada CTA, tom da camada sobre a fotografia
   (preta → `bg-black/50`; esverdeada → `bg-primary-deep/70`).

2. **Fixa o `bg`** a partir de `img:`, sem o `public/` — ver "Fotografia de fundo".
   Confirma que o ficheiro existe antes de continuar.

3. **Textos** — ver "Traduções" abaixo: todo o texto do banner sai de
   `traducao.getTraducao(['<pt>', '<en>'])`, nunca de `traducao.t()`.

4. **Componente da página** — acrescenta os `computed` que o banner consome:

   ```ts
   protected readonly tituloHero = computed(() =>
     this.traducao.getTraducao(['Portal do', 'Portal for']),
   );

   protected readonly tituloDestaqueHero = computed(() =>
     this.traducao.getTraducao(['Estudante', 'Students']),
   );

   protected readonly selosHero = computed(() => [
     this.traducao.getTraducao(['BEM-VINDO ESTUDANTE', 'WELCOME STUDENT']),
   ]);

   protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
     {
       link: '/estudantes#secao-intranet',
       texto: this.traducao.getTraducao(['Ver meus cursos', 'View my courses']),
       variante: 'branco',
       icone: 'arrow-right',
       posicaoIcone: 'direita',
     },
   ]);
   ```

   Nomeia-os pelo banner (`selosHero`/`ctasHero`, `selosIntranet`/`ctasIntranet`, …)
   para não colidirem quando a página tiver mais do que um banner.

5. **Markup** no `.html` da página — o hero envolvido no
   `app-container-banner-faixa-estatistica` — e **registar**
   `BannerDestaqueComponent`, `ContainerBannerFaixaEstatisticaComponent` (e o que mais
   usares) no array `imports` do `@Component`. Mantém `ChangeDetectionStrategy.OnPush`.

6. **Verifica**: `npx ng build`. Tem de passar. Se aparecerem erros em ficheiros que
   não tocaste, são pré-existentes: não os corrijas, mas di-lo no relatório.

## Regras

- **Container**: o hero vai sempre dentro do `app-container-banner-faixa-estatistica`,
  e nunca com um `app-faixa-estatisticas` duplicado — ver "O container obrigatório".
- **Traduções**: todo o texto do banner vem de `traducao.getTraducao([pt, en])`; nunca
  `traducao.t()` — ver "Traduções".
- **Ícones**: só nomes que existam em `src/app/shared/componentes/icone/dados-icones.ts`.
  Confirma antes de usar.
- **Variantes de botão** (`VarianteBotao`): `primario`, `secundario`, `contorno`,
  `branco`, `glass`, `suave`. Sobre fotografia, o par habitual é `branco` + `glass`;
  o botão dourado é `secundario`.
- **Links**: usa rotas que existam em `src/app/app.routes.ts`. Se o mockup pedir um
  destino que não existe, aponta para uma âncora da própria página e deixa um
  `// TODO:` — e diz no relatório qual é o destino que falta.
- **Cores e espaçamentos** vêm dos tokens de `src/styles.css` (`primary`, `primary-dark`,
  `primary-deep`, `secondary`, `accent`, `bg-light`, `bg-lighter`, `text-primary`,
  `text-secondary`). Não escrevas hexadecimais.
- **Nomes em português**, como o resto do código. Comentários só onde expliquem uma
  decisão que o código não mostra.
- Não mexas em ficheiros fora do necessário: a página, o componente do banner (se
  precisar de um input novo) e nada mais.

## Relatório final

Diz, em poucas linhas: que ficheiros mudaste, se o hero ficou dentro do
`app-container-banner-faixa-estatistica`, se estendeste o `app-banner-destaque` e com
que input, que fotografia usaste (e se é definitiva ou marcador), o resultado do build,
e o que ficou pendente (destinos de links, imagens que faltam).
