import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CampoTextoComponent } from './campo-texto.component';

@Component({
  imports: [ReactiveFormsModule, CampoTextoComponent],
  template: `<app-campo-texto [formControl]="controlo" rotulo="Nome" mensagemErro="Obrigatório" />`,
})
class HospedeiraTeste {
  readonly controlo = new FormControl('', { nonNullable: true });
}

describe('CampoTextoComponent (ControlValueAccessor)', () => {
  it('escreve o valor inicial do FormControl no input', () => {
    const fixture = TestBed.createComponent(HospedeiraTeste);
    fixture.componentInstance.controlo.setValue('Maria');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Maria');
  });

  it('propaga a digitação do utilizador de volta ao FormControl', () => {
    const fixture = TestBed.createComponent(HospedeiraTeste);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'João';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.controlo.value).toBe('João');
  });

  it('mostra a mensagem de erro apenas depois de tocado e inválido', () => {
    const fixture = TestBed.createComponent(HospedeiraTeste);
    fixture.componentInstance.controlo.addValidators((c) => (c.value ? null : { obrigatorio: true }));
    fixture.componentInstance.controlo.updateValueAndValidity();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')).toBeNull();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('Obrigatório');
  });
});
