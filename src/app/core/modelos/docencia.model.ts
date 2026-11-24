import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Vantagem oferecida a quem se junta ao corpo docente — cartão com ícone. */
export interface VantagemDocencia {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Requisito geral do recrutamento docente, listado no painel lateral. */
export interface RequisitoDocencia {
  id: string;
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

/** Opção da lista "maior titulação" do formulário de candidatura docente. */
export interface TitulacaoDocencia {
  id: string;
  rotulo: TextoTraduzido;
}
