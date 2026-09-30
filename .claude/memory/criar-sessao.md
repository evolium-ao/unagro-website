# Componentes das sessões

Registo dos componentes criados pelo agente `criar-sessao` (`.claude/agents/criar-sessao.md`).
Serve para não se criarem dois componentes iguais com nomes diferentes: **antes de
criar qualquer componente, procura-se aqui primeiro** e confirma-se no disco que ele
ainda existe.

Uma entrada por componente. Quem reutiliza um componente já registado não abre entrada
nova — acrescenta a página à linha **Usado em**. Quem estende um componente com um
input novo actualiza a linha **Inputs**.

## Formato de cada entrada

```markdown
### app-nome-do-componente

**Onde:** `src/app/shared/componentes/nome-do-componente/nome-do-componente.component.ts`
**Criado para:** sessão "<nome da sessão>" de `<página>` (AAAA-MM-DD)
**Descrição:** para que serve e que aspecto tem — o suficiente para outra execução
reconhecer que já existe sem abrir o ficheiro.

**Inputs:** `dados: Tipo` (obrigatório) · `formato: 'a' | 'b'` (por omissão `'a'`)

**Como usar:** (bloco de código html)

**Usado em:** `<página>`
```

## Componentes

### app-item-estatistica

**Onde:** `src/app/shared/componentes/item-estatistica/item-estatistica.component.ts`
**Criado para:** sessão "Impacto em Números" de `desenvolvimento` (2026-09-02)
**Descrição:** número grande em destaque com o rótulo em maiúsculas pequeno por baixo,
para grelhas de indicadores dentro de uma secção. Ao contrário da
`app-faixa-estatisticas` (faixa rolante), este fica parado e é um item só — quem faz a
grelha é a página. No tema `escuro` o valor sai dourado (`text-secondary`) sobre fundo
verde; no `claro`, verde escuro sobre fundo claro.

**Estendido em** 2026-09-03 (sessão "Contexto e Desafio" de `detalhe-projeto`) com o
input `formato` e com o tema `verde`, ambos aditivos: `formato="bloco"` (omissão) é
exactamente o desenho antigo — número `text-3xl sm:text-4xl` solto — e `formato="barra"`
dá o indicador miúdo (`text-xl sm:text-2xl`, rótulo `text-[10px] tracking-wider`) com
uma **barra vertical verde à esquerda** (`border-l-2 border-primary pl-4`), para
acompanhar um bloco de texto em vez de uma grelha. O tema `verde` põe o valor em
`text-primary-deep` sobre fundo claro, a par do tema homónimo do `app-cabecalho-secao`.

**Estendido em** 2026-09-03 (sessão "Impacto do Projecto" de `detalhe-projeto`) com o
formato `centrado`, aditivo: raiz `text-center`, valor `text-4xl sm:text-5xl` e rótulo
`mt-3 text-[11px] tracking-wide` — é a faixa de números de impacto que ocupa uma secção
inteira, **sem cartões, molduras nem separadores verticais**, quatro colunas centradas
sobre branco. Nada a ver com a `app-faixa-estatisticas` nem com o slot do
`app-container-banner-faixa-estatistica` do hero. Os formatos `bloco` e `barra` saem no
prerender exactamente como antes.

**Estendido em** 2026-09-04 (sessão "Sobre a Alumni UNAGRO" de `alumni`) com o tema
`sobreEscuro`, aditivo: valor a **branco** (`text-white`) e rótulo em `text-white/70`,
para o cartão `bg-primary-deep` onde o dourado fica reservado ao ícone acima do número.
O tema `escuro` (valor dourado) continua a omissão e não mudou.

**Inputs:** `valor: string` (obrigatório) · `rotulo: string` (obrigatório) ·
`tema: 'escuro' | 'claro' | 'verde' | 'sobreEscuro'` (por omissão `'escuro'`) ·
`formato: 'bloco' | 'barra' | 'centrado'` (por omissão `'bloco'`)

**Como usar:**

    <app-item-estatistica [valor]="estatistica.valor" [rotulo]="estatistica.rotulo"
      [appRevelarAoScroll]="$index" />

    <app-item-estatistica formato="barra" tema="verde" [valor]="estatistica.valor"
      [rotulo]="estatistica.rotulo" [appRevelarAoScroll]="$index + 1" />

    <app-item-estatistica formato="centrado" tema="verde" [valor]="estatistica.valor"
      [rotulo]="estatistica.rotulo" [appRevelarAoScroll]="$index + 1" />

**Usado em:** `desenvolvimento`, `detalhe-projeto`, `alumni`

### app-cartao-vidro

**Onde:** `src/app/shared/componentes/cartao-vidro/cartao-vidro.component.ts`
**Criado para:** sessão "Impacto em Números" de `desenvolvimento` (2026-09-02)
**Descrição:** cartão translúcido de vidro fosco (`bg-white/20`, `backdrop-blur-md`,
moldura `border-white/30`) com título branco e um texto curto por baixo, feito para
ficar sobreposto a uma fotografia ou banner. Não se posiciona a si mesmo — o
`absolute`/`bottom`/`left` vem de quem o usa.

**Estendido em** 2026-09-04 (sessão "Onde estão os nossos Alumni?" de `alumni`) com o
input `tamanho`, aditivo: `normal` (omissão) é a caixa de sempre — `p-5`, título
`text-base font-semibold sm:text-lg` e texto `text-xs sm:text-sm text-white/80` — e
`compacto` dá a **faixa miúda** que se encosta ao fundo de um retrato: `px-4 py-3`,
`shadow-lg`, moldura `border-white/20`, título `text-sm font-bold` e a linha de baixo em
`text-[11px] text-white/75`. As três cadeias de classes passaram a vir de `computed`
sobre `Record<TamanhoCartaoVidro, string>`; no prerender de `desenvolvimento` o conjunto
de classes é o mesmo de antes (só a ordem muda, porque o Angular serializa o binding
ordenado).

**Inputs:** `titulo: string` (obrigatório) · `texto: string | undefined` (opcional; sem
ele fica só o título) · `tamanho: 'normal' | 'compacto'` (por omissão `'normal'`)

**Como usar:**

    <app-cartao-vidro class="absolute bottom-5 left-5 sm:max-w-xs"
      [titulo]="tituloNota()" [texto]="textoNota()" />

    <app-cartao-vidro class="absolute inset-x-3 bottom-3" tamanho="compacto"
      [titulo]="historia().nome" [texto]="historia().cargoAtual" />

**Usado em:** `desenvolvimento`, `alumni` (dentro do `app-cartao-historia-alumni`)

### app-cartao-evento-foto

**Onde:** `src/app/shared/componentes/cartao-evento-foto/cartao-evento-foto.component.ts`
**Criado para:** sessão "Próximos Eventos" de `eventos` (2026-09-02)
**Descrição:** cartão de evento **com fotografia**, sem sombra e com moldura
`border-gray-200`. Dois formatos: `vertical` (fotografia em cima em `aspect-video`, selo
verde sólido sobreposto ao canto superior direito, data e local numa linha de meta,
título, descrição a duas linhas e botão "Inscrever-se" a toda a largura) e `destaque`
(fotografia à esquerda a 2/5, selo cinzento dentro do texto, e o rodapé com o local à
esquerda e o botão à direita — feito para ocupar duas colunas da grelha). Sem `imagem`
cai no marcador cinzento do `app-espaco-imagem`. Não confundir com o `cartao-evento`
(bloco de data verde, sem fotografia) nem com o `cartao-evento-destaque` (faixa escura
com contagem decrescente). Trouxe a variante `sobreFoto` (`bg-primary text-white`) ao
`app-selo`.

**Inputs:** `evento: EventoFotoCartao` (obrigatório) · `formato: 'vertical' | 'destaque'`
(por omissão `'vertical'`) · `varianteBotao: 'primario' | 'contorno'` (por omissão
`'primario'`; só conta no formato `vertical`)

**Como usar:**

    <app-cartao-evento-foto [evento]="destacado" formato="destaque" />
    <app-cartao-evento-foto [evento]="evento" [appRevelarAoScroll]="$index + 1" />

**Usado em:** `eventos`

### app-item-filtro-lateral

**Onde:** `src/app/shared/componentes/item-filtro-lateral/item-filtro-lateral.component.ts`
**Criado para:** sessão "Próximos Eventos" de `eventos` (2026-09-02)
**Descrição:** item de uma lista **vertical** de filtros, com ícone à esquerda e rótulo.
Activo fica em `bg-primary-deep` com texto branco; inactivo é transparente com texto
secundário. Alternativa ao `filtro-pilula` (que é um `select` redondo horizontal) quando
os filtros vivem numa barra lateral. Não guarda estado: recebe `ativo` e emite
`selecionado`.

**Inputs:** `rotulo: string` (obrigatório) · `icone: string` (obrigatório) ·
`ativo: boolean` (por omissão `false`) — **Output:** `selecionado`

**Como usar:**

    <app-item-filtro-lateral [rotulo]="filtro.rotulo" [icone]="filtro.icone"
      [ativo]="ambitoSelecionado() === filtro.valor"
      (selecionado)="selecionarAmbito(filtro.valor)" />

**Usado em:** `eventos`

### app-pilar-icone

**Onde:** `src/app/shared/componentes/pilar-icone/pilar-icone.component.ts`
**Criado para:** sessão "A Autoridade de uma Certificação UNAGRO" de `formacoes` (2026-09-02)
**Descrição:** pilar com ícone, **tudo centrado**: quadrado arredondado de 56px com o
ícone, título pequeno em negrito e descrição curta por baixo. Sem cartão, sem moldura e
sem sombra — assenta directamente no fundo da secção, ao contrário do `cartao-recurso`
(cartão branco, alinhado à esquerda) e do `item-estatistica` (número + rótulo). No tema
`escuro` a caixa é `bg-white/10` com ícone branco, título branco e descrição
`text-white/60`; no `claro`, caixa `bg-primary/10` com ícone verde e título
`primary-dark`. Trouxe o ícone `shield-check` a `dados-icones.ts`.

**Inputs:** `icone: string` (obrigatório) · `titulo: string` (obrigatório) ·
`descricao: string` (obrigatório) · `tema: 'escuro' | 'claro'` (por omissão `'escuro'`)

**Como usar:**

    <app-pilar-icone [icone]="pilar.icone" [titulo]="pilar.titulo"
      [descricao]="pilar.descricao" [appRevelarAoScroll]="$index" />

**Usado em:** `formacoes`

### app-cartao-publicacao

**Onde:** `src/app/shared/componentes/cartao-publicacao/cartao-publicacao.component.ts`
**Criado para:** sessão "Publicações Recentes" de `desenvolvimento` (2026-09-02)
**Descrição:** linha horizontal de uma lista **vertical** de artigos científicos (não é
cartão de grelha): quadrado de 40px com ícone verde sobre fundo verde muito claro à
esquerda, no meio "REVISTA · DATA" em maiúsculas, título e autores, e à direita os
botões "Abstract" (contorno) e "Download" (sólido, com ícone). Cartão branco de moldura
`border-gray-200`, sem sombra; em ecrã pequeno empilha e as acções descem. Resolve os
textos bilingues a partir da `Publicacao` (`src/app/core/modelos/publicacao.model.ts`).
Trouxe a variante `profundo` (`bg-primary-deep text-white`) ao `app-botao` e os ícones
`download` e `sliders-horizontal` a `dados-icones.ts`.

**Inputs:** `publicacao: Publicacao` (obrigatório) · `varianteDownload: VarianteBotao`
(por omissão `'profundo'`)

**Como usar:**

    <app-cartao-publicacao [publicacao]="publicacao" [appRevelarAoScroll]="$index" />

**Usado em:** `desenvolvimento`

### app-grupo-cartoes-selecao

**Onde:** `src/app/shared/componentes/grupo-cartoes-selecao/grupo-cartoes-selecao.component.ts`
**Criado para:** modal "Agende sua Visita" de `desenvolvimento` (2026-09-02)
**Descrição:** escolha única desenhada como uma fila de cartões clicáveis (ícone
pequeno em cima, rótulo em baixo) em vez de um select — o papel de um grupo de radios
com área clicável grande. Implementa `ControlValueAccessor`, logo usa-se com
`formControlName` como qualquer campo; o rótulo segue o estilo minimalista dos campos
do projecto (maiúsculas pequenas, `tracking` largo). O cartão escolhido fica branco com
moldura e anel `primary-deep`; os outros com fundo `bg-bg-lighter` e moldura neutra.
Interface `OpcaoCartaoSelecao` (`valor`, `rotulo`, `icone?`) exportada no ficheiro.

**Inputs:** `label: string` (por omissão `''`) · `opcoes: OpcaoCartaoSelecao[]` (por
omissão `[]`) · `colunas: 2 | 3 | 4` (por omissão `3`) · `erro: string | null` (por
omissão `null`)

**Como usar:**

    <app-grupo-cartoes-selecao formControlName="unidade" [label]="rotulo()"
      [opcoes]="opcoesUnidades()" [colunas]="3" [erro]="erros.unidade()" />

**Usado em:** `desenvolvimento` (dentro do `app-modal-agendar-visita`)

### app-modal-agendar-visita

**Onde:** `src/app/shared/componentes/modal-agendar-visita/modal-agendar-visita.component.ts`
(campos em `campos-agendar-visita.component.ts`, na mesma pasta)
**Criado para:** modal "Agende sua Visita" de `desenvolvimento` (2026-09-02)
**Descrição:** conteúdo do modal de pedido de visita a um centro ou laboratório —
título e subtítulo centrados, X de fechar no canto, e o formulário em três filas:
nome/instituição/e-mail, telefone/data/hora, motivo (textarea a 2/3) e nº de
participantes, com a fila de cartões "Unidade a visitar" pelo meio. Não é uma secção de
página: renderiza-se como `template` do `AlertModalService` (`temHeader: false`,
`semBotoes: true`) e recebe em `data` a unidade clicada (que chega pré-seleccionada) e a
lista completa. Campos com `variante="minimalista"` do `form-input-field` e do
`field-select-v2`, erros pelo `criarErrosFormulario` + `ValidacaoService`, botão
`profundo` "Solicitar Agendamento". Submissão sem backend: fecha e mostra
`servicoAlert.sucesso(...)`. Trouxe o ícone `wrench` a `dados-icones.ts` e o campo
opcional `icone` ao modelo `UnidadeInvestigacao`.

**Inputs:** nenhum — os dados entram por `ModalDataService` (`DadosAgendarVisita`:
`unidadeSelecionada`, `unidades`). Exporta também `ID_MODAL_AGENDAR_VISITA`.

**Como usar:** (na página, ao receber `visitarSolicitado` do `app-cartao-unidade`)

    void this.modais.open({
      id: ID_MODAL_AGENDAR_VISITA,
      template: ModalAgendarVisitaComponent,
      tamanho: 'xlgrande',
      temHeader: false,
      semBotoes: true,
      fecharAoClicarFundo: false,
      data: { unidadeSelecionada: unidade, unidades: this.unidades() },
    });

**Usado em:** `desenvolvimento`

### app-cartao-unidade (existente, estendido)

**Onde:** `src/app/shared/componentes/cartao-unidade/cartao-unidade.component.ts`
**Estendido para:** modal "Agende sua Visita" de `desenvolvimento` (2026-09-02)
**Descrição:** o botão "Visitar Unidade" continua a ser um link por omissão; com
`acaoComoBotao` a `true` passa a `<button>` e emite `visitarSolicitado` com a unidade,
para quem usa o cartão decidir a acção (o cartão não conhece modais nem serviços).

**Inputs:** `unidade: UnidadeInvestigacao` (obrigatório) · `acaoComoBotao: boolean`
(por omissão `false`, isto é, mantém o link)
**Outputs:** `visitarSolicitado: UnidadeInvestigacao` (só emite com `acaoComoBotao`)

**Como usar:**

    <app-cartao-unidade [unidade]="unidade" [acaoComoBotao]="true"
      (visitarSolicitado)="abrirAgendamentoVisita($event)" [appRevelarAoScroll]="$index" />

**Usado em:** `desenvolvimento`

### app-passo-metodologia

**Onde:** `src/app/shared/componentes/passo-metodologia/passo-metodologia.component.ts`
**Criado para:** sessão "Nossa Metodologia" de `desenvolvimento` (2026-09-02)
**Descrição:** um passo de um método faseado, alinhado à esquerda: quadrado de 64px de
cantos arredondados (`rounded-2xl`) com fundo `bg-gray-100` **opaco** e o ícone em
`text-primary-deep` de traço fino (1.5), depois "01. Título" semi-negrito e uma
descrição pequena em cinzento. Não é círculo nem verde cheio e não tem sombra — é o
desenho do "Ciclo de Excelência". Traz `relative z-10` no host para assentar por cima
da linha horizontal de ligação que a secção desenha (a diretiva de revelação limpa o
`transform` no fim, logo o `z-10` não pode ficar num filho). Alternativa ao
`app-indicador-passos`, que desenha a fila inteira com ícones em círculo verde e texto
centrado, e não permite a linha de ligação.

**Inputs:** `passo: PassoMetodologia` (obrigatório) — modelo em
`src/app/core/modelos/investigacao.model.ts` (`id`, `numero` já formatado tipo `'01'`,
`icone`, `titulo`, `descricao`)

**Como usar:** (a linha de ligação e a grelha ficam na página)

    <div class="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <span aria-hidden="true"
        class="pointer-events-none absolute left-8 right-8 top-8 hidden h-px bg-gray-200 lg:block"></span>
      @for (passo of passosMetodologia(); track passo.id) {
        <app-passo-metodologia [passo]="passo" [appRevelarAoScroll]="$index" />
      }
    </div>

