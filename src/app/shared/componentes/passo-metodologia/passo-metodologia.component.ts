import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PassoMetodologia } from '../../../core/modelos/investigacao.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';

/**
 * Passo de um método faseado, com tudo centrado: quadrado de cantos
 * arredondados com fundo cinzento claro e o ícone em verde escuro de traço fino,
 * "01. Título" por baixo e uma descrição curta.
 *
 * O `relative z-10` vive no host (e não no quadrado) porque a diretiva de
 * revelação limpa o `transform` no fim da animação: sem posicionamento próprio,
 * a linha de ligação que a secção desenha passaria por cima do quadrado.
 */
@Component({
  selector: 'app-passo-metodologia',
  imports: [IconeComponent],
  host: { class: 'relative z-10 block h-full' },
  template: `
    <article class="flex h-full flex-col items-center text-center">
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-primary-deep"
      >
        <app-icone [nome]="passo().icone" [tamanho]="26" [espessuraTraco]="1.5" />
      </div>

      <h3 class="mt-6 text-base font-semibold text-text-primary">
        {{ passo().numero }}. {{ titulo() }}
      </h3>
      <p class="mt-2 text-xs leading-relaxed text-text-secondary">{{ descricao() }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassoMetodologiaComponent {
  readonly passo = input.required<PassoMetodologia>();

  private readonly traducao = inject(TraducaoService);

  protected readonly titulo = computed(() => this.traducao.getTraducao(this.passo().titulo));
  protected readonly descricao = computed(() => this.traducao.getTraducao(this.passo().descricao));
}
