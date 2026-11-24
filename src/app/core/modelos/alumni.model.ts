/**
 * Alumni na forma do **site** — espelha o `AlumniResource`, já em texto
 * simples (`.claude/README.md`, "Modelos de dados vindos da API"). Cobre só
 * o que a secção "Onde estão os nossos Alumni?" (`app-cartao-historia-alumni`)
 * mostra; uma futura listagem completa de histórias vai precisar também do
 * `curso` e de um "ano de conclusão" que a API ainda não dá — ver "A API não
 * dá" em `.claude/memory/integrar-recurso.md`.
 */
export interface Alumni {
  id: string;
  /** Nome próprio; não se traduz. */
  nome: string;
  /** `cargo_atual` da API. */
  cargoAtual: string;
  /** `citacao` da API — o testemunho em itálico fora do cartão. */
  testemunho: string;
  /** Retrato; sem ele o cartão cai no fundo neutro translúcido. */
  foto?: string;
  /** Marca as histórias mostradas na secção "Onde estão os nossos Alumni?". */
  destaque: boolean;
}
