import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TraducaoService } from '../traducao/traducao.service';
import { SeoService } from './seo.service';

@Component({ template: '' })
class PaginaTeste {}

describe('SeoService', () => {
  async function configurar() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: PaginaTeste,
            data: { tituloChave: 'rotas.inicio.titulo', descricaoChave: 'rotas.inicio.descricao' },
          },
        ]),
      ],
    });
    TestBed.inject(SeoService);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    return harness;
  }

  it('define o título e a meta descrição a partir dos dados da rota', async () => {
    await configurar();
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe('Início | UNAGRO');
  });

  it('atualiza o título quando o idioma muda', async () => {
    await configurar();
    const traducao = TestBed.inject(TraducaoService);
    const title = TestBed.inject(Title);

    traducao.definirIdioma('en');
    TestBed.flushEffects();
    expect(title.getTitle()).toBe('Home | UNAGRO');
  });
});
