/**
 * Configuração usada no build de produção, no lugar de `environment.ts`.
 *
 * TODO: trocar `apiUrl` pelo domínio público da API quando ele existir — o IP
 * abaixo é da rede local e não resolve fora dela.
 */
export const environment = {
  producao: true,
  apiUrl: 'https://apiunagro.evofenix.it.ao/api',
  /** Endereço público do site, sem barra no fim — base dos links que se partilham. */
  siteUrl: 'https://candidaturas.agrosophia.ao/candidatura-geral',
  traducaoEmail: 'admiro.andre@evolium.ao',
};
