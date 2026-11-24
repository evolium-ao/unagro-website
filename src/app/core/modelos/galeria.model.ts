/**
 * Uma fotografia de uma galeria, já no idioma do pedido — a forma que a API
 * devolve. A **posição no mosaico não é dado de conteúdo**: sai da ordem em que
 * o item vem na lista, por isso não há aqui nenhum campo de layout.
 */
export interface ItemGaleria {
  id: string;
  /**
   * Caminho da fotografia servida a partir de `public/`, já **sem** o `public/`
   * (ex.: `/imagens/campos-de-bananeiras.png`). Ausente, quem mostra a galeria
   * cai no marcador cinzento em vez de pedir um ficheiro que não existe.
   */
  url?: string;
  /** Legenda sobreposta à fotografia; no mosaico só alguns itens a trazem. */
  legenda?: string;
}
