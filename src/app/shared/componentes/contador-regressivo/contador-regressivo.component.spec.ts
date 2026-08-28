import { TestBed } from '@angular/core/testing';
import { ContadorRegressivoComponent } from './contador-regressivo.component';

describe('ContadorRegressivoComponent', () => {
  it('mostra 4 unidades de tempo restante até à data alvo', () => {
    const dataFutura = new Date(Date.now() + 2 * 86_400_000).toISOString();
    const fixture = TestBed.createComponent(ContadorRegressivoComponent);
    fixture.componentRef.setInput('dataAlvo', dataFutura);
    fixture.detectChanges();

    const blocos = fixture.nativeElement.querySelectorAll('span.text-2xl');
    expect(blocos.length).toBe(4);
    expect(blocos[0].textContent.trim()).toMatch(/^\d{2}$/);
  });

  it('não mostra tempo negativo quando a data alvo já passou', () => {
    const dataPassada = new Date(Date.now() - 86_400_000).toISOString();
    const fixture = TestBed.createComponent(ContadorRegressivoComponent);
    fixture.componentRef.setInput('dataAlvo', dataPassada);
    fixture.detectChanges();

    const blocos = fixture.nativeElement.querySelectorAll('span.text-2xl');
    expect(Array.from(blocos).every((b) => (b as HTMLElement).textContent === '00')).toBe(true);
  });
});
