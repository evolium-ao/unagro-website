/**
 * Candidatura ao corpo docente, na forma que o **site** preenche — os nomes dos
 * campos do `app-formulario-docente`. Quem a traduz para o `CandidaturaRequest`
 * da API é o `CandidaturasService`.
 */
export interface NovaCandidaturaDocente {
  nome: string;
  email: string;
  telefone: string;
  /** URL do LinkedIn/Lattes; opcional do lado da API. */
  perfil: string;
  /** Maior titulação, **já em português** — a API é monolingue e guarda texto livre. */
  titulacao: string;
  universidade: string;
  area: string;
  linhasPesquisa: string;
  /** Carta de motivação. */
  carta: string;
  /** CV em PDF, até 5MB (limite da API). */
  curriculo: File | null;
}
