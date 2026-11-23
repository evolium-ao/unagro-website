import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Linha horizontal partida ao meio por um rótulo curto — o "ou entrar com". */
@Component({
  selector: 'app-separador-texto',
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-3">
      <span class="h-px flex-1 bg-gray-200"></span>
      <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
        {{ texto() }}
      </span>
      <span class="h-px flex-1 bg-gray-200"></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparadorTextoComponent {
  readonly texto = input.required<string>();
}
