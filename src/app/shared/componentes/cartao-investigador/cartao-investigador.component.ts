import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Investigador } from '../../../core/modelos/investigacao.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';

/**
 * Cartão de um investigador: a fotografia preenche o topo de bordo a bordo
 * — sem margem entre ela e o cartão, recortada pelos cantos arredondados do
 * `overflow-hidden` — e o texto vive num bloco com espaçamento próprio: nome em
 * verde escuro, cargo em cinzento e as pílulas das especialidades em maiúsculas
 * miúdas. Sem fotografia cai no marcador cinzento do `app-espaco-imagem`.
 */
@Component({
  selector: 'app-cartao-investigador',
  imports: [EspacoImagemComponent, SeloComponent],
  host: { class: 'block h-full' },
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      @if (investigador().foto_url) {
        <img
          [src]="investigador().foto_url"
          [alt]="investigador().nome"
          class="aspect-[4/5] w-full object-cover"
        />
      } @else {
        <!-- TODO: falta a fotografia do investigador; fica o marcador cinzento. -->
        <app-espaco-imagem proporcao="retrato" class="block w-full" />
      }

      <div class="flex flex-1 flex-col p-4">
        <h3 class="text-base font-bold text-primary-deep">{{ investigador().nome }}</h3>
        <p class="mt-1 text-xs text-text-secondary">{{ cargo() }}</p>

        @if (especialidades().length) {
          <div class="mt-4 flex flex-wrap gap-2">
            @for (especialidade of especialidades(); track especialidade) {
              <app-selo variante="neutro" tamanho="pequeno" class="uppercase tracking-wide">
                {{ especialidade }}
              </app-selo>
            }
          </div>
        }
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoInvestigadorComponent {
  readonly investigador = input.required<Investigador>();

  private readonly traducao = inject(TraducaoService);

  protected readonly cargo = computed(() => this.traducao.getTraducao(this.investigador().cargo));
  protected readonly especialidades = computed(() =>
    this.investigador().especialidades.map((especialidade) =>
      this.traducao.getTraducao(especialidade),
    ),
  );
}
