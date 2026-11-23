/**
 * Espelha a linha que a API de publicações devolve — já no idioma do pedido,
 * por isso só texto simples (ver `.claude/README.md`, "Modelos de dados
 * vindos da API").
 */
export interface Publicacao {
  id: string;
  titulo: string;
  resumo: string;
  /** Data ISO de publicação; o cartão formata-a para leitura (`formatarDataCurta`). */
  data: string;
  /** Ficheiro em português (o botão "Baixar", sempre presente quando existe). */
  documentoUrl?: string;
  /** Ficheiro em inglês (o botão "Baixar Abstract", só aparece quando existe). */
  documentoUrlEn?: string;
  /** Presente quando a publicação está associada a um projecto específico. */
  projetoId?: string;
}
