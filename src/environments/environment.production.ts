/**
 * Configuração usada no build de produção, no lugar de `environment.ts`.
 *
 * TODO: trocar `apiUrl` pelo domínio público da API quando ele existir — o IP
 * abaixo é da rede local e não resolve fora dela.
 */
export const environment = {
  producao: true,
  apiUrl: 'https://apiunagro.evofenix.it.ao/api',
  traducaoEmail: 'admiro.andre@evolium.ao',
};
