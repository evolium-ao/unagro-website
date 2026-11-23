import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconeComponent } from '../icone/icone.component';

/**
 * `claro` = fundo claro, emblema verde translúcido e texto escuro (o de sempre);
 * `escuro` = sobre painel verde escuro, emblema `bg-white/10` e texto branco.
 */
export type TemaItemContacto = 'claro' | 'escuro';

/**
 * Onde fica o peso das duas primeiras linhas — a ordem é sempre rótulo e depois
 * valor. `valorDestaque` = rótulo em negrito e valor em texto normal (o de
 * sempre); `rotuloAcima` = rótulo reduzido a etiqueta em maiúsculas miúdas e o
 * valor em negrito, como no painel de contacto do detalhe de projecto.
 */
export type FormatoItemContacto = 'valorDestaque' | 'rotuloAcima';

const CLASSES_EMBLEMA: Record<TemaItemContacto, string> = {
  claro: 'rounded-lg bg-primary/10 text-primary',
  escuro: 'rounded-lg bg-white/10 text-white',
};

const CLASSES_ROTULO: Record<TemaItemContacto, Record<FormatoItemContacto, string>> = {
  claro: {
    valorDestaque: 'text-sm font-semibold text-text-primary',
    rotuloAcima: 'text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary',
  },
  escuro: {
    valorDestaque: 'text-sm font-semibold text-white',
    rotuloAcima: 'text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60',
  },
};

const CLASSES_VALOR: Record<TemaItemContacto, Record<FormatoItemContacto, string>> = {
  claro: {
    valorDestaque: 'mt-0.5 text-sm text-text-primary',
    rotuloAcima: 'mt-1 text-sm font-bold text-text-primary',
  },
  escuro: {
    valorDestaque: 'mt-0.5 text-sm text-white/80',
    rotuloAcima: 'mt-1 text-sm font-bold text-white',
  },
};

const CLASSES_DETALHE: Record<TemaItemContacto, string> = {
  claro: 'mt-0.5 text-xs text-text-secondary',
  escuro: 'mt-0.5 text-xs text-white/60',
};

/**
 * Canal de contacto: emblema quadrado de 36px com o ícone à esquerda e, à
 * direita, o rótulo, o valor e uma linha de apoio opcional.
 *
 * O destaque das duas primeiras linhas sai do `formato` e as cores do `tema`; os
 * valores por omissão (`claro` + `valorDestaque`) são o aspecto de sempre, o da
 * coluna de contactos de `candidaturas`.
 */
@Component({
  selector: 'app-item-contacto',
  imports: [IconeComponent],
  template: `
    <div class="flex items-start gap-3">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center" [class]="classesEmblema()">
        <app-icone [nome]="icone()" [tamanho]="16" />
      </div>
      <div>
        <p [class]="classesRotulo()">{{ rotulo() }}</p>
        <p [class]="classesValor()">{{ valor() }}</p>
        @if (detalhe(); as detalhe) {
          <p [class]="classesDetalhe()">{{ detalhe }}</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemContactoComponent {
  readonly icone = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string>();
  /**
   * Linha de apoio por baixo do valor. Deixou de ser obrigatória para o painel de
   * contacto do detalhe de projecto, que só tem rótulo e valor — quem já a passa
   * continua a vê-la igual.
   */
  readonly detalhe = input<string>();
  readonly tema = input<TemaItemContacto>('claro');
  readonly formato = input<FormatoItemContacto>('valorDestaque');

  protected readonly classesEmblema = computed(() => CLASSES_EMBLEMA[this.tema()]);
  protected readonly classesRotulo = computed(() => CLASSES_ROTULO[this.tema()][this.formato()]);
  protected readonly classesValor = computed(() => CLASSES_VALOR[this.tema()][this.formato()]);
  protected readonly classesDetalhe = computed(() => CLASSES_DETALHE[this.tema()]);
}
