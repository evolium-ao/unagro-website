import { RenderMode, ServerRoute } from '@angular/ssr';

// Cada entrada aqui tem de ter a rota correspondente em `app.routes.ts`: o build
// SSR falha com "server route does not match any routes" se uma delas estiver
// comentada lá e não aqui.
const ROTAS_ESTATICAS = [
  // '',
  // 'sobre',
  // 'desenvolvimento',
  // 'hub-unagro',
  // 'contactos',
  // 'eventos',
  // 'formacoes',
  // 'candidaturas',
  // 'candidaturas/estudantes',
  // 'candidaturas/docentes',
  // 'alumni',
  // 'estudantes',
  // 'entrar',
  // 'registo',
  'candidatura-geral',
] as const;

export const serverRoutes: ServerRoute[] = [
  ...ROTAS_ESTATICAS.map(
    (path): ServerRoute => ({
      path,
      renderMode: RenderMode.Prerender,
    }),
  ),
  {
    // Etapas do formulário da candidatura docente: dependem do rascunho no
    // `localStorage` e do `state` da navegação, que só existem no navegador —
    // renderizá-las no cliente evita um HTML de servidor diferente do hidratado.
    path: 'candidatura-geral/etapa-1',
    renderMode: RenderMode.Client,
  },
  {
    path: 'candidatura-geral/etapa-2',
    renderMode: RenderMode.Client,
  },
  {
    path: 'candidatura-geral/etapa-3',
    renderMode: RenderMode.Client,
  },
  {
    path: 'candidatura-geral/etapa-4',
    renderMode: RenderMode.Client,
  },
  // {
  //   // Endereços antigos das candidaturas: continuam a redireccionar para as novas
  //   // páginas. Renderizados no servidor para devolver 200 em vez do 404 da rota
  //   // catch-all abaixo.
  //   path: 'candidaturas/admissao-candidatura',
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   path: 'candidaturas/admissao-candidatura/inscricao',
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   // `/login` redirecciona para `/entrar`. Precisa de entrada própria: sem ela
  //   // caía na catch-all de baixo, e um redireccionamento com estado 404 não é
  //   // uma resposta válida — o build recusava-se a terminar.
  //   path: 'login',
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   // Os ids dos cursos vêm da API, não de um mock do repositório (era
  //   // `CURSOS_MOCK`, com ids em slug e lista fechada) — mesma razão do
  //   // `noticias/:id` abaixo: sem lista fechada para o build, renderiza-se no
  //   // servidor sob pedido.
  //   path: 'cursos/:id',
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   // Os ids das notícias vêm da API, não de um mock do repositório: não há lista
  //   // fechada para prerenderizar no build, por isso a página é renderizada no
  //   // servidor sob pedido. Sem esta entrada caía na catch-all abaixo e era servida
  //   // com estado 404.
  //   path: 'noticias/:id',
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   // Os ids dos projectos passaram a vir da API (antes eram os do
  //   // `PROJETOS_MOCK`, prerenderizados por uma lista fechada) — mesma razão do
  //   // `noticias/:id` acima: sem lista fechada para o build, renderiza-se no
  //   // servidor sob pedido.
  //   path: 'projetos/:id',
  //   renderMode: RenderMode.Server,
  // },
  {
    // Qualquer caminho não coberto pelas rotas acima é, por definição, desconhecido:
    // renderizado em SSR sob pedido para mostrar a página 404 real da aplicação
    // (em vez do 404 em bruto do Express), com o código de estado HTTP correto.
    //
    // Enquanto o site principal estiver desligado em `app.routes.ts`, a `**` de lá
    // redirecciona para `/candidatura-geral` — e um redireccionamento com estado
    // 404 não é válido. Repor o `status: 404` quando a página 404 voltar.
    path: '**',
    renderMode: RenderMode.Server,
    // status: 404,
  },
];
