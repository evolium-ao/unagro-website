import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export interface OpcaoSeletor {
  valor: string;
  rotulo: string;
}

@Component({
  selector: 'app-seletor',
  template: `
    <label class="block">
      @if (rotulo()) {
        <span class="mb-1 block text-sm font-medium text-text-primary">
          {{ rotulo() }}
          @if (obrigatorio()) {
            <span class="text-red-500">*</span>
          }
        </span>
      }
      <select
        [value]="valor"
        [disabled]="desativado"
        class="w-full rounded-lg border bg-white px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        [class.border-red-400]="mostrarErro()"
        [class.border-gray-300]="!mostrarErro()"
        (change)="aoSelecionar($event)"
        (blur)="aoTocar()"
      >
        @if (placeholder()) {
          <option value="" disabled>{{ placeholder() }}</option>
        }
        @for (opcao of opcoes(); track opcao.valor) {
          <option [value]="opcao.valor">{{ opcao.rotulo }}</option>
        }
      </select>
    </label>
    @if (mostrarErro()) {
      <p class="mt-1 text-sm text-red-600">{{ mensagemErro() }}</p>
    }
  `,
})
export class SeletorComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  readonly rotulo = input<string>();
  readonly placeholder = input<string>();
  readonly opcoes = input<OpcaoSeletor[]>([]);
  readonly obrigatorio = input(false);
  readonly mensagemErro = input<string>();

  protected valor = '';
  protected desativado = false;

  private aoAlterar: (valor: string) => void = () => {};
  private aoTocarFn: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(valor: string): void {
    this.valor = valor ?? '';
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.aoAlterar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.aoTocarFn = fn;
  }

  setDisabledState(desativado: boolean): void {
    this.desativado = desativado;
  }

  protected aoSelecionar(evento: Event): void {
    this.valor = (evento.target as HTMLSelectElement).value;
    this.aoAlterar(this.valor);
  }

  protected aoTocar(): void {
    this.aoTocarFn();
  }

  protected mostrarErro(): boolean {
    const controlo = this.ngControl?.control;
    return !!this.mensagemErro() && !!controlo && controlo.invalid && (controlo.touched || controlo.dirty);
  }
}
