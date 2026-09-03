import { TextoTraduzido } from '../traducao/texto-traduzido';

/**
 * Uma startup/agritech incubada no Hub UNAGRO, tal como a API a serviria: os
 * textos em par `pt`/`en` e nada já formatado. A `categoria` guarda-se como
 * frase normal — o `uppercase` do cartão é decisão de apresentação.
 */
export interface Startup {
  id: string;
  categoria: TextoTraduzido;
  /** Nome comercial; fica em `TextoTraduzido` para a API poder servir variantes. */
  nome: TextoTraduzido;
  descricao: TextoTraduzido;
  /** Destino do "Saiba Mais". */
  link: string;
  /** Caminho a partir de `public/` (sem o `public/`); sem ele fica o marcador cinzento. */
  imagem_url?: string;
}
