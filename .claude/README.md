# Regras do projecto

## Traduções

Evita `traducao.t()` para textos ou frases pequenas — em vez disso usa
`traducao.getTraducao([pt, en])`. As chaves de dicionário ficam para texto
estrutural e reutilizado.

## Animações — sempre com Motion

**Toda a animação do site é feita com o Motion (pacote `motion`).** Não escrevas
`transition-*`/`animate-*` do Tailwind nem `@keyframes` para animar entradas,
revelações ao scroll, ou reacções a interacção. Única excepção: a pulsação dos
esqueletos de carregamento, que continua a ser `animate-pulse` do Tailwind —
é um ciclo infinito e em CSS não custa nada.

### Entrada de cartões e listas

Usa a diretiva `appRevelarAoScroll`
(`src/app/shared/diretivas/revelar-ao-scroll.directive.ts`): revela o elemento de
baixo para cima quando ele entra no ecrã. O valor é a posição no lote e multiplica
o atraso, o que dá a cascata:

```html
@for (item of itensVisiveis(); track item.id) {
  <app-cartao-x [x]="item" [appRevelarAoScroll]="$index % itensPorPagina" />
}
```

O `% itensPorPagina` é o que faz a cascata **reiniciar em cada lote**: sem ele o
atraso cresce sem fim e a quinta página entraria com segundos de espera. Cartões
criados depois animam sozinhos, porque cada um traz a sua instância da diretiva.

### Ao escrever animação nova

- Importa o Motion **dinamicamente dentro de `afterNextRender`**
  (`const { animate } = await import('motion')`). Mantém-no fora do bundle do
  servidor e garante que só corre no navegador.
- Respeita `prefers-reduced-motion: reduce` — nesse caso não animes, mostra.
- Deixa sempre uma salvaguarda que revela o conteúdo se a animação não chegar a
  correr. Conteúdo escondido à espera de JS que falhou é conteúdo perdido.
- Não escondas conteúdo no HTML renderizado no servidor: esconde-o no navegador,
  antes da primeira pintura, para o prerender continuar a ter texto.

## Esqueletos de carregamento

Cada cartão com carregamento assíncrono tem o seu `*-esqueleto` a acompanhar
(ex.: `cartao-projecto` / `cartao-projecto-esqueleto`), com a mesma moldura e o
mesmo ritmo vertical do cartão real, para a grelha não saltar quando os dados
chegam. O esqueleto é decoração: `aria-hidden="true"`, sem texto nem foco.
