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

*(ainda nenhum — a primeira execução do agente abre esta lista)*

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
