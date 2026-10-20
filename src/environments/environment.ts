/**
 * Configuração do ambiente de desenvolvimento — é este o ficheiro que os
 * `import` referem. Em build de produção o Angular substitui-o por
 * `environment.production.ts` (ver `fileReplacements` no `angular.json`).
 */
export const environment = {
  producao: false,
  apiUrl: 'http://192.168.1.252:8000/api',
  siteUrl: 'https://unagro.evoubuntu.it.ao/candidatura-geral',
  traducaoEmail: 'admiro.andre@evolium.ao',
};
