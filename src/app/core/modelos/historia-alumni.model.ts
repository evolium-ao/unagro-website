import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface HistoriaAlumni {
  id: string;
  nome: string;
  curso: TextoTraduzido;
  anoConclusao: number;
  cargoAtual: TextoTraduzido;
  testemunho: TextoTraduzido;
  /**
   * Retrato do antigo aluno, em `/imagens/...`. Opcional: nem todas as histórias
   * têm fotografia, e quem as mostra trata a ausência.
   */
  foto?: string;
}
