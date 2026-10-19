import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/** Estado de um campo verificado no servidor (p. ex. BI na AGT); `null` não mostra nada. */
export type EstadoVerificacao = 'aVerificar' | 'valido' | 'invalido' | null;

/**
 * Ícone à direita de um `form-input-field` (slot `rightIcon`) com o estado de
 * uma verificação assíncrona: a rodar enquanto verifica, ✓ verde ou ✗ vermelho.
 */
@Component({
  selector: 'app-indicador-verificacao',
  imports: [IconeComponent],
  host: { class: 'flex items-center' },
  template: `
    @switch (estado()) {
      @case ('aVerificar') {
        <app-icone nome="loader-circle" [tamanho]="18" class="animate-spin text-text-secondary"
          [attr.aria-label]="rotuloAVerificar()" role="status" />
      }
      @case ('valido') {
        <app-icone nome="check" [tamanho]="18" class="text-green-600" aria-hidden="true" />
      }
      @case ('invalido') {
        <app-icone nome="x" [tamanho]="18" class="text-red-600" aria-hidden="true" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicadorVerificacaoComponent {
  readonly estado = input<EstadoVerificacao>(null);
  /** Texto para leitores de ecrã enquanto verifica — recebe o texto já traduzido. */
  readonly rotuloAVerificar = input('A verificar…');
}
