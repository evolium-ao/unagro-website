import { Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

export type ProporcaoImagem = 'quadrado' | 'video' | 'retrato' | 'auto';

const CLASSES_PROPORCAO: Record<ProporcaoImagem, string> = {
  quadrado: 'aspect-square',
  video: 'aspect-video',
  retrato: 'aspect-[3/4]',
  auto: '',
};

@Component({
  selector: 'app-espaco-imagem',
  imports: [IconeComponent],
  template: `
    <div
      class="flex w-full flex-col items-center justify-center gap-2 bg-gray-300 text-gray-500 dark:bg-slate-700"
      [class]="classeProporcao()"
      [style.min-height]="alturaMinima()"
      role="img"
      [attr.aria-label]="legenda() ?? 'Imagem ilustrativa'"
    >
      <app-icone [nome]="icone()" [tamanho]="40" />
      @if (legenda()) {
        <span class="px-4 text-center text-sm">{{ legenda() }}</span>
      }
    </div>
  `,
})
export class  EspacoImagemComponent {
  readonly proporcao = input<ProporcaoImagem>('auto');
  readonly alturaMinima = input<string>('200px');
  readonly icone = input<string>('image');
  readonly legenda = input<string>();

  protected readonly classeProporcao = computed(() => CLASSES_PROPORCAO[this.proporcao()]);
}
