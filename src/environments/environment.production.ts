/**
 * Configuração usada no build de produção, no lugar de `environment.ts`.
 *
 * TODO: trocar `apiUrl` pelo domínio público da API quando ele existir — o IP
 * abaixo é da rede local e não resolve fora dela.
 */
export const environment = {
  producao: true,
  apiUrl: 'https://apiunagro.evofenix.it.ao/api',
  //apiUrl: 'https://victory-them-either-printer.trycloudflare.com/',

  /** Endereço público do site, sem barra no fim — base dos links que se partilham. */
  siteUrl: 'https://unagro.evoubuntu.it.ao/candidatura-geral',
  traducaoEmail: 'admiro.andre@evolium.ao',
};