**Usado em:** `desenvolvimento`

### app-cartao-investigador

**Onde:** `src/app/shared/componentes/cartao-investigador/cartao-investigador.component.ts`
**Criado para:** sessão "Investigadores Principais" de `desenvolvimento` (2026-09-02)
**Descrição:** cartão de pessoa da equipa científica: fotografia em retrato
(`aspect-[4/5]`, cantos arredondados) no topo, nome em `text-primary-deep` negrito,
cargo pequeno em cinzento e as pílulas de especialidade em maiúsculas miúdas
(`app-selo` `neutro`/`pequeno` com `uppercase`). Cartão branco de moldura
`border-gray-200`, sem sombra. Sem `foto_url` cai no marcador cinzento do
`app-espaco-imagem`. Trouxe o input `tamanho` ao `app-selo`.

**Inputs:** `investigador: Investigador` (obrigatório) — modelo em
`src/app/core/modelos/investigacao.model.ts` (`id`, `nome` sem tradução, `cargo`,
`foto_url`, `especialidades: TextoBilingue[]`)

**Como usar:**

    <app-cartao-investigador [investigador]="investigador"
      [appRevelarAoScroll]="$index % investigadoresPorPagina" />

**Usado em:** `desenvolvimento`

### app-selo (existente, estendido)

**Onde:** `src/app/shared/componentes/selo/selo.component.ts`
**Estendido para:** sessão "Investigadores Principais" de `desenvolvimento` e sessão
"Cursos de Curta Duração e Treinamentos Técnicos" de `formacoes` (2026-09-02)
**Descrição:** duas extensões, ambas aditivas e com os valores por omissão a manter o
aspecto antigo:
- input `tamanho` — `normal` mantém exactamente o antigo (`px-2.5 py-2 text-xs`) e
  `pequeno` dá a pílula miúda (`px-2 py-1 text-[10px]`) das especialidades dos cartões
  de investigador. O `uppercase` vem por classe de quem usa, porque `text-transform`
  herda para o `span` interno.
- variantes sólidas para selos assentes numa fotografia: `sobreFoto`
  (`bg-primary text-white`) e o par neutro `sobreFotoEscuro` (`bg-gray-700 text-white`),
  usado no estado "Próxima Turma: <mês>" dos cursos de curta duração.

**Inputs:** `variante: VarianteSelo` (`primario` | `acento` | `neutro` | `segondary` |
`sobreEscuro` | `sobreFoto` | `sobreFotoEscuro`; por omissão `'primario'`) ·
`tamanho: 'normal' | 'pequeno'` (por omissão `'normal'`)

### app-cabecalho-secao (existente, estendido)

**Onde:** `src/app/shared/componentes/cabecalho-secao/cabecalho-secao.component.ts`
**Estendido para:** sessão "Investigadores Principais" de `desenvolvimento` (2026-09-02)
**Descrição:** o `tema` ganhou o valor `verde` — título em `text-primary-deep` sobre
fundo claro, com a descrição em `text-text-secondary`. Os temas `claro`, `escuro` e
`branco` ficaram como estavam e `claro` continua a ser o valor por omissão.

**Estendido em** 2026-09-03 (sessão "Startups & Incubação" de `hub-unagro`) com a
**ligação de acção à direita** e com o tamanho da descrição, ambos aditivos: com
`textoAcao` o cabeçalho passa a uma fila (`sm:flex-row sm:items-end sm:justify-between`)
com o bloco de texto à esquerda (limitado a `sm:max-w-2xl`) e um link verde
`texto + ícone` encostado à direita, alinhado ao fundo do bloco; sem `textoAcao` a saída
é exactamente a de antes, porque o bloco vive num `ng-template` reaproveitado pelos dois
ramos. O `linkAcao` separa o fragmento da rota como o `app-botao`, e o `iconeAcao` é
`arrow-right` por omissão. `tamanhoDescricao="pequeno"` põe a descrição em
`text-sm leading-relaxed`; `normal` (omissão) mantém o corpo de sempre. As classes da
descrição vão numa só cadeia já com `trim()` — um `[class]` com um troço vazio faz o
`classList` rejeitar a cadeia inteira ao renderizar no servidor.

**Estendido em** 2026-09-04 (sessão "Sobre a Alumni UNAGRO" de `alumni`) com a
**posição dos traços**, aditiva: `posicaoTracos="abaixo"` desce as três barras douradas
para **debaixo do título** (`mt-5`, antes da descrição), como no mockup da Alumni; `acima`
(omissão) é o cabeçalho de sempre. As barras passaram a viver num `ng-template #tracos`
reaproveitado pelos dois ramos, e a cadeia de classes passou a vir toda de um `[class]`
computado — o conteúdo do `acima` é o mesmo (`mb-4 flex items-center gap-1.5`), só a
**ordem** das classes no prerender é que muda, porque o Angular serializa o binding
ordenado.

**Estendido em** 2026-09-04 (sessão "Onde estão os nossos Alumni?" de `alumni`) com a
**cor da ligação de acção**, aditiva: `corAcao="branca"` põe o link da direita em
`text-white hover:text-secondary`, para o cabeçalho assente em `bg-primary-deep` onde o
verde não se lê; `primaria` (omissão) é o `text-primary hover:text-primary-dark` de
sempre. Só a cor saiu para um `[class]` computado — as classes de forma do `<a>`
(`inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold`) ficaram no `class`
estático, pelo que o `hub-unagro` sai no prerender com o mesmo conjunto de classes.

**Inputs:** `titulo: string` (obrigatório) · `descricao?: string` ·
`tema: 'claro' | 'escuro' | 'branco' | 'verde'` (por omissão `'claro'`) ·
`alinhamento: 'centro' | 'esquerda'` (por omissão `'centro'`) · `mostrarTracos: boolean`
(por omissão `true`) · `posicaoTracos: 'acima' | 'abaixo'` (por omissão `'acima'`) · `textoAcao?: string` (sem ele não há link à direita) ·
`linkAcao: string` (por omissão `''`) · `iconeAcao: string` (por omissão `'arrow-right'`) ·
`corAcao: 'primaria' | 'branca'` (por omissão `'primaria'`) ·
`tamanhoDescricao: 'normal' | 'pequeno'` (por omissão `'normal'`)

A combinação `tema="verde" alinhamento="esquerda" [mostrarTracos]="false"` é o título
simples alinhado à esquerda dos blocos de texto — usada nas sessões "Contexto e Desafio"
e "Galeria Multimédia" de `detalhe-projeto` (2026-09-03), esta última **sem descrição**,
só com o título verde por cima do mosaico. Não é preciso componente novo para esse caso.

A combinação `tema="verde" [mostrarTracos]="false"` com o alinhamento ao centro é o
bloco de chamada de atenção sem cartão — ícone `award` por cima e dois botões por baixo,
tudo markup da página — usada na sessão "Já concluiu seu curso?" de `formacoes`
(2026-09-03).

A combinação `alinhamento="esquerda" [mostrarTracos]="false" tamanhoDescricao="pequeno"`
com `textoAcao`/`linkAcao` é o cabeçalho de secção com "Ver todas →" à direita — usado na
sessão "Startups & Incubação" de `hub-unagro` (2026-09-03).

A combinação `tema="branco"` com o alinhamento ao centro e os traços é o cabeçalho de uma
secção de fundo verde escuro (`bg-primary-deep`) com título branco e descrição em
`text-white/70` — usada na sessão "Solução Implementada" de `detalhe-projeto` (2026-09-03).

A combinação `alinhamento="esquerda" tamanhoDescricao="pequeno"` **com** os traços
(`mostrarTracos` por omissão) é o cabeçalho encostado à esquerda mas ainda com as três
barras douradas — usado na sessão "Como Apoiar" de `hub-unagro` (2026-09-03).

A combinação `tema="escuro" alinhamento="esquerda" [mostrarTracos]="false"
tamanhoDescricao="pequeno" corAcao="branca"` com `textoAcao` é o cabeçalho **sobre fundo
verde escuro** com o título dourado à esquerda, a descrição em `text-white/70` e o link
branco "Ver todas as histórias →" encostado à direita — usado na sessão "Onde estão os
nossos Alumni?" de `alumni` (2026-09-04).

A combinação `tema="verde"` **sem descrição** e com os traços, ao centro, é o cabeçalho
só-título de uma secção clara — usada na sessão "Cronograma do Projecto" de
`detalhe-projeto` (2026-09-03) e, sem alteração nenhuma ao componente, na sessão
"Equipa do Projecto" da mesma página (2026-09-04). A mesma combinação com
`posicaoTracos="abaixo"` é o cabeçalho da sessão "Sobre a Alumni UNAGRO" de `alumni`
(2026-09-04): título verde ao centro e as três barras douradas por baixo dele.

**Usado em:** `alumni`, `candidaturas`, `contactos`, `desenvolvimento`, `detalhe-curso`,
`detalhe-projeto`, `estudantes`, `eventos`, `formacoes`, `hub-unagro`, `inscricao`

### app-cartao-curso-curta-duracao

**Onde:** `src/app/shared/componentes/cartao-curso-curta-duracao/cartao-curso-curta-duracao.component.ts`
**Criado para:** sessão "Cursos de Curta Duração e Treinamentos Técnicos" de `formacoes` (2026-09-02)
**Descrição:** cartão de módulo de formação profissional, branco com moldura
`border-gray-200` e sombra leve: fotografia em `aspect-video` no topo com o selo do
estado de inscrição sobreposto ao canto superior direito (verde "Inscrições Abertas" ou
cinzento escuro "Próxima Turma: <mês>"), linha de meta com relógio + "40 Horas", título
em `text-primary-deep`, resumo a duas linhas (`line-clamp-2`) e rodapé numa linha com o
preço em negrito à esquerda e o botão "Inscrever-se" à direita. Recebe `cargaHoraria` e
`preco` **crus** (números) e formata-os ele mesmo — "40 Horas"/"40 Hours" e
"Kz 80.250,00". Não confundir com o `app-cartao-curso` (variantes `padrao`/`academica`),
que mostra faculdade, grau e regime e não tem preço, selo sobreposto nem resumo — foi por
isso que não deu para reaproveitar. Trouxe a variante `sobreFotoEscuro`
(`bg-gray-700 text-white`) ao `app-selo`.

**O cartão inteiro é uma ligação** para `curso().link` (o detalhe do curso), feita com
um `<a class="absolute inset-0">` sobreposto dentro do `<article class="relative">` —
e não com um `<a>` a envolver tudo, porque um botão dentro de uma ligação é markup
inválido. O "Inscrever-se" fica em `relative z-10`, por cima dessa camada, para
continuar a abrir o modal em vez de navegar. Padrão a copiar em qualquer cartão que
tenha de ser clicável e ter um botão próprio.

**Inputs:** `curso: CursoCurtaDuracaoCartao` (obrigatório; interface exportada no
próprio ficheiro — `id`, `titulo`, `resumo`, `cargaHoraria: number`, `preco: number`,
`estadoInscricao: 'abertas' | 'proxima-turma'`, `proximaTurma?`, `link`, `imagem?`) ·
`acaoComoBotao: boolean` (por omissão `false`, isto é, o "Inscrever-se" mantém-se o link
para `curso().link`)
**Outputs:** `inscricaoSolicitada: CursoCurtaDuracaoCartao` (só emite com
`acaoComoBotao`, para a página abrir o `app-modal-inscricao-curso`)

**Como usar:**

    <app-cartao-curso-curta-duracao [curso]="curso" [acaoComoBotao]="true"
      (inscricaoSolicitada)="abrirInscricaoCurso($event)"
      [appRevelarAoScroll]="$index % cursosCurtaPorLote" />

**Usado em:** `formacoes`

### app-modal-inscricao-curso

**Onde:** `src/app/shared/componentes/modal-inscricao-curso/modal-inscricao-curso.component.ts`
(campos em `campos-inscricao-curso.component.ts`, na mesma pasta)
**Criado para:** modal "Inscrição em Curso de Curta Duração" aberto do "Inscrever-se" do
`app-cartao-curso-curta-duracao` na sessão "Cursos de Curta Duração" de `formacoes`
(2026-09-02)
**Descrição:** diálogo de inscrição num módulo de curta duração, em três zonas separadas
por linhas finas: cabeçalho com o título a negrito em `text-primary-deep` e o subtítulo
em cinzento; corpo com "Nome completo" a toda a largura, "E-mail" e "Telefone" a duas
colunas (uma em ecrã pequeno) e "Curso desejado" a toda a largura; rodapé alinhado à
direita com "Cancelar" (`contorno`) e "Confirmar Inscrição →" (`profundo`). Campos com
`variante="caixa"` do `form-input-field` (ícones `users`/`mail`/`phone` pelo slot
`leftIcon`) e do `field-select-v2` (sem ícone — não tem slot). Erros pelo
`criarErrosFormulario` + `ValidacaoService`; o telefone usa o
`validarTelefoneComIndicativo`, que passou a viver em
`src/app/shared/formulario/validadores.ts` (partilhado com o `modal-agendar-visita`).
Não é uma secção de página: renderiza-se como `template` do `AlertModalService`
(`temHeader: false`, `semBotoes: true`, `fecharAoClicarFundo: false`) e o fecho é o X do
canto. Submissão sem backend: fecha e mostra `modais.sucesso(...)`. Sem imagens.

**Inputs:** nenhum — os dados entram por `ModalDataService` (`DadosInscricaoCurso`:
`cursoSelecionado`, `cursos`). Exporta também `ID_MODAL_INSCRICAO_CURSO`.

**Abre-se com:** `modais.modal({ id: ID_MODAL_INSCRICAO_CURSO, template: ModalInscricaoCursoComponent, … })`
**Dados (`data`):** `DadosInscricaoCurso` — `cursoSelecionado` (chega já escolhido no
select) e `cursos` (todos os cursos de curta duração da página, que constroem as opções;
o modal não injecta o `CursosService`)

**Como usar:** (na página, ao receber `inscricaoSolicitada` do
`app-cartao-curso-curta-duracao`)

    void this.modais.modal({
      id: ID_MODAL_INSCRICAO_CURSO,
      template: ModalInscricaoCursoComponent,
      tamanho: 'xgrande',
      temHeader: false,
      semBotoes: true,
      fecharAoClicarFundo: false,
      data: { cursoSelecionado: curso, cursos: this.cartoesCursosCurta() },
    });

**Usado em:** `formacoes`

### app-cartao-apoio

**Onde:** `src/app/shared/componentes/cartao-apoio/cartao-apoio.component.ts`
**Criado para:** sessão "Inicie a sua Candidatura" de `inscricao` (2026-09-02)
**Descrição:** cartão sólido em verde escuro (`bg-primary-deep`, `rounded-xl`, texto
branco) para colunas laterais: cabeçalho com ícone dourado opcional e título, um
parágrafo curto em `text-white/75` e a acção projectada por `<ng-content>` (tipicamente
um `app-botao` `secundario` com `larguraTotal`). Alinhado à esquerda e sem sombra — ao
contrário do `app-cartao-chamada-acao`, que é branco translúcido, centrado e feito para
assentar sobre uma fotografia. Combina com o `app-painel-lateral` na mesma coluna.

**Estendido em** 2026-09-03 (sessão "Objetivos do Projecto" de `detalhe-projeto`) com o
input `formato`, aditivo: `lateral` (omissão) é exactamente o cartão antigo — `p-6 sm:p-7`,
título branco `text-base` e parágrafo `text-white/75` — e `destaque` dá o painel alto de
uma coluna da grelha (`h-full`, `p-7 sm:p-9`, título **dourado** `text-secondary`
`text-lg sm:text-xl` e parágrafo maior em `text-white/90`), usado no cartão "Objetivo
Geral". A caixa da acção passou a ter `empty:hidden`, para não deixar margem quando não
se projecta nada.

**Inputs:** `titulo: string` (obrigatório) · `descricao?: string` · `icone?: string` ·
`formato: 'lateral' | 'destaque'` (por omissão `'lateral'`)

**Como usar:**

    <app-cartao-apoio [titulo]="tituloAjuda()" [descricao]="descricaoAjuda()">
      <app-botao variante="secundario" raio="medio" link="/contactos" [larguraTotal]="true">
        {{ textoBotaoAjuda() }}
      </app-botao>
    </app-cartao-apoio>

    <app-cartao-apoio formato="destaque" class="h-full" [titulo]="tituloObjetivoGeral()"
      [descricao]="p.objetivoGeral" appRevelarAoScroll />

**Usado em:** `inscricao`, `detalhe-projeto`

### app-painel-lateral (existente, estendido)

**Onde:** `src/app/shared/componentes/painel-lateral/painel-lateral.component.ts`
**Estendido para:** sessão "Inicie a sua Candidatura" de `inscricao` (2026-09-02)
**Descrição:** ganhou o input `tema`. `claro` mantém exactamente o painel antigo
(`bg-[#F4F4F1]`) e `branco` dá o cartão branco de moldura fina que acompanha o
formulário de inscrição.

**Inputs:** `titulo: string` (obrigatório) · `icone?: string` · `mostrarRodape: boolean`
(por omissão `true`) · `tema: 'claro' | 'branco'` (por omissão `'claro'`)

**Usado em:** `candidatura-docentes`, `inscricao`

### app-passos-formulario (existente, estendido)

