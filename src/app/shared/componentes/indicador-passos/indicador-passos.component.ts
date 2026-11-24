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
    <ol class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
      @for (passo of passos(); track passo.numero) {
        <li class="flex flex-col items-center gap-3 text-center">
          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <app-icone [nome]="passo.icone" [tamanho]="24" />
          </div>
          <div>
            <h3 class="text-sm font-semibold text-text-primary">{{ passo.numero }}. {{ passo.titulo }}</h3>
            <p class="mt-1 text-xs text-text-secondary">{{ passo.descricao }}</p>
          </div>
        </li>
      }
    </ol>
  `,
})
export class IndicadorPassosComponent {
  readonly passos = input<PassoExibido[]>([]);
}
