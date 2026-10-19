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
  minimalista: 'text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary truncate',
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
    // `min-w-0`: como item de grid/flex o host não encolhia abaixo do texto
    // escolhido (o `truncate` não quebra linha), e um nome comprido alargava o
    // cartão em vez de terminar em "…" como no painel.
    class: 'block min-w-0',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <div class="flex flex-col" [class]="variante() === 'minimalista' ? 'gap-y-1' : 'gap-y-2'"
      [class.bg-white]="fundoBranco()" animate.enter="animete-titulo-1">
      <label [class]="classesRotulo()">
        {{ label() }}
        @if (obrigatorio()) {
          <span class="text-red-600" aria-hidden="true">*</span>
        }
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
          [attr.title]="selectedOptionLabel() || null"
          (click)="toggleOpen()"
        >
          <!-- w-0 flex-1: o texto escolhido (nowrap) deixa de contar para a largura
               mínima do campo — senão um nome comprido alargava a grelha/cartão à
               volta e o "…" nunca aparecia. A largura vem só do botão (w-full). -->
          <span class="flex w-0 min-w-0 flex-1 items-center gap-2 overflow-hidden">
            @if (selectedOptionsData().length || (permitirNovo() && selectedValues().length)) {
              @if (!multiple() && selectedOptionsData()[0]?.icon) {
                @if (isImageIcon(selectedOptionsData()[0].icon)) {
                  <img [src]="selectedOptionsData()[0].icon" class="w-4 h-4 object-contain shrink-0 {{ selectedOptionsData()[0].iconClass ?? '' }}" />
                } @else {
                  <span class="material-icons text-base shrink-0 {{ selectedOptionsData()[0].iconClass ?? '' }}">{{ selectedOptionsData()[0].icon }}</span>
                }
              }
              <span class="truncate">{{ selectedOptionLabel() }}</span>
            } @else {
              <span class="truncate" [class]="classesPlaceholder()">{{ placeholder() }}</span>
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
              <!-- Fixa no topo da lista: ao fazer scroll pelas opções, a pesquisa (e o
                   «Adicionar» do permitirNovo) ficam sempre à vista. -->
              <div class="sticky top-0 z-10 border-b border-gray-200 bg-white">
                <div class="px-3 py-2">
                  <input
                    type="text"
                    class="w-full px-3 py-2 rounded-md border border-gray-200 text-sm text-[#585959] focus:border-primary focus:outline-3 focus:outline-primary/20"
                    placeholder="Pesquisar..."
                    [(ngModel)]="searchTerm"
                    (keydown.enter)="aoEnterPesquisa($event)"
                  />
                  @if (permitirNovo() && !multiple() && dicaNovo() && !valorNovo()) {
                    <p class="mt-1.5 text-[11px] leading-snug text-text-secondary">{{ dicaNovo() }}</p>
                  }
                </div>

                @if (valorNovo(); as novo) {
                  <!-- permitirNovo: o texto pesquisado não existe na lista e pode ser usado tal como está. -->
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 border-t border-gray-200 bg-primary/5 px-3 py-3 text-left text-sm font-medium text-primary hover:bg-primary/10 focus:bg-primary/10"
                    (click)="selecionarNovo()"
                  >
                    <app-icone nome="plus" [tamanho]="16" class="shrink-0" />
                    <span class="truncate">{{ textoNovo() }} «{{ novo }}»</span>
                  </button>
                }
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
            } @else if (!valorNovo()) {
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
  /** Asterisco vermelho a seguir ao rótulo. Por omissão `false` — nada muda. */
  readonly obrigatorio = input<boolean>(false);
  readonly searchable = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly bgTransparent = input<boolean>(false);
  readonly temError = input<boolean>(true);
  /** Permite desabilitar diretamente via template, sem depender de um FormControl. */
  readonly disabled = input<boolean>(false);
  readonly variante = input<VarianteCampo>('caixa');
  /**
   * Com `searchable` e sem `multiple`: deixa escolher o texto pesquisado quando
   * não há opção com esse rótulo — o valor do controlo passa a ser o próprio
   * texto. Por omissão `false` — nada muda nos outros selects.
   */
  readonly permitirNovo = input<boolean>(false);
  /** Texto antes do valor novo ("Adicionar «…»") — recebe o texto já traduzido. */
  readonly textoNovo = input<string>('Adicionar');
  /** Dica por baixo da pesquisa, enquanto não há texto, a dizer que se pode escrever um valor novo. */
  readonly dicaNovo = input<string>('');

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

  /** Texto pesquisado que pode entrar como valor novo, ou `''` se não se aplica ou já existe na lista. */
  readonly valorNovo = computed(() => {
    if (!this.permitirNovo() || !this.searchable() || this.multiple()) {
      return '';
    }
    const termo = this.searchTerm().trim().replace(/\s+/g, ' ');
    if (!termo) {
      return '';
    }
    const existe = this.options().some((option) => option.label.trim().toLowerCase() === termo.toLowerCase());
    return existe ? '' : termo;
  });

  /** Enter na pesquisa escolhe o valor novo, em vez de submeter o formulário à volta. */
  aoEnterPesquisa(evento: Event): void {
    if (!this.permitirNovo()) {
      return;
    }
    evento.preventDefault();
    this.selecionarNovo();
  }

  /** Escolhe o texto pesquisado como valor (ver `permitirNovo`). */
  selecionarNovo(): void {
    const novo = this.valorNovo();
    if (!novo || this.isDisabled()) {
      return;
    }
    this.selectedValues.set([novo]);
    this.onChange(novo);
    this.onTouched();
    this.searchTerm.set('');
    this.open.set(false);
  }

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
