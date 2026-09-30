import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Instituição da faixa "Enquadramento institucional" da candidatura docente. */
export interface ParceiroCandidaturaGeral {
  id: string;
  icone: string;
  nome: TextoTraduzido;
}

/** Cartão curto com ícone, título e descrição (visão institucional). */
export interface DestaqueCandidaturaGeral {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Área de especialização aberta a concurso — também é a opção da etapa 1. */
export interface AreaCandidaturaGeral {
  id: string;
  numero: number;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  especialidades: TextoTraduzido[];
  graus: TextoTraduzido;
  vagas: number;
  /** Cartão escuro com o selo "Vagas abertas", como o primeiro do mockup. */
  destaque: boolean;
}

/** Departamento do acordeão "Termos de Referência por Área Científica". */
export interface TermoReferenciaCandidaturaGeral {
  id: string;
  codigo: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Critério de admissão ou passo do concurso: cartão numerado. */
export interface EtapaNumeradaCandidaturaGeral {
  id: string;
  numero: number;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
  /** Rótulo em maiúsculas no pé do cartão (só nos passos do concurso). */
  fase?: TextoTraduzido;
}

/** Documento obrigatório do dossier de candidatura. */
export interface DocumentoCandidaturaGeral {
  id: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}
