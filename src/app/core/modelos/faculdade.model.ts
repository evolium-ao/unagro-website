/** Um curso de grau, tal como aparece dentro do cartão da faculdade a que pertence. */
export interface CursoFaculdade {
  id: string;
  titulo: string;
}

/**
 * Uma faculdade, na forma que a aba "Faculdades e departamentos" de `/sobre`
 * mostra — espelha o `FaculdadeResource` da API, já mapeado (ver
 * `core/servicos/faculdades.service.ts`).
 *
 * A API não dá ícone nem "área"; o ícone continua atribuído por posição do
 * lado do componente (`ICONES_FACULDADE`), como já acontecia com o mock.
 */
export interface Faculdade {
  id: string;
  nome: string;
  cursos: CursoFaculdade[];
}
