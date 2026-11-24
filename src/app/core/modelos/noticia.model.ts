/**
 * Notícia na forma do **site** — os nomes que os componentes consomem.
 *
 * Segue a regra dos modelos vindos da API (`.claude/README.md`): campos de texto
 * simples (`string`), porque a API devolve o texto já resolvido e não um par
 * bilingue. Quem traduz do `NoticiaResource` para esta forma é o
 * `NoticiasService`.
 */
export interface Noticia {
  id: string;
  /** `tipo_noticia` da API: "Institucional", "Académica", "Aviso técnico", … */
  categoria: string;
  /** Data de publicação em ISO. */
  data: string;
  titulo: string;
  resumo: string;
  /** Corpo do artigo. Só o detalhe da notícia o usa; os cartões não. */
  conteudo?: string;
  /** URL da fotografia de capa; sem ela o cartão mostra o espaço reservado. */
  imagem?: string;
  destaque: boolean;
}
