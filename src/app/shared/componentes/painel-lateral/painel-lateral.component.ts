import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** `claro` = fundo cinzento suave (por omissão); `branco` = cartão branco. */
export type TemaPainelLateral = 'claro' | 'branco';

const CLASSES_TEMA: Record<TemaPainelLateral, string> = {
  claro: 'bg-[#F4F4F1]',
  branco: 'bg-white',
};

/**
 * Painel de apoio que acompanha uma secção: cabeçalho com ícone e título, corpo
 * projectado e um rodapé opcional separado por uma linha. O rodapé é empurrado
 * para baixo, pelo que o painel acompanha a altura da coluna vizinha.
 */
@Component({
  selector: 'app-painel-lateral',
  imports: [IconeComponent],
  host: { class: 'block h-full' },
  template: `
    <aside
      class="flex h-full flex-col rounded-xl p-6 sm:p-7 border border-gray-200"
      [class]="classeTema()"
    >
      <header class="flex items-center gap-2.5">
        @if (icone(); as nome) {
          <app-icone [nome]="nome" [tamanho]="20" class="text-primary" />
        }
        <h3 class="text-base font-bold text-primary-dark">{{ titulo() }}</h3>
      </header>

      <div class="mt-6 space-y-6 pb-10">
        <ng-content />
      </div>

      @if (mostrarRodape()) {
        <div class="mt-auto border-t border-gray-200 pt-4">
          <ng-content select="[rodape]" />
        </div>
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainelLateralComponent {
  readonly titulo = input.required<string>();
  readonly icone = input<string>();
  /** Desligar quando o painel não projecta nada em `[rodape]` — evita a linha solta. */
  readonly mostrarRodape = input(true);
  readonly tema = input<TemaPainelLateral>('claro');

  protected readonly classeTema = computed(() => CLASSES_TEMA[this.tema()]);
}
