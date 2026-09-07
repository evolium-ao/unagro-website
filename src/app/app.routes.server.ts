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
  'candidaturas',
  'candidaturas/estudantes',
  'candidaturas/docentes',
  'alumni',
  'estudantes',
  'entrar',
  'registo',
] as const;

export const serverRoutes: ServerRoute[] = [
  ...ROTAS_ESTATICAS.map(
    (path): ServerRoute => ({
      path,
      renderMode: RenderMode.Prerender,
    }),
  ),
  {
    // Endereços antigos das candidaturas: continuam a redireccionar para as novas
    // páginas. Renderizados no servidor para devolver 200 em vez do 404 da rota
    // catch-all abaixo.
    path: 'candidaturas/admissao-candidatura',
    renderMode: RenderMode.Server,
  },
  {
    path: 'candidaturas/admissao-candidatura/inscricao',
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
    // Os ids das notícias vêm da API, não de um mock do repositório: não há lista
    // fechada para prerenderizar no build, por isso a página é renderizada no
    // servidor sob pedido. Sem esta entrada caía na catch-all abaixo e era servida
    // com estado 404.
    path: 'noticias/:id',
    renderMode: RenderMode.Server,
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
