import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export type TipoCampoTexto = 'text' | 'email' | 'tel';

@Component({
  selector: 'app-campo-texto',
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
      @if (multilinha()) {
        <textarea
          [placeholder]="placeholder()"
          [disabled]="desativado"
          rows="4"
          class="w-full rounded-lg border px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          [class.border-red-400]="mostrarErro()"
          [class.border-gray-300]="!mostrarErro()"
          (input)="aoDigitar($event)"
          (blur)="aoTocar()"
          >{{ valor }}</textarea
        >
      } @else {
        <input
          [type]="tipo()"
          [placeholder]="placeholder()"
          [value]="valor"
          [disabled]="desativado"
          class="w-full rounded-lg border px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          [class.border-red-400]="mostrarErro()"
          [class.border-gray-300]="!mostrarErro()"
          (input)="aoDigitar($event)"
          (blur)="aoTocar()"
        />
      }
    </label>
    @if (mostrarErro()) {
      <p class="mt-1 text-sm text-red-600">{{ mensagemErro() }}</p>
    }
  `,
})
export class CampoTextoComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  readonly rotulo = input<string>();
  readonly tipo = input<TipoCampoTexto>('text');
  readonly placeholder = input<string>('');
  readonly obrigatorio = input(false);
  readonly multilinha = input(false);
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

  protected aoDigitar(evento: Event): void {
    this.valor = (evento.target as HTMLInputElement | HTMLTextAreaElement).value;
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
