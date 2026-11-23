import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TestemunhoProjeto } from '../../../core/modelos/projeto.model';

/**
 * Cartão de citação sobre verde escuro: marca de citação grande e esbatida no
 * canto superior direito (puramente ornamental), a citação em itálico e, no
 * fundo, o retrato circular pequeno com o nome em branco e o papel da pessoa em
 * maiúsculas miúdas douradas.
 *
 * As maiúsculas e o `tracking` do papel são apresentação — os dados guardam-no
 * escrito normalmente. Sem `foto` fica um círculo translúcido com as iniciais,
 * em vez do marcador cinzento: num cartão escuro o cinzento salta à vista.
 */
@Component({
  selector: 'app-cartao-testemunho',
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="relative h-full overflow-hidden rounded-2xl bg-primary-deep p-6 sm:p-8">
      <span
        aria-hidden="true"
        class="pointer-events-none absolute -top-4 right-5 select-none font-serif text-8xl leading-none text-white/10"
        >&rdquo;</span
      >

      <blockquote class="relative text-sm italic leading-relaxed text-white/85">
        {{ testemunho().citacao }}
      </blockquote>

      <figcaption class="relative mt-6 flex items-center gap-3">
        <div class="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
          @if (testemunho().foto; as foto) {
            <img [src]="foto" [alt]="testemunho().autor" loading="lazy" class="h-full w-full object-cover" />
          } @else {
            <span class="flex h-full w-full items-center justify-center bg-white/10 text-[11px] font-bold text-white">
              {{ iniciais() }}
            </span>
          }
        </div>

        <div>
          <p class="text-sm font-bold text-white">{{ testemunho().autor }}</p>
          <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            {{ testemunho().papel }}
          </p>
        </div>
      </figcaption>
    </figure>
  `,
})
export class CartaoTestemunhoComponent {
  readonly testemunho = input.required<TestemunhoProjeto>();

  protected readonly iniciais = computed(() =>
    this.testemunho()
      .autor.split(/\s+/)
      .filter((parte) => parte.length > 1)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? '')
      .join(''),
  );
}
