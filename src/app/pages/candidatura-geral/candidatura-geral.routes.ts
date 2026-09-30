import { Routes } from '@angular/router';

/**
 * Módulo da candidatura docente, carregado com `loadChildren` a partir de
 * `/candidatura-geral`. As etapas do formulário (`etapa-1` a `etapa-4`) entram
 * aqui como filhas à medida que forem implementadas.
 */
export const CANDIDATURA_GERAL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./inicio/candidatura-geral-inicio.component').then(
        (m) => m.CandidaturaGeralInicioComponent,
      ),
    data: { tituloChave: 'rotas.candidaturaGeral.titulo', descricaoChave: 'rotas.candidaturaGeral.descricao' },
  },
];
