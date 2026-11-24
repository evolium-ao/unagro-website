# Relatório técnico — antes / depois

> Resumo do trabalho feito entre 2026-09-09 e 2026-09-11 (branch `feat/continue`),
> a partir da auditoria inicial em [`docs/AUDITORIA.md`](./AUDITORIA.md). Cobre
> só o que foi feito nesta sessão — outras alterações que apareçam no `git
> status` (favicon, `.claude/*`, `rodapé`, `styles.css`, porta da API nos
> comentários) não fazem parte deste trabalho e não estão aqui detalhadas.

## Estado em 2026-09-09 (ponto de partida)

Levantamento completo em `docs/AUDITORIA.md`. Resumo dos pontos que este
relatório cobre:

| Área | Estado inicial |
| --- | --- |
| `apiUrl` de produção | IP de rede local (`192.168.1.252:8000`), igual em dev e produção — não resolve fora da rede |
| Sessão → API | Token guardado em `SessaoService`, mas nunca anexado às chamadas (sem interceptor) |
| Rotas autenticadas | Sem nenhum guard — `/estudantes` acessível a qualquer visitante |
| Contrato de `POST /login` | Nunca confirmado contra a API real — código aceitava campos alternativos "por segurança" |
| "Publicações Recentes" (`/desenvolvimento`) | 100% mock (`PUBLICACOES_MOCK`), sem endpoint identificado |
| Documentos do projecto (`/projetos/:id`) | 100% mock (`PROJETOS_MOCK`), sem botão de download real |
| Botão de link externo (`app-botao`) | Só sabia navegar por `routerLink` — não suportava URL absoluto nem `download` |

## O que mudou

### 1. Segurança e infraestrutura

| Mudança | Ficheiros | Estado |
| --- | --- | --- |
| `apiUrl` de produção trocado do IP local para um domínio placeholder | `src/environments/environment.production.ts` | ⚠️ ainda por substituir pelo domínio público real quando existir |
| Interceptor HTTP anexa `Authorization: Bearer <token>` às chamadas para `environment.apiUrl` | `src/app/core/api/token.interceptor.ts` (novo), `src/app/app.config.ts` | ✅ activo |
| Contrato de `POST /login` confirmado via `/docs/api.json` (`AuthResource`: `{ user, token, token_type }`) | — (só documentação; `autenticacao.service.ts` não foi simplificado) | 📝 confirmado, código por limpar |
| Guard de rota para sessão iniciada | `src/app/core/guardas/autenticado.guard.ts` (novo) | 🟡 criado, mas **não aplicado a nenhuma rota** — ver secção "Revertido" abaixo |

### 2. Auditoria e documentação

- `docs/AUDITORIA.md` (novo): estado geral do projecto, checklist priorizado
  de pendências, comparação dos 145 endpoints do OpenAPI da API contra os
  ~24 realmente consumidos pelo frontend, e uma secção dedicada ao
  levantamento campo-a-campo de "Projetos".

### 3. Publicações — de mock a dado real

A API tem um recurso `Publicação` (`GET /publicacoes`) que não tinha sido
identificado na primeira varredura porque não aparece aninhado em
`/projectos` — só traz um `projecto_id` solto. Isto alimenta duas secções:

| Secção | Antes | Depois |
| --- | --- | --- |
| "Publicações Recentes" (`/desenvolvimento`) | `PUBLICACOES_MOCK`, array fixo de 3 itens | `GET /publicacoes` via `injectQuery`, com esqueleto de carregamento, estado de erro e tradução automática |
| "Documentos e Publicações" (`/projetos/:id`) | Sempre do `PROJETOS_MOCK` | Publicações reais filtradas por `projecto_id`; só cai no mock se o projecto não tiver nenhuma associada |

Ficheiros novos:
- `src/app/core/servicos/publicacoes.service.ts`
- `src/app/core/consultas/publicacoes.queries.ts`
- `src/app/shared/componentes/cartao-publicacao-esqueleto/`

Ficheiros alterados:
- `src/app/core/modelos/publicacao.model.ts` — de par bilingue mock (`revista`,
  `autores`, `link_abstract`, `link_download`) para o formato que a API
  devolve (`titulo`, `resumo`, `data`, `documentoUrl`, `linkExterno`, `projetoId`)
- `src/app/shared/componentes/cartao-publicacao/cartao-publicacao.component.ts`
  — adaptado ao novo modelo, botões condicionais (só aparecem quando há
  ficheiro/link)
- `src/app/pages/desenvolvimento/desenvolvimento.component.ts` + `.html`
- `src/app/core/servicos/projetos.service.ts` — busca publicações a par de
  investigadores e agrupa por `projecto_id`

### 4. `app-botao` — suporte a URL externo

`app-botao[link]` só renderizava `[routerLink]`, que não funciona para um
ficheiro do `storage` da API nem para um link externo (DOI, revista) — o
router tentaria navegar dentro da SPA. Agora detecta um `http(s)://` e
renderiza um `<a href target="_blank">` normal, com `download` opcional.

`src/app/shared/componentes/botao/botao.component.ts` — mudança pequena,
mas desbloqueia qualquer botão futuro que aponte para a API, não só o de
publicações.

### 5. Revertido

O guard de autenticação chegou a ser aplicado à rota `estudantes`
(`canActivate: [autenticadoGuard]`), mas foi **desfeito a pedido em
2026-09-11** — `/estudantes` voltou a ser pública. `app.routes.ts` está hoje
idêntico ao estado inicial (sem diff); o guard em si continua a existir em
`core/guardas/autenticado.guard.ts`, pronto a aplicar a outra rota quando
fizer sentido.

## O que não mudou (continua pendente)

Do checklist original em `docs/AUDITORIA.md`, continuam por fazer:

- CI/CD, ESLint, cobertura de testes (7 specs para ~280 ficheiros)
- `galeriaProjectos` (fotos por projecto, já vem da API mas não está ligado)
- Campos de financiamento (`meta_financeira`, `valor_arrecadado`, `tipo_apoio`) e
  filtro por `ativo`/`destaque` em `/projectos`
- `/registo` (só estático), login social, recuperação de senha (a API já tem
  os 4 endpoints, nenhum ligado)
- Testemunhos e contacto de projecto (sem endpoint viável na API actual)
- `POST /logout` nunca chamado — sessão só termina localmente

## Verificação

Cada mudança de código foi validada com `npx tsc --noEmit -p tsconfig.app.json`
e, para as mudanças de template/publicações, com `npx ng build --configuration
development` (SSR + prerender), ambos sem erros.
