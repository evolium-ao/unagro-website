/**
 * Startup/agritech incubada no Hub UNAGRO, na forma do **site** — espelha o
 * `StartupResource`, já em texto simples (`.claude/README.md`, "Modelos de
 * dados vindos da API"). Quem traduz do `StartupResource` para esta forma é o
 * `StartupsService`.
 *
 * A API não devolve um destino de detalhe (`link`) nem tem rota de listagem
 * própria em `app.routes.ts` — quem usa este modelo resolve o link na própria
 * página, como já acontece com os eventos.
 */
export interface Startup {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  /** Caminho a partir do `storage` da API; sem ele o cartão mostra o marcador cinzento. */
  imagem_url?: string;
}
