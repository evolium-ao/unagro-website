import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';

/** Uma escolha do grupo: o valor guardado no formulário, o texto visível e um ícone. */
export interface OpcaoCartaoSelecao {
  valor: string;
  rotulo: string;
  /** Nome de um ícone de `dados-icones.ts`. Sem ícone, o cartão mostra só o rótulo. */
  icone?: string;
  /** Linha secundária por baixo do rótulo (ex.: "MSc"). Opcional. */
  subrotulo?: string;
}

/**
 * `minimalista` (por omissão) é o grupo de sempre: rótulo em maiúsculas pequenas e
 * cartões alinhados à esquerda. `caixa` combina com os campos `caixa` do
 * formulário: rótulo normal, cartões centrados e o escolhido em verde claro — o
 * "Grau académico" da candidatura docente.
 */
export type VarianteGrupoCartoes = 'minimalista' | 'caixa';

const CLASSES_COLUNAS: Record<2 | 3 | 4, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
};

const CLASSES_LEGENDA: Record<VarianteGrupoCartoes, string> = {
  minimalista: 'text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary',
  caixa: 'text-xs font-medium text-black',
};

const CLASSES_BOTAO: Record<VarianteGrupoCartoes, string> = {
  minimalista: 'items-start gap-3 rounded-xl p-4 text-left',
  caixa: 'items-center justify-center gap-1.5 rounded-md px-4 py-5 text-center',
};

/**
 * Escolha única desenhada como uma fila de cartões (ícone em cima, rótulo em baixo),
 * em vez de um select — o mesmo papel de um grupo de radios, mas com área clicável
 * grande. Implementa `ControlValueAccessor`, pelo que se usa com `formControlName`
 * como qualquer campo. O rótulo segue o estilo minimalista dos outros campos do
 * projecto (maiúsculas pequenas), para combinar no mesmo formulário.
 */
@Component({
  selector: 'app-grupo-cartoes-selecao',
  imports: [IconeComponent],
  host: { class: 'block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrupoCartoesSelecaoComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="flex flex-col gap-y-2">
      @if (label()) {
        <legend [class]="classesLegenda()">
          {{ label() }}
          @if (obrigatorio()) {
            <span class="text-red-600" aria-hidden="true">*</span>
          }
        </legend>
      }

      <div class="grid gap-3 {{ classesColunas() }}" [class.mt-2]="variante() === 'caixa'">
        @for (opcao of opcoes(); track opcao.valor) {
          <button
            type="button"
            class="flex h-full cursor-pointer flex-col border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep/40"
            [class]="classesBotao() + ' ' + classesCartao(opcao.valor)"
            [attr.aria-pressed]="opcao.valor === valor()"
            (click)="selecionar(opcao.valor)"
          >
            @if (opcao.icone) {
              <app-icone
                [nome]="opcao.icone"
                [tamanho]="variante() === 'caixa' ? 22 : 18"
                [class]="opcao.valor === valor() || variante() === 'caixa' ? 'text-primary-deep' : 'text-text-secondary'"
              />
            }
            <span class="text-sm font-medium leading-snug">{{ opcao.rotulo }}</span>
            @if (opcao.subrotulo) {
              <span class="text-xs tracking-wide text-text-secondary">{{ opcao.subrotulo }}</span>
            }
          </button>
        }
      </div>

      @if (erro()) {
        <span class="text-xs text-red-600" role="alert">{{ erro() }}</span>
      }
    </fieldset>
  `,
})
export class GrupoCartoesSelecaoComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly opcoes = input<OpcaoCartaoSelecao[]>([]);
  readonly colunas = input<2 | 3 | 4>(3);
  readonly erro = input<string | null>(null);
  /** Ver `VarianteGrupoCartoes`. `minimalista` mantém o aspecto de sempre. */
  readonly variante = input<VarianteGrupoCartoes>('minimalista');
  /** Asterisco vermelho a seguir ao rótulo. Por omissão `false`. */
  readonly obrigatorio = input(false);

  protected readonly valor = signal<string>('');

  protected readonly classesColunas = computed(() => CLASSES_COLUNAS[this.colunas()]);
  protected readonly classesLegenda = computed(() => CLASSES_LEGENDA[this.variante()]);
  protected readonly classesBotao = computed(() => CLASSES_BOTAO[this.variante()]);

  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected classesCartao(valor: string): string {
    const escolhido = valor === this.valor();
    if (this.variante() === 'caixa') {
      return escolhido
        ? 'border-primary bg-primary/10 text-primary-deep'
        : 'border-gray-300 bg-white text-text-primary hover:border-primary/50';
    }
    return escolhido
      ? 'border-primary-deep bg-white text-primary-deep ring-2 ring-primary-deep/15'
      : 'border-gray-200 bg-bg-lighter text-text-secondary hover:border-primary-deep/40';
  }

  protected selecionar(valor: string): void {
    this.valor.set(valor);
    this.onChange(valor);
    this.onTouched();
  }

  writeValue(valor: string | null): void {
    this.valor.set(valor ?? '');
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
