import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatarDataCurta, formatarTempoRelativo } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { NoticiaCartao } from '../../modelos/noticia-cartao.model';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/** `vertical` = imagem em cima; `horizontal` = miniatura à esquerda, para listas laterais. */
export type ModoCartaoNoticiaResumo = 'vertical' | 'horizontal';

/**
 * Cartão de notícia secundário. Em `vertical` a imagem fica em cima e absorve a
 * altura sobrante da célula, o que mantém cartões de alturas diferentes alinhados;
 * em `horizontal` reduz-se a uma miniatura à esquerda com categoria, título e a
 * antiguidade da publicação — a forma usada na lista de notícias académicas.
 */
@Component({
  selector: 'app-cartao-noticia-resumo',
  imports: [EspacoImagemComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    @if (modo() === 'horizontal') {
      <article
        class="flex h-full gap-4 overflow-hidden rounded-lg border border-gray-200 bg-[#EBEFED] p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
      >
        <app-espaco-imagem
          class="w-2/5 max-w-52 shrink-0 self-stretch"
          proporcao="cover"
          alturaMinima="100%"
          [arredondado]="true"
          [imagem]="noticia().imagem"
          [legenda]="legendaImagem()"
        />

        <div class="flex min-w-0 flex-col justify-center">
          @if (noticia().categoria) {
            <p class="text-[10px] font-bold uppercase tracking-wider text-primary-dark">
              {{ noticia().categoria }}
            </p>
          }
          <h3 class="mt-1.5 text-sm font-semibold leading-snug text-text-primary">
            {{ noticia().titulo }}
          </h3>
          <p class="mt-2 text-[11px] text-text-secondary">
            {{ traducao.t('comum.publicado') }} {{ tempoRelativo() }}
          </p>

          @if (link(); as destino) {
            <a
              [routerLink]="destino"
              class="mt-2 text-xs font-semibold text-primary-dark transition-colors duration-200 hover:text-primary"
              >{{ traducao.t('comum.lerMais') }}</a
            >
          }
        </div>
      </article>
    } @else {
      <article
        class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="relative min-h-32 flex-1">
          <app-espaco-imagem
            class="absolute inset-0"
            alturaMinima="100%"
            [imagem]="noticia().imagem"
            [legenda]="legendaImagem()"
          />
        </div>

        <div class="flex flex-col p-5">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-accent">
            {{ dataFormatada() }}
            @if (noticia().categoria) {
              <span> • {{ noticia().categoria }}</span>
            }
          </p>

          <h3 class="mt-2 text-base font-bold leading-tight text-primary-dark">
            {{ noticia().titulo }}
          </h3>
          <p class="mt-2 text-xs leading-snug text-text-secondary">{{ noticia().resumo }}</p>

          @if (link(); as destino) {
            <a
              [routerLink]="destino"
              class="mt-4 text-xs font-semibold text-primary-dark transition-colors duration-200 hover:text-primary"
              >{{ traducao.t('comum.lerMais') }}</a
            >
          }
        </div>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaResumoComponent {
  readonly noticia = input.required<NoticiaCartao>();
  readonly modo = input<ModoCartaoNoticiaResumo>('vertical');
  /** Descrição da fotografia a colocar no espaço reservado enquanto não há imagem real. */
  readonly legendaImagem = input<string>();
  /** Destino da ligação "Ler mais"; sem destino, a ligação não é apresentada. */
  readonly link = input<string>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() =>
    formatarDataCurta(this.noticia().data, this.traducao.idioma()),
  );

  protected readonly tempoRelativo = computed(() =>
    formatarTempoRelativo(this.noticia().data, this.traducao.idioma()),
  );
}
