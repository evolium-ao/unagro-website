import { RenderMode, ServerRoute } from '@angular/ssr';
import { CURSOS_MOCK } from './core/dados/cursos.mock';
import { PROJETOS_MOCK } from './core/dados/projetos.mock';

const ROTAS_ESTATICAS = [
  '',
  'sobre',
  'desenvolvimento',
  'hub-unagro',
  'contactos',
  'eventos',
  'formacoes',
  'candidaturas/admissao-candidatura',
  'candidaturas/docentes',
  'alumni',
  'estudantes',
] as const;

export const serverRoutes: ServerRoute[] = [
  ...ROTAS_ESTATICAS.map(
    (path): ServerRoute => ({
      path,
      renderMode: RenderMode.Prerender,
    }),
  ),
  {
    // `/candidaturas` só redirecciona para a página de admissões: renderizado no
    // servidor para devolver 200 em vez do 404 da rota catch-all abaixo.
    path: 'candidaturas',
    renderMode: RenderMode.Server,
  },
  {
    path: 'cursos/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CURSOS_MOCK.map((curso) => ({ id: curso.id }));
    },
  },
  {
    path: 'projetos/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return PROJETOS_MOCK.map((projeto) => ({ id: projeto.id }));
    },
  },
  {
    // Qualquer caminho não coberto pelas rotas acima é, por definição, desconhecido:
    // renderizado em SSR sob pedido para mostrar a página 404 real da aplicação
    // (em vez do 404 em bruto do Express), com o código de estado HTTP correto.
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
  },
];
