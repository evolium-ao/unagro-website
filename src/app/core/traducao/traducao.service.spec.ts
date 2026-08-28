import { TestBed } from '@angular/core/testing';
import { TraducaoService } from './traducao.service';

describe('TraducaoService', () => {
  let servico: TraducaoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    servico = TestBed.inject(TraducaoService);
  });

  it('usa português como idioma por defeito', () => {
    expect(servico.idioma()).toBe('pt');
    expect(servico.t('nav.inicio')).toBe('Início');
  });

  it('muda para inglês e reflete no t()', () => {
    servico.definirIdioma('en');
    expect(servico.idioma()).toBe('en');
    expect(servico.t('nav.inicio')).toBe('Home');
  });

  it('devolve o próprio caminho quando a chave não existe', () => {
    expect(servico.t('nav.inexistente' as never)).toBe('nav.inexistente');
  });

  it('persiste a escolha em localStorage', () => {
    servico.definirIdioma('en');
    expect(localStorage.getItem('unagro.idioma')).toBe('en');
  });
});
