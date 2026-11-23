import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';

/**
 * Caixa de confirmação com texto longo ao lado — declarações, termos e
 * consentimentos. O texto entra por `ng-content`, para poder levar ênfase ou
 * ligações; o asterisco de obrigatório é acrescentado no fim.
 *
 * Implementa `ControlValueAccessor` com valor `boolean`. Para tornar a
 * confirmação obrigatória use `Validators.requiredTrue` no `FormControl`.
 * Documentação e exemplos no `README.md` ao lado.
 */
@Component({
  selector: 'app-caixa-confirmacao',
  imports: [IconeComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaixaConfirmacaoComponent),
      multi: true,
    },
  ],
  host: { class: 'block' },
  template: `
    <label [for]="id" class="flex items-start gap-4" [class]="desativado() ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'">
      <span class="relative mt-0.5 flex h-5 w-5 shrink-0">
        <input
          [id]="id"
          type="checkbox"
          class="peer h-5 w-5 cursor-[inherit] appearance-none rounded-[4px] border bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          [class]="erro() ? 'border-red-400' : 'border-gray-300'"
          [checked]="marcado()"
          [disabled]="desativado()"
          [attr.aria-invalid]="erro() ? true : null"
          [attr.aria-describedby]="erro() ? id + '-erro' : null"
          (change)="aoMudar($event)"
          (blur)="onTouched()"
        />
        <span class="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
          <app-icone nome="check" [tamanho]="14" [espessuraTraco]="3" />
        </span>
      </span>
      <span class="text-sm leading-relaxed text-primary-deep">
        <ng-content />
        @if (obrigatorio()) {
          <span class="ml-0.5 text-red-600" aria-hidden="true">*</span>
        }
      </span>
    </label>
    @if (erro()) {
      <p [id]="id + '-erro'" class="mt-1 pl-9 text-xs text-red-600" role="alert">{{ erro() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaixaConfirmacaoComponent implements ControlValueAccessor {
  /** Mostra o asterisco vermelho. Não valida — use `Validators.requiredTrue`. */
  readonly obrigatorio = input(false, { transform: booleanAttribute });
  /** Mensagem de erro já resolvida (ver `criarErrosFormulario`). */
  readonly erro = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly id = `caixa-confirmacao-${crypto.randomUUID()}`;
  protected readonly marcado = signal(false);
  private readonly desativadoPeloForm = signal(false);

  protected readonly desativado = computed(() => this.disabled() || this.desativadoPeloForm());

  private onChange: (valor: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(valor: boolean | null): void {
    this.marcado.set(valor === true);
  }

  registerOnChange(fn: (valor: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desativado: boolean): void {
    this.desativadoPeloForm.set(desativado);
  }

  protected aoMudar(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).checked;
    this.marcado.set(valor);
    this.onChange(valor);
    this.onTouched();
  }
}
