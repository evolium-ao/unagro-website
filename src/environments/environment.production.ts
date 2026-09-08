/**
 * Configuração usada no build de produção, no lugar de `environment.ts`.
 *
 * TODO: trocar `apiUrl` pelo domínio público da API quando ele existir — o IP
 * abaixo é da rede local e não resolve fora dela.
 */
export const environment = {
  producao: true,
  apiUrl: 'http://192.168.1.252:8000/api',
  traducaoEmail: '',
};
