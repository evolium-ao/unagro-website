import { TextoTraduzido } from '../traducao/texto-traduzido';

/** Canal de contacto da secretaria de admissões (telefone, email, localização). */
export interface CanalContacto {
  id: string;
  icone: string;
  rotulo: TextoTraduzido;
  valor: TextoTraduzido;
  /** Informação de apoio: horário, prazo de resposta, piso do edifício. */
  detalhe: TextoTraduzido;
}
