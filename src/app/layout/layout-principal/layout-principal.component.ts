import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'app-layout-principal',
  imports: [CabecalhoComponent, RodapeComponent, RouterOutlet],
  template: `
    <app-cabecalho />
    <main class="min-h-screen bg-[#F8F8F8]">
      <router-outlet />
    </main>
    <app-rodape />
  `,
})
export class LayoutPrincipalComponent {}
