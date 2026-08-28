import { Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

export interface PassoExibido {
  numero: number;
  titulo: string;
  descricao: string;
  icone: string;
}

@Component({
  selector: 'app-indicador-passos',
  imports: [IconeComponent],
  template: `
    <ol class="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8 lg:grid-cols-6">
      @for (passo of passos(); track passo.numero) {
        <li class="flex flex-col items-start gap-3 md:items-center md:text-center">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          >
            <app-icone [nome]="passo.icone" [tamanho]="22" />
          </div>
          <div>
            <p class="text-sm font-semibold text-accent">{{ passo.numero }}</p>
            <h3 class="font-semibold text-text-primary">{{ passo.titulo }}</h3>
            <p class="mt-1 text-sm text-text-secondary">{{ passo.descricao }}</p>
          </div>
        </li>
      }
    </ol>
  `,
})
export class IndicadorPassosComponent {
  readonly passos = input<PassoExibido[]>([]);
}
