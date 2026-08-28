/** Notícia já localizada, no formato que os cartões da secção de notícias consomem. */
export interface NoticiaCartao {
  id: string;
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
}
