import { Idioma } from './idioma';

export type TextoTraduzido = Record<Idioma, string>;

export function traduzir(texto: TextoTraduzido, idioma: Idioma): string {
  return texto[idioma] ?? texto.pt;
}
