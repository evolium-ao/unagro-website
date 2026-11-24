# Auditoria do projeto — unagro-frontend

> Varredura feita em 2026-09-09, para dar uma visão rápida do estado real do
> projeto a quem chega agora.
>
> Este documento **não substitui** a documentação interna já existente —
> complementa-a. Para profundidade, ver:
> - [`.claude/README.md`](../.claude/README.md) — arquitetura de dados em 3
>   camadas, regras de tradução, animação e esqueletos de carregamento.
> - [`.claude/memory/integrar-recurso.md`](../.claude/memory/integrar-recurso.md)
>   — histórico detalhado, recurso a recurso, do que a API dá e do que ainda
>   não dá.
> - [`.claude/memory/criar-sessao.md`](../.claude/memory/criar-sessao.md)

## O que já funciona

- **Angular 21 + SSR**, 100% standalone components, arquitetura de dados em
  três camadas bem definida e documentada: `ApiService` → `*.service.ts`
  (mapeia forma da API → modelo do site) → `*.queries.ts` (TanStack Query) →
  `injectQuery()` no componente.
- **~12 recursos já ligados a uma API real** (Laravel): notícias, eventos,
  laboratórios, treinamentos, startups, investigadores, faculdades, cursos,
  histórias de alumni, projetos — mais 5 formulários de escrita (contactos,
  candidaturas de alunos/docentes, inscrições em curso/evento, login).
- **Tratamento de erro consistente**: toda chamada HTTP passa por `ApiService`
  e é normalizada em `ErroApi` — não há chamada de API "solta" sem tratamento.
- **Estilo consistente**: Tailwind v4 com tema centralizado, sem SCSS nem CSS
  espalhado pelo projeto.
- **Esqueletos de carregamento** aplicados de forma disciplinada — cada
  cartão assíncrono tem o seu par `*-esqueleto`.
- **Histórico git limpo** (mensagens descritivas, sem "wip"/"fix bug") e
  **dependências atualizadas** (Angular 21, TypeScript 5.9, Tailwind v4,
  Vitest 4 — nada obsoleto).

## Checklist priorizado de pendências

### 🔴 Crítico — bloqueia produção

- [x] `apiUrl` aponta para um IP de rede local (`http://192.168.1.252:8001/api`)
      mesmo em `environment.production.ts` — não resolve fora da rede local
      (`src/environments/environment.production.ts:4`, já tem TODO próprio).
      _Atualizado para um domínio placeholder (`https://api.unagro.exemplo.ao/api`) —
      trocar pelo domínio público real da API quando estiver disponível._
- [x] Sem `HttpInterceptor` — o `SessaoService` guarda o token de sessão, mas
      nada o anexa automaticamente (`Authorization: Bearer ...`) aos pedidos
      subsequentes ao `ApiService`.
      _Adicionado `core/api/token.interceptor.ts` (interceptor funcional),
      registado em `app.config.ts` via `withInterceptors`. Só anexa o token a
      pedidos para `environment.apiUrl` — não vaza para a API de tradução._
- [ ] Sem guards de rota (`CanActivate`) — páginas destinadas a utilizador
      autenticado (ex.: `/estudantes`) ficam acessíveis a qualquer visitante
      pela URL, mesmo sem login.
      _`core/guardas/autenticado.guard.ts` (guard funcional) existe, mas foi
      **desfeito em `estudantes`** a pedido em 2026-09-11 — `/estudantes`
      voltou a ficar pública. O guard fica disponível para aplicar a outra
      rota quando fizer sentido; a ressalva de SSR (sessão só existe no
      navegador, por isso um utilizador autenticado ainda veria o
      redireccionamento no HTML do servidor até a hidratação corrigir)
      continua válida para quando for reaplicado._
- [x] Contrato de `POST /login` nunca confirmado contra a API real — o código
      aceita `token`/`access_token` e `user`/`utilizador` "por segurança"
      (`autenticacao.service.ts:29`).
      _Confirmado via `/docs/api.json` (esquema `AuthResource`): a resposta é
      sempre `{ user: { id, name, email, tipo }, token, token_type: 'Bearer' }`
      — não existem `access_token` nem `utilizador`/`nome`. O código em
      `autenticacao.service.ts` ainda não foi simplificado para remover os
      campos alternativos — fica como próximo passo, separado desta varredura._
- [ ] Sem CI/CD (nenhum `.github/workflows`) e sem ESLint configurado — só
      Prettier. Nada valida build/testes automaticamente antes de um merge.
