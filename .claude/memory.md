# Decisões que se mantêm

Notas sobre o porquê das regras em `README.md`, para não serem revistas a cada
sessão.

## Motion é a única biblioteca de animação (2026-09-01)

**Regra:** toda a animação do site passa pelo Motion (`motion`, ^13.1.1). A
excepção única é a pulsação dos esqueletos, em `animate-pulse` do Tailwind.

**Porquê:** antes havia animação em dois sítios — classes de transição do Tailwind
adicionadas por diretiva e CSS à mão — o que dava curvas e durações diferentes na
mesma página e não permitia encadear nem escalonar. O Motion centraliza curva,
duração e atraso em código, que é o que a cascata dos cartões exige.

**Como aplicar:** ver "Animações" no `README.md`. O ponto de entrada é a diretiva
`appRevelarAoScroll`; a revelação de baixo para cima com cascata por lote já está
resolvida lá, não a reimplementes por cartão.

**Cuidados que custaram a acertar:**

- O Motion é importado com `await import('motion')` dentro de `afterNextRender`,
  não no topo do ficheiro. O site é prerenderizado (24 rotas) e o SSR não tem DOM.
- O elemento é escondido no construtor da diretiva, não em `afterNextRender`:
  esconder depois da primeira pintura faz o conteúdo piscar.
- Há um tempo limite de 2s que revela o conteúdo se o `inView` nunca disparar.
  Sem ele, uma falha a carregar o Motion apagava a secção inteira.
- O prerender não pode sair com o conteúdo escondido — daí o esconder ser só no
  navegador.

## Textos curtos não vão para o dicionário

**Regra:** `traducao.getTraducao(['<pt>', '<en>'])` em vez de `traducao.t()` para
textos e frases pequenas.

**Porquê:** as chaves de dicionário obrigam a editar quatro ficheiros
(`dicionario.ts`, `pt.ts`, `en.ts` e o componente) para uma frase que só aparece
num sítio, e o nome da chave acaba por dizer menos do que o próprio texto.

**Nota:** a página de estudantes e os banners escritos antes desta regra ainda
usam chaves de dicionário. Converter está em aberto.
