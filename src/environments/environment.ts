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
  // A oferta da candidatura docente (`/candidaturas-docentes/areas`) e o novo
  // `CandidaturaDocenteRequest` só existem, por agora, no servidor da rede local.
  //apiUrl: 'http://192.168.1.252:8000/api',
  apiUrl: 'https://apiunagro.evofenix.it.ao/api',

  // apiUrl: 'https://apiunagro.evofenix.it.ao/api',
  /**
   * Endereço público do site, sem barra no fim — base dos links que se
   * partilham (p. ex. a convocatória no modal de candidatura submetida). É o
   * de produção também aqui, para o link partilhado nunca ser `localhost`.
   */
  siteUrl: 'https://unagro.evofenix.it.ao',
  /**
   * E-mail opcional enviado à MyMemory (`api.mymemory.translated.net`) para
   * traduzir conteúdo vindo da API — ver `TraducaoAutomaticaService`. Sem
   * chave nenhuma, mas com este campo preenchido o limite diário de tradução
   * sobe de ~1000 para ~10000 palavras. Deixa vazio para não mandar nenhum.
   */
  traducaoEmail: 'admiro.andre@evolium.ao',
};