**Onde:** `src/app/shared/componentes/passos-formulario/passos-formulario.component.ts`
**Estendido para:** sessão "Inicie a sua Candidatura" de `inscricao` (2026-09-02)
**Descrição:** ganhou o input `formaDistintivo`. `arredondado` mantém o distintivo
antigo (`h-9 w-9 rounded-xl`) e `circulo` dá o círculo cheio de 40px do mockup de
inscrição; a linha de ligação sobe de `mt-4.5` para `mt-5` para continuar centrada no
distintivo.

**Inputs:** `passos: string[]` (por omissão `[]`) · `ativo: number` (por omissão `0`) ·
`rotuloLista: string` · `formaDistintivo: 'arredondado' | 'circulo'` (por omissão
`'arredondado'`)

**Usado em:** `candidatura-docentes`, `inscricao`

### app-campo-upload (existente, estendido)

**Onde:** `src/app/shared/componentes/campo-upload/campo-upload.component.ts`
**Estendido para:** sessão "Inicie a sua Candidatura" de `inscricao` (2026-09-02)
**Descrição:** ganhou o input `tema`. `primario` mantém a zona antiga (tracejado verde,
fundo `bg-bg-light`, ícone solto de 34px em `text-primary-dark`); `neutro` dá a caixa do
mockup de inscrição — tracejado `border-gray-300` sobre branco, ícone de 22px dentro de
um círculo `bg-gray-100` e o texto de acção em `text-text-primary`. O estado de erro e o
estado de arrasto ficaram iguais nos dois temas.

**Inputs:** `label`, `erro`, `optional`, `textoOpcional`, `disabled`, `aceita`,
`textoAcao`, `textoArraste`, `textoLimite`, `textoTrocar` (como antes) ·
`tema: 'primario' | 'neutro'` (por omissão `'primario'`)

**Usado em:** `candidatura-docentes`, `inscricao`

### app-cartao-recurso (existente, estendido)

**Onde:** `src/app/shared/componentes/cartao-recurso/cartao-recurso.component.ts`
**Estendido para:** sessão "Objetivos do Projecto" de `detalhe-projeto` (2026-09-03)
**Descrição:** cartão branco vertical de moldura `border-gray-200` com o ícone solto no
topo (26px, sem caixa), título `text-lg` negrito em `text-primary-dark` e descrição
pequena em cinzento — é o cartão dos objectivos específicos e das vantagens do
recrutamento docente. Ganhou o input `corIcone`: `primario` (omissão) mantém o ícone
verde de sempre e `dourado` põe-no em `text-secondary`. Diferente do `app-pilar-icone`
(centrado, sem cartão) e do `app-cartao-requisito` (horizontal, ícone em caixa).

**Estendido em** 2026-09-03 (sessão "Como Apoiar" de `hub-unagro`) com o **ícone em
caixa** e com a **ligação de acção no rodapé**, ambos aditivos: `caixaIcone` a `true`
mete o ícone (22px, traço branco) dentro de um quadrado de 48px `rounded-xl bg-primary-deep`
— por omissão `false` é o ícone solto de 26px de sempre, e é só nesse caso que o
`corIcone` conta; e `textoAcao` desenha um rodapé encostado ao fundo do cartão
(`mt-auto pt-6`) com um link `text-xs font-bold text-primary-deep` mais o `iconeAcao` à
direita — sem `textoAcao` não se desenha rodapé nenhum. O `linkAcao` separa o
fragmento `#ancora` da rota como o `app-botao`. Foi por isto que não se criou cartão
novo: a casca (cartão branco `rounded-xl`, moldura `border-gray-200`, `flex h-full
flex-col`, título e descrição) é exactamente a mesma, e os dois usos anteriores
(`candidatura-docentes` e `detalhe-projeto`) saem no prerender iguais aos de antes,
sem uma alteração nos templates deles.

**Estendido em** 2026-09-03 (sessão "Solução Implementada" de `detalhe-projeto`) com o
input `formato`, aditivo: `vertical` (omissão) é exactamente o cartão de sempre — casca
`rounded-xl bg-white border-gray-200`, ícone solto acima do título `text-lg font-bold
text-primary-dark` — e `iconeInline` põe o **ícone de 16px em `text-primary-deep` na
mesma linha do título** (`flex items-center gap-2.5`, título `text-base font-semibold
text-primary-deep`) com a descrição bem separada (`mt-6`) e a casca em fundo claro suave
(`rounded-2xl bg-bg-light border-gray-200/70`), para grelhas dentro de uma **secção
escura**. As classes do `<article>` passaram a vir de um `computed` sobre um
`Record<FormatoCartaoRecurso, string>`; o prerender do formato `vertical` sai com o mesmo
conjunto de classes de antes, por isso `candidatura-docentes`, `hub-unagro` e os
objectivos de `detalhe-projeto` não mudaram. No formato `iconeInline` o `corIcone` e o
`caixaIcone` não contam. Não se criou cartão novo porque a casca (cartão de moldura fina,
`flex h-full flex-col`, título e descrição, rodapé de acção opcional) é a mesma.

**Estendido em** 2026-09-04 (sessão "Sobre a Alumni UNAGRO" de `alumni`) com o input
`superficie`, aditivo e só válido no formato `vertical`: `branca` (omissão) é, letra por
letra, a casca de sempre (`rounded-xl bg-white border border-gray-200`) e `suave`
troca-a pelo cinzento muito claro (`rounded-xl bg-bg-light border border-gray-100`), para
grelhas assentes num fundo quase branco (`bg-bg-lighter`) onde um cartão branco não se
lê. O `classeArtigo` passou a escolher a casca do `iconeInline` primeiro e só depois a
superfície, pelo que os usos anteriores saem no prerender iguais.

**Estendido em** 2026-09-04 (sessão "Pilares do modelo UNAGRO" de `inicio`) com a
superfície `sombra` e com o input `estiloCaixaIcone`, ambos aditivos: `superficie="sombra"`
dá o cartão branco **sem moldura**, `rounded-2xl p-6 shadow-sm`, para a faixa de pilares
assente num fundo `bg-bg-lighter`; e `estiloCaixaIcone="suave"` troca o quadrado de 48px
`bg-primary-deep` com ícone branco do `caixaIcone` pelo quadrado de 44px `bg-primary/10`
com o ícone de 20px em `text-primary-deep` (só conta com `caixaIcone` ligado). Os valores
por omissão são `branca` e `solida`, pelo que `alumni`, `candidatura-docentes`,
`detalhe-projeto` e `hub-unagro` saem no prerender exactamente como antes — confirmado no
`dist`, onde os cartões do Hub continuam com o mesmo conjunto de classes. Não se criou
cartão novo porque a casca e a pilha ícone/título/descrição são as mesmas; só mudam a
moldura e a cor da caixa do ícone.

**Inputs:** `icone: string` (obrigatório) · `titulo: string` (obrigatório) ·
`descricao: string` (obrigatório) · `corIcone: 'primario' | 'dourado'` (por omissão
`'primario'`) · `formato: 'vertical' | 'iconeInline'` (por omissão `'vertical'`) ·
`superficie: 'branca' | 'suave' | 'sombra'` (por omissão `'branca'`; só conta no formato
`vertical`) · `caixaIcone: boolean` (por omissão `false`) ·
`estiloCaixaIcone: 'solida' | 'suave'` (por omissão `'solida'`; só conta com `caixaIcone`) ·
`textoAcao?: string` (sem ele não há rodapé) · `linkAcao: string` (por omissão `''`) ·
`iconeAcao: string` (por omissão `'arrow-right'`)

**Como usar:**

    <app-cartao-recurso corIcone="dourado" [icone]="objetivo.icone" [titulo]="objetivo.titulo"
      [descricao]="objetivo.descricao" [appRevelarAoScroll]="$index + 1" />

    <app-cartao-recurso [caixaIcone]="true" [icone]="forma.icone" [titulo]="forma.titulo"
      [descricao]="forma.descricao" [textoAcao]="forma.textoAcao" [linkAcao]="forma.linkAcao"
      [iconeAcao]="forma.iconeAcao" [appRevelarAoScroll]="$index" />

    <app-cartao-recurso formato="iconeInline" [icone]="solucao.icone" [titulo]="solucao.titulo"
      [descricao]="solucao.descricao" [appRevelarAoScroll]="$index + 1" />

    <app-cartao-recurso superficie="suave" [icone]="pilar.icone" [titulo]="pilar.titulo"
      [descricao]="pilar.descricao" [appRevelarAoScroll]="$index" />

    <app-cartao-recurso superficie="sombra" [caixaIcone]="true" estiloCaixaIcone="suave"
      [icone]="pilar.icone" [titulo]="pilar.titulo" [descricao]="pilar.descricao"
      [appRevelarAoScroll]="$index" />

**Dados:** nas formas de apoio do Hub os textos vêm de uma constante estrutural no `.ts`
da página (`FORMAS_APOIO_BRUTAS`, resolvida por `localizarProfundo`) — não há modelo,
mock nem serviço, porque não é uma lista que a API venha a servir. Na solução implementada
do detalhe de projecto os cartões vêm do **próprio projecto**: `solucoes?: SolucaoProjeto[]`
(alias de `ObjetivoProjeto`, mesma forma `{ id, icone, titulo, descricao }`) e
`descricaoSolucao?: string` em `src/app/core/modelos/projeto.model.ts`, conteúdo em
`src/app/core/dados/projetos.mock.ts` e tradução no `ProjetosService`. O `solucoes` era um
`string[]` obrigatório legado, sem nenhum template a lê-lo — foi **substituído** por esta
forma estruturada em vez de se acumularem os dois campos. (O `cronograma` continua legado e
sem markup.)

**Usado em:** `alumni`, `candidatura-docentes`, `detalhe-projeto`, `hub-unagro`, `inicio`

### app-cartao-proxima-data

**Onde:** `src/app/shared/componentes/cartao-proxima-data/cartao-proxima-data.component.ts`
**Criado para:** sessão "Próximas Datas" de `formacoes` (2026-09-03)
**Descrição:** linha de uma lista **vertical** de datas do calendário de formação (não é
cartão de grelha): bloco de data quadrado de 56px (`rounded-xl`) à esquerda com o **mês
em maiúsculas pequeno em cima e o dia grande a negrito por baixo**, no meio a categoria
em maiúsculas miúdas, o título em `text-primary-deep` e uma linha de detalhe pequena, e
um `chevron-right` cinzento encostado à direita. Cartão branco de moldura
`border-gray-200`, sem sombra — feito para assentar num fundo `bg-bg-lighter`. O bloco de
data é `bg-primary-deep` branco no estado `confirmada` e `bg-gray-100` escuro no
`prevista`. Com `link` a **linha inteira** passa a `<a [routerLink]>` (pode, porque não
há botão dentro dela) e o fragmento `#ancora` é separado da rota como no `app-botao`.
Recebe os textos já localizados e a `data` **ISO crua**, que formata ele mesmo com
`toLocaleDateString` no idioma corrente ("MAIO"/"MAY", dia com dois dígitos).
Não confundir com o `app-cartao-evento` — esse põe o dia acima do mês, tem o bloco
`bg-primary` fixo, selo de âmbito, `map-pin` e botão "Inscrever-se", e está em uso noutras
páginas; foi por isso que não deu para reaproveitar.

**Inputs:** `dados: ProximaDataCartao` (obrigatório; interface exportada no próprio
ficheiro — `id`, `data` ISO, `categoria`, `titulo`, `detalhe`,
`estado: 'confirmada' | 'prevista'`, `link?`)

**Como usar:**

    <div class="mt-10 flex flex-col gap-4">
      @for (proxima of proximasDatas(); track proxima.id) {
        <app-cartao-proxima-data [dados]="proxima" [appRevelarAoScroll]="$index" />
      }
    </div>

**Dados:** modelo `src/app/core/modelos/proxima-data.model.ts`, mock
`src/app/core/dados/proximas-datas.mock.ts`, serviço
`src/app/core/servicos/proximas-datas.service.ts` (`proximasDatas` já localizado e
ordenado por data).

**Usado em:** `formacoes`

### app-cartao-startup

**Onde:** `src/app/shared/componentes/cartao-startup/cartao-startup.component.ts`
**Criado para:** sessão "Startups & Incubação" de `hub-unagro` (2026-09-03)
**Descrição:** cartão de uma agritech incubada, branco de moldura `border-gray-200`,
`rounded-lg` e **sem sombra**: a fotografia fica **embutida** no topo (o cartão tem `p-3`
em volta e a imagem `rounded-md` em `aspect-[16/10]`), e por baixo a etiqueta de
categoria em maiúsculas miúdas (`text-[10px] tracking-wide`), o nome a negrito em
`text-primary-dark`, a descrição pequena em cinzento e a ligação "Saiba Mais" em verde
com um `arrow-up-right` à direita. Sem `imagem_url` cai no marcador cinzento do
`app-espaco-imagem`. Não confundir com o `app-cartao-projecto` — esse tem a imagem a
sangrar até à borda, o selo de categoria **sobreposto** à fotografia, sombra, `hover`
que levanta o cartão e um rodapé "Resultado principal" com botão redondo; foi por isso
que não deu para reaproveitar.

**Inputs:** `startup: StartupCartao` (obrigatório; interface exportada no próprio
ficheiro — `id`, `categoria`, `nome`, `descricao`, `link`, `imagem_url?`, tudo já
localizado). O `link` pode trazer `#ancora`, que é separada da rota como no `app-botao`.

**Como usar:**

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      @for (startup of startups(); track startup.id) {
        <app-cartao-startup [startup]="startup" [appRevelarAoScroll]="$index" />
      }
    </div>

**Dados:** modelo `src/app/core/modelos/startup.model.ts`, mock
`src/app/core/dados/startups.mock.ts`, serviço
`src/app/core/servicos/startups.service.ts` (`startups`, já localizado).

**Usado em:** `hub-unagro`

### app-cartao-projecto-inovador

**Onde:** `src/app/shared/componentes/cartao-projecto-inovador/cartao-projecto-inovador.component.ts`
**Criado para:** sessão "Projectos Inovadores" de `hub-unagro` (2026-09-03)
**Descrição:** cartão de uma iniciativa em estágio de pesquisa à procura de apoio, em dois
formatos. `simples` (omissão) é o cartão branco alto de moldura `border-gray-200` com o
ícone num quadrado de 44px `bg-accent/20` (ícone em `text-primary`), título em
`text-primary-dark`, descrição pequena e o rodapé **encostado ao fundo** (`mt-auto`) com
"Estágio: <fase>" a negrito miúdo à esquerda e um **coração** de guardar à direita.
`destaque` é o cartão largo de duas colunas: fotografia à esquerda a ~40% e altura total
(`sm:absolute sm:inset-0` dentro de um `relative`, para o cartão ganhar a altura pela
coluna de texto), a pílula da meta (`app-selo` `neutro`/`pequeno`) e a percentagem
atingida numa linha, título maior, descrição, **barra de progresso** (`role="progressbar"`
com `aria-valuenow`/`min`/`max` e a largura por `[style.width.%]`) e o botão "Apoiar
Projeto" (`contorno`, `raio="medio"`). Sem `imagem_url` cai no marcador cinzento do
`app-espaco-imagem`.

Recebe os valores **crus** e formata-os ele mesmo: `metaFinanciamento: 120000` + `moeda:
'USD'` dão "Buscando $120k" (`Intl.NumberFormat` compacto com `currencyDisplay:
'narrowSymbol'`, `minimumFractionDigits: 0` — sem isso o estilo `currency` impõe duas
casas e sai "$120.0k"; o locale é **fixo em `en-US`** de propósito, porque em `pt` a
notação compacta com moeda dá "120 mil US$") e `percentagemMeta: 85` dá "85% Meta
atingida" e a largura da barra.

Não confundir com o `app-cartao-startup` — esse tem a fotografia embutida no topo e a
ligação "Saiba Mais", e não tem meta de financiamento, barra de progresso, estágio nem
coração; está em uso na sessão 1 da mesma página e não deu para reaproveitar. Também não
é o `app-cartao-projecto` (projecto de investigação, com selo sobre a fotografia e rodapé
de resultado). Trouxe o ícone `heart` a `dados-icones.ts`.

**Inputs:** `projecto: ProjectoInovadorCartao` (obrigatório; interface exportada no
próprio ficheiro, com os textos já localizados — `id`, `titulo`, `descricao`, `destaque?`,
`icone?`, `imagem_url?`, `estagio?`, `metaFinanciamento?`, `moeda?`, `percentagemMeta?`,
`link?`) · `formato: 'destaque' | 'simples'` (por omissão `'simples'`)
**Outputs:** `guardarSolicitado: ProjectoInovadorCartao` — o coração do formato `simples`.
Afordância do mockup **sem backend**: falta o endpoint de favoritos, e o `hub-unagro`
ainda não liga o output.

**Como usar:** (o `sm:col-span-2` do destacado vem de quem monta a grelha, não do cartão)

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      @for (projecto of projectosInovadores(); track projecto.id) {
        <app-cartao-projecto-inovador [projecto]="projecto"
          [formato]="projecto.destaque ? 'destaque' : 'simples'"
          [class]="projecto.destaque ? 'sm:col-span-2' : 'sm:col-span-1'"
          [appRevelarAoScroll]="$index" />
      }
    </div>

O `[class]` com um valor em cada ramo (nunca vazio) **funde-se** com o `class` do `host`:
o prerender sai `class="block h-full sm:col-span-2"`. Padrão a copiar em grelhas *bento*,
onde a célula larga vive na mesma lista que as estreitas.

