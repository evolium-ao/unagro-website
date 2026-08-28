import { TextoTraduzido } from '../traducao/texto-traduzido';

export interface PerguntaFrequente {
  id: string;
  pergunta: TextoTraduzido;
  resposta: TextoTraduzido;
}
