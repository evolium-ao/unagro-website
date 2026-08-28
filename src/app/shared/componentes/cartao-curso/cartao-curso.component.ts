import { Component, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';

export interface CursoExibidoCard {
  id: string;
  faculdade: string;
  titulo: string;
  grau: string;
  duracao: string;
}

@Component({
  selector: 'app-cartao-curso',
  imports: [EspacoImagemComponent, SeloComponent, BotaoComponent],
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <app-espaco-imagem proporcao="video" />
      <div class="flex flex-1 flex-col gap-2 p-4">
        <app-selo variante="primario" class="self-start">{{ curso().faculdade }}</app-selo>
        <h3 class="text-lg font-semibold text-text-primary">{{ curso().titulo }}</h3>
        <p class="text-sm text-text-secondary">{{ curso().grau }} · {{ curso().duracao }}</p>
        <app-botao
          variante="contorno"
          tamanho="sm"
          [link]="'/cursos/' + curso().id"
          class="mt-auto self-start pt-2"
        >
          {{ traducao.t('comum.verDetalhes') }}
        </app-botao>
      </div>
    </article>
  `,
})
export class CartaoCursoComponent {
  readonly curso = input.required<CursoExibidoCard>();
  protected readonly traducao = inject(TraducaoService);
}
