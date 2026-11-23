import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { formatarDataCurta } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { NoticiaCartao } from '../../modelos/noticia-cartao.model';
import { RouterLink } from '@angular/router';
import { BotaoComponent } from '../botao/botao.component';
import { BotaoCompartilharComponent } from '../botao-compartilhar/botao-compartilhar.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Cartão de notícia em destaque: a imagem ocupa todo o cartão e o texto assenta
 * sobre um gradiente escuro. Estica-se à altura da célula onde é colocado.
 */
@Component({
  selector: 'app-cartao-noticia-destaque',
  imports: [EspacoImagemComponent, BotaoComponent, BotaoCompartilharComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    <article class="relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-lg">
      <app-espaco-imagem
        class="absolute inset-0"
        proporcao="cover"
        alturaMinima="100%"
        [imagem]="noticia().imagem"
        [legenda]="legendaImagem()" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/10"
      ></div>

      @if (variante() === 'padrao' && mostrarSelo()) {
        <span
          class="absolute right-3 top-5 rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark"
        >
          {{ traducao.t('comum.emDestaque') }}
        </span>
      }

      <div class="relative flex flex-col items-start p-6 sm:p-8">
        @if (variante() === 'padrao') {
          <p class="text-xs text-white/80">
            <span class="capitalize">{{ dataFormatada() }}</span>
            @if (noticia().categoria) {
              <span> • {{ noticia().categoria }}</span>
            }
          </p>
        } @else if (noticia().categoria) {
          <span
            class="rounded bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
          >
            {{ noticia().categoria }}
          </span>
        }

        <h3 class="mt-3 text-2xl font-medium leading-tight text-white">{{ noticia().titulo }}</h3>
        <p class="mt-3 text-xs leading-5 text-white/75">{{ noticia().resumo }}</p>

        @if (link(); as destino) {
          <div class="relative z-20 mt-6 flex items-center gap-3">
            <app-botao variante="secundario" tamanho="sm" [link]="destino">
              {{ traducao.t('comum.lerArtigo') }}
            </app-botao>
            <app-botao-compartilhar variante="claro" [titulo]="noticia().titulo" [link]="destino" />
          </div>
        }
      </div>

      <!-- Ligação sobreposta: o cartão inteiro abre a notícia. Decorativa para o
           leitor de ecrã e fora da ordem de tabulação — quem navega por teclado
           usa o botão "Ler artigo", que vai ao mesmo sítio. -->
      @if (link(); as destino) {
        <a [routerLink]="destino" class="absolute inset-0 z-10" aria-hidden="true" tabindex="-1"></a>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaDestaqueComponent {
  readonly noticia = input.required<NoticiaCartao>();
  /**
   * `padrao` = selo "Em destaque" e linha de data (home); `simples` = apenas a
   * categoria em selo sobre o gradiente (secção de notícias académicas).
   */
  readonly variante = input<'padrao' | 'simples'>('padrao');
  /**
   * Selo "Em destaque" no canto (só na variante `padrao`). Por omissão fica
   * visível; o cartão só deve receber notícias marcadas como destaque na API.
   */
  readonly mostrarSelo = input(true);
  /** Descrição da fotografia a colocar no espaço reservado enquanto não há imagem real. */
  readonly legendaImagem = input<string>();
  /** Destino do botão "Ler artigo"; sem destino, o botão não é apresentado. */
  readonly link = input<string>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() =>
    formatarDataCurta(this.noticia().data, this.traducao.idioma()),
  );
}