**Dados:** modelo `src/app/core/modelos/projecto-inovador.model.ts`, mock
`src/app/core/dados/projectos-inovadores.mock.ts`, serviço
`src/app/core/servicos/projectos-inovadores.service.ts` (`projectos`, `projectoDestacado`,
`projectosSimples`, já localizados). O `ProjectoInovador` **não** é o `Projeto` de
`projeto.model.ts` (projecto de investigação com cronograma, galeria e objectivos, servido
pelo `ProjetosService`).

**Usado em:** `hub-unagro`

### app-etapa-cronograma

**Onde:** `src/app/shared/componentes/etapa-cronograma/etapa-cronograma.component.ts`
**Criado para:** sessão "Cronograma do Projecto" de `detalhe-projeto` (2026-09-03)
**Descrição:** uma etapa de uma **linha temporal horizontal**: bola numerada de 40px em
cima, o seu troço da régua fina a seguir e, por baixo e alinhados à esquerda, o título
pequeno em `text-primary-dark` e a descrição miúda. A aparência sai toda do
`etapa().estado`: `concluida` dá bola `bg-primary-deep` branca e segmento
`bg-primary-deep`; `atual` dá bola `bg-accent` com halo `ring-4 ring-accent/25`,
segmento `bg-accent` e a descrição **a negrito em `text-text-primary`**; `futura` dá bola
`bg-gray-100` cinzenta e segmento `bg-gray-200`.

**A régua não é da secção — cada etapa desenha o seu segmento** (`hidden ... lg:block`),
o que faz a barra de progresso sair sozinha dos estados: a página não calcula
percentagens nem posiciona linhas `absolute` (ao contrário do `app-passo-metodologia`,
onde é a página que desenha a linha de ligação). Empilhado abaixo de `lg` o segmento
desaparece, porque uma régua horizontal não se lê em coluna.

O **número vem da ordem** (`[numero]="$index + 1"`) e o texto "Fase Atual" **não está nos
dados**: é o rótulo do estado `atual`, traduzido dentro do componente, e só entra quando a
etapa não traz `periodo`. Fora disso a descrição sai como `"<periodo> - <descricao>"`.
Não confundir com o `app-passos-formulario`/`app-indicador-passos` (fila de passos de um
formulário/processo, com ícones e sem estados de progresso por etapa) nem com o
`app-cartao-fase` (cartão de prazos de candidatura para fundos escuros).

**Inputs:** `etapa: EtapaCronograma` (obrigatório) · `numero: number` (obrigatório)

**Como usar:**

    <div class="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
      @for (etapa of p.cronograma ?? []; track etapa.id) {
        <app-etapa-cronograma [etapa]="etapa" [numero]="$index + 1"
          [appRevelarAoScroll]="$index + 1" />
      }
    </div>

**Dados:** as etapas são dados do **projecto** — `cronograma?: EtapaCronograma[]` em
`src/app/core/modelos/projeto.model.ts` (`id`, `titulo`, `periodo?`, `descricao`,
`estado: 'concluida' | 'atual' | 'futura'`), conteúdo em
`src/app/core/dados/projetos.mock.ts` e tradução no `ProjetosService`. O `cronograma` era
`{ data, titulo, descricao }` obrigatório e legado, sem nenhum template a lê-lo — foi
**substituído** por esta forma (e passou a opcional), como já se fez ao `solucoes`, em vez
de se acumularem dois campos. A faixa de números da mesma página é
`estatisticasImpacto?: EstatisticaProjeto[]`, campo novo que **reutiliza a interface** das
`estatisticasContexto` da sessão 1.

**Usado em:** `detalhe-projeto`

### app-galeria-mosaico

**Onde:** `src/app/shared/componentes/galeria-mosaico/galeria-mosaico.component.ts`
**Criado para:** sessão "Galeria Multimédia" de `detalhe-projeto` (2026-09-03)
**Descrição:** mosaico de fotografias de cantos arredondados (`rounded-xl`, `gap-6`) —
uma imagem **grande e alta à esquerda** (colunas 1–2 e as duas linhas), **duas
pequenas lado a lado em cima à direita** e uma **larga em baixo à direita** (colunas
3–4). Em `lg` é uma grelha de 4 colunas com as linhas explícitas
`lg:grid-rows-[11rem_23rem]` (a primeira mais baixa do que a segunda, como no mockup);
em `sm` são duas colunas com a grande a ocupar as duas e alturas fixas por célula;
abaixo de `sm` fica uma coluna, a grande em primeiro. **A posição sai da ordem da
lista** (`CLASSES_CELULA_MOSAICO` indexado pelo `$index`) — não há campo de layout nos
dados. Com **menos de 4 itens** a galeria cai numa grelha uniforme (`h-44 sm:h-52
lg:h-64`) em vez de deixar buracos no mosaico, e os itens **a partir do quinto**
seguem em células iguais nas linhas implícitas da mesma grelha; foi por isso que as
linhas são alturas absolutas e não `1fr/2fr` — com `fr` as linhas extra espremiam as
duas primeiras. Legenda **opcional** por item, sobreposta ao canto inferior esquerdo
em `text-xs sm:text-sm` branco sobre `bg-gradient-to-t from-black/70` (é a legenda
"Estado Inicial (2024)" da fotografia grande). Item sem `url` cai no marcador cinzento
do `app-espaco-imagem` (`proporcao="cover"`), nunca num caminho inventado.

É o **primeiro componente partilhado que importa a `RevelarAoScrollDirective`**: a
cascata das fotografias (`[appRevelarAoScroll]="$index"`) tem de viver com a grelha, e
a grelha é o próprio mosaico. Não importa o Motion nem reimplementa a revelação. Só
usa a `TraducaoService` para a frase do `@empty`; o conteúdo entra todo por input.

**Inputs:** `itens: ItemGaleria[]` (obrigatório) · `textoAlternativo: string` (por
omissão `''`; `alt` de recurso para os itens sem legenda — na página é o título do
projecto)

**Como usar:**

    <app-galeria-mosaico [itens]="p.galeria ?? []" [textoAlternativo]="p.titulo" />

**Dados:** modelo genérico `ItemGaleria` (`id`, `url?`, `legenda?`) em
`src/app/core/modelos/galeria.model.ts` — ficheiro próprio de propósito, para o
mosaico não depender do modelo de projectos. No detalhe de projecto as fotografias são
dados do **projecto**: `galeria?: ItemGaleria[]` em
`src/app/core/modelos/projeto.model.ts`, conteúdo em
`src/app/core/dados/projetos.mock.ts` (`ItemGaleriaBruto`, com a `legenda` em
`TextoBilingue`) e tradução no `ProjetosService`. O `numeroImagensGaleria: number` era
um contador legado de marcadores cinzentos, lido só por um `computed` morto da página —
foi **substituído** por este campo (opcional) e o `computed` apagado, como já se fez ao
`solucoes` e ao `cronograma`.

**Usado em:** `detalhe-projeto`

### app-membro-equipa

**Onde:** `src/app/shared/componentes/membro-equipa/membro-equipa.component.ts`
**Criado para:** sessão "Equipa do Projecto" de `detalhe-projeto` (2026-09-04)
**Descrição:** uma pessoa de uma **fila de equipa**, tudo centrado e **sem cartão,
moldura nem fundo** — assenta direito no fundo da secção: retrato **circular** grande
no topo (`h-28 w-28 sm:h-32 lg:h-36`, `object-cover`) dentro de uma caixa
`rounded-full overflow-hidden` com um anel discreto (`ring-1 ring-gray-200`), nome em
`text-primary-deep` semibold `text-base` bem separado por baixo (`mt-6`), e o cargo em
`text-[11px] uppercase tracking-widest text-text-secondary`. O `uppercase` é
**apresentação**: os dados guardam o cargo escrito normalmente (`Coordenador Geral`).
Sem `foto_url` cai no marcador cinzento do `app-espaco-imagem` (`proporcao="cover"`,
`alturaMinima="0"`), recortado em círculo pela caixa — nunca num caminho inventado. A
`<img>` leva `loading="lazy"` e o `alt` é o nome do membro.

Não deu para reaproveitar o `app-cartao-investigador`: esse é um **cartão** branco de
moldura `border-gray-200` com fotografia **rectangular `aspect-[4/5]`** de bordo a bordo
e pílulas de **especialidades obrigatórias**, e recebe um `Investigador` do
`investigacao.model` com o `cargo` ainda em `TextoBilingue`. Chegar ao retrato circular
sem cartão exigiria trocar a casca, a proporção da imagem e o tipo de dados do input —
não é aditivo, e ele está em uso na sessão "Investigadores Principais" de
`desenvolvimento`, que ficou intacta.

**Inputs:** `membro: MembroEquipa` (obrigatório)

**Como usar:** (a grelha e a cascata são da página)

    <div class="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      @for (membro of p.equipa ?? []; track membro.id) {
        <app-membro-equipa [membro]="membro" [appRevelarAoScroll]="$index + 1" />
      }
    </div>

**Dados:** modelo genérico `MembroEquipa` (`id`, `nome` sem tradução, `cargo`,
`foto_url?`) em `src/app/core/modelos/membro-equipa.model.ts` — ficheiro próprio de
propósito, como o `ItemGaleria`, para o componente não depender do modelo de projectos e
servir qualquer secção de equipa. No detalhe de projecto a equipa é dado do **projecto**:
`equipa?: MembroEquipa[]` (campo **novo e opcional**) em
`src/app/core/modelos/projeto.model.ts`, conteúdo em
`src/app/core/dados/projetos.mock.ts` (`MembroEquipaBruto`, com o `cargo` em
`TextoBilingue` e o `nome` em texto simples) e tradução no `ProjetosService`, que monta o
projecto campo a campo — **sem a entrada `equipa:` nesse mapeamento o campo nunca chega à
página**. Os **quatro** projectos do mock têm equipa; só o primeiro é o do mockup, os
outros três são conteúdo de marcador e reutilizam os mesmos quatro retratos.

**Usado em:** `detalhe-projeto`

### app-item-informacao

**Onde:** `src/app/shared/componentes/item-informacao/item-informacao.component.ts`
**Criado para:** sessão "Envie-nos uma Mensagem / Uma Ponte para o Futuro do Campo" de
`contactos` (2026-09-04)
**Descrição:** nota de informação que acompanha um bloco de texto: emblema **circular**
de 48px (`h-12 w-12 rounded-full bg-gray-100`) com o ícone de 20px em `text-primary-deep`
à esquerda e, à direita, um título curto `text-xs font-bold uppercase tracking-[0.12em]`
verde escuro com uma descrição `text-sm` cinzenta por baixo. Sem cartão, moldura nem
sombra — assenta direito no fundo da secção. O `uppercase` é apresentação: os dados
guardam o título escrito normalmente (`Localização Central`).

Não deu para reaproveitar o `app-item-contacto`: esse é a **caixa quadrada** de 36px
(`rounded-lg bg-primary/10`) com **três** linhas (rótulo, valor em destaque e detalhe) e
tem `valor`/`detalhe` como `input.required` — passar ao emblema circular de duas linhas
obrigava a mexer no tipo desses inputs, e ele está em uso em `candidaturas`. Também não
é o `app-item-requisito` (ícone solto, sem caixa) nem o `app-pilar-icone` (tudo centrado,
quadrado arredondado).

**Inputs:** `icone: string` (obrigatório) · `titulo: string` (obrigatório) ·
`descricao: string` (obrigatório) · `formato: 'etiqueta' | 'simples'` (por omissão
`'etiqueta'`)

O formato `simples` (acrescentado em 2026-09-04 para a sessão "Contribua com a UNAGRO"
de `alumni`) troca o emblema circular pelo **quadrado arredondado de 40px**
(`h-10 w-10 rounded-xl`, ícone de 18px), o título passa a `text-sm font-bold` **escrito
normalmente** (sem `uppercase` nem `tracking`) e a descrição a `text-xs` — serve pares de
notas curtas lado a lado numa coluna estreita. O `'etiqueta'` por omissão mantém o item
de `contactos` exactamente como estava.

**Como usar:** (a coluna e a cascata são da página)

    <div class="mt-10 flex flex-col gap-8">
      @for (informacao of informacoes(); track informacao.id) {
        <app-item-informacao [icone]="informacao.icone" [titulo]="informacao.titulo"
          [descricao]="informacao.descricao" [appRevelarAoScroll]="$index" />
      }
    </div>

**Dados:** conteúdo **estrutural** da secção — constante `INFORMACOES_BRUTAS` no `.ts` da
página (`id`, `icone`, `titulo`/`descricao` em `TextoTraduzido`), resolvida por
`localizarProfundo`, como as `VANTAGENS_BRUTAS` de `formacoes`. Não há modelo, mock nem
serviço: são duas notas fixas do texto da secção, não uma lista que a API venha a servir.

**Usado em:** `contactos` · `alumni` (formato `simples`)

### app-item-detalhe-barra

**Onde:** `src/app/shared/componentes/item-detalhe-barra/item-detalhe-barra.component.ts`
**Criado para:** sessão "Nossa Localização" de `contactos` (2026-09-04)
**Descrição:** bloco de detalhe com uma **barra vertical fina à esquerda**
(`border-l-2 pl-4`): rótulo curto **por cima**, em maiúsculas miúdas
(`text-[11px] font-semibold uppercase tracking-[0.18em]`), e o valor em texto normal
(`text-sm sm:text-base`) por baixo — morada, coordenadas, horário. Sem cartão, moldura
nem sombra: assenta direito no painel da secção. No tema `escuro` a barra e o rótulo são
dourados (`border-secondary`/`text-secondary`) e o valor `text-white/90`, para painéis
`bg-primary-deep`; no `claro` a barra e o rótulo são verdes e o valor `text-text-primary`.

Não deu para reaproveitar o `app-item-estatistica` `formato="barra"`: esse põe o **valor
em destaque primeiro** (`text-xl sm:text-2xl` a negrito) e o rótulo **por baixo**, com a
barra verde — trocar a ordem e a cor obrigava a um formato e a um tema novos que
mudavam o significado do componente (número de indicador vs. par rótulo/valor), e ele
está em uso em `desenvolvimento` e `detalhe-projeto`. Também não é o
`app-item-informacao` (emblema circular com ícone, sem barra) nem o `app-item-contacto`
(caixa quadrada e três linhas).

**Inputs:** `rotulo: string` (obrigatório) · `valor: string` (obrigatório) ·
`tema: 'escuro' | 'claro'` (por omissão `'escuro'`)

**Como usar:** (a coluna e a cascata são da página)

    <div class="mt-10 flex flex-col gap-8">
      @for (detalhe of detalhesLocalizacao(); track detalhe.id) {
        <app-item-detalhe-barra [rotulo]="detalhe.rotulo" [valor]="detalhe.valor"
          [appRevelarAoScroll]="$index + 1" />
      }
    </div>

**Dados:** conteúdo **estrutural** da secção — constante `DETALHES_LOCALIZACAO_BRUTOS` no
`.ts` da página (`id`, `rotulo`/`valor` em `TextoTraduzido`), resolvida por
`localizarProfundo`, como as `INFORMACOES_BRUTAS` da sessão 1 da mesma página. Não há
modelo, mock nem serviço: a morada e as coordenadas da instituição não são lista de API.

**Usado em:** `contactos`

### app-mapa-google

**Onde:** `src/app/shared/componentes/mapa-google/mapa-google.component.ts`
**Criado para:** sessão "Nossa Localização" de `contactos` (2026-09-04)
**Descrição:** mapa do Google **embutido** (`<iframe>`), de bordo a bordo, sem moldura
nem cantos arredondados — é o **único iframe do projecto**. Usa o embed **sem chave de
API** (`https://www.google.com/maps?q=<lat>,<lng>&z=<zoom>&output=embed`), que só aceita
coordenadas e zoom, e monta o URL a partir dos inputs. O Angular recusa um URL em
`[src]` de iframe sem o marcar como recurso de confiança: a
`DomSanitizer.bypassSecurityTrustResourceUrl` fica **dentro do componente**, para quem o
usa passar apenas números. O iframe leva `loading="lazy"`,
`referrerpolicy="no-referrer-when-downgrade"`, `allowfullscreen` e `title` (obrigatório
para leitores de ecrã) — sem `titulo` entra o rótulo genérico traduzido dentro do
componente. **A altura vem de quem o usa**: o host é `block h-full w-full` e o iframe
ocupa-o todo, por isso basta `class="min-h-[420px]"` na página ou uma célula de grelha
esticada. Sai no prerender do `ng build` sem problema (o `src` sanitizado aparece no
HTML do servidor).

**Inputs:** `latitude: number` (obrigatório) · `longitude: number` (obrigatório) ·
`zoom: number` (por omissão `12`) · `titulo: string` (por omissão `''` — cai em
"Mapa da localização"/"Location map")

**Como usar:**

    <app-mapa-google class="min-h-[420px]" [latitude]="latitudeCampus"
      [longitude]="longitudeCampus" [titulo]="tituloMapa()" />

**Usado em:** `contactos`

### app-cartao-unidade-esqueleto

**Onde:** `src/app/shared/componentes/cartao-unidade-esqueleto/cartao-unidade-esqueleto.component.ts`
**Criado para:** sessão "Centros e Laboratórios" de `desenvolvimento` (2026-09-07)
**Descrição:** espera de um `app-cartao-unidade` — a mesma moldura alta
(`min-h-80 rounded-xl`) com os blocos do selo, das duas linhas do nome e do botão no
sítio onde eles ficam no cartão real, para a grelha não saltar quando os laboratórios
chegam da API. `aria-hidden`, sem texto nem foco.

