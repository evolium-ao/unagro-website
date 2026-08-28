import { Component, input, signal } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

let contadorIds = 0;

@Component({
  selector: 'app-item-acordeao',
  imports: [IconeComponent],
  template: `
    <div>
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-text-primary"
        [attr.aria-expanded]="aberto()"
        [attr.aria-controls]="idConteudo"
        (click)="alternar()"
      >
        <span>{{ titulo() }}</span>
        <app-icone
          nome="chevron-down"
          [tamanho]="20"
          class="shrink-0 transition-transform duration-300"
          [class.rotate-180]="aberto()"
        />
      </button>
      <div
        [id]="idConteudo"
        class="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out"
        [class]="aberto() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="min-h-0">
          <div class="pb-4 text-text-secondary">
            <ng-content />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ItemAcordeaoComponent {
  readonly titulo = input.required<string>();

  protected readonly aberto = signal(false);
  protected readonly idConteudo = `acordeao-conteudo-${++contadorIds}`;

  protected alternar(): void {
    this.aberto.update((valor) => !valor);
  }
}
