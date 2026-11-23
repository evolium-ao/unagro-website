import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TraducaoService } from '../traducao/traducao.service';
import { SeoService } from './seo.service';

@Component({ template: '' })
class PaginaTeste {}

describe('SeoService', () => {
  // O idioma escolhido fica no `localStorage`: sem isto o teste do inglês contaminava os seguintes.
  beforeEach(() => localStorage.clear());

  async function configurar() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: PaginaTeste,
            data: { tituloChave: 'rotas.inicio.titulo', descricaoChave: 'rotas.inicio.descricao' },
          },
          {
            path: 'formulario',
            component: PaginaTeste,
            data: {
              tituloChave: 'rotas.inicio.titulo',
              indexar: false,
              dadosEstruturados: { '@type': 'JobPosting', title: '</script>' },
            },
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
    expect(title.getTitle()).toBe('Início | AgroSophia');
  });

  it('atualiza o título quando o idioma muda', async () => {
    await configurar();
    const traducao = TestBed.inject(TraducaoService);
    const title = TestBed.inject(Title);

    traducao.definirIdioma('en');
    TestBed.flushEffects();
    expect(title.getTitle()).toBe('Home | AgroSophia');
  });

  it('escreve as tags Open Graph com endereços absolutos e o canónico', async () => {
    await configurar();
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('property="og:title"')?.content).toBe('Início | AgroSophia');
    expect(meta.getTag('property="og:image"')?.content).toMatch(/^https:\/\/.+\/imagens\/campus-hero\.png$/);
    expect(meta.getTag('name="robots"')?.content).toBe('index, follow');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/^https:\/\//);
    expect(document.head.querySelector('script#dados-estruturados')).toBeNull();
  });

  it('marca a rota como noindex e escreve o JSON-LD escapado', async () => {
    const harness = await configurar();
    await harness.navigateByUrl('/formulario');
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, follow');
    const script = document.head.querySelector('script#dados-estruturados');
    expect(script?.textContent).not.toContain('</script>');
    expect(JSON.parse(script!.textContent!).title).toBe('</script>');
  });
});
