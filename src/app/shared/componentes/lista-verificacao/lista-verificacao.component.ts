import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** Lista de itens confirmados, cada um precedido por um visto num círculo preenchido. */
@Component({
  selector: 'app-lista-verificacao',
  imports: [IconeComponent],
  template: `
    <ul class="flex flex-col gap-3.5">
      @for (item of itens(); track item) {
        <li class="flex items-start gap-3 text-sm text-text-primary">
          <span
            class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          >
            <app-icone nome="check" [tamanho]="12" [espessuraTraco]="3" />
          </span>
          {{ item }}
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaVerificacaoComponent {
  readonly itens = input<string[]>([]);
}
