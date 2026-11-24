/**
 * Uma pessoa da equipa de um projecto ou de uma iniciativa — retrato, nome e
 * cargo, nada mais. Vive em ficheiro próprio (como o `ItemGaleria`) para o
 * `app-membro-equipa` não depender do modelo de projectos: o mesmo item serve
 * qualquer secção de equipa.
 *
 * Já na forma que a API devolve: só texto simples e no idioma do pedido. O
 * `cargo` guarda-se escrito normalmente (`Coordenador Geral`) — as maiúsculas
 * do mockup são apresentação e vivem no componente.
 */
export interface MembroEquipa {
  id: string;
  /** Nome próprio, sem tradução. */
  nome: string;
  cargo: string;
  /** Retrato já sem o `public/`; ausente, sai o marcador cinzento em vez de um 404. */
  foto_url?: string;
}
