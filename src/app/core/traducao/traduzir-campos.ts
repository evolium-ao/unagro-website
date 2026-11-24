/**
 * Achata os campos de texto de uma lista de itens vindos da API numa única
 * lista de strings, na ordem `item0.campo0, item0.campo1, …, item1.campo0, …`
 * — é essa lista que se manda para o `TraducaoAutomaticaService`, e é essa
 * ordem que `aplicarTraducao` espera de volta para desfazer o achatamento.
 */
export function camposParaTraduzir<T>(
  itens: readonly T[],
  campos: readonly (keyof T & string)[],
): string[] {
  return itens.flatMap((item) => campos.map((campo) => String(item[campo] ?? '')));
}

/**
 * Reconstrói os itens com os campos traduzidos no lugar dos originais.
 * `traduzidos` tem de vir de `camposParaTraduzir(itens, campos)` — mesma
 * lista, mesma ordem. Sem tradução ainda disponível (`undefined`, a query a
 * carregar) ou com uma entrada vazia (a tradução dessa frase falhou),
 * mantém-se o campo original em vez de mostrar texto vazio.
 */
/**
 * Igual a `aplicarTraducao`, mas para uma lista de textos soltos em vez de
 * campos de objectos — usa-se, por exemplo, para os parágrafos do corpo de
 * um artigo, em que cada parágrafo é a sua própria entrada a traduzir.
 */
export function aplicarTraducaoTextos(
  originais: readonly string[],
  traduzidos: readonly string[] | undefined,
): string[] {
  if (!traduzidos) return [...originais];
  return originais.map((original, indice) => traduzidos[indice] || original);
}

export function aplicarTraducao<T>(
  itens: readonly T[],
  campos: readonly (keyof T & string)[],
  traduzidos: readonly string[] | undefined,
): T[] {
  if (!traduzidos) return itens as T[];
  return itens.map((item, indiceItem) => {
    const copia = { ...item };
    campos.forEach((campo, indiceCampo) => {
      const traduzido = traduzidos[indiceItem * campos.length + indiceCampo];
      if (traduzido) copia[campo] = traduzido as T[typeof campo];
    });
    return copia;
  });
}