**Inputs:** nenhum.

**Como usar:**

    @if (consultaUnidades.isPending()) {
      @for (esqueleto of esqueletosUnidades; track esqueleto) {
        <app-cartao-unidade-esqueleto />
      }
    }

**Usado em:** `desenvolvimento`

### appTiraHorizontal (diretiva)

**Onde:** `src/app/shared/diretivas/tira-horizontal.directive.ts`
**Criada para:** sessão "Centros e Laboratórios" de `desenvolvimento` (2026-09-07)
**Descrição:** diretiva, não componente. Põe-se no elemento `overflow-x-auto` de uma tira
que rola na horizontal e expõe `podeRecuar()`, `podeAvancar()` e `rolar(1 | -1)`, para os
dois botões de seta do **canto superior direito** da secção — que ficam noutro ponto do
template e por isso não podem viver dentro da tira. O passo é a largura do primeiro
cartão mais o `column-gap`, o que faz o `snap` encaixar o seguinte no lugar. Mede no
`afterNextRender` e mantém-se actualizada com um `MutationObserver` (os cartões só chegam
quando a query resolve) e um `ResizeObserver` (a largura da janela). No servidor não
mede: assume o início da tira, que é onde ela começa.

Distingue-se da `app-galeria-mosaico`, que tem a sua própria tira **só em telemóvel**,
com setas sobrepostas ao centro e gradientes nos extremos, e não serve fora da galeria.

**Como usar:**

    <button [disabled]="!tiraUnidades()?.podeRecuar()" (click)="rolarUnidades(-1)">…</button>
    <button [disabled]="!tiraUnidades()?.podeAvancar()" (click)="rolarUnidades(1)">…</button>

    <div appTiraHorizontal class="flex snap-x snap-mandatory gap-6 overflow-x-auto">
      @for (unidade of unidades(); track unidade.id) {
        <app-cartao-unidade class="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]" … />
      }
    </div>

No componente: `protected readonly tiraUnidades = viewChild(TiraHorizontalDirective);`.
A barra de scroll esconde-se numa classe do próprio componente (`.tira-unidades`), e não
numa variante arbitrária do Tailwind: o `[&::-webkit-scrollbar]` teria de ir escapado no
HTML e o Tailwind já não reconheceria a classe ao varrer o ficheiro.

**Usado em:** `desenvolvimento`

## Sessões sem componente novo

Blocos únicos que ficaram em markup da página — registados aqui para não se procurar
por um componente que não existe.

### app-cartao-historia-alumni

**Onde:** `src/app/shared/componentes/cartao-historia-alumni/cartao-historia-alumni.component.ts`
**Criado para:** sessão "Onde estão os nossos Alumni?" de `alumni` (2026-09-04)
**Descrição:** célula de uma grelha de **histórias de antigos alunos sobre fundo escuro**,
em duas partes dentro de um `<figure>`: (1) retrato em pé (`aspect-[4/5]`,
`rounded-2xl overflow-hidden`, `object-cover`) com uma **faixa de vidro fosco encostada
ao fundo** (`absolute inset-x-3 bottom-3`) a mostrar o nome a negrito branco e o cargo
por baixo — a faixa é o `app-cartao-vidro` em `tamanho="compacto"`, não markup próprio; e
(2) o testemunho **fora do cartão**, num `<figcaption>` `mt-5 text-sm italic text-white/70`
entre aspas curvas. Sem cartão, moldura nem sombra em volta do conjunto. Sem `foto` fica o
fundo neutro translúcido (`bg-white/10`) do próprio contentor da imagem — não usa o
marcador cinzento do `app-espaco-imagem`, que se lê mal em fundo verde escuro.

As duas partes vivem no mesmo componente porque andam sempre juntas e formam a célula da
grelha; à página fica só a grelha. Não deu para reaproveitar o `app-membro-equipa`
(retrato **circular** sem faixa, nome e cargo por baixo, para fundos claros) nem o
`app-cartao-investigador` (cartão branco com pílulas de especialidade obrigatórias) —
nenhum tem faixa sobreposta nem citação, e chegar lá obrigava a trocar a casca, a forma da
imagem e o tipo dos inputs deles.

**Inputs:** `historia: HistoriaAlumniCartao` (obrigatório; interface exportada no próprio
ficheiro, com os textos já localizados — `id`, `nome`, `cargoAtual`, `testemunho`,
`foto?`)

**Como usar:** (a grelha e a cascata são da página)

    <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      @for (historia of historiasDestaque(); track historia.id) {
        <app-cartao-historia-alumni [historia]="historia" [appRevelarAoScroll]="$index" />
      }
    </div>

**Dados:** modelo `src/app/core/modelos/historia-alumni.model.ts` (ganhou o campo
**opcional** `foto?: string` — obrigatório partiria as seis histórias sem retrato que já
lá estavam), mock `src/app/core/dados/historias-alumni.mock.ts` (as três entradas com
retrato ficaram **no topo**, sem se tocar nas seis antigas) e serviço
`src/app/core/servicos/alumni.service.ts`, com o `computed` **`historiasDestaque`** — as
histórias **com fotografia**, no máximo três. A filtragem vive no serviço; a página só
mostra o sinal. O `curso` e o `anoConclusao` das três novas entradas são valores
plausíveis inventados: o mockup não os dá e o modelo exige-os.

**Usado em:** `alumni`

### Painel de subscrição "Acompanhar Projectos" (`hub-unagro`, 2026-09-03)

Painel `bg-primary-dark rounded-xl p-8 sm:p-10` em duas colunas (`lg:grid-cols-2`,
empilha em ecrã pequeno): à esquerda título branco e descrição em `text-white/70`; à
direita uma fila com o `form-input-field` (`variante="caixa"` por omissão,
`type="email"`, `[label]="''"`) e o `app-botao` `secundario`/`raio="medio"`/`tipo="submit"`,
e por baixo a nota de privacidade em `text-white/50` — que o sinal `estadoSubscricao`
(`'ocioso' | 'enviado'`) troca pela confirmação. É um bloco único, não uma lista, por
isso não virou componente.

O erro do campo **não** passa pelo `criarErrosFormulario`: esse injecta o
`FormGroupDirective` e só funciona dentro de um componente que viva debaixo do
`[formGroup]`, o que não é o caso da classe de uma página. O padrão a copiar é
`[erro]="erroEmail()"`, um `computed` que lê `toSignal(controlo.events)` para reagir ao
`touched`/validade e devolve a mensagem traduzida ou `null`. Falta o endpoint de
subscrição (`// TODO:` no `subscrever()`).

### Cartão do formulário de contacto (`contactos`, 2026-09-04)

Sessão de duas colunas (`lg:grid-cols-2 lg:items-center`) sobre `bg-bg-lighter`: à
esquerda o cartão branco do formulário (`rounded-3xl bg-white p-6 sm:p-8 shadow-xl
shadow-black/5`) e à direita o bloco de texto (`app-selo` `primario`/`pequeno` com
`uppercase tracking-[0.16em]`, título, parágrafo e os `app-item-informacao`). O
formulário é um bloco único, não uma lista, por isso ficou em markup da página, como o
painel de subscrição do `hub-unagro`.

Campos todos em `variante="minimalista"`: `form-input-field` para nome, e-mail e
mensagem (`type="textarea"`, `[rows]="5"`) e `field-select-v2` para o assunto. O botão é
o `app-botao` `primario`, `tamanho="lg"`, `raio="completo"` (pílula — **já era o valor
por omissão**, não foi preciso estender nada), `[larguraTotal]="true"`,
`icone="send"`/`posicaoIcone="direita"`, com `aCarregar`/`desativado` ligados ao
`estadoEnvio() === 'enviando'` e a confirmação num `<p role="status">` quando fica
`'sucesso'`.

Os erros **não** passam pelo `criarErrosFormulario` (injecta o `FormGroupDirective`, que
não existe na classe de uma página): há um helper privado `sinalErro(controlo, mensagem)`
que faz `toSignal(controlo.events)` e devolve o `computed` da mensagem traduzida — a
versão reutilizável do `erroEmail()` do `hub-unagro`, agora para quatro campos.

**Por corrigir (pré-existente, fora do âmbito):** em
`src/app/shared/componentes/select-field-v2/select-field-v2.ts`, o
`CLASSES_ROTULO.minimalista` traz por engano as classes do *campo* em vez das do
*rótulo* (`py-1.5 text-base ... border-b border-gray-200`), pelo que o rótulo do
`field-select-v2` minimalista sai grande e sublinhado ao lado dos rótulos miúdos em
maiúsculas do `form-input-field`. Afecta também `modal-agendar-visita`,
`candidatura-docentes` e `inscricao`; não se tocou nele para não mudar essas páginas.

### Painel de localização a toda a largura (`contactos`, 2026-09-04)

Sessão 2 de `contactos` (`#secao-localizacao`), **full-bleed**: `<section class="bg-white">`
com um `div class="grid lg:grid-cols-2"` **sem `gap` e fora do `app-container-pagina`** —
as duas metades encostam uma à outra e vão de bordo a bordo. À esquerda o painel
`bg-primary-deep` (`flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-16`)
com o título branco `text-3xl`, os `app-item-detalhe-barra` numa coluna `gap-8` e a
ligação dourada "Abrir no Google Maps" (`inline-flex w-fit items-center gap-2 text-sm
font-bold text-secondary`, `target="_blank"` + `rel="noopener noreferrer"`) com o ícone
`external-link` à direita; à direita o `app-mapa-google` como célula da grelha, que
estica à altura da linha (`min-h-[420px]` para o caso de o painel ser mais baixo). O
painel é um bloco único, não uma lista, por isso ficou em markup da página.

O `external-link` (seta a sair de uma caixa) foi **acrescentado** a
`src/app/shared/componentes/icone/dados-icones.ts` — não havia ícone de ligação externa;
o `arrow-up-right`, que existia, é a seta de "saiba mais" já usada noutros cartões.

### Missão + dimensão da rede da sessão "Sobre a Alumni UNAGRO" (`alumni`, 2026-09-04)

Sessão 1 de `alumni` (`#secao-sobre-alumni`), sobre `bg-bg-lighter`, em **duas grelhas
seguidas**: a primeira `lg:grid-cols-3` com o cartão branco da missão a ocupar duas
colunas (`lg:col-span-2`, `rounded-2xl border-gray-100 bg-white p-8 sm:p-10 shadow-sm
shadow-black/5`, título `text-xl` verde escuro e parágrafo cinzento) e, na terceira, o
cartão verde do indicador (`rounded-2xl bg-primary-deep p-8 sm:p-9`) com o `app-icone`
dourado de 32px por cima de um `app-item-estatistica` `tema="sobreEscuro"`; a segunda
grelha (`mt-6 sm:grid-cols-2 lg:grid-cols-3`) tem os três `app-cartao-recurso`
`superficie="suave"`. Os dois cartões são blocos únicos, não listas, por isso ficaram em
markup da página — só o **conteúdo** do verde vem de dados (ver abaixo).

O cartão verde vive dentro de `@if (membrosRede(); as membros)`: sem o indicador a
grelha fica só com a missão em duas colunas, em vez de um buraco. O ícone também vem dos
dados (`membros.icone`, opcional no modelo `Estatistica`), por isso está num `@if` seu.

**Dados:** modelo `Estatistica` (`src/app/core/modelos/estatistica.model.ts`), conteúdo em
`src/app/core/dados/estatisticas.mock.ts` — a const **nova** `ESTATISTICA_MEMBROS_ALUMNI_MOCK`
(indicador **único**, ao lado da lista `ESTATISTICAS_IMPACTO_ALUMNI_MOCK`, que não se
tocou para não meter um sexto número na futura faixa) — e o sinal `membrosRede` do
`AlumniService`, que devolve `undefined` quando não há indicador. No dia da API muda-se a
linha `private readonly membrosRedeBruto = signal(ESTATISTICA_MEMBROS_ALUMNI_MOCK)`.
Os três eixos (Educação/Networking/Carreiras) e o texto da missão são **estruturais**:
constante `PILARES_ALUMNI_BRUTOS` e `computed` de `getTraducao` no `.ts` da página, como
as `VANTAGENS_BRUTAS` de `formacoes`.

O ícone `handshake` (duas mãos a apertar-se, Lucide) foi **acrescentado** a
`src/app/shared/componentes/icone/dados-icones.ts` — não havia ícone de parceria; o
`users`, o `graduation-cap` e o `award` já existiam.

**Nota pré-existente (não corrigida):** `ESTATISTICAS_IMPACTO_ALUMNI_MOCK` tem a entrada
`empresas-fundadas` **repetida**, com o mesmo `id` — quem a renderizar com
`track estatistica.id` vai partir. Não se tocou porque a lista não é usada por esta sessão.

## Já existiam antes do agente

Componentes partilhados que **não** foram criados por este agente mas que ele deve
reutilizar. Lista de arranque, para consulta rápida; a fonte de verdade é sempre
`ls src/app/shared/componentes/` e o `.ts` de cada um.

- **Cartões:** `cartao-curso`, `cartao-evento`, `cartao-evento-destaque`,
  `cartao-noticia`, `cartao-noticia-destaque`, `cartao-noticia-resumo`,
  `cartao-projecto` (+ `cartao-projecto-esqueleto`), `cartao-bolsa`, `cartao-unidade`,
  `cartao-recurso`, `cartao-requisito`, `cartao-fase`, `cartao-linha-investigacao`,
  `cartao-chamada-acao`
- **Estrutura de secção:** `container-pagina`, `cabecalho-secao`, `titulo-bloco`,
  `container-banner-faixa-estatistica`, `banner-destaque`
- **Listas e navegação:** `abas`, `acordeao`, `filtro-pilula`, `indicador-passos`,
  `passos-formulario`, `lista-verificacao`, `item-requisito`, `item-contacto`,
  `dropdown-menu`, `painel-lateral`
- **Formulário:** `campo-texto`, `campo-upload`, `seletor`, `input-field`,
  `select-field-v2`, `botao`. Fora de `componentes/`, em `src/app/shared/formulario/`:
  `erros-formulario.ts` (mensagens do `ValidacaoService` como signals) e
  `validadores.ts` (validadores partilhados — `validarTelefoneComIndicativo`)
- **Diversos:** `espaco-imagem` (marcador cinzento das imagens), `icone`, `selo`,
  `faixa-estatisticas`, `faixa-patrocinadores`, `contador-regressivo`,
  `modal-generico`, `alert-modal`, `modal-nossa-historia`, `modal-orgaos-gestao`,
  `modal-pilares-institucionais`,
  `barra-topo`

### Contribuição da sessão "Contribua com a UNAGRO" (`alumni`, 2026-09-04)

Sessão 3 de `alumni` (`#secao-contribuir`), sobre `bg-white` (alterna com a sessão 2, que
é `bg-primary-deep`), em duas colunas `lg:grid-cols-2 lg:items-center lg:gap-16`: à
**esquerda** a fotografia (`/imagens/jovem-agronimos.png`, `h-72 sm:h-96 lg:h-[30rem]
rounded-3xl object-cover shadow-xl shadow-black/10`) — no mockup a foto estava à direita,
mas o pedido foi trocá-la para a esquerda — e à direita o `app-cabecalho-secao`
`tema="verde" alinhamento="esquerda" [mostrarTracos]="false" tamanhoDescricao="pequeno"`,
os dois `app-item-informacao` `formato="simples"` numa grelha `sm:grid-cols-2` e, por
baixo, dois `app-botao` `raio="medio"` empilhados em coluna estreita (`sm:max-w-xs`,
`[larguraTotal]="true"`): `variante="primario"` para "Fazer uma Doação" e
`variante="contorno"` para "Fazer parte da comunidade".

Nada aqui virou componente novo: a fotografia, a grelha e a pilha de botões são markup da
página, e as duas notas de apoio couberam no `app-item-informacao` com o formato novo.

**Dados:** conteúdo **estrutural** — constante `MODOS_CONTRIBUICAO_BRUTOS` (reaproveita a
interface `PilarAlumniBruto` do mesmo ficheiro) resolvida por `localizarProfundo` no `.ts`
da página, mais `computed` de `getTraducao` para título, descrição, legenda da imagem e
rótulos dos botões. Sem modelo, mock nem serviço: são as duas vias de apoio desenhadas na
secção, não uma lista que a API venha a servir.

**Ligações (pendentes):** não há rota de doações em `app.routes.ts` — `linkDoacao` aponta
para `/contactos` com `// TODO:`; `linkComunidade` sobe para `#secao-sobre-alumni`, como o
CTA do hero, até existir a rota de inscrição na comunidade.

**Usado em:** `alumni`

### Sessão "Parceiros Estratégicos" (`detalhe-projeto`, 2026-09-04)

Sessão 8 (última) de `detalhe-projeto` (`#secao-parceiros`), dentro do
`@if (projeto(); as p)` mas **fora** de qualquer `@if` de campo do projecto — a faixa é
institucional, não do projecto. Faixa baixa sobre `bg-white` com `border-t
border-gray-200` a separá-la da Equipa (`bg-bg-lighter`): um **rótulo** centrado
(`text-xs font-semibold tracking-[0.2em] text-text-secondary uppercase`, com
`appRevelarAoScroll`) e, abaixo, o `app-faixa-patrocinadores`.

