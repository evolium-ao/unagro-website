import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Documento exigido na candidatura, apresentado como cartão com ícone. */
export interface DocumentoCandidatura {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Critérios de admissão específicos de um nível de ensino, apresentados em abas. */
export interface RequisitosPorNivel {
  id: string;
  rotulo: TextoTraduzido;
  criterios: TextoTraduzido[];
  nota: TextoTraduzido;
}
