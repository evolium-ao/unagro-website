import { Routes } from '@angular/router';
import { DADOS_ESTRUTURADOS_CANDIDATURA_GERAL } from './candidatura-geral.seo';
import { etapaGuard } from './estado/etapa.guard';

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
    data: {
      tituloChave: 'rotas.candidaturaGeral.titulo',
      descricaoChave: 'rotas.candidaturaGeral.descricao',
      imagem: '/imagens/og-candidatura-geral-v1.jpg',
      dadosEstruturados: DADOS_ESTRUTURADOS_CANDIDATURA_GERAL,
    },
  },
  {
    // Moldura das etapas: cada `etapa-N` é filha e traz `data.etapa`. Ficam fora
    // dos motores de busca (`indexar: false`): são o formulário, não a convocatória.
    path: '',
    loadComponent: () =>
      import('./formulario/formulario-candidatura.component').then((m) => m.FormularioCandidaturaComponent),
    children: [
      {
        path: 'etapa-1',
        loadComponent: () => import('./formulario/etapa-1/etapa-1.component').then((m) => m.Etapa1Component),
        data: {
          etapa: 1,
          tituloChave: 'rotas.candidaturaGeralFormulario.titulo',
          descricaoChave: 'rotas.candidaturaGeralFormulario.descricao',
          indexar: false,
        },
      },
      {
        path: 'etapa-2',
        canActivate: [etapaGuard],
        loadComponent: () => import('./formulario/etapa-2/etapa-2.component').then((m) => m.Etapa2Component),
        data: {
          etapa: 2,
          tituloChave: 'rotas.candidaturaGeralFormulario.titulo',
          descricaoChave: 'rotas.candidaturaGeralFormulario.descricao',
          indexar: false,
        },
      },
      {
        path: 'etapa-3',
        canActivate: [etapaGuard],
        loadComponent: () => import('./formulario/etapa-3/etapa-3.component').then((m) => m.Etapa3Component),
        data: {
          etapa: 3,
          tituloChave: 'rotas.candidaturaGeralFormulario.titulo',
          descricaoChave: 'rotas.candidaturaGeralFormulario.descricao',
          indexar: false,
        },
      },
      {
        path: 'etapa-4',
        canActivate: [etapaGuard],
        loadComponent: () => import('./formulario/etapa-4/etapa-4.component').then((m) => m.Etapa4Component),
        data: {
          etapa: 4,
          tituloChave: 'rotas.candidaturaGeralFormulario.titulo',
          descricaoChave: 'rotas.candidaturaGeralFormulario.descricao',
          indexar: false,
        },
      },
    ],
  },
];
