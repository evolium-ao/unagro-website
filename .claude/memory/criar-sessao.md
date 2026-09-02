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

**Inputs:** `valor: string` (obrigatório) · `rotulo: string` (obrigatório) ·
`tema: 'escuro' | 'claro'` (por omissão `'escuro'`)

**Como usar:**

    <app-item-estatistica [valor]="estatistica.valor" [rotulo]="estatistica.rotulo"
      [appRevelarAoScroll]="$index" />

**Usado em:** `desenvolvimento`

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

**Inputs:** `titulo: string` (obrigatório) · `descricao?: string` ·
`tema: 'claro' | 'escuro' | 'branco' | 'verde'` (por omissão `'claro'`) ·
`alinhamento: 'centro' | 'esquerda'` (por omissão `'centro'`) · `mostrarTracos: boolean`
(por omissão `true`)

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

**Inputs:** `curso: CursoCurtaDuracaoCartao` (obrigatório; interface exportada no
próprio ficheiro — `id`, `titulo`, `resumo`, `cargaHoraria: number`, `preco: number`,
`estadoInscricao: 'abertas' | 'proxima-turma'`, `proximaTurma?`, `link`, `imagem?`)

**Como usar:**

    <app-cartao-curso-curta-duracao [curso]="curso"
      [appRevelarAoScroll]="$index % cursosCurtaPorLote" />

**Usado em:** `formacoes`

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
  `select-field-v2`, `botao`
- **Diversos:** `espaco-imagem` (marcador cinzento das imagens), `icone`, `selo`,
  `faixa-estatisticas`, `faixa-patrocinadores`, `contador-regressivo`,
  `modal-generico`, `alert-modal`, `modal-nossa-historia`, `barra-topo`
