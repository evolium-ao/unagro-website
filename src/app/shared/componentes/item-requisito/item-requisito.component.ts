import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** `acento` = ícone dourado (painéis laterais); `primario` = ícone verde. */
export type TemaItemRequisito = 'acento' | 'primario';

const CLASSES_ICONE: Record<TemaItemRequisito, string> = {
  acento: 'text-accent',
  primario: 'text-primary',
};

/**
 * Linha de requisito: ícone sem caixa à esquerda, título e descrição recuados.
 * Ao contrário do `app-item-contacto`, não tem valor em destaque nem fundo.
 */
@Component({
  selector: 'app-item-requisito',
  imports: [IconeComponent],
  host: { class: 'block' },
  template: `
    <div class="flex items-start gap-3">
      <app-icone [nome]="icone()" [tamanho]="18" class="mt-0.5" [class]="classeIcone()" />
      <div>
        <h4 class="text-sm font-semibold text-text-primary">{{ titulo() }}</h4>
        <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ descricao() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemRequisitoComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  readonly tema = input<TemaItemRequisito>('acento');

  protected readonly classeIcone = computed(() => CLASSES_ICONE[this.tema()]);
}
