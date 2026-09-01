import { Component, input, forwardRef, Optional, Host, OnInit, computed } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';

type ErroFnOuTexto = (form: FormGroup) => string | null | boolean;

/**
 * `caixa` = campo emoldurado clássico; `minimalista` = rótulo em maiúsculas e campo
 * sem moldura, sublinhado apenas em foco — o estilo do formulário de candidatura.
 */
export type VarianteCampo = 'caixa' | 'minimalista';

import { Directive } from '@angular/core';

@Directive({
  selector: '[leftIcon]',
  standalone: true
})
export class LeftIconDirective { }

@Directive({
  selector: '[rightIcon]',
  standalone: true
})
export class RightIconDirective { }

const CLASSES_ROTULO: Record<VarianteCampo, string> = {
  caixa: 'text-xs font-medium text-black truncate',
  minimalista: 'text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary truncate',
};

const CLASSES_TEXTO: Record<VarianteCampo, string> = {
  caixa: 'py-2 text-sm text-[#585959] placeholder:text-[#9A9A9A]',
  minimalista: 'py-1.5 text-base text-text-primary placeholder:text-text-primary/55',
};

@Component({
  selector: 'form-input-field',
  // Lembre-se de importar as diretivas aqui para o Angular aceitá-las no ng-content selector
  imports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldInputComponentV2),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-y-1" [class.bg-white]="fundoBranco()">
      <label [for]="id" [class]="classesRotulo()" animate.enter="animete-titulo-1">
        {{ label() }}
        @if (optional()) {
          <span class="text-[#9A9A9A] font-normal normal-case">{{ textoOpcional() }}</span>
        }
      </label>

      <div class="group flex w-full items-center transition" [class]="classesMoldura()">
        <div class="mr-2 flex shrink-0 select-none items-center justify-center text-gray-400">
          <ng-content select="[leftIcon]"></ng-content>
        </div>

        <div class="flex-1">
          @if (type() === 'textarea') {
            <textarea
              (blur)="onBlur()"
              [id]="id"
              [disabled]="disabled()"
              [placeholder]="placeholder()"
              [value]="value"
              [rows]="rows()"
              (input)="updateValue($event)"
              animate.enter="animete-titulo-2"
              class="w-full resize-none border-0 bg-transparent outline-none focus:ring-0 {{ classesTexto() }}"
            ></textarea>
          } @else {
            <input
              (blur)="onBlur()"
              [id]="id"
              [disabled]="disabled()"
              [type]="type()"
              [placeholder]="placeholder()"
              [value]="value"
              (input)="updateValue($event)"
              animate.enter="animete-titulo-2"
              class="w-full border-0 bg-transparent outline-none focus:ring-0 {{ classesTexto() }}"
            />
          }
        </div>

        <div class="ml-2 flex shrink-0 select-none items-center justify-center text-gray-400">
          <ng-content select="[rightIcon]"></ng-content>
        </div>
      </div>

      <span class="min-h-2 text-xs text-red-600" role="alert">
        {{ __erro() }}
      </span>
    </div>
  `,
})
export class FormFieldInputComponentV2 implements ControlValueAccessor, OnInit {
  public parentForm!: FormGroup;
  constructor(
    @Optional() @Host() private controlContainer: ControlContainer
  ) { }

  ngOnInit(): void {
    if (this.controlContainer) {
      this.parentForm = this.controlContainer.control as FormGroup;
    }
  }

  readonly label = input<string>('');
  readonly erro = input<string | null | boolean | ErroFnOuTexto>(null);
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly optional = input<boolean>(false);
  /** Sufixo do rótulo quando `optional` — recebe o texto já traduzido. */
  readonly textoOpcional = input<string>('(opcional)');
  readonly inline = input<boolean>(false);
  readonly rows = input<number>(4);
  readonly disabled = input<boolean>(false);
  readonly bgTransparent = input<boolean>(false);
  readonly variante = input<VarianteCampo>('caixa');
  id = crypto.randomUUID();
  value = '';

  protected readonly classesRotulo = computed(() => CLASSES_ROTULO[this.variante()]);
  protected readonly classesTexto = computed(() => CLASSES_TEXTO[this.variante()]);
  protected readonly fundoBranco = computed(
    () => !this.bgTransparent() && this.variante() === 'caixa',
  );

  /**
   * Na variante minimalista o campo é apenas uma linha que se pinta a verde em foco;
   * a textarea é a excepção — mantém caixa para se perceber a área de escrita.
   */
  protected readonly classesMoldura = computed(() => {
    const temErro = !!this.__erro();

    if (this.variante() === 'caixa') {
      return temErro
        ? 'rounded-md border border-red-500 bg-white px-3 pr-1 outline-2 outline-red-300'
        : 'rounded-md border border-[#E2E8F0] bg-white px-3 pr-1 focus-within:border-primary focus-within:outline-3 focus-within:outline-primary/20';
    }

    if (this.type() === 'textarea') {
      return temErro
        ? 'rounded-lg border border-red-400 bg-bg-lighter px-4 py-1'
        : 'rounded-lg border border-gray-200 bg-bg-lighter px-4 py-1 focus-within:border-primary';
    }

    // Sem linha em repouso, como na maqueta; o sublinhado verde só aparece em foco.
    return temErro
      ? 'border-b border-red-400'
      : 'border-b border-transparent focus-within:border-primary';
  });

  __erro = computed(() => {
    if (typeof this.erro() === 'function') {
      return (this.erro() as ErroFnOuTexto)?.(this.parentForm);
    }
    return this.erro();
  });

  onChange = (_value: string) => { };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void { }

  updateValue(event: Event) {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onBlur() {
    this.onTouched()
  }
}
