/**
 * Configuração do ambiente de desenvolvimento — é este o ficheiro que os
 * `import` referem. Em build de produção o Angular substitui-o por
 * `environment.production.ts` (ver `fileReplacements` no `angular.json`).
 */
export const environment = {
  producao: false,
  /**
   * Raiz da API da Unagro, **já com o `/api`** e sem barra no fim. Toda a
   * chamada HTTP do site passa por aqui, via `ApiService`.
   * Documentação interactiva dos endpoints: `http://192.168.1.252:8001/docs/api`
   * (o esquema OpenAPI em bruto está em `/docs/api.json`).
   */
  apiUrl: 'http://192.168.1.252:8001/api',
  /**
   * E-mail opcional enviado à MyMemory (`api.mymemory.translated.net`) para
   * traduzir conteúdo vindo da API — ver `TraducaoAutomaticaService`. Sem
   * chave nenhuma, mas com este campo preenchido o limite diário de tradução
   * sobe de ~1000 para ~10000 palavras. Deixa vazio para não mandar nenhum.
   */
  traducaoEmail: 'admiro.andre@evolium.ao',
};
