import { Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

export type ProporcaoImagem = 'quadrado' | 'video' | 'retrato' | 'cover' | 'auto';

const CLASSES_PROPORCAO: Record<ProporcaoImagem, string> = {
  quadrado: 'aspect-square',
  video: 'aspect-video',
  retrato: 'aspect-[3/4]',
  cover: 'h-full w-full',
  auto: '',
};

@Component({
  selector: 'app-espaco-imagem',
  // imports: [IconeComponent],
  imports: [],
  template: `
    <div
      class="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gray-300 text-gray-500 dark:bg-slate-700"
      [class]="classeProporcao()"
      [style.min-height]="alturaMinima()"
      role="img"
      [attr.aria-label]="legenda() ?? 'Imagem ilustrativa'"
    >
      <!-- <app-icone [nome]="icone()" [tamanho]="40" /> -->
       @if (imagem()) {
         <img [src]="imagem()" alt="Campus Hero" class="h-full w-full object-cover" />
       }
      @if (legenda()) {
        <span class="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-1 text-center text-sm text-white">
          {{ legenda() }}
        </span>
      }
    </div>
  `,
})
export class EspacoImagemComponent {
  readonly proporcao = input<ProporcaoImagem>('auto');
  readonly alturaMinima = input<string>('200px');
  readonly icone = input<string>('image');
  readonly legenda = input<string>();
  readonly imagem = input<string>();
  protected readonly classeProporcao = computed(() => CLASSES_PROPORCAO[this.proporcao()]);
}
