import { TextoTraduzido } from '../traducao/texto-traduzido';

/**
 * Entidade parceira/patrocinadora da instituição. O `nome` é bilingue porque serve de
 * texto alternativo do logótipo: um leitor de ecrã em inglês tem de o ouvir traduzido.
 */
export interface Patrocinador {
  id: string;
  nome: TextoTraduzido;
  /** Opcional: sem logótipo, a faixa desenha uma caixa tracejada com o nome. */
  logoUrl?: string;
}