**Nada de componente novo.** O rótulo é um `<p>` no template da página: o
`app-cabecalho-secao` desenha sempre um `<h2>` e não tem formato de etiqueta, e estendê-lo
para isto não se justificava. A faixa vai **fora** do `app-container-pagina` (só o rótulo
fica dentro), porque a rolagem infinita dela depende de ocupar a largura toda — igual ao
que já se fazia em `inicio.component.html`. A faixa **não** leva `appRevelarAoScroll`: a
revelação por opacidade colide com o `transform` da animação de rolagem contínua.

**Dados (novo):** a lista de parceiros deixou de ser constante de página e passou à camada
de dados, porque agora aparece em duas páginas:

- modelo `src/app/core/modelos/patrocinador.model.ts` — `Patrocinador { id: string;
  nome: TextoTraduzido; logoUrl?: string }`. O `nome` é bilingue porque é o `alt` do
  logótipo;
- mock `src/app/core/dados/patrocinadores.mock.ts` (`PATROCINADORES_MOCK`) — os quatro
  logótipos institucionais: `minplan`, `minsa`, `mindcom`, `feito-em-angola`;
- serviço `src/app/core/servicos/patrocinadores.service.ts` — `PatrocinadoresService`,
  com `patrocinadores` (`computed` + `localizarProfundo`) a devolver exactamente o
  `PatrocinadorExibido[]` que a faixa espera. No dia da API muda só o
  `signal(PATROCINADORES_MOCK)`.

A constante `PATROCINADORES` de `inicio.component.ts` **foi removida**: essa página passou
a consumir `PatrocinadoresService.patrocinadores` (mesma lista, agora com nome traduzido em
inglês).

**Usado em:** `detalhe-projeto`, `inicio`

### app-item-documento

**Onde:** `src/app/shared/componentes/item-documento/item-documento.component.ts`
**Criado para:** sessão "Documentos e Publicações" de `detalhe-projeto` (2026-09-04)
**Descrição:** linha de um **ficheiro para descarregar**: rectângulo branco
`rounded-lg border border-gray-200 px-4 py-3.5` com o ícone de documento a **vermelho**
(`text-red-600`, 18px) à esquerda e o nome do ficheiro em `text-sm font-semibold
text-primary-deep` a seguir. O rectângulo **inteiro** é a área de clique: com `url`
desenha-se um `<a download>` com `aria-label` "Descarregar <nome>" traduzido dentro do
componente e realce em `hover:border-primary/40 hover:bg-primary/5`; **sem `url`** sai o
mesmo bloco num `<div>` não clicável — é assim que se evita um link para lado nenhum
enquanto os PDF não existirem no servidor. Não há ícone `pdf` nem `file-pdf` em
`dados-icones.ts`: o padrão é `file-text`.

Não havia nada parecido no projecto — o `app-cartao-publicacao` é um cartão de artigo
com autores, revista e ano, e o `app-item-informacao` tem emblema com ícone e duas
linhas de texto, sem casca clicável.

**Inputs:** `documento: DocumentoProjeto` (obrigatório) · `icone: string` (por omissão
`'file-text'`)

**Como usar:** (a lista e a cascata são da página)

    <div class="mt-6 space-y-3">
      @for (documento of p.documentos ?? []; track documento.id) {
        <app-item-documento [documento]="documento" [appRevelarAoScroll]="$index + 1" />
      }
    </div>

**Usado em:** `detalhe-projeto`

### app-cartao-testemunho

**Onde:** `src/app/shared/componentes/cartao-testemunho/cartao-testemunho.component.ts`
**Criado para:** sessão "Testemunhos" de `detalhe-projeto` (2026-09-04)
**Descrição:** cartão de **citação sobre verde escuro** (`rounded-2xl bg-primary-deep
p-6 sm:p-8`, `overflow-hidden`) com uma marca de citação grande e esbatida no canto
superior direito (`&rdquo;` em `font-serif text-8xl text-white/10`, `aria-hidden`,
puramente ornamental): a citação em `<blockquote>` `text-sm italic text-white/85` e, por
baixo, o `<figcaption>` com **retrato circular de 36px** (`ring-1 ring-white/20`), o nome
em `text-sm font-bold text-white` e o papel da pessoa em `text-[10px] uppercase
tracking-[0.18em] text-secondary` (dourado). O `uppercase` é apresentação — os dados
guardam "Beneficiário local". **Sem `foto`** fica um círculo `bg-white/10` com as
**iniciais** do nome, e não o marcador cinzento: num cartão escuro o cinzento salta à
vista. A `<img>` leva `loading="lazy"` e o `alt` é o nome do autor.

Único componente de citação do projecto — não existia nada parecido.

**Inputs:** `testemunho: TestemunhoProjeto` (obrigatório)

**Como usar:**

    <div class="mt-6 space-y-6">
      @for (testemunho of p.testemunhos ?? []; track testemunho.id) {
        <app-cartao-testemunho [testemunho]="testemunho" [appRevelarAoScroll]="$index + 1" />
      }
    </div>

**Usado em:** `detalhe-projeto`

### app-item-contacto (existente, estendido)

**Onde:** `src/app/shared/componentes/item-contacto/item-contacto.component.ts`
**Estendido para:** sessão "Interessado no Projecto?" de `detalhe-projeto` (2026-09-04)
**Descrição:** canal de contacto com emblema quadrado de 36px e o ícone à esquerda. O
`tema` dá as cores (`claro` = `bg-primary/10 text-primary` sobre fundo claro, o de
sempre; `escuro` = `bg-white/10 text-white` sobre painel `bg-primary-deep`) e o `formato`
dá o peso das duas primeiras linhas — a **ordem é sempre rótulo e depois valor**:
`valorDestaque` mantém o rótulo em negrito com o valor em texto normal, e `rotuloAcima`
reduz o rótulo a etiqueta `text-[11px] uppercase tracking-[0.16em]` e põe o **valor em
negrito**, como no painel verde do detalhe de projecto.

O `detalhe` passou de `input.required` a **`input` opcional**, dentro de um `@if`: o
painel do detalhe só tem rótulo e valor. Tornar um obrigatório em opcional **não quebra**
quem já o passa — `candidaturas` continua a mostrar as três linhas exactamente como
antes, porque os valores por omissão (`claro` + `valorDestaque`) são o aspecto de sempre.

**Inputs:** `icone: string` (obrigatório) · `rotulo: string` (obrigatório) ·
`valor: string` (obrigatório) · `detalhe?: string` (**passou a opcional**) ·
`tema: 'claro' | 'escuro'` (por omissão `'claro'`) ·
`formato: 'valorDestaque' | 'rotuloAcima'` (por omissão `'valorDestaque'`)

**Como usar:** (no painel verde escuro)

    <app-item-contacto tema="escuro" formato="rotuloAcima" [icone]="item.icone"
      [rotulo]="item.rotulo" [valor]="item.valor" />

**Usado em:** `candidaturas`, `detalhe-projeto`

### Sessões "Documentos e Publicações / Testemunhos" e "Interessado no Projecto?" (`detalhe-projeto`, 2026-09-04)

Sessões **9** (`#secao-documentos`, `bg-bg-lighter`) e **10** (`#secao-contacto`,
`bg-white`) de `detalhe-projeto`, depois dos Parceiros e dentro do
`@if (projeto(); as p)`, cada uma no seu `@if` de campo (`p.documentos?.length ||
p.testemunhos?.length` e `p.contacto`), como as oito anteriores.

A **9** é uma grelha `lg:grid-cols-2 gap-10 lg:gap-16` em que **cada coluna tem o seu
`app-cabecalho-secao`** `tema="verde" alinhamento="esquerda" [mostrarTracos]="false"` sem
descrição — o mesmo dos cabeçalhos das sessões 1 e 6: à esquerda a lista de
`app-item-documento` (`space-y-3`), à direita os `app-cartao-testemunho` (`space-y-6`),
ambas com `@empty` traduzido.

A **10** é um **cartão único** `rounded-2xl overflow-hidden shadow-xl shadow-black/5`
dividido em dois painéis (`grid lg:grid-cols-2`, empilhados abaixo de `lg`), com o
`appRevelarAoScroll` no cartão inteiro. Painel esquerdo `bg-primary-deep` com título
branco, parágrafo `text-white/80` e os três `app-item-contacto` `tema="escuro"`
`formato="rotuloAcima"`; painel direito branco com o formulário. Nem o painel nem o
formulário viraram componente: são blocos únicos, não listas.

**Formulário:** `FormGroup` com quatro `FormControl` não-nulos obrigatórios (`nome`,
`email`, `tipoInteressado`, `mensagem`); `form-input-field` `variante="minimalista"` para
nome e e-mail lado a lado (`grid gap-x-6 sm:grid-cols-2`), `field-select-v2` da mesma
variante para o tipo de interessado e outro `form-input-field` `type="textarea"`
`[rows]="4"` para a mensagem. O e-mail valida com o **`validarEmail` do
`ValidacaoService`** em vez do `Validators.email`, e o erro de cada campo é
`[erro]="validacao.getErro('campo')"` — a sobrecarga de **um só argumento** devolve a
função `(form) => string | null` que o input `erro` dos dois campos espera, e o
`ControlContainer` `@Host` deles resolve o `FormGroup` sozinho. Nota: as mensagens do
`ValidacaoService` são **só em português** (é um dicionário fixo no serviço), ao
contrário do padrão `sinalErro` de `contactos`, que as traduz — foi decisão do pedido usar
o serviço. O botão é o `app-botao` `variante="secundario"` (a única que usa o `accent`
`#c09a6b`, o bege/dourado do mockup), `tamanho="lg"`, `raio="completo"`,
`[larguraTotal]="true"`, com `aCarregar`/`desativado` no `estadoEnvio() === 'enviando'` e
a confirmação num `<p role="status">` em `'sucesso'`. Falta o **endpoint** (`// TODO:` no
`enviarMensagem()`).

