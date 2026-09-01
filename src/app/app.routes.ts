import { Routes } from '@angular/router';
import { LayoutPrincipalComponent } from './layout/layout-principal/layout-principal.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPrincipalComponent,
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
        path: 'candidaturas',
        children: [
          { path: '', redirectTo: 'admissao-candidatura', pathMatch: 'full' },
          {
            path: 'admissao-candidatura',
            loadComponent: () =>
              import('./pages/candidaturas/candidaturas.component').then((m) => m.CandidaturasComponent),
            data: { tituloChave: 'rotas.candidaturas.titulo', descricaoChave: 'rotas.candidaturas.descricao' },
          },
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
