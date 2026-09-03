import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Optional,
  Host,
  OnInit,
  computed,
  input,
  forwardRef,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';

export interface SelectOptionV2<T extends unknown =  unknown> {
  value: string;
  label: string;
  /**
   * Ícone exibido à direita do item, antes do check de seleção.
   * - Nome de ícone Material (ex: 'star', 'verified') -> renderizado como <span class="material-icons">
   * - URL/caminho de imagem (ex: 'https://...', '/assets/x.png', 'data:image/...') -> renderizado como <img>
   */
  icon?: string;
  /** Classe(s) Tailwind aplicada ao ícone (ex: 'text-green-500', 'w-5 h-5 rounded-full') */
  iconClass?: string;
  /** Linha secundária do item (ex: motorista, modelo). Só é renderizada por templates personalizados. */
  sublabel?: string;
  /** Desabilita apenas esta opção específica dentro da lista */
  disabled?: boolean;
  data?: T
}

/** Contexto disponível dentro do <ng-template #optionTemplate> personalizado */
export interface SelectOptionTemplateContext<T> {
  $implicit: SelectOptionV2<T>;
  selected: boolean;
}

type ErroFnOuTexto = (form: FormGroup) => string | null | boolean;

/** Mesmas variantes do `form-input-field`, para os dois campos combinarem no mesmo formulário. */
export type VarianteCampo = 'caixa' | 'minimalista';

const CLASSES_ROTULO: Record<VarianteCampo, string> = {
  caixa: 'text-xs font-medium text-black truncate',
  minimalista: 'py-1.5 text-base text-text-primary placeholder:text-text-primary/55 border-b border-gray-200',
};