- [ ] Sem nenhuma configuração de deploy no repositório (sem Docker, sem
      `.env.example`, sem definição de hosting/infra).

### 🟠 Importante — funcionalidade incompleta ou simulada

- [ ] Conteúdo ainda 100% mock (nunca ligado a endpoint próprio): todo o
      conteúdo de `/candidaturas` (bolsas, calendário académico, requisitos,
      fases, canais de contacto), notícias académicas + intranet de
      `/estudantes`, docência, FAQ, patrocinadores, próximas datas, projetos
      inovadores, estatísticas institucionais/de alumni, e a metodologia /
      linhas de investigação / publicações de `/desenvolvimento`.
      **Actualização (varredura ao `/docs/api.json`):** várias destas secções
      já têm endpoint real na API, só não foram ligadas ainda — ver a secção
      [Endpoints da API ainda não consumidos](#endpoints-da-api-ainda-não-consumidos)
      abaixo para o mapeamento exacto mock → endpoint.
- [ ] `POST /logout` nunca é chamado — terminar sessão no site
      (`SessaoService.terminar()`) só limpa o armazenamento local; o token
      continua válido no backend até expirar por conta própria. Risco pequeno
      mas real (token roubado antes do "logout" continua a funcionar).
- [ ] `GET /startups/{id}` já está implementado de ponta a ponta
      (`StartupsService.obterPorId`, `startupsQueries.porId`), mas nenhum
      componente o chama — falta só a rota/página de detalhe, o resto já
      existe (código morto à espera de uso).
- [ ] `/registo` é apenas uma página estática com um link para `/entrar` —
      não existe formulário de criação de conta.
- [ ] Login social (Google/etc.) visível na UI mas não ligado a nada —
      `console.warn` explícito em `entrar.component.ts:166`.
- [ ] Sem fluxo de recuperação de password (`entrar.component.ts:24`).
- [ ] Páginas/rotas de detalhe ausentes para: startups, investigadores,
      treinamentos (clicar num treinamento cai em `/cursos/:id`, que não o
      reconhece — bug latente, não só limitação), eventos, e a plataforma de
      certificados de formação.
- [ ] `detalhe-projeto`: mistura dados reais da API com `PROJETOS_MOCK` via
      `(id - 1) % 4` para campos que a API ainda não tem (contexto, galeria,
      ~~documentos~~, ~~testemunhos~~) — a página parece 100% dinâmica, mas não é.
      `documentos` liga a `GET /publicacoes` desde 2026-09-10, e `testemunhos`
      a `GET /testemunhos` desde 2026-09-11 (cai no mock só se o projecto não
      tiver nenhum registo associado em qualquer um dos dois).
      **Detalhe campo-a-campo, incluindo o que já dá para ligar hoje** (galeria)
      **vs. o que continua a depender do backend**: ver
      [Projetos — o que falta, em detalhe](#projetos--o-que-falta-em-detalhe).
- [ ] Endpoint de contacto de projeto e de subscrição de newsletter ainda não
      existem no backend — os formulários correspondentes só simulam o envio.
- [ ] 2 das 7 abas de `/sobre` (`governanca`, `aba-unagro`) sem conteúdo
      aprovado pelo cliente — mostram um placeholder dedicado
      (`app-sobre-conteudo-em-preparacao`), decisão deliberada até haver texto.
- [ ] Imagens `capa_url`/`imagem_url` devolvidas pela API apontam para
      `http://localhost:8000/storage/...` — não carregam fora da máquina da
      API (fix é do lado do backend Laravel, `APP_URL`).
- [ ] Tradução automática (MyMemory, terceiros, sem chave) depende de uma
      quota diária baixa — já esgotada uma vez em produção, faz a tradução
      falhar silenciosamente. Sem loading state próprio (pode "flashar"
      texto em português antes de traduzir).

### 🟡 Qualidade / débito técnico

- [ ] Cobertura de testes quase nula: 7 `*.spec.ts` para ~274 ficheiros
      `.ts` (~2.5%), e sem nenhum teste e2e configurado.
- [ ] `console.log` de depuração esquecido em
      `Validacao.service.ts:187,190`.
- [ ] Sobreposição de código entre `modal-inscricao-curso` e
      `modal-inscricao-evento` (ex.: `telefonePlaceholder` duplicado) —
      candidato a extrair para algo partilhado.
- [ ] E-mail pessoal de um colaborador (`admiro.andre@evolium.ao`) hardcoded
      em `environment.ts` e `environment.production.ts`, versionado no git.
- [ ] Duplicação de dados de seed do lado da API (faculdades e cursos vêm
      duplicados), contornada no cliente com filtros ad-hoc
      (`semFaculdadesDuplicadas`, `semCursosDuplicados`, etc.) — sintoma de
      dados de teste ainda no backend, não resolvido na origem.
- [ ] A própria memória do projeto regista uma nota que contradiz o README
      sobre o SSR da página `noticias` não esperar pela query mesmo após a
      correção geral (`notifyManager.setScheduler`) — vale reverificar
      manualmente em `dist` antes de assumir resolvido.

## Endpoints da API ainda não consumidos

Varredura feita em 2026-09-09 contra o esquema OpenAPI real da API
(`http://192.168.1.252:8001/docs/api.json`, acessível na rede local). A API
expõe **145 combinações método+caminho** (29 recursos, na maioria CRUD
completo `GET`/`POST`/`PUT`/`DELETE`). O frontend consome hoje só **~24**
dessas combinações, através de 16 `*.service.ts` em `core/servicos/`.

Isto muda a prioridade de várias das secções acima marcadas como "100% mock":
não é preciso esperar por backend nenhum — o endpoint já existe, falta só a
camada de 3 passos (`service` → `queries` → componente) descrita em
[`.claude/README.md`](../.claude/README.md) e o agente `integrar-recurso`.

### Recursos com endpoint pronto na API, 0% consumidos pelo frontend

| Recurso na API | Endpoints | Substituiria este mock |
| --- | --- | --- |
| Recuperação de senha | `POST /auth/recuperar-senha`, `/verificar-codigo`, `/definir-nova-senha`, `/reenviar-codigo` | resolve "sem recuperação de password" (`entrar.component.ts:24`) |
| Parceiro (`/parceiros`) | leitura | `patrocinadores.mock.ts` |
| ~~Testemunho (`/testemunhos`)~~ | leitura | ~~campo `testemunhos` de `PROJETOS_MOCK`~~ — **integrado em 2026-09-11**, afinal tem `projecto_id` (a análise anterior baseou-se num schema desactualizado); ver [Projetos — o que falta, em detalhe](#projetos--o-que-falta-em-detalhe) |
| Dúvidas Frequentes (`/duvidas-frequentes`) | leitura | `perguntas-frequentes.mock.ts` (usado em `/candidaturas`) |
| ~~Publicações (`/publicacoes`)~~ | leitura | ~~`PUBLICACOES_MOCK` em `desenvolvimento.component.ts`~~ — **integrado em 2026-09-10**, ver [Projetos — o que falta, em detalhe](#projetos--o-que-falta-em-detalhe) |
| Bolsa (`/bolsas`) | leitura | `bolsas.mock.ts` (usado em `/candidaturas`) |
| Categoria (`/categorias`) | leitura | `ROTULOS_CATEGORIA_PROJECTO` fixo no cliente |
| Planos Curriculares (`/planos-curriculares`) | leitura | nada ainda — poderia enriquecer `detalhe-curso` (grade curricular) |
| Banner (`/banners`) | leitura | nada ainda — existe um agente `.claude/agents/criar-banner.md`, sugere feature planeada mas não ligada |
| Carreira (`/carreiras`) | leitura | nada ainda — recurso sem página correspondente no site hoje (possível secção "Carreiras/Vagas" futura) |

Não estão nesta lista, de propósito: `calendario-academico`, `avisos-intranet`,
`docencia`, `noticias-academicas`, `estatisticas`, `proximas-datas` e
`projectos-inovadores` — os mocks destes **não têm** endpoint correspondente
no OpenAPI actual; continuam a ser mock por falta de API, não por falta de
integração do frontend.

> **Nota do utilizador (2026-09-10):** nem todas as rotas do OpenAPI se destinam
> ao site público — muitas (sobretudo `POST`/`PUT`/`DELETE`) são para o
> backoffice/CMS. No futuro os endpoints de leitura do site vão ganhar um
> prefixo `public` próprio. A tabela acima já só lista o lado de leitura de
> cada recurso por essa razão; os caminhos exactos podem mudar quando o
> prefixo `public` existir — o que importa é o recurso, não o caminho actual.

### Consumo parcial — endpoint existe, só falta ligar o resto

- `GET /faculdades/{id}`, `/investigadores/{id}`, `/laboratorios/{id}`,
  `/treinamentos/{id}` — só a listagem (`GET` sem `/{id}`) é usada; sem
  página de detalhe para nenhum destes quatro recursos.

### CRUD não consumido, mas esperado

`POST`/`PUT`/`DELETE` em recursos só de leitura no site (alumni, cursos,
eventos, faculdades, investigadores, laboratórios, notícias, projectos,
startups, treinamentos) não são chamados — são operações de administração
de conteúdo (backoffice), fora do âmbito do site público. Não é uma
pendência, só para não aparecer como "não consumido" por engano numa próxima
varredura.

## Projetos — o que falta, em detalhe

Pedido específico de auditoria em 2026-09-10. `ProjetosService`
(`src/app/core/servicos/projetos.service.ts`) já é o mais integrado dos
recursos com API real — mas com uma dependência forte de `PROJETOS_MOCK` para
o que a API ainda não modela. Eis o que muda ao olhar para o `ProjectoResource`
do OpenAPI campo a campo:

**Falsos alarmes da varredura anterior** — `cronogramas` e `equipaProjectos`
**já vêm embutidos** na resposta de `GET /projectos` e `GET /projectos/{id}`
(não são endpoints à parte a chamar) e o `ProjetosService` já os lê
(`paraCronogramaApi`, `paraEquipaApi`). Só caem no mock porque **os dados reais
de hoje estão vazios/escassos** (cronogramas sempre vazio nos 20 projectos
actuais; equipa só preenchida nos ids 1–5) — é um problema de conteúdo no
backend, não de integração no frontend.

**Gaps reais, por ordem de esforço:**

1. **`galeriaProjectos` — vem da API, mas o frontend nem declara o campo.**
   O `ProjectoResource` traz `galeriaProjectos` (imagem + legenda + ordem, por
   projecto) tal como `equipaProjectos`, mas a interface `ProjetoApi` em
   `projetos.service.ts:52-62` não o inclui — `galeria` no `Projeto` do site
   vem sempre de `PROJETOS_MOCK`, mesmo quando a API já tem fotos daquele
   projecto. É o gap mais barato de fechar: mesmo padrão que já existe para
   equipa/cronograma (mapear, cair no mock só se vier vazio).
2. **Campos de financiamento devolvidos pela API e nunca usados:**
   `meta_financeira`, `valor_arrecadado`, `percentagem_meta`, `tipo_apoio` —
   nenhum aparece em `ProjetoApi` nem em `Projeto` (`core/modelos/projeto.model.ts`).
   Não há hoje nenhuma barra de progresso de financiamento na página de
   projecto; a API já devolve os números para isso.
3. **`ativo` (boolean) nunca é lido** — `GET /projectos` não tem parâmetro de
   filtro (sem query params documentados), por isso devolve tudo, incluindo
   projectos eventualmente marcados `ativo: false`. O site não filtra por
   `ativo` do lado do cliente — risco de mostrar publicamente um projecto que
   o backoffice marcou como inactivo/rascunho.
4. **`destaque` (boolean) e `GET /projectos/destaque` nunca são usados** — o
   equivalente ao que `eventos.service.ts` já faz com `/eventos/destaque`.
   `desenvolvimento.component.ts` não escolhe nenhum projecto em destaque hoje.
5. **Sem endpoint para os campos narrativos do detalhe** — `contexto`,
   `desafio`, `objetivoGeral`/`objetivosEspecificos`, `descricaoSolucao`/
   `solucoes`, `estatisticasContexto`/`estatisticasImpacto`, `faculdade`,
   `local`, `periodo` e `resultado_principal` **não existem em nenhum schema
   do OpenAPI actual** — não é falta de integração, é conteúdo que o backend
   ainda não modelou. Continuam a vir do `PROJETOS_MOCK`, por decisão já
   documentada em `.claude/memory/integrar-recurso.md`.
   ~~`documentos`~~ **resolvido em 2026-09-10** — ver item 8 abaixo, tinha
   endpoint próprio (`/publicacoes`) que a varredura inicial não tinha ligado
   ao projecto.
6. ~~`testemunhos` não tem como se ligar a um projecto específico ainda`~~ —
   **enganei-me em 2026-09-09**: o schema OpenAPI em cache não tinha
   `projecto_id`, mas a resposta real de `GET /testemunhos` traz `projecto_id`
   e `projecto` embutido, tal como `publicações`. **Resolvido em 2026-09-11**
   — ver item 8 abaixo.
7. **Endpoint de contacto de projecto continua sem existir** — o formulário em
   `detalhe-projeto.component.ts:358` continua a simular o envio; não há
   recurso "Contacto de Projecto" nem afim no OpenAPI.
8. [x] **`documentos` (detalhe do projecto) e "Publicações Recentes"
   (`/desenvolvimento`) — resolvido em 2026-09-10.** A API tem um recurso
   `Publicação` (`GET /publicacoes`) que não apareceu na varredura inicial
   porque não está ligado a `/projectos` no schema — só devolve `projecto_id`
   como uma referência solta. Cada publicação pode trazer `documento`
   (ficheiro no `storage`) e/ou `link` (URL externo, ex.: DOI). Implementado:
   - `core/servicos/publicacoes.service.ts` + `core/consultas/publicacoes.queries.ts`
     — novo recurso, no mesmo padrão dos outros (sem `obterPorId`, a API não
     filtra por projecto nem tem detalhe).
   - `desenvolvimento.component.ts`: secção "Publicações Recentes" liga a
     `GET /publicacoes` (com esqueleto de carregamento e tradução automática),
     `PUBLICACOES_MOCK` removido.
   - `projetos.service.ts`: `documentos` do detalhe do projecto passa a vir
     das publicações cujo `projetoId` bate com o projecto (cai no mock só se
     não houver nenhuma) — mesma lógica de equipa/cronograma.
   - `app-botao` ganhou suporte a URLs absolutos (ficheiro/link externo, com
     `download` opcional) — antes só sabia navegar por `routerLink`, o que
     não funciona para um ficheiro do `storage` da API.
   - **Actualização em 2026-09-11**: a API passou a devolver `documento_en` a
     par de `documento` (`link`/`link_en` deixaram de se usar, por pedido).
     O cartão de publicação tem dois botões, cada um a depender só do seu
     próprio ficheiro — não do idioma do site:
     - **"Baixar"** — sempre presente quando há `documento` (português).
     - **"Baixar Abstract"** — só aparece quando há `documento_en`.
     `Publicacao` ganhou `documentoUrl`/`documentoUrlEn` (dois campos, em vez
     de um só resolvido pelo idioma); `linkExterno` foi removido, já não
     corresponde à API real. Confirmado com dados reais: dos 76 registos
     actuais, ~26 já têm `documento_en` preenchido.
9. [x] **`testemunhos` (detalhe do projecto) — resolvido em 2026-09-11.** Ao
   confirmar directamente com `GET /testemunhos` (não só o schema, que estava
   incompleto), a resposta real traz `projecto_id` e `projecto` embutido —
   exactamente como as publicações. Implementado:
   - `core/servicos/testemunhos.service.ts` — novo recurso, mesmo padrão
     (sem `obterPorId`, sem filtro no `GET`).
   - `projetos.service.ts`: `testemunhos` do detalhe do projecto passa a vir
     dos testemunhos cujo `projetoId` bate com o projecto (cai no mock só se
     não houver nenhum) — mesma lógica de equipa/cronograma/documentos.
   - `detalhe-projeto.component.ts`: `citacao` e `papel` entram na tradução
     automática (`CAMPOS_TRADUZIVEIS_TESTEMUNHO`) quando vêm da API — e o
     mesmo gap foi corrigido para o `titulo` dos documentos
     (`CAMPOS_TRADUZIVEIS_DOCUMENTO`), que tinha ficado sem tradução desde a
     integração de publicações no item 8.

**Fora do âmbito do site (backoffice)**: `POST`/`PUT`/`DELETE` em
`/projectos`, `/cronogramas`, `/equipa-projectos`, `/galeria-projectos`,
`/publicacoes`, `/testemunhos` — gerir estes dados é trabalho de CMS, não do
site público.

## Metodologia

Auditoria feita por 3 explorações paralelas do código (stack/estrutura geral;
features ligadas à API vs. mock; débito técnico e histórico git), cruzadas
com leitura direta de `.claude/README.md`, e por uma 4ª passagem que buscou o
esquema OpenAPI real da API (`/docs/api.json`) e comparou os 145 endpoints
disponíveis com as chamadas efectivas em `core/servicos/*.service.ts`. Todos
os caminhos de ficheiro citados acima foram confirmados durante a
exploração.
