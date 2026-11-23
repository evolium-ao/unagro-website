import { TextoTraduzido } from '../traducao/texto-traduzido';

export type TipoAvisoIntranet = 'manutencao' | 'inscricao' | 'geral';

export interface AvisoIntranet {
  id: string;
  tipo: TipoAvisoIntranet;
  titulo: TextoTraduzido;
  mensagem: TextoTraduzido;
  data: string;
}
