---
name: evolium-toolkit
description: Usar sempre que a tarefa envolva a @evolium-kit/toolkit neste projecto — criar ou alterar UI (botões, campos de texto, selects, switches, cartões, badges), formulários, layouts/shells, páginas de autenticação, 404, tema, tokens --evo-*, modo escuro, Theme Studio, serviços HTTP, plugins do kernel ou autenticação. Dá o inventário exacto da versão instalada (componentes, inputs, tokens, serviços, geradores) e as regras para a usar sem partir o tema nem o SSR.
---

<!-- gerado por ng g @evolium-kit/toolkit:ai-context — apagar esta linha para personalizar (deixa de ser actualizado) -->

# @evolium-kit/toolkit neste projecto

Este projecto usa a @evolium-kit/toolkit: componentes de UI temáveis, layouts, páginas
prontas, tema por tokens e um kernel de serviços por plugins. **Antes de
escrever código novo, confirma se a toolkit já o oferece.**

## Onde está a informação

1. **Ler primeiro `node_modules/@evolium-kit/toolkit/AGENTS.md`** — o índice da versão **instalada**: entry
   points, todos os componentes (selector, inputs com tipo e omissão, tokens),
   layouts, páginas, tokens de tema, serviços, geradores e as regras de uso.
2. Depois, o README do recurso em causa. Os caminhos no índice são relativos a
   `node_modules/@evolium-kit/toolkit/` (ex.: `components/src/lib/select/README.md`).
3. Para a assinatura exacta de um símbolo:
   `node_modules/@evolium-kit/toolkit/types/evolium-kit-toolkit-<entry>.d.ts`.

**Usar a ferramenta Read com estes caminhos exactos.** O `node_modules` está
no `.gitignore` e a pesquisa (Grep/Glob) ignora-o: procurar a toolkit por
pesquisa dá "não encontrado" mesmo com ela instalada.

A versão instalada está em `node_modules/@evolium-kit/toolkit/package.json`; as
alterações por versão em `node_modules/@evolium-kit/toolkit/CHANGELOG.md`.

Se `AGENTS.md` não existir, a toolkit instalada é anterior a este guia: ler
`node_modules/@evolium-kit/toolkit/README.md` e os README de cada entry point, e
sugerir actualizar (`npm install @evolium-kit/toolkit@latest`).

## Regras essenciais (lista completa no índice)

- Reutilizar componentes, layouts e páginas da toolkit; importar só de
  `@evolium-kit/toolkit/{core,theme,components,layouts,pages,services}`.
- Angular moderno: standalone, zoneless, `OnPush`, signals,
  `input()`/`output()`/`model()`; SSR-safe (nada de `window`/`localStorage`
  fora de `afterNextRender()`/`isPlatformBrowser()`).
- Aparência **só por tokens `--evo-*`** (`:root`, variante, `[evoTokens]`):
  nunca `::ng-deep`, nunca reescrever classes `.evo-*`, nunca cores literais.
  Em `[evoTokens]` usar o nome curto completo (`'text-field-ring-width'`).
- Serviços HTTP como plugins (`withPlugin(…)`); autenticação e cabeçalhos
  globais em `sharedInterceptors`; erros por `ctx.toError`; `ctx.storage`.
- Preferir os geradores: `ng g @evolium-kit/toolkit:page|layout|ui-component|resource-plugin`
  (com `--dry-run` primeiro).
