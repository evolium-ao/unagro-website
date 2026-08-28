import { TestBed } from '@angular/core/testing';
import { CursosService } from './cursos.service';
import { TraducaoService } from '../traducao/traducao.service';

describe('CursosService', () => {
  let servico: CursosService;
  let traducao: TraducaoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    servico = TestBed.inject(CursosService);
    traducao = TestBed.inject(TraducaoService);
  });

  it('localiza os cursos em português por defeito', () => {
    const cursos = servico.cursos();
    expect(cursos.length).toBeGreaterThan(0);
    expect(cursos[0].titulo).not.toContain('|');
    expect(typeof cursos[0].titulo).toBe('string');
  });

  it('reflete a troca de idioma nos cursos', () => {
    const tituloPt = servico.cursos()[0].titulo;
    traducao.definirIdioma('en');
    const tituloEn = servico.cursos()[0].titulo;
    expect(tituloEn).not.toBe(tituloPt);
  });

  it('separa cursos de grau e de curta duração', () => {
    expect(servico.cursosGrau().every((c) => c.tipo === 'grau')).toBe(true);
    expect(servico.cursosCurtaDuracao().every((c) => c.tipo === 'curta-duracao')).toBe(true);
  });

  it('obtém um curso pelo id', () => {
    const primeiro = servico.cursos()[0];
    const encontrado = servico.obterPorId(primeiro.id)();
    expect(encontrado?.id).toBe(primeiro.id);
  });
});
