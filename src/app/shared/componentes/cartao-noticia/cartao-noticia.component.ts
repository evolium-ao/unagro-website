import { Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';

export type ModoCartaoNoticia = 'vertical' | 'horizontal';

export interface NoticiaExibidaCard {
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
}

@Component({
  selector: 'app-cartao-noticia',
  imports: [EspacoImagemComponent, SeloComponent],
  template: `
    <article
      class="flex overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
      [class]="modo() === 'horizontal' ? 'flex-col md:flex-row' : 'flex-col'"
    >
      <app-espaco-imagem proporcao="video" [class]="modo() === 'horizontal' ? 'md:w-1/2' : ''" />
      <div class="flex flex-1 flex-col gap-2 p-4">
        <div class="flex items-center gap-2">
          <app-selo variante="acento">{{ noticia().categoria }}</app-selo>
          <span class="text-xs text-text-secondary">{{ dataFormatada() }}</span>
        </div>
        <h3 class="font-semibold text-text-primary" [class]="modo() === 'horizontal' ? 'text-xl' : 'text-lg'">
          {{ noticia().titulo }}
        </h3>
        <p class="text-sm text-text-secondary">{{ noticia().resumo }}</p>
      </div>
    </article>
  `,
})
export class CartaoNoticiaComponent {
  readonly noticia = input.required<NoticiaExibidaCard>();
  readonly modo = input<ModoCartaoNoticia>('vertical');

  private readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() =>
    new Date(this.noticia().data).toLocaleDateString(this.traducao.idioma() === 'pt' ? 'pt-PT' : 'en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  );
}
