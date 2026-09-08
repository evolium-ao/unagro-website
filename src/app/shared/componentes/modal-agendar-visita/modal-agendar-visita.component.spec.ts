import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QueryClient, provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { describe, expect, it } from 'vitest';
import { UnidadeInvestigacao } from '../../../core/modelos/investigacao.model';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { DadosAgendarVisita, ModalAgendarVisitaComponent } from './modal-agendar-visita.component';

const UNIDADES: UnidadeInvestigacao[] = [
  {
    id: '1',
    area: 'Biotecnologia',
    nome: 'Centro de Biotecnologia Agrícola',
    imagem_url: '/imagens/desenvolvimento-card-1.png',
    icone: 'flask-conical',
    link: '/desenvolvimento#secao-investigacao',
  },
  {
    id: '3',
    area: 'Engenharia',
    nome: 'Unidade de Engenharia Rural',
    imagem_url: '/imagens/desenvolvimento-card-3.png',
    icone: 'wrench',
    link: '/desenvolvimento#secao-investigacao',
  },
];

function montar(unidadeSelecionada: UnidadeInvestigacao) {
  const dadosModal = new ModalDataService();
  const dados: DadosAgendarVisita = { unidadeSelecionada, unidades: UNIDADES };
  dadosModal.definirDados(dados);

  TestBed.configureTestingModule({
    imports: [ModalAgendarVisitaComponent],
    providers: [
      // O AlertModalService injecta Router/ActivatedRoute para o fluxo de fragmentos.
      provideRouter([]),
      // O `injectMutation` do POST /agendamento-visitas precisa de um QueryClient
      // e o ApiService de um HttpClient, mesmo que nenhum teste chegue a submeter.
      provideHttpClient(),
      provideTanStackQuery(new QueryClient()),
      { provide: ModalDataService, useValue: dadosModal },
    ],
  });

  const fixture = TestBed.createComponent(ModalAgendarVisitaComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ModalAgendarVisitaComponent', () => {
  /**
   * Regressão: os campos instanciados directamente dentro do `<form [formGroup]>`
   * nasciam antes do binding, e o `criarErrosFormulario` rebentava com
   * "Cannot read properties of null (reading 'events')".
   */
  it('monta o formulário sem rebentar no criarErrosFormulario', () => {
    expect(() => montar(UNIDADES[0])).not.toThrow();
  });

  it('desenha um cartão por unidade e pré-selecciona a que foi clicada', () => {
    const fixture = montar(UNIDADES[1]);
    const html: HTMLElement = fixture.nativeElement;

    expect(html.textContent).toContain('Centro de Biotecnologia Agrícola');
    expect(html.textContent).toContain('Unidade de Engenharia Rural');

    const seleccionados = html.querySelectorAll('[aria-pressed="true"], [aria-checked="true"]');
    expect(seleccionados.length).toBe(1);
    expect(seleccionados[0].textContent).toContain('Unidade de Engenharia Rural');
  });
});
