import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MembroEquipa } from '../../../core/modelos/membro-equipa.model';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Uma pessoa de uma fila de equipa: retrato **circular** no topo, com um anel
 * discreto em volta, o nome em verde escuro por baixo e o cargo em maiúsculas
 * miúdas de `tracking` largo. Sem cartão, sem moldura e sem fundo — assenta
 * directamente no fundo da secção, ao contrário do `app-cartao-investigador`
 * (cartão branco com fotografia rectangular 4:5 e pílulas de especialidade).
 *
 * O `uppercase` do cargo é decisão de apresentação: os dados guardam-no
 * escrito normalmente. Sem `foto_url` cai no marcador cinzento, recortado em
 * círculo pelo `overflow-hidden` da caixa.
 */
@Component({
  selector: 'app-membro-equipa',
  imports: [EspacoImagemComponent],
  host: { class: 'block h-full' },
  template: `
    <div class="flex h-full flex-col items-center text-center">
      <div
        class="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
      >
        @if (membro().foto_url) {
          <img
            [src]="membro().foto_url"
            [alt]="membro().nome"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        } @else {
          <!-- TODO: falta o retrato deste membro; fica o marcador cinzento. -->
          <app-espaco-imagem proporcao="cover" alturaMinima="0" />
        }
      </div>

      <h3 class="mt-6 text-base font-semibold text-primary-deep">{{ membro().nome }}</h3>
      <p class="mt-1.5 text-[11px] uppercase tracking-widest text-text-secondary">
        {{ membro().cargo }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembroEquipaComponent {
  readonly membro = input.required<MembroEquipa>();
}
