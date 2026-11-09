## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- evolium-toolkit:inicio — gerado por ng g @evolium-kit/toolkit:ai-context; não editar entre os marcadores -->

## @evolium-kit/toolkit

Este projecto usa a @evolium-kit/toolkit. Antes de criar ou alterar UI, formulários,
layouts, páginas, tema/tokens ou serviços, ler `node_modules/@evolium-kit/toolkit/AGENTS.md` — o índice da
versão instalada (ou deixar a skill `evolium-toolkit` fazê-lo). Ler os
caminhos do índice com Read: o `node_modules` é ignorado pela pesquisa.

- Reutilizar o que a toolkit oferece antes de criar componentes ou serviços.
- Aparência só por tokens `--evo-*`; nunca `::ng-deep` nem cores literais.
- Gerar com `ng g @evolium-kit/toolkit:<page|layout|ui-component|resource-plugin>`.

<!-- evolium-toolkit:fim -->
