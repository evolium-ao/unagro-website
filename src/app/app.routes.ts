import { Routes } from '@angular/router';

// Os layouts são carregados sob pedido para não entrarem no bundle inicial:
// quem abre só a candidatura geral não precisa do layout principal nem do de
// autenticação.
const carregarLayoutAutenticacao = () =>
  import('./layout/layout-autenticacao/layout-autenticacao.component').then((m) => m.LayoutAutenticacaoComponent);
const carregarLayoutPrincipal = () =>
  import('./layout/layout-principal/layout-principal.component').then((m) => m.LayoutPrincipalComponent);
const carregarLayoutCandidatura = () =>
  import('./layout/layout-candidatura/layout-candidatura.component').then((m) => m.LayoutCandidaturaComponent);

export const routes: Routes = [
  {
    path: 'entrar',
    loadComponent: carregarLayoutAutenticacao,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/entrar/entrar.component').then((m) => m.EntrarComponent),
        data: { tituloChave: 'rotas.entrar.titulo', descricaoChave: 'rotas.entrar.descricao' },
      },
    ],
  },
  {
    path: 'registo',
    loadComponent: carregarLayoutAutenticacao,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/registo/registo.component').then((m) => m.RegistoComponent),
        data: { tituloChave: 'rotas.registo.titulo', descricaoChave: 'rotas.registo.descricao' },
      },
    ],
  },
  // O módulo da candidatura docente tem moldura própria (sem cabeçalho e com o
  // rodapé do edital). Vem antes do `path: ''` de baixo pela mesma razão das
  // páginas de autenticação: a catch-all `**` apanhá-lo-ia como 404.
  {
    path: 'candidatura-geral',
    loadComponent: carregarLayoutCandidatura,
    loadChildren: () =>
      import('./pages/candidatura-geral/candidatura-geral.routes').then((m) => m.CANDIDATURA_GERAL_ROUTES),
  },
  // `/login` é o endereço que muita gente escreve à mão: encaminha para a rota
  // canónica em português em vez de cair na página 404.
  { path: 'login', redirectTo: '/entrar', pathMatch: 'full' },
  {
    path: '',
    loadComponent: carregarLayoutPrincipal,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
        data: { tituloChave: 'rotas.inicio.titulo', descricaoChave: 'rotas.inicio.descricao' },
      },
      {
        path: 'sobre',
        loadComponent: () => import('./pages/sobre/sobre.component').then((m) => m.SobreComponent),
        data: { tituloChave: 'rotas.sobre.titulo', descricaoChave: 'rotas.sobre.descricao' },
      },
      {
        path: 'desenvolvimento',
        loadComponent: () =>
          import('./pages/desenvolvimento/desenvolvimento.component').then((m) => m.DesenvolvimentoComponent),
        data: { tituloChave: 'rotas.desenvolvimento.titulo', descricaoChave: 'rotas.desenvolvimento.descricao' },
      },
      {
        path: 'hub-unagro',
        loadComponent: () => import('./pages/hub-unagro/hub-unagro.component').then((m) => m.HubUnagroComponent),
        data: { tituloChave: 'rotas.hub.titulo', descricaoChave: 'rotas.hub.descricao' },
      },
      {
        path: 'contactos',
        loadComponent: () => import('./pages/contactos/contactos.component').then((m) => m.ContactosComponent),
        data: { tituloChave: 'rotas.contactos.titulo', descricaoChave: 'rotas.contactos.descricao' },
      },
      {
        path: 'eventos',
        loadComponent: () => import('./pages/eventos/eventos.component').then((m) => m.EventosComponent),
        data: { tituloChave: 'rotas.eventos.titulo', descricaoChave: 'rotas.eventos.descricao' },
      },
      {
        path: 'formacoes',
        loadComponent: () => import('./pages/formacoes/formacoes.component').then((m) => m.FormacoesComponent),
        data: { tituloChave: 'rotas.formacoes.titulo', descricaoChave: 'rotas.formacoes.descricao' },
      },
      {
        path: 'cursos/:id',
        loadComponent: () =>
          import('./pages/detalhe-curso/detalhe-curso.component').then((m) => m.DetalheCursoComponent),
        data: { tituloChave: 'rotas.detalheCurso.titulo', descricaoChave: 'rotas.detalheCurso.descricao' },
      },
      {
        // Candidaturas é agora um ramo: cada público tem a sua própria página filha.
        // `/candidaturas` deixou de redireccionar e passou a ser a própria página de
        // informações gerais (o item "Mais informações" do menu).
        path: 'candidaturas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/candidaturas/candidaturas.component').then((m) => m.CandidaturasComponent),
            data: { tituloChave: 'rotas.candidaturas.titulo', descricaoChave: 'rotas.candidaturas.descricao' },
          },
          {
            path: 'estudantes',
            loadComponent: () => import('./pages/inscricao/inscricao.component').then((m) => m.InscricaoComponent),
            data: { tituloChave: 'rotas.inscricao.titulo', descricaoChave: 'rotas.inscricao.descricao' },
          },
          // Endereços antigos: mantidos como redireccionamentos para não quebrar
          // links já partilhados fora do site.
          { path: 'admissao-candidatura/inscricao', redirectTo: '/candidaturas/estudantes', pathMatch: 'full' },
          { path: 'admissao-candidatura', redirectTo: '/candidaturas', pathMatch: 'full' },
          {
            path: 'docentes',
            loadComponent: () =>
              import('./pages/candidatura-docentes/candidatura-docentes.component').then(
                (m) => m.CandidaturaDocentesComponent,
              ),
            data: {
              tituloChave: 'rotas.candidaturaDocentes.titulo',
              descricaoChave: 'rotas.candidaturaDocentes.descricao',
            },
          },
        ],
      },
      {
        path: 'alumni',
        loadComponent: () => import('./pages/alumni/alumni.component').then((m) => m.AlumniComponent),
        data: { tituloChave: 'rotas.alumni.titulo', descricaoChave: 'rotas.alumni.descricao' },
      },
      {
        path: 'estudantes',
        loadComponent: () => import('./pages/estudantes/estudantes.component').then((m) => m.EstudantesComponent),
        data: { tituloChave: 'rotas.estudantes.titulo', descricaoChave: 'rotas.estudantes.descricao' },
      },
      {
        path: 'noticias/:id',
        loadComponent: () =>
          import('./pages/detalhe-noticia/detalhe-noticia.component').then((m) => m.DetalheNoticiaComponent),
        data: { tituloChave: 'rotas.detalheNoticia.titulo', descricaoChave: 'rotas.detalheNoticia.descricao' },
      },
      {
        path: 'projetos/:id',
        loadComponent: () =>
          import('./pages/detalhe-projeto/detalhe-projeto.component').then((m) => m.DetalheProjetoComponent),
        data: { tituloChave: 'rotas.detalheProjeto.titulo', descricaoChave: 'rotas.detalheProjeto.descricao' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pagina-nao-encontrada/pagina-nao-encontrada.component').then(
            (m) => m.PaginaNaoEncontradaComponent,
          ),
        data: { tituloChave: 'rotas.naoEncontrada.titulo', descricaoChave: 'rotas.naoEncontrada.descricao' },
      },
    ],
  },
];
