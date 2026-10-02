# Caixa de Confirmação — `app-caixa-confirmacao`

Checkbox com texto longo ao lado, para declarações, termos e consentimentos. O
texto entra por conteúdo projetado, para poder levar ênfase ou ligações.

```ts
import { CaixaConfirmacaoComponent } from 'src/app/shared/componentes/caixa-confirmacao/caixa-confirmacao.component';
```

## Exemplos

### Obrigatória

```html
<app-caixa-confirmacao formControlName="compromissoHonra" obrigatorio [erro]="erros.compromissoHonra()">
  Declaração sob Compromisso de Honra: declaro que todos os dados são fidedignos.
</app-caixa-confirmacao>
```

```ts
compromissoHonra: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
```

### Com ligação no texto

```html
<app-caixa-confirmacao formControlName="termos">
  Li e aceito os <a routerLink="/termos" class="underline">termos de utilização</a>.
</app-caixa-confirmacao>
```

## Estados

| Estado        | Aspeto                                                     |
| ------------- | ---------------------------------------------------------- |
| desmarcada    | Quadrado branco com contorno cinzento.                     |
| marcada       | Quadrado verde (`--color-primary`) com visto branco.       |
| erro          | Contorno vermelho e mensagem por baixo, alinhada ao texto. |
| desativada    | Opacidade reduzida, cursor `not-allowed`.                  |
| foco (teclado) | Anel verde (`focus-visible`).                             |

## API

### Inputs

| Input         | Tipo             | Omissão | Descrição                                                           |
| ------------- | ---------------- | ------- | ------------------------------------------------------------------- |
| `obrigatorio` | `boolean`        | `false` | Acrescenta o asterisco ao fim do texto. **Não valida** — use `Validators.requiredTrue`. |
| `erro`        | `string \| null` | `null`  | Mensagem já resolvida. Com `OnPush`, use `criarErrosFormulario`.    |
| `disabled`    | `boolean`        | `false` | Desativa (além do `disable()` do `FormControl`).                    |

### Conteúdo

| Slot     | Descrição              |
| -------- | ---------------------- |
| (padrão) | Texto da confirmação.  |

### Valor (`ControlValueAccessor`)

`boolean`. O controlo fica `touched` ao mudar ou ao perder o foco.

## Acessibilidade

- É um `<input type="checkbox">` nativo (com `appearance-none`), dentro de um
  `<label>`: clicar no texto marca a caixa, e o espaço funciona pelo teclado.
- Com erro: `aria-invalid` e `aria-describedby` a apontar para a mensagem.
- O asterisco é `aria-hidden`.
