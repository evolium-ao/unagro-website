import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RodapeCandidaturaComponent } from '../rodape-candidatura/rodape-candidatura.component';

/**
 * Moldura do módulo da candidatura docente (`/candidatura-geral`): sem o
 * cabeçalho do site — o mockup abre directamente no hero — e com o rodapé
 * próprio do edital em vez do `app-rodape`.
 */
@Component({
  selector: 'app-layout-candidatura',
  imports: [RouterOutlet, RodapeCandidaturaComponent],
  template: `
    <main class="min-h-screen bg-bg-lighter">
      <router-outlet />
    </main>
    <app-rodape-candidatura />
  `,
})
export class LayoutCandidaturaComponent {}