@Component({
  selector: 'field-select-v2',
  imports: [CommonModule, FormsModule, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldSelectComponentV2),
      multi: true,
    },
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <div class="flex flex-col" [class]="variante() === 'minimalista' ? 'gap-y-1' : 'gap-y-2'"
      [class.bg-white]="fundoBranco()" animate.enter="animete-titulo-1">
      <label [class]="classesRotulo()">
        {{ label() }}
        @if (optional()) {
          <span class="text-[#9A9A9A] font-normal normal-case">{{ textoOpcional() }}</span>
        }
      </label>

      <div class="relative">
        <button
          type="button"
          class="flex w-full items-center justify-between text-left transition disabled:cursor-not-allowed disabled:opacity-60"
          [class]="classesGatilho()"
          [attr.aria-expanded]="open()"
          [disabled]="isDisabled()"
          [attr.data-cy]="dataCy()"
          (click)="toggleOpen()"
        >
          <span class="truncate flex items-center gap-2">
            @if (selectedOptionsData().length) {
              @if (!multiple() && selectedOptionsData()[0].icon) {
                @if (isImageIcon(selectedOptionsData()[0].icon)) {
                  <img [src]="selectedOptionsData()[0].icon" class="w-4 h-4 object-contain shrink-0 {{ selectedOptionsData()[0].iconClass ?? '' }}" />
                } @else {
                  <span class="material-icons text-base shrink-0 {{ selectedOptionsData()[0].iconClass ?? '' }}">{{ selectedOptionsData()[0].icon }}</span>
                }
              }
              <span class="truncate">{{ selectedOptionLabel() }}</span>
            } @else {
              <span [class]="classesPlaceholder()">{{ placeholder() }}</span>
            }
          </span>
          <app-icone
            nome="chevron-down"
            [tamanho]="18"
            class="shrink-0 text-text-secondary transition-transform duration-200"
            [class.rotate-180]="open()" />
        </button>

        @if (open()) {
          <div class="absolute z-100 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg max-h-72 overflow-auto">
            @if (searchable()) {
              <div class="px-3 py-2 border-b border-gray-200">
                <input
                  type="text"
                  class="w-full px-3 py-2 rounded-md border border-gray-200 text-sm text-[#585959] focus:border-primary focus:outline-3 focus:outline-primary/20"
                  placeholder="Pesquisar..."
                  [(ngModel)]="searchTerm"
                />
              </div>
            }

            @if (filteredOptions().length > 0) {
              @for (option of filteredOptions(); track option.value) {
                <button
                  type="button"
                  class="w-full text-left px-3 py-3 text-sm flex items-center justify-between gap-2 hover:bg-gray-50 focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  [class.font-semibold]="isSelected(option)"
                  [class.text-primary]="isSelected(option)"
                  [disabled]="!!option.disabled"
                  (click)="select(option)"
                >
                  @if (optionTemplate) {
                    <ng-container
                      *ngTemplateOutlet="optionTemplate; context: { $implicit: option, selected: isSelected(option) }"
                    ></ng-container>
                  } @else {
                    <span class="flex items-center gap-2 truncate">
                      @if (option.icon) {
                        @if (isImageIcon(option.icon)) {
                          <img [src]="option.icon" class="w-4 h-4 object-contain shrink-0 {{ option.iconClass ?? '' }}" />
                        } @else {
                          <span class="material-icons text-base shrink-0 {{ option.iconClass ?? '' }}">{{ option.icon }}</span>
                        }
                      }
                      <span class="truncate">{{ option.label }}</span>
                    </span>
                    @if (isSelected(option)) {
                      <span class="shrink-0">✓</span>
                    }
                  }
                </button>
              }
            } @else {
              <div class="px-3 py-3 text-sm text-[#9A9A9A]">Nenhuma opção encontrada</div>
            }
          </div>
        }
      </div>
      @if (temError()) {
        <span class="min-h-2 text-xs text-red-600" role="alert">
          {{ __erro() }}
        </span>
      }
    </div>
  `,
})
export class FormFieldSelectComponentV2<D> implements ControlValueAccessor, OnInit {
  public parentForm!: FormGroup;

  readonly label = input<string>('');
  readonly dataCy = input<string | null>(null);
  readonly options = input<SelectOptionV2<D>[]>([]);
  readonly placeholder = input<string>('Selecione...');
  readonly erro = input<string | null | boolean | ErroFnOuTexto>(null);
  readonly optional = input<boolean>(false);
  /** Sufixo do rótulo quando `optional` — recebe o texto já traduzido. */
  readonly textoOpcional = input<string>('(opcional)');
  readonly searchable = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly bgTransparent = input<boolean>(false);
  readonly temError = input<boolean>(true);
  /** Permite desabilitar diretamente via template, sem depender de um FormControl. */
  readonly disabled = input<boolean>(false);
  readonly variante = input<VarianteCampo>('caixa');

  /**
   * Template opcional para renderização totalmente personalizada de cada item.
   * Uso no consumidor:
   *   <field-select ...>
   *     <ng-template #optionTemplate let-option let-selected="selected">
   *       <div class="flex items-center gap-2">
   *         <img [src]="option.icon" class="w-6 h-6 rounded-full" />
   *         <span>{{ option.label }}</span>
   *         @if (selected) { <span class="material-icons text-green-500">check</span> }
   *       </div>
   *     </ng-template>
   *   </field-select>
   */
  @ContentChild('optionTemplate') optionTemplate?: TemplateRef<SelectOptionTemplateContext<unknown>>;

  id = crypto.randomUUID();
  open = signal(false);
  searchTerm = signal('');
  selectedValues = signal<string[]>([]);

  /** Estado de disabled vindo do FormControl via ControlValueAccessor. */
  private cvaDisabled = signal(false);

  /** Estado final: desabilitado se vier true pelo @Input OU pelo FormControl. */
  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  constructor(
    private elementRef: ElementRef,
    @Optional() @Host() private controlContainer: ControlContainer
  ) { }

  ngOnInit(): void {
    if (this.controlContainer) {
      this.parentForm = this.controlContainer.control as FormGroup;
    }
  }

  protected readonly classesRotulo = computed(() => CLASSES_ROTULO[this.variante()]);
  protected readonly fundoBranco = computed(
    () => !this.bgTransparent() && this.variante() === 'caixa',
  );
  protected readonly classesPlaceholder = computed(() =>
    this.variante() === 'minimalista' ? 'text-text-primary/55' : 'text-[#9A9A9A]',
  );

  /** Na variante minimalista o gatilho é só texto sublinhado em foco, como o input. */
  protected readonly classesGatilho = computed(() => {
    const temErro = !!this.__erro();

    if (this.variante() === 'caixa') {
      return temErro
        ? 'rounded-md border border-red-500 bg-white px-3 py-2 text-sm text-[#585959] outline-2 outline-red-300'
        : 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#585959] hover:border-primary focus:border-primary focus:outline-3 focus:outline-primary/20';
    }

    return temErro
      ? 'border-b border-red-400 py-1.5 text-base text-text-primary'
      : 'border-b border-transparent py-1.5 text-base text-text-primary focus:border-primary focus:outline-none';
  });

  __erro = computed(() => {
    if (typeof this.erro() === 'function') {
      return (this.erro() as ErroFnOuTexto)?.(this.parentForm);
    }
    return this.erro();
  });

  readonly selectedOptionLabel = computed(() => {
    const selected = this.selectedValues();
    if (!selected.length) {
      return '';
    }

    const selectedLabels = this.options()
      .filter((option) => selected.includes(option.value))
      .map((option) => option.label);

    if (!selectedLabels.length) {
      return selected.join(', ');
    }

    return this.multiple() ? selectedLabels.join(', ') : selectedLabels[0];
  });

  /** Dados completos (incluindo icon/iconClass) das opções selecionadas, para exibir no botão fechado. */
  readonly selectedOptionsData = computed(() => {
    const selected = this.selectedValues();
    return this.options().filter((option) => selected.includes(option.value));
  });

  readonly filteredOptions = computed(() => {
    const filter = this.searchTerm().trim().toLowerCase();
    if (!filter) {
      return this.options();
    }
    return this.options().filter((option) => option.label.toLowerCase().includes(filter));
  });

  onChange = (_value: unknown) => { };
  onTouched = () => { };

  writeValue(value: unknown): void {
    if (this.multiple()) {
      const values = Array.isArray(value) ? value.filter((item) => item != null) : [];
      this.selectedValues.set(values as string[]);
    } else {
      const normalized = value != null && value !== '' ? String(value) : '';
      this.selectedValues.set(normalized ? [normalized] : []);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  toggleOpen(): void {
    if (this.isDisabled()) {
      return;
    }

    this.open.update((value) => !value);
    if (!this.open()) {
      this.onTouched();
    }
  }

  select(option: SelectOptionV2<unknown>): void {
    if (this.isDisabled() || option.disabled) {
      return;
    }

    const values = this.selectedValues();
    const index = values.indexOf(option.value);

    if (this.multiple()) {
      const nextValues = index >= 0
        ? values.filter((value) => value !== option.value)
        : [...values, option.value];

      this.selectedValues.set(nextValues);
      this.onChange(nextValues);
    } else {
      this.selectedValues.set([option.value]);
      this.onChange(option.value);
      this.open.set(false);
    }

    this.onTouched();
  }

  isSelected(option: SelectOptionV2<unknown>): boolean {
    return this.selectedValues().includes(option.value);
  }

  /** Detecta se o valor de `icon` é uma imagem/URL em vez de um nome de ícone Material. */
  isImageIcon(icon?: string): boolean {
    if (!icon) return false;
    return /^(https?:\/\/|data:image|\/|\.\/|\.\.\/)/.test(icon) || /\.(png|jpe?g|svg|gif|webp)$/i.test(icon);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }
}