**Dados:** campos **novos e opcionais** no `Projeto`
(`src/app/core/modelos/projeto.model.ts`): `documentos?: DocumentoProjeto[]`
(`id`, `titulo`, `url?`), `testemunhos?: TestemunhoProjeto[]` (`id`, `citacao`, `autor`
sem tradução, `papel`, `foto?`) e `contacto?: ContactoProjeto` (`email`, `telefone`,
`localizacao`) — só os **valores** de contacto são dados; os rótulos ("Email do líder de
projecto") são texto de interface, num `computed` `itensContacto` da página com o ícone
(`mail`, `phone`, `map-pin`). Conteúdo em `src/app/core/dados/projetos.mock.ts`
(`DocumentoProjetoBruto`, `TestemunhoProjetoBruto`, `ContactoProjetoBruto`), tradução no
`ProjetosService`, que monta o projecto **campo a campo** — sem as entradas
`documentos:`/`testemunhos:`/`contacto:` nesse mapeamento os campos nunca chegam à
página. Os **quatro** projectos do mock têm os três blocos.

As opções do `Tipo de Interessado` são a constante `TIPOS_INTERESSADO` no `.ts` da página
(par `[pt, en]` resolvido no `computed` `opcoesTipoInteressado`, que devolve
`SelectOptionV2[]`): conteúdo **estrutural** do formulário, não uma lista que a API sirva
— o mesmo critério do `VANTAGENS_BRUTAS` de `formacoes`.

**Nenhum PDF existe em `public/`**: todos os `documentos` ficaram **sem `url`**, com
`// TODO:` no mock, e desenham-se como blocos não clicáveis. O retrato do testemunho do
primeiro projecto é `/imagens/homem-do-campo.png` como **marcador declarado** (`// TODO:`
no mock); os outros três projectos ficaram sem `foto` e caem nas iniciais.

### app-modal-orgaos-gestao

**Onde:** `src/app/shared/componentes/modal-orgaos-gestao/modal-orgaos-gestao.component.ts`
**Criado para:** modal "Órgãos de Gestão" aberto do item `nav.sobreMenu.orgaosGestao` do
submenu "Sobre UNAGRO" (`src/app/layout/cabecalho/menu.config.ts`) (2026-09-04)
**Descrição:** modal **só de conteúdo** (sem formulário, como o `modal-nossa-historia`),
sobre `bg-bg-light`: sobrerótulo dourado "LIDERANÇA EXECUTIVA" em maiúsculas com
`tracking-[0.22em]`, título centrado, subtítulo `max-w-2xl` e uma grelha de 4 cartões
(`sm:grid-cols-2 lg:grid-cols-4`) com a estrutura directiva. Cada cartão é branco
`rounded-2xl shadow-md`, com o retrato em `aspect-[3/4] object-cover object-top`
(`rounded-t-2xl`, sem `overflow-hidden` no cartão para a pílula não ser cortada), a
etiqueta do órgão numa pílula `bg-primary-deep` branca **sobreposta ao bordo inferior da
foto** (`bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`), e por baixo nome a negrito
e cargo em `text-text-secondary`, tudo centrado. No canto superior esquerdo da grelha há
um "L" decorativo (`border-l border-t border-secondary/50`, `aria-hidden`). Sem header,
sem rodapé de botões: o fecho é o X do canto superior direito. Os nomes das pessoas não se
traduzem — só etiquetas e cargos.

**Inputs:** `membrosGestao: readonly MembroGestao[]` (por omissão a constante
`MEMBROS_GESTAO` do próprio ficheiro — deixado aberto para o dia em que a estrutura venha
da API; quem abre pelo menu não passa nada). Exporta `ID_MODAL_ORGAOS_GESTAO` e a
interface `MembroGestao` (`id`, `etiqueta: [pt, en]`, `nome`, `cargo: [pt, en]`, `imagem`).

**Abre-se com:** `modais.open({ id: ID_MODAL_ORGAOS_GESTAO, template: ModalOrgaosGestaoComponent, tamanho: 'xlgrande', temHeader: false, semBotoes: true })`
**Dados (`data`):** nenhum — os 4 membros vivem no componente.

**Imagens:** `/imagens/professor-doutor-augusto.png`, `/imagens/Dr-abel-van--dunem.png`
(dois hífenes), `/imagens/Dr-menddes-adao.png` ("menddes" com dois "d") e
`/imagens/francisco-calenga.png` — todas 272×340 no disco.

**Usado em:** `cabecalho` (submenu "Sobre UNAGRO" → "Órgãos de Gestão")

### app-modal-pilares-institucionais

**Onde:** `src/app/shared/componentes/modal-pilares-institucionais/modal-pilares-institucionais.component.ts`
**Criado para:** modal "Pilares Institucionais" aberto do item `nav.sobreMenu.pilares` do
submenu "Sobre UNAGRO" (`src/app/layout/cabecalho/menu.config.ts`) (2026-09-04)
**Descrição:** modal **só de conteúdo** (sem formulário e sem imagens, como o
`modal-nossa-historia` e o `modal-orgaos-gestao`), sobre `bg-bg-light`: título centrado
`text-3xl sm:text-4xl` sem sobrerótulo, separador de **três traços dourados** soltos
(`h-1 w-6 rounded-full bg-secondary`, `aria-hidden`) e uma grelha `md:grid-cols-3` com os
três pilares. Cada cartão é branco `rounded-2xl p-6 shadow-sm h-full`, alinhado à
esquerda, com um mosaico de ícone `h-13 w-13 rounded-xl bg-bg-light text-primary-deep`,
título a negrito e corpo em `text-text-secondary`. O cartão dos **Valores** troca o
parágrafo por um `<ul>` de 4 `<li>`, cada um com um `app-icone nome="check"` em
`text-primary` (`aria-hidden`) — o template escolhe entre parágrafo e lista conforme o
pilar traga `texto` ou `itens`. Sem header, sem rodapé de botões: o fecho é o X do canto
superior direito. **Ícones:** `target` (Missão) e `shield-check` (Valores) existem no
catálogo; para a Visão **não há ícone de olho** em `dados-icones.ts`, pelo que ficou
`globe` (o mais próximo do "reconhecida mundialmente" do texto).

**Inputs:** `pilaresInstitucionais: readonly PilarInstitucional[]` (por omissão a
constante `PILARES` do próprio ficheiro — aberto para o dia em que venham da API; quem
abre pelo menu não passa nada). Exporta `ID_MODAL_PILARES` e a interface
`PilarInstitucional` (`id`, `icone`, `titulo: [pt, en]`, `texto?: [pt, en]`,
`itens?: [pt, en][]` — `texto` e `itens` são exclusivos).

**Abre-se com:** `modais.open({ id: ID_MODAL_PILARES, template: ModalPilaresInstitucionaisComponent, tamanho: 'xgrande', temHeader: false, semBotoes: true, fecharAoClicarFundo: true })`
**Dados (`data`):** nenhum — os 3 pilares vivem no componente.

**Imagens:** nenhuma.

**Usado em:** `cabecalho` (submenu "Sobre UNAGRO" → "Pilares Institucionais")

### app-modal-estrutura-organizacional

**Onde:** `src/app/shared/componentes/modal-estrutura-organizacional/modal-estrutura-organizacional.component.ts`
**Criado para:** modal "Estrutura Organizacional" aberto do item
`nav.sobreMenu.estruturaOrganizacional` do submenu "Sobre UNAGRO"
(`src/app/layout/cabecalho/menu.config.ts`) (2026-09-04)
**Descrição:** modal **só de conteúdo** (sem formulário e sem imagens, como o
`modal-pilares-institucionais`), sobre `bg-white`: **barra de topo `sticky top-0`**
(`h-12 border-b border-gray-200 bg-white`) com o X à direita — copiada do
`modal-orgaos-gestao`, para o botão de sair acompanhar o scroll do painel. Por baixo,
título centrado `text-3xl sm:text-4xl`, subtítulo `max-w-2xl` e um **organograma em
coluna** (`max-w-3xl`) de quatro níveis, ligados por traços verticais
(`h-10 w-px bg-gray-200`, `aria-hidden`): (1) cartão `bg-primary-deep` branco com ícone
`landmark` — Conselho Universitário; (2) cartão branco `ring-1 ring-gray-100` com ícone
`trees` — Reitoria; (3) grelha `sm:grid-cols-3` de cartões `bg-bg-light` com as três
vice-reitorias (sem ícone, como no mockup); (4) faixa larga `rounded-3xl bg-secondary/15`
com ícone, título em `text-primary` e parágrafo — Faculdades e Departamentos. Sem header
e sem rodapé de botões. **Ícones:** `landmark` e `trees` existem no catálogo; para as
Faculdades **não há ícone de edifício** em `dados-icones.ts`, pelo que ficou
`graduation-cap`. O bege do mockup do nível 4 saiu como `bg-secondary/15` (token da
marca), não um hexadecimal.

**Inputs:** `estrutura: EstruturaOrganizacional` (por omissão a constante `ESTRUTURA` do
próprio ficheiro — aberto para o dia em que o organograma venha da API; quem abre pelo
menu não passa nada). Exporta `ID_MODAL_ESTRUTURA_ORGANIZACIONAL` e as interfaces
`NoOrganograma` (`id`, `icone?`, `titulo: [pt, en]`, `legenda: [pt, en]`) e
`EstruturaOrganizacional` (`conselho`, `reitoria`, `viceReitorias[]`, `unidades`).

**Abre-se com:** `modais.open({ id: ID_MODAL_ESTRUTURA_ORGANIZACIONAL, template: ModalEstruturaOrganizacionalComponent, tamanho: 'xgrande', temHeader: false, semBotoes: true, fecharAoClicarFundo: true })`
**Dados (`data`):** nenhum — o organograma vive no componente.

**Imagens:** nenhuma.

**Usado em:** `cabecalho` (submenu "Sobre UNAGRO" -> "Estrutura organizacional")

### menu.config.ts / cabecalho (existentes, estendidos)

**Onde:** `src/app/layout/cabecalho/menu.config.ts` e `cabecalho.component.ts`
**Estendido para:** modais "Órgãos de Gestão", "Pilares Institucionais" e "Estrutura
Organizacional" (2026-09-04)
**Descrição:** o tipo `ModalMenu` passou a `'nossaHistoria' | 'orgaosGestao' | 'pilares' | 'estruturaOrganizacional'`
e os itens `nav.sobreMenu.orgaosGestao` e `nav.sobreMenu.pilares` trocaram o
`path: '/sobre'` por `modal: 'orgaosGestao'` / `modal: 'pilares'`. O `abrirModal()` do
cabeçalho ganhou um ramo por modal, cada um fechado com `return` (os ramos anteriores
ficaram intactos). O fecho do menu móvel e do dropdown já vinha de graça:
`abrirModal()` chama `fecharMenu()` e o `app-dropdown-menu` fecha no `closeOnSelect`.
Mais tarde `nav.sobreMenu.estruturaOrganizacional` trocou tambem o `path: '/sobre'` por
`modal: 'estruturaOrganizacional'`, com o seu ramo em `abrirModal()` (o ramo do
`orgaosGestao`, que era o último, ganhou o `return` que lhe faltava).

### app-cartao-noticia-destaque (existente, estendido)

**Onde:** `src/app/shared/componentes/cartao-noticia-destaque/cartao-noticia-destaque.component.ts`
**Estendido para:** sessão "Notícias" de `inicio` (2026-09-04)
**Descrição:** ganhou o input **`mostrarSelo`** (por omissão `true`, portanto nada mudou
para quem já o usava). Serve para o lugar grande da grelha: quando a notícia que lá cai
não vem marcada como `destaque` na API, o selo "Em destaque" desliga-se e o resto do
cartão — a linha de data • categoria, o título, o resumo e o botão — fica igual. Não
confundir com o `variante="simples"`, que troca a linha de data por um selo de categoria.

**Inputs:** `noticia: NoticiaCartao` (obrigatório) · `variante: 'padrao' | 'simples'`
(por omissão `'padrao'`) · `mostrarSelo: boolean` (por omissão `true`) ·
`legendaImagem?: string` · `link?: string`

**Como usar:**

    <app-cartao-noticia-destaque [noticia]="destaque" [mostrarSelo]="destaque.destaque" />

**Usado em:** `inicio`, `estudantes`

### app-cartao-noticia-destaque-esqueleto

**Onde:** `src/app/shared/componentes/cartao-noticia-destaque-esqueleto/cartao-noticia-destaque-esqueleto.component.ts`
**Criado para:** sessão "Notícias" de `inicio` (2026-09-04)
**Descrição:** espera do `app-cartao-noticia-destaque` — mesma moldura arredondada,
mesmo `min-h-80` e o mesmo bloco de texto encostado ao fundo, com barras em pulsação no
lugar da data, do título, do resumo e do botão. `aria-hidden`, sem texto nem foco.

**Inputs:** nenhum.

**Como usar:**

    <app-cartao-noticia-destaque-esqueleto />

**Usado em:** `inicio`

### app-cartao-noticia-resumo-esqueleto

**Onde:** `src/app/shared/componentes/cartao-noticia-resumo-esqueleto/cartao-noticia-resumo-esqueleto.component.ts`
**Criado para:** sessão "Notícias" de `inicio` (2026-09-04)
**Descrição:** espera do `app-cartao-noticia-resumo`, com os **dois modos do cartão**:
`vertical` é a moldura branca com a imagem em cima a absorver a altura sobrante
(`flex-1`); `horizontal` é a moldura clara `bg-[#EBEFED]` com a miniatura à esquerda,
das listas laterais. O ritmo vertical é o do cartão real, para a grelha não saltar
quando as notícias chegam. `aria-hidden`, sem texto nem foco.

**Inputs:** `modo: 'vertical' | 'horizontal'` (por omissão `'vertical'`)

**Como usar:**

    <app-cartao-noticia-resumo-esqueleto class="md:col-span-2 lg:col-span-1" />
    <app-cartao-noticia-resumo-esqueleto modo="horizontal" />

**Usado em:** `inicio`, `detalhe-noticia`

### Sessão "Notícias" (`inicio`, 2026-09-04)

**Onde:** `src/app/pages/inicio/inicio.component.html`, `<section id="secao-noticias">`,
logo a seguir ao banner.

**Descrição:** cabeçalho próprio (não usa o `app-cabecalho-secao`): "Notícias" com o
traço grosso `bg-primary-dark` por baixo, o subtítulo em cinzento ao lado na mesma linha
de base, e os dois botões de paginação (`chevron-left`/`chevron-right`) encostados à
direita. A grelha é `md:grid-cols-2 lg:grid-cols-3`: destaque na primeira coluna, duas
notícias empilhadas (`lg:grid-rows-2`) na segunda, uma na terceira — quatro notícias por
página, que é o que o `NOTICIAS_POR_PAGINA` do `.ts` diz.

**Dados:** **vem da API** (`GET /noticias`), pelas três camadas do `.claude/README.md` —
`NoticiasService` (mapeia `NoticiaResource` → `Noticia`), `noticiasQueries.lista()` em
`core/consultas/noticias.queries.ts`, `injectQuery` na página. O `noticias.mock.ts`
deixou de ser a fonte da secção: passou a `NOTICIAS_FALLBACK` (`NoticiaBruta`, bilingue),
o conteúdo **de recurso** que a página mostra quando a API devolve lista vazia ou falha.
A ordenação (destaques primeiro, depois por data) e a paginação são `computed` da página,
porque a API manda a lista inteira sem filtros.

**Estados:** `consultaNoticias.isPending()` → um `app-cartao-noticia-destaque-esqueleto`
mais três `app-cartao-noticia-resumo-esqueleto` na mesma grelha; sem notícia nenhuma
(nem da API nem do recurso) → parágrafo traduzido centrado.

**Imagens:** só o conteúdo de recurso tem fotografias — `/imagens/desenvolvimento-card-1.png`
(destaque), `/imagens/mulher-no-campo.png`, `/imagens/mulher-dra.png` e
`/imagens/mulher-cientista.png`. As capas da API (`capa_url`) vêm com host `localhost` e
são descartadas pelo serviço (ver `capaUtilizavel`), pelo que as notícias reais caem no
espaço reservado cinzento até o `APP_URL` do Laravel ser corrigido.


### app-cartao-noticia-destaque / app-cartao-noticia-resumo (existentes, ligação sobreposta)

**Onde:** `src/app/shared/componentes/cartao-noticia-destaque/…` e
`src/app/shared/componentes/cartao-noticia-resumo/…`
**Estendidos para:** página `detalhe-noticia` (2026-09-04)
**Descrição:** os dois cartões passaram a ter uma **ligação sobreposta** — um
`<a [routerLink]="link()" class="absolute inset-0 z-10" aria-hidden="true" tabindex="-1">`
como último filho do `<article>` — para o cartão inteiro abrir a notícia, e não só o
"Ler mais"/"Ler artigo". Só existe **quando o input `link` é passado**, por isso as
listas que não passam link (a de `estudantes`) ficam exactamente como estavam. No
`cartao-noticia-resumo` o `relative` do `<article>` entra por `[class.relative]="!!link()"`,
pela mesma razão. A ligação visível ganhou `relative z-20` para manter o seu próprio
`hover` por cima da sobreposta; é decorativa para o leitor de ecrã e está fora da ordem
de tabulação, para não duplicar o destino.

**Usado em:** `inicio` (com link), `detalhe-noticia` (com link), `estudantes` (sem link)

### Página `detalhe-noticia` — `/noticias/:id` (2026-09-04)

**Onde:** `src/app/pages/detalhe-noticia/detalhe-noticia.component.{ts,html}`; rota em
`app.routes.ts` (`noticias/:id`, chaves `rotas.detalheNoticia.*`) e em
`app.routes.server.ts` (`RenderMode.Server` — os ids vêm da API, não há lista fechada
para prerenderizar).

**Descrição:** artigo à esquerda (`lg:col-span-2`) — capa em `app-espaco-imagem`
`proporcao="video"` arredondada, depois a linha `data • categoria`, o `<h1>`, o resumo
como lead e o `conteudo` partido em parágrafos — e, à direita (`lg:col-span-1`), a
sessão "Outras notícias" com até 4 `app-cartao-noticia-resumo modo="horizontal"` um
debaixo do outro (`flex-col gap-4`), cada um com `[link]="'/noticias/' + id"`. Por cima
de tudo, uma ligação "Voltar às notícias" para `/` com `fragment="secao-noticias"`.
Sem componente novo: o artigo aparece uma vez só, por isso fica no template da página.

**Dados:** `injectQuery(noticiasQueries.porId(...))` para o artigo — com
`enabled: idApi() !== null`, porque só se chama `GET /noticias/{id}` quando o id é
inteiro; os ids do conteúdo de recurso são slugs e resolvem-se em memória. As "outras"
vêm de `noticiasQueries.lista(...)`, filtradas e ordenadas num `computed` (a API não tem
endpoint de relacionadas). Sem notícia nenhuma, o artigo dá lugar a um bloco "Notícia
não encontrada" com botão para a página inicial. O `SeoService.definirTituloDinamico`
põe o título da notícia no `<title>`.

**Estados:** pendente → esqueleto próprio do artigo (barras no lugar da capa, do título
e do corpo) mais três `app-cartao-noticia-resumo-esqueleto modo="horizontal"` na coluna
da direita.


### app-espaco-imagem — a fotografia tapava o texto (2026-09-04)

**Onde:** `src/app/shared/componentes/espaco-imagem/espaco-imagem.component.ts` (não
mexido) e quem o usa: `cartao-noticia-destaque`, `cartao-noticia-resumo`.

**O problema:** o `app-espaco-imagem` dimensiona-se por `min-height`, nunca por altura
definida. Quando o host é `class="absolute inset-0"` mas se lhe passa só
`alturaMinima="100%"`, o `<img class="h-full w-full object-cover">` lá dentro resolve o
`h-full` contra uma altura indefinida, cai na **altura intrínseca da fotografia** e
transborda a caixa — na página inicial isso traduzia-se em imagens grandes por cima da
data, do título e do resumo dos cartões pequenos (e de todos, em ecrã estreito), e em
fotografias "em caixa" com barras cinzentas no cartão de destaque.

**A correcção:** passar **também `proporcao="cover"`** (dá `h-full w-full` ao div
interior, que aí já tem altura definida vinda do `inset-0`). É o que o modo `horizontal`
do `cartao-noticia-resumo` sempre fez — daí nunca ter dado problema nas listas laterais.
**Regra prática: `app-espaco-imagem` posicionado em absoluto leva sempre
`proporcao="cover"` + `alturaMinima="100%"`.**

No `cartao-noticia-resumo` (modo `vertical`) a caixa da imagem passou ainda a
`aspect-video w-full shrink-0` até `lg` — uma faixa 16:9 no topo, que é o que o mockup
mostra em ecrã estreito — e só em `lg` volta a `flex-1` com `min-h-20`, para nos cartões
empilhados (metade da altura da coluna) ser a imagem a ceder espaço e não o texto, que
ganhou `shrink-0`. O `cartao-noticia-resumo-esqueleto` acompanha a mesma forma.

**Cuidado ao editar estes ficheiros:** o template é um *template literal*; um comentário
HTML com crases (`` `lg` ``) fecha a string e parte o componente com erros enganadores
(`NG2012`, `TS18004: shorthand property 'lg'`). Nos comentários dentro do `template:`,
sem crases.

### Sessão "Pilares do modelo UNAGRO" (`inicio`, 2026-09-04)

**Onde:** `src/app/pages/inicio/inicio.component.html`, `<section id="secao-pilares">` —
**primeira** sessão da página, entre o `app-container-banner-faixa-estatistica` do banner e
a sessão 2 (notícias). É irmã das outras no `div.flex.flex-col.gap-40`, por isso leva só
`py-12 sm:py-14` de padding próprio.

**Descrição:** faixa de quatro cartões iguais sobre `bg-bg-lighter`, **sem cabeçalho de
secção** (o mockup não tem título nem descrição, logo não há `app-cabecalho-secao`).
Grelha `sm:grid-cols-2 lg:grid-cols-4` com `gap-6`. Cada cartão é um
`app-cartao-recurso superficie="sombra" [caixaIcone]="true" estiloCaixaIcone="suave"` —
foi para esta sessão que essas duas opções foram acrescentadas ao cartão.

**Dados:** conteúdo **estrutural** da própria sessão — constante `PILARES_MODELO`
(`PilarBruto`: `id`, `icone`, `titulo`/`descricao` em `TextoTraduzido`) no `.ts` da página,
resolvida pelo `computed` `pilaresModelo` com `localizarProfundo`, como as
`VANTAGENS_BRUTAS` de `formacoes`. Sem modelo, mock nem serviço: não é lista que a API
venha a servir. O `track` é o `pilar.id`. **Não** confundir com o `pilares` que a página já
tinha, vindo do `EstatisticasService`.

**Ícones:** `sprout` (Educação em Solo Real), `bot` (Tecnologia e Inovação), `earth`
(Sustentabilidade) e `handshake` (Conexão com o Mercado). Os três últimos são
**aproximações**: `dados-icones.ts` não tem sensor/IoT, reciclagem nem diamante/gema, que
eram os do mockup.

**Imagens:** nenhuma — a sessão é só ícones.

### app-cartao-evento-destaque (existente, estendido)

**Onde:** `src/app/shared/componentes/cartao-evento-destaque/cartao-evento-destaque.component.ts`
**Estendido para:** sessão "Evento em destaque" de `inicio` (2026-09-07)
**Descrição:** faixa larga e baixa do próximo evento, em verde escuro (`bg-primary-deep`,
`rounded-xl`) com **barra dourada de 6px no bordo esquerdo** (`border-l-6 border-secondary`):
à esquerda a pílula dourada "Em destaque" + `calendar` e o intervalo de datas em maiúsculas
miúdas, o título a duas linhas (`text-xl lg:text-2xl`), um parágrafo pequeno em
`text-white/70` e o botão pílula branco "Saber mais →"; à direita o painel da contagem
decrescente, que passa para baixo do texto abaixo de `lg`. Não é cartão de grelha — ocupa a
largura toda do `app-container-pagina`. Não confundir com o `cartao-evento` (bloco de data
verde, cartão de grelha) nem com o `cartao-evento-foto` (fotografia + botão "Inscrever-se").

Ganhou o input **`imagemFundo`**, aditivo: sem ele o cartão fica com o verde sólido
exactamente como antes; com ele entram um `<img class="absolute inset-0 object-cover">` e um
véu `bg-gradient-to-r from-primary-deep via-primary-deep/95 to-primary-deep/70` por cima —
quase opaco à esquerda, onde assenta o texto, e mais aberto à direita. O `<article>` levou
`relative` e o bloco de conteúdo também, para ficar acima do véu. Não havia nenhum uso do
componente antes desta sessão, por isso a extensão não mexeu com nenhuma página.

**Inputs:** `evento: EventoDestaqueCartao` (obrigatório; interface exportada no próprio
ficheiro — `titulo`, `descricao`, `dataInicio` ISO, `dataFim?`, tudo já localizado) ·
`link?: string` (sem ele o botão "Saber mais" não aparece) · `imagemFundo?: string`
(sem ela, verde sólido)

**Como usar:**

    @if (eventoPrincipal(); as destaque) {
      <app-cartao-evento-destaque [evento]="destaque" [imagemFundo]="destaque.imagem_url"
        link="/eventos" appRevelarAoScroll />
    }

**Usado em:** `inicio`

### app-contador-regressivo (existente, reutilizado)

**Onde:** `src/app/shared/componentes/contador-regressivo/contador-regressivo.component.ts`
**Descrição:** contagem decrescente **a sério** até uma data ISO recebida por input, em duas
variantes: `caixas` (uma caixa `bg-white/10` por unidade) e `painel` (um único painel
`rounded-xl border-white/10 bg-black/20 px-8 py-7` com o título dourado em maiúsculas
espaçadas por cima e as unidades separadas por `:`, números `text-[36px]` a branco e rótulos
`text-[10px]` em `text-white/50`). Assume sempre fundo escuro. `mostrarSegundos` a `false`
deixa DIAS · HORAS · MIN, que é o desenho do mockup do início.

**Pronto para SSR:** o `setInterval` de 1s só arranca no `afterNextRender` e é limpo no
`DestroyRef.onDestroy` — sem isto o prerender fica pendurado. Datas já passadas dão zeros
(`Math.max(0, alvo - agora)`), nunca negativos. Reutilizado tal e qual na sessão "Evento em
destaque" de `inicio` (2026-09-07), dentro do `app-cartao-evento-destaque`.

**Inputs:** `dataAlvo: string` (obrigatório, ISO) · `rotulos: RotulosContadorRegressivo`
(por omissão `dias`/`horas`/`min`/`seg`) · `variante: 'caixas' | 'painel'` (por omissão
`'caixas'`) · `mostrarSegundos: boolean` (por omissão `true`) · `titulo?: string` (só na
variante `painel`)

**Variante `caixasGrandes` (2026-09-30, aditiva):** caixas quadradas `h-24 w-20 sm:h-28 sm:w-28`
`rounded-xl border-white/10 bg-white/5`, número `text-3xl sm:text-4xl` a dourado
(`text-secondary`) e rótulo `text-[10px]` em `text-white/60`, centradas e com `flex-wrap`. É o
prazo da convocatória docente. As variantes antigas não mudaram.

**Usado em:** `inicio` (dentro do `app-cartao-evento-destaque`) · `candidatura-geral/inicio`
(`#secao-prazo`, variante `caixasGrandes`)

### app-banner-destaque — slot de conteúdo (2026-09-30, aditivo)

**Onde:** `src/app/shared/componentes/banner-destaque/banner-destaque.component.ts`
**Mudança:** `<ng-content />` depois do bloco dos CTAs, dentro da coluna de conteúdo. Sem nada
projectado não gera DOM, por isso os banners existentes ficam iguais. O elemento projectado pode
trazer `data-animar="ctas"` para entrar na cascata do Motion (o `querySelectorAll` apanha-o).
**Usado em:** `candidatura-geral/inicio` — projecta o `app-email-hero-candidatura` (campo de
e-mail + botão "Candidatar", com `form-input-field`) e a linha de metadados abaixo dele.

### Sessão "Evento em destaque" (`inicio`, 2026-09-07)

**Onde:** `src/app/pages/inicio/inicio.component.html`, `<section id="secao-evento-destaque">`
— **terceira** e última sessão da página, **depois** das notícias: a página abre com o que a
UNAGRO é (pilares), passa ao que se anda a fazer (notícias) e fecha com a chamada à acção
datada (o próximo evento), que é o passo seguinte natural do visitante. Fica em
`bg-bg-lighter`, alternando com a sessão 2 (notícias), que é sem fundo. Como as irmãs, vive
no `div.flex.flex-col.gap-40` e leva só `py-12 sm:py-14` de padding próprio. Dentro do
`app-container-pagina` o cartão ocupa a largura toda, sem margens laterais extra.

**Descrição:** uma só peça — o `app-cartao-evento-destaque` com a fotografia de fundo, com
`appRevelarAoScroll` sem valor (não há grelha, logo não há cascata). O `@else` mostra
"Ainda não há eventos agendados." / "No events scheduled yet." por `getTraducao`, para a
sessão não ficar às moscas enquanto a API não responder.

**Dados:** modelo `src/app/core/modelos/evento.model.ts`, mock
`src/app/core/dados/eventos.mock.ts`, serviço `src/app/core/servicos/eventos.service.ts` —
**já existiam e foram reutilizados**. A página só expõe `eventoPrincipal =
this.eventosService.emDestaque` (o `computed` que devolve o evento com `destaque: true`, ou
o primeiro por data). No dia da API muda-se **uma linha**: o
`private readonly brutos = signal(EVENTOS_MOCK)` do `EventosService`.

O modelo ganhou o campo **opcional** `imagem_url?: string` (fotografia de fundo do cartão de
destaque) e o mock do `congresso-agricultura-sustentavel` passou a trazer
`/imagens/bg-banner-estudantes.jpg`. Opcional de propósito: os outros seis eventos do mock
não mudaram e nada partiu.

**Textos:** os do cartão vêm dos dados; os fixos ("Em destaque", "Saber mais", "O evento
começa em:", "dias"/"horas"/"min") já viviam no dicionário (`comum.*`,
`paginas.eventos.contador*`) e são resolvidos dentro dos componentes.

**Imagens:** `/imagens/bg-banner-estudantes.jpg`, indicada no pedido e confirmada no disco.
Nenhum marcador cinzento.

**Link:** o botão "Saber mais" aponta para `/eventos` — **não existe rota de detalhe de
evento** (`app.routes.ts` só tem `eventos`, ao contrário de `noticias/:id` e `projetos/:id`).
Quando a rota existir, é só mudar o `link` na página.

### app-painel-marca-autenticacao

**Onde:** `src/app/shared/componentes/painel-marca-autenticacao/painel-marca-autenticacao.component.ts`
**Criado para:** página `entrar` — metade esquerda do cartão de login (2026-09-07)
**Descrição:** meia-página de marca dos ecrãs de autenticação: fotografia de fundo
(`object-cover`, `-z-20`) coberta por um véu `bg-gradient-to-b from-primary/85
to-primary-dark/95`, e por cima, tudo centrado na vertical e na horizontal: um círculo
branco de 80px com um ícone em imagem, o título grande a branco, um subtítulo em
`text-white/85`, um traço curto de 56px e um parágrafo pequeno em `text-white/70`. O
título respeita `\n` (`whitespace-pre-line`) — é o texto que decide onde parte, não a
largura do painel. O traço só aparece com `descricao`. Não é cartão de grelha: é uma
metade de cartão, e conta com o pai para lhe dar altura (`min-h-72` ou a irmã ao lado).

**Inputs:** `imagemFundo: string` (obrigatório) · `titulo: string` (obrigatório, aceita
`\n`) · `icone?: string` (caminho de SVG/PNG; sem ele o círculo não aparece) ·
`subtitulo?: string` · `descricao?: string` (traz consigo o traço acima)

**Como usar:**

    <app-painel-marca-autenticacao class="min-h-72"
      imagemFundo="/imagens/bg-banner-formacoes.png" icone="/imagens/livro-login.svg"
      [titulo]="tituloPainel()" [subtitulo]="subtituloPainel()"
      [descricao]="descricaoPainel()" />

**Usado em:** `entrar`

### app-botao-social

**Onde:** `src/app/shared/componentes/botao-social/botao-social.component.ts`
**Criado para:** página `entrar` — "ou entrar com Google / Office 365" (2026-09-07)
**Descrição:** botão de entrada por provedor externo: `rounded-lg border-gray-200 bg-white`,
largura total do pai, logótipo de 16px à esquerda e o nome do provedor em
`text-xs font-semibold`. O logótipo entra por **caminho de imagem**, e não pelo
`app-icone`, porque são marcas de terceiros que não pertencem ao conjunto de ícones do
site (`/imagens/google.svg`, `/imagens/microsoft.svg`). Emite `clicado` — não navega
sozinho.

**Inputs:** `icone: string` (obrigatório) · `rotulo: string` (obrigatório) ·
`desativado: boolean` (por omissão `false`)
**Outputs:** `clicado: void`

**Como usar:**

    <div class="grid grid-cols-2 gap-3">
      <app-botao-social icone="/imagens/google.svg" rotulo="Google"
        [desativado]="entrar.isPending()" (clicado)="entrarCom('google')" />
    </div>

**Usado em:** `entrar`

### app-separador-texto

**Onde:** `src/app/shared/componentes/separador-texto/separador-texto.component.ts`
**Criado para:** página `entrar` — o "OU ENTRAR COM" entre o botão e os provedores (2026-09-07)
**Descrição:** linha horizontal de 1px partida ao meio por um rótulo curto em maiúsculas
miúdas (`text-[10px] uppercase tracking-[0.12em] text-text-secondary`), com as duas metades
em `flex-1`. Assume fundo claro. É só isto — para separar secções com título usa-se o
`app-cabecalho-secao`, não este.

**Inputs:** `texto: string` (obrigatório — já traduzido; o componente só o põe em maiúsculas
por CSS)

**Como usar:**

    <app-separador-texto class="mt-7" [texto]="textoSeparador()" />

**Usado em:** `entrar`

### form-input-field (existente, estendido)

**Onde:** `src/app/shared/componentes/input-field/form-input-field.ts`
**Estendido para:** página `entrar` — os campos de e-mail e palavra-passe (2026-09-07)
**Descrição:** ganhou a variante **`sublinhado`** e o input **`ocultarRotuloVazio`**, ambos
aditivos.

`variante="sublinhado"`: uma única linha cinzenta (`border-b border-gray-200`) sob **toda** a
moldura, que se pinta a verde em foco (`focus-within:border-primary`) e a vermelho em erro. A
diferença face à `minimalista` é onde a linha vive: na `minimalista` o `border-b` está no
próprio `<input>`, e por isso não passa por baixo do ícone da esquerda; na `sublinhado` está
na moldura, e atravessa ícone e campo de ponta a ponta — que é o desenho dos ecrãs de
autenticação.

`ocultarRotuloVazio`: deixa cair o `<label>` quando não há texto nenhum. **Por omissão
`false`**, e tem de continuar assim: o rótulo vazio é usado como espaçador no campo de
subscrição de `hub-unagro`, onde é ele que alinha o botão com a caixa de texto (há um
comentário no template a dizê-lo). Só quem passa `true` perde o rótulo.

**Inputs (acrescentados):** `variante: 'caixa' | 'minimalista' | 'sublinhado'` (por omissão
`'caixa'`) · `ocultarRotuloVazio: boolean` (por omissão `false`)

**Como usar:**

    <form-input-field variante="sublinhado" [ocultarRotuloVazio]="true" type="password"
      formControlName="palavraPasse" [placeholder]="placeholderPalavraPasse()"
      [erro]="validacao.getErro('palavraPasse')">
      <app-icone leftIcon nome="lock" [tamanho]="16" />
    </form-input-field>

**Usado em:** `entrar` (variante `sublinhado`); `contactos`, `detalhe-projeto`, `hub-unagro`,
`inscricao`, `candidatura-docentes`, `modal-agendar-visita`, `modal-inscricao-curso`
(variantes anteriores, intactas)

### Página `entrar` — `/entrar` (2026-09-07)

**Onde:** `src/app/pages/entrar/entrar.component.{ts,html}`, dentro do
`app-layout-autenticacao` (`src/app/layout/layout-autenticacao/`) — o layout sem cabeçalho
nem rodapé, que traz só a `app-barra-topo` dentro de um contentor `min-h-dvh bg-primary-dark`.

**Não é uma sessão**: é a página inteira. Um cartão `max-w-3xl rounded-xl` centrado, partido
em duas metades (`grid sm:grid-cols-2`): à esquerda o `app-painel-marca-autenticacao`, à
direita o logótipo, o formulário, o `app-separador-texto`, dois `app-botao-social` e uma
faixa de direitos em `bg-bg-light` colada ao fundo da coluna.

**Camada de dados:** não há mock nem lista. O texto do painel esquerdo é conteúdo
**estrutural** da página, em `computed` com `getTraducao([pt, en])`. A ligação ao backend é
uma **mutação** do TanStack Query:

    AutenticacaoService.entrar()   POST /login, promessa, sem estado  (core/servicos/)
       ↓
    injectMutation<Sessao, ErroApi, Credenciais>   no componente
       ↓
    SessaoService.guardar(sessao, lembrar)   estado + localStorage/sessionStorage

O `SessaoService` está separado de propósito: o `AutenticacaoService` fala HTTP e não tem
estado, o `SessaoService` tem estado e não fala HTTP. O "Lembrar-me" é o que escolhe entre
`localStorage` (sobrevive a fechar o navegador) e `sessionStorage`.

**Validação:** `ValidacaoService` — `validarEmail` como validator (mais exigente que o
`Validators.email`) e `validacao.getErro('campo')` no `[erro]` de cada campo. Os 422 do
Laravel são distribuídos pelos controlos em `distribuirErrosDeValidacao`, com o mapa
`CAMPOS_DA_API` a traduzir `password` → `palavraPasse`; os 401/403/rede aparecem numa faixa
`bg-red-50` acima do botão.

**Imagens:** todas definitivas — `/imagens/bg-banner-formacoes.png` (fundo do painel),
`/imagens/livro-login.svg` (ícone do círculo), `/imagens/unagro-logo.png` (logótipo),
`/imagens/google.svg` e `/imagens/microsoft.svg`. Nenhum marcador cinzento.

**Ícone novo:** `lock` acrescentado ao `dados-icones.ts` (Lucide, MIT) — não havia nenhum
ícone de fecho para o campo de palavra-passe.

**Pendente:** o contrato do `POST /login` não foi confirmado (a API não estava alcançável),
por isso o `paraSessao` aceita `token`/`access_token` e `user`/`utilizador`; falta o
interceptor que põe o `Authorization: Bearer` nos pedidos de escrita; a entrada por Google e
Office 365 não tem endpoint (`entrarCom` só avisa na consola); não há página de recuperação
de palavra-passe (a ligação fica na própria página); e o `ROTA_APOS_ENTRAR` aponta para
`/estudantes`, que é o portal que existe hoje.

### app-abas (existente, estendido)

**Onde:** `src/app/shared/componentes/abas/abas.component.ts`
**Estendido para:** abas de `/sobre` (2026-09-07)
**Descrição:** barra de abas com sublinhado na aba activa; o conteúdo de cada aba é de
quem a usa. **Estendido** com o input `rolavel`, aditivo: `false` (omissão) é a barra de
sempre — exactamente o que `candidaturas` já mostrava — e `true` deixa a fila deslizar na
horizontal (`overflow-x-auto`, barra de scroll escondida) com os botões em `shrink-0
whitespace-nowrap`, para as sete abas de `/sobre` caberem em telemóvel sem quebrar
rótulos. As classes passaram de literais no template para `computed`/método; com
`rolavel` a `false` o conjunto de classes é o mesmo de antes.

**Inputs:** `abas: ItemAba[]` (por omissão `[]`) · `rolavel: boolean` (por omissão
`false`) — **Model:** `ativa: string`

**Como usar:**

    <app-abas [abas]="abasRequisitos()" [(ativa)]="nivelRequisitosAtivo" />

    <app-abas class="block" [abas]="abas()" [(ativa)]="abaAtiva" [rolavel]="true" />

**Usado em:** `candidaturas`, `sobre`

### Abas de `/sobre` — os modais do submenu passaram a página (2026-09-07)

Proposta alternativa à do cliente: em vez de cada item do submenu "Sobre UNAGRO" abrir um
modal, "Sobre UNAGRO" é uma ligação simples para `/sobre`, e os sete itens são **abas**
dessa página. Um componente por aba, em `src/app/pages/sobre/<aba>/`:
`nossa-historia`, `pilares-institucionais`, `orgaos-gestao`, `estrutura-organizacional`,
`faculdades-departamentos`, `aba-unagro`, `governanca`.

**Os modais não foram tocados** — continuam em `shared/componentes/modal-*` e o
`CabecalhoComponent` continua a saber abri-los. Para voltar à proposta do cliente basta
`SOBRE_COM_SUBMENU_MODAIS = true` em `layout/cabecalho/menu.config.ts`, que devolve o
`SUBMENU_SOBRE_MODAIS` ao menu.

**Sem conteúdo duplicado:** as abas reusam as listas que os modais já tinham, agora
exportadas — `PILARES`, `MEMBROS_GESTAO`, `ESTRUTURA` — e a aba "Nossa História" lê as
mesmas chaves `modais.nossaHistoria.*` do dicionário. Os rótulos das abas são as chaves
`nav.sobreMenu.*` do submenu.

**Faculdades e departamentos** não tinha modal: deriva as faculdades dos cursos de grau do
`CursosService` (agrupados por `faculdade`, cada uma com os seus cursos a ligar para
`/cursos/:id`), em vez de repetir uma lista à mão.

**Pendente:** "Aba Unagro" e "Governança" não tinham modal nem texto, e o rótulo "Aba
Unagro" não diz o que a secção deve mostrar. Ambas mostram o
`app-sobre-conteudo-em-preparacao` (`pages/sobre/conteudo-em-preparacao/`) — caixa
tracejada com ícone, título, aviso e botão para `/contactos` — em vez de conteúdo
institucional inventado. Quando o texto chegar, troca-se o componente pela secção real.

**Reversão:** a página `/sobre` anterior (hero simples, Missão/Visão, quatro valores em
cartões, parágrafo da história) está inteira e fora do routing em
`pages/sobre/legado/sobre-legado.component.ts`.
