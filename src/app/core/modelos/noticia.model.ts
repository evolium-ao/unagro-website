import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface Noticia {
  id: string;
  categoria: TextoTraduzido;
  data: string;
  titulo: TextoTraduzido;
  resumo: TextoTraduzido;
  destaque?: boolean;
  academica?: boolean;
}
