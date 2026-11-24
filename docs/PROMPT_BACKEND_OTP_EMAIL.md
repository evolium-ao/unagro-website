# Prompt — Validação do e-mail por código OTP (backend Laravel)

> Copiar o bloco abaixo para o agente/IA que trabalha no repositório do backend.

---

## Contexto

A API Laravel da Unagro recebe as candidaturas docentes em `POST /candidaturas-docentes`
(público, `multipart/form-data`, `CandidaturaDocenteRequest`, respostas no envelope
`{ status, message, data }`). Precisamos de garantir que o e-mail indicado pelo candidato
existe e é dele, **sem** validar por SMTP nem usar API externa com chave.

A solução: um código OTP de 6 dígitos enviado para o e-mail. O frontend (já implementado)
pede o código, o candidato escreve-o num modal, o frontend confirma-o, e o mesmo código segue
no corpo da candidatura no campo `codigo_otp`. **A API tem de voltar a verificá-lo na
submissão** e só então o consome — a verificação no modal é apenas para feedback imediato.

## O que implementar

### 1. Tabela `verificacoes_email`

| coluna         | tipo                 | notas                                          |
|----------------|----------------------|------------------------------------------------|
| id             | bigIncrements        |                                                |
| email          | string, index        | guardado normalizado: `trim` + `lowercase`     |
| codigo_hash    | string               | `Hash::make($codigo)` — nunca o código em claro |
| tentativas     | unsignedTinyInteger  | default 0                                      |
| expira_em      | timestamp            | agora + 10 minutos                             |
| verificado_em  | timestamp, nullable  | preenchido no endpoint de verificação          |
| usado_em       | timestamp, nullable  | preenchido quando a candidatura é criada       |
| timestamps     |                      |                                                |

(Alternativa aceitável: `Cache` com chave `otp:email:{sha1(email)}`, desde que as mesmas regras
se mantenham.)

### 2. `POST /candidaturas-docentes/email/enviar-codigo` (público)

- Corpo JSON: `{ "email": "nome@dominio.ao" }`
- Validação: `required|email:rfc,dns|max:255` (o `dns` verifica o MX do domínio, sem SMTP).
- Gera `random_int(0, 999999)` com `str_pad(..., 6, '0', STR_PAD_LEFT)`.
- Invalida códigos anteriores **não usados** desse e-mail e cria um novo registo.
- Envia um Mailable (`CodigoVerificacaoEmailMail`, em fila — `ShouldQueue`) com o código,
  a validade (10 min) e o aviso "se não pediu este código, ignore este e-mail". PT.
- Cooldown: se já houve um envio para o mesmo e-mail há menos de 60 s, responder **429**
  com `{ message, data: { reenviar_em: <segundos restantes> } }`.
- Rate limit da rota: `throttle:5,1` por IP (e idealmente também por e-mail).
- Resposta **200**:
  ```json
  { "status": true, "message": "Código enviado.", "data": { "expira_em": 600, "reenviar_em": 60 } }
  ```
  (`expira_em` e `reenviar_em` em segundos — o frontend usa `reenviar_em` para a contagem do
  botão "Reenviar código".)

### 3. `POST /candidaturas-docentes/email/verificar-codigo` (público)

- Corpo JSON: `{ "email": "...", "codigo_otp": "123456" }`
- Validação: `email` required/email; `codigo_otp` `required|digits:6`.
- Procura o registo mais recente desse e-mail, **não usado** e **não expirado**.
- Se não existir, ou `tentativas >= 5`, ou `!Hash::check(...)`: incrementa `tentativas`
  (quando houver registo) e responde **422** no formato do Laravel:
  ```json
  { "message": "Código inválido ou expirado.", "errors": { "codigo_otp": ["Código inválido ou expirado."] } }
  ```
- Se válido: define `verificado_em = now()` (sem consumir) e responde **200**
  `{ "status": true, "message": "E-mail verificado.", "data": null }`.
- Rate limit: `throttle:10,1` por IP.

### 4. Alteração em `POST /candidaturas-docentes`

- Novo campo no `CandidaturaDocenteRequest`: `codigo_otp` → `required|digits:6`.
- Regra/closure de validação (ou `after()` no FormRequest): existe um registo para
  `strtolower(trim(email))` que **não está usado, não expirou, tem `tentativas < 5`** e cujo
  `Hash::check($codigo_otp, codigo_hash)` passa. Se falhar → **422** com
  `errors.codigo_otp = ["O código de verificação do e-mail é inválido ou expirou. Valide o e-mail novamente."]`.
  O frontend, ao receber um erro em `codigo_otp`, apaga o código guardado e volta a pedir a validação.
- Na criação da candidatura (dentro da mesma transação DB), marcar `usado_em = now()` —
  o código só serve para **uma** candidatura.
- Opcional: guardar `email_verificado_em` na tabela `candidaturas_docentes`.

### 5. Segurança e limpeza

- Nunca devolver o código na resposta nem registá-lo em logs.
- Comparação via `Hash::check` (tempo constante).
- Comando agendado (`schedule:daily`) que apaga registos com `expira_em < now() - 1 dia`.
- As novas rotas são públicas (sem `auth`), como `verificar-bi`.

### 6. Testes (Feature)

1. `enviar-codigo` com e-mail válido → 200, registo criado, Mailable em fila (`Mail::fake()`).
2. Segundo `enviar-codigo` em < 60 s → 429 com `reenviar_em`.
3. `verificar-codigo` com código certo → 200; errado → 422 em `codigo_otp` e `tentativas + 1`;
   após 5 erros, mesmo o certo → 422.
4. Código expirado (`travel(11)->minutes()`) → 422.
5. `POST /candidaturas-docentes` sem `codigo_otp` → 422; com código certo → 201 e `usado_em`
   preenchido; segunda candidatura com o mesmo código → 422.
6. E-mail com maiúsculas/espaços na candidatura → o código continua válido (normalização).

### 7. Documentação

Atualizar o OpenAPI/Scribe com as duas rotas novas e o campo `codigo_otp` no
`CandidaturaDocenteRequest`.

## Contrato que o frontend já usa (não alterar sem avisar)

| Pedido | Corpo | Sucesso | Erros tratados |
|---|---|---|---|
| `POST candidaturas-docentes/email/enviar-codigo` | `{ email }` (JSON) | 200 `data: { expira_em, reenviar_em }` | 422 (mostra a mensagem do `errors`), 429 |
| `POST candidaturas-docentes/email/verificar-codigo` | `{ email, codigo_otp }` (JSON) | 200 | 422 `errors.codigo_otp`, 429 |
| `POST candidaturas-docentes` | multipart + `codigo_otp` | 201 | 422 `errors.codigo_otp` → frontend pede nova validação |
