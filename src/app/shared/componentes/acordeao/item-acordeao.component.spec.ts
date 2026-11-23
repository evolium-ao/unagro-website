import { TestBed } from '@angular/core/testing';
import { ItemAcordeaoComponent } from './item-acordeao.component';

describe('ItemAcordeaoComponent', () => {
  it('alterna aria-expanded ao clicar', async () => {
    const fixture = TestBed.createComponent(ItemAcordeaoComponent);
    fixture.componentRef.setInput('titulo', 'Pergunta de teste');
    fixture.detectChanges();

    const botao: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(botao.getAttribute('aria-expanded')).toBe('false');

    botao.click();
    fixture.detectChanges();
    expect(botao.getAttribute('aria-expanded')).toBe('true');

    botao.click();
    fixture.detectChanges();
    expect(botao.getAttribute('aria-expanded')).toBe('false');
  });
});
