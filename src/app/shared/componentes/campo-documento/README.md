# Campo Documento — `app-campo-documento`

Anexo de **um** documento de um dossier: cartão com título, descrição e formatos
aceites, que passa a cartão "Anexado" com Substituir / Remover quando há ficheiro.

```ts
import { CampoDocumentoComponent } from 'src/app/shared/componentes/campo-documento/campo-documento.component';
```

## Estados

| Estado      | Quando                          | Aspeto                                                                                   |
| ----------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| **vazio**   | valor `null`                    | Moldura tracejada centrada: ícone, título, descrição, botão "Selecionar", linha de formatos. Aceita largar o ficheiro. |
| **anexado** | valor `File`                    | Cartão sólido: ícone, título + selo "Anexado", descrição, chip com nome e tamanho, botões Substituir e Remover. |
| **erro**    | `erro` com texto                | Moldura/cartão a vermelho e mensagem por baixo (`role="alert"`).                         |
| **desativado** | `disabled` ou `FormControl.disable()` | Botões desativados; largar ficheiros é ignorado.                                  |

## Exemplos

### Básico (obrigatório)

```html
<app-campo-documento
  formControlName="curriculo"
  aceita=".pdf,application/pdf"
  titulo="1. Curriculum Vitae"
  descricao="Modelo detalhado com publicações e projetos."
  textoSelecionar="Selecionar Ficheiro (PDF)"
  textoFormatos="Formatos: PDF até 10MB"
  obrigatorio
  [erro]="erros.curriculo()"
/>
```

```ts
curriculo: new FormControl<File | null>(null, {
  validators: [Validators.required, this.validacao.validarFicheiro(['pdf'], 10)],
}),
```

### Opcional, com ícones próprios

```html
<app-campo-documento
  formControlName="comprovativos"
  aceita=".pdf,.zip"
  icone="folder-up"
  iconeAnexado="folder-input"
  titulo="3. Comprovativos"
  rotuloOpcional="(Opcional / Valorativo)"
  textoSelecionar="Selecionar Documentos (PDF ou ZIP)"
/>
```

### Traduzido

O componente não tem texto fixo em português além dos valores por omissão: passe
sempre os rótulos já traduzidos (`textoSelecionar`, `textoAnexado`,
`textoSubstituir`, `textoRemover`, `textoFormatos`, `rotuloOpcional`).
Ver `pages/candidatura-geral/formulario/etapa-3/secao-dossier.component.ts`.

## API

### Inputs

| Input             | Tipo             | Omissão                 | Descrição                                                         |
| ----------------- | ---------------- | ----------------------- | ----------------------------------------------------------------- |
| `titulo`          | `string`         | — (obrigatório)         | Título do documento.                                              |
| `descricao`       | `string`         | `''`                    | Texto de apoio por baixo do título.                               |
| `obrigatorio`     | `boolean`        | `false`                 | Mostra o asterisco. **Não valida** — use `Validators.required`.   |
| `rotuloOpcional`  | `string`         | `''`                    | Rótulo ao lado do título quando não é obrigatório.                |
| `icone`           | `string`         | `'file-up'`             | Ícone do estado vazio (`dados-icones.ts`).                        |
| `iconeAnexado`    | `string`         | `'file-text'`           | Ícone do estado anexado.                                          |
| `aceita`          | `string`         | `''`                    | Filtro `accept` do seletor nativo. Só filtra o diálogo — valide também no `FormControl`. |
| `textoSelecionar` | `string`         | `'Selecionar ficheiro'` | Botão do estado vazio.                                            |
| `textoFormatos`   | `string`         | `''`                    | Linha por baixo do botão. Vazio = não aparece.                    |
| `textoAnexado`    | `string`         | `'Anexado'`             | Selo do estado anexado.                                           |
| `textoSubstituir` | `string`         | `'Substituir'`          | Botão de substituir.                                              |
| `textoRemover`    | `string`         | `'Remover'`             | Botão de remover.                                                 |
| `erro`            | `string \| null` | `null`                  | Mensagem já resolvida. Com `OnPush`, use `criarErrosFormulario`.  |
| `disabled`        | `boolean`        | `false`                 | Desativa o campo (além do `disable()` do `FormControl`).          |

### Valor (`ControlValueAccessor`)

`File | null`. Remover escreve `null`. Cancelar o diálogo nativo **mantém** o
anexo anterior. Ao escolher, largar ou remover, o controlo fica `touched`.

### Função exportada

`formatarTamanho(bytes: number): string` — `"3.4 MB"` / `"820 KB"`. Use-a onde o
tamanho do anexo for mostrado fora do campo (ex.: revisão da candidatura), para o
formato ser igual.

## Acessibilidade

- O cartão é um `role="group"` ligado ao título (`aria-labelledby`) e à
  descrição e erro (`aria-describedby`); `aria-invalid` quando há erro.
- O `<input type="file">` fica escondido e fora da ordem de tabulação: quem abre o
  diálogo são os botões "Selecionar" / "Substituir", que são `<button>` reais.
- O asterisco é `aria-hidden` — a obrigatoriedade é comunicada pela mensagem de erro.

## Limitações

- Um ficheiro por campo. Para vários documentos, peça um ZIP (como no dossier
  docente) ou use vários campos.
- `aceita` não impede ficheiros largados com outro formato — é o validador do
  `FormControl` que os recusa.
