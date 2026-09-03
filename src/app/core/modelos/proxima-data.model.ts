import { TextoTraduzido } from '../traducao/texto-traduzido';

/**
 * `confirmada` = data fechada (bloco de data verde); `prevista` = ainda por
 * confirmar (bloco cinzento).
 */
export type EstadoProximaData = 'confirmada' | 'prevista';

/**
 * Uma data do calendário de formações (workshop, certificação, processo
 * selectivo). A `data` guarda-se em ISO — o mês e o dia são formatados por quem
 * mostra, nunca escritos como texto.
 */
export interface ProximaData {
  id: string;
  /** Data em ISO, por exemplo `'2026-05-15'`. */
  data: string;
  categoria: TextoTraduzido;
  titulo: TextoTraduzido;
  detalhe: TextoTraduzido;
  estado: EstadoProximaData;
  /** Destino da linha, quando existe página para onde ir. */
  link?: string;
}
