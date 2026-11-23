import { Component, computed, input } from '@angular/core';
import { DADOS_ICONES } from './dados-icones';

@Component({
  selector: 'app-icone',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.width]="tamanho()"
      [attr.height]="tamanho()"
      [attr.stroke-width]="espessuraTraco()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @for (no of nos(); track $index) {
        @switch (no.tipo) {
          @case ('path') {
            <path [attr.d]="no.d" />
          }
          @case ('circle') {
            <circle [attr.cx]="no.cx" [attr.cy]="no.cy" [attr.r]="no.r" />
          }
          @case ('rect') {
            <rect
              [attr.x]="no.x"
              [attr.y]="no.y"
              [attr.width]="no.width"
              [attr.height]="no.height"
              [attr.rx]="no.rx"
              [attr.ry]="no.ry"
            />
          }
          @case ('line') {
            <line [attr.x1]="no.x1" [attr.y1]="no.y1" [attr.x2]="no.x2" [attr.y2]="no.y2" />
          }
        }
      }
    </svg>
  `,
  host: { class: 'inline-flex shrink-0' },
})
export class IconeComponent {
  readonly nome = input.required<string>();
  readonly tamanho = input<number>(20);
  readonly espessuraTraco = input<number>(2);

  protected readonly nos = computed(() => DADOS_ICONES[this.nome()] ?? []);
}
