import { Component, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent } from '../selo/selo.component';

export type VarianteCartaoCurso = 'padrao' | 'academica';

export interface CursoExibidoCard {
  id: string;
  faculdade: string;
  titulo: string;
  grau: string;
  duracao: string;
  regime?: string;
  imagem?: string;
}

@Component({
  selector: 'app-cartao-curso',
  imports: [EspacoImagemComponent, SeloComponent, BotaoComponent, IconeComponent],
  template: `
    @if (variante() === 'academica') {
      <article
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
      >
        <app-espaco-imagem proporcao="video" [arredondado]="true" [imagem]="curso().imagem" />
        <div class="flex flex-1 flex-col items-start gap-2 px-1 pt-4">
          <app-selo variante="primario">{{ curso().grau }}</app-selo>
          <h3 class="text-base font-semibold text-text-primary">{{ curso().titulo }}</h3>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
            <span class="flex items-center gap-1.5">
              <app-icone nome="clock" [tamanho]="13" />
              {{ curso().duracao }}
            </span>
            @if (curso().regime) {
              <span class="flex items-center gap-1.5">
                <app-icone nome="briefcase" [tamanho]="13" />
                {{ curso().regime }}
              </span>
            }
          </div>
          <app-botao
            variante="suave"
            tamanho="sm"
            raio="medio"
            [larguraTotal]="true"
            [link]="'/cursos/' + curso().id"
            class="mt-4 font-semibold"
          >
            {{ traducao.t('comum.verDetalhes') }}
          </app-botao>
        </div>
      </article>
    } @else {
      <article
        class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
      >
        <app-espaco-imagem proporcao="video" [imagem]="curso().imagem" />
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
    }
  `,
})
export class CartaoCursoComponent {
  readonly curso = input.required<CursoExibidoCard>();
  readonly variante = input<VarianteCartaoCurso>('padrao');
  protected readonly traducao = inject(TraducaoService);
}
