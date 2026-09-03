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

**Inputs:** `valor: string` (obrigatório) · `rotulo: string` (obrigatório) ·
`tema: 'escuro' | 'claro' | 'verde'` (por omissão `'escuro'`) ·
`formato: 'bloco' | 'barra' | 'centrado'` (por omissão `'bloco'`)

**Como usar:**

    <app-item-estatistica [valor]="estatistica.valor" [rotulo]="estatistica.rotulo"
      [appRevelarAoScroll]="$index" />

    <app-item-estatistica formato="barra" tema="verde" [valor]="estatistica.valor"
      [rotulo]="estatistica.rotulo" [appRevelarAoScroll]="$index + 1" />

    <app-item-estatistica formato="centrado" tema="verde" [valor]="estatistica.valor"
      [rotulo]="estatistica.rotulo" [appRevelarAoScroll]="$index + 1" />

**Usado em:** `desenvolvimento`, `detalhe-projeto`

### app-cartao-vidro

**Onde:** `src/app/shared/componentes/cartao-vidro/cartao-vidro.component.ts`
**Criado para:** sessão "Impacto em Números" de `desenvolvimento` (2026-09-02)
**Descrição:** cartão translúcido de vidro fosco (`bg-white/20`, `backdrop-blur-md`,
moldura `border-white/30`) com título branco e um texto curto por baixo, feito para
ficar sobreposto a uma fotografia ou banner. Não se posiciona a si mesmo — o
`absolute`/`bottom`/`left` vem de quem o usa.

**Inputs:** `titulo: string` (obrigatório) · `texto: string | undefined` (opcional; sem
ele fica só o título)

**Como usar:**

    <app-cartao-vidro class="absolute bottom-5 left-5 sm:max-w-xs"
      [titulo]="tituloNota()" [texto]="textoNota()" />

**Usado em:** `desenvolvimento`

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

**Inputs:** `titulo: string` (obrigatório) · `descricao?: string` ·
`tema: 'claro' | 'escuro' | 'branco' | 'verde'` (por omissão `'claro'`) ·
`alinhamento: 'centro' | 'esquerda'` (por omissão `'centro'`) · `mostrarTracos: boolean`
(por omissão `true`) · `textoAcao?: string` (sem ele não há link à direita) ·
`linkAcao: string` (por omissão `''`) · `iconeAcao: string` (por omissão `'arrow-right'`) ·
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

A combinação `tema="verde"` **sem descrição** e com os traços, ao centro, é o cabeçalho
só-título de uma secção clara — usada na sessão "Cronograma do Projecto" de
`detalhe-projeto` (2026-09-03).

**Usado em:** `candidaturas`, `desenvolvimento`, `detalhe-curso`, `detalhe-projeto`,
`estudantes`, `eventos`, `formacoes`, `hub-unagro`, `inscricao`

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

**Inputs:** `icone: string` (obrigatório) · `titulo: string` (obrigatório) ·
`descricao: string` (obrigatório) · `corIcone: 'primario' | 'dourado'` (por omissão
`'primario'`) · `formato: 'vertical' | 'iconeInline'` (por omissão `'vertical'`) ·
`caixaIcone: boolean` (por omissão `false`) · `textoAcao?: string` (sem
ele não há rodapé) · `linkAcao: string` (por omissão `''`) · `iconeAcao: string` (por
omissão `'arrow-right'`)

**Como usar:**

    <app-cartao-recurso corIcone="dourado" [icone]="objetivo.icone" [titulo]="objetivo.titulo"
      [descricao]="objetivo.descricao" [appRevelarAoScroll]="$index + 1" />

    <app-cartao-recurso [caixaIcone]="true" [icone]="forma.icone" [titulo]="forma.titulo"
      [descricao]="forma.descricao" [textoAcao]="forma.textoAcao" [linkAcao]="forma.linkAcao"
      [iconeAcao]="forma.iconeAcao" [appRevelarAoScroll]="$index" />

    <app-cartao-recurso formato="iconeInline" [icone]="solucao.icone" [titulo]="solucao.titulo"
      [descricao]="solucao.descricao" [appRevelarAoScroll]="$index + 1" />

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

**Usado em:** `candidatura-docentes`, `detalhe-projeto`, `hub-unagro`

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

## Sessões sem componente novo

Blocos únicos que ficaram em markup da página — registados aqui para não se procurar
por um componente que não existe.

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
  `modal-generico`, `alert-modal`, `modal-nossa-historia`, `barra-topo`
