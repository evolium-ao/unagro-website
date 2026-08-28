import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { formatarDataCurta } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { NoticiaCartao } from '../../modelos/noticia-cartao.model';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Cartão de notícia em destaque: a imagem ocupa todo o cartão e o texto assenta
 * sobre um gradiente escuro. Estica-se à altura da célula onde é colocado.
 */
@Component({
  selector: 'app-cartao-noticia-destaque',
  imports: [EspacoImagemComponent, BotaoComponent],
  host: { class: 'block h-full' },
  template: `
    <article class="relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-lg">
      <app-espaco-imagem class="absolute inset-0" alturaMinima="100%" [legenda]="legendaImagem()" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/10"
      ></div>

      <span
        class="absolute right-3 top-5 rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark"
      >
        {{ traducao.t('comum.emDestaque') }}
      </span>

      <div class="relative flex flex-col items-start p-6 sm:p-8">
        <p class="text-xs text-white/80">
          <span class="capitalize">{{ dataFormatada() }}</span>
          @if (noticia().categoria) {
            <span> • {{ noticia().categoria }}</span>
          }
        </p>

        <h3 class="mt-3 text-2xl font-medium leading-tight text-white">{{ noticia().titulo }}</h3>
        <p class="mt-3 text-xs leading-5 text-white/75">{{ noticia().resumo }}</p>

        @if (link(); as destino) {
          <app-botao variante="secundario" tamanho="sm" [link]="destino" class="mt-6">
            {{ traducao.t('comum.lerArtigo') }}
          </app-botao>
        }
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaDestaqueComponent {
  readonly noticia = input.required<NoticiaCartao>();
  /** Descrição da fotografia a colocar no espaço reservado enquanto não há imagem real. */
  readonly legendaImagem = input<string>();
  /** Destino do botão "Ler artigo"; sem destino, o botão não é apresentado. */
  readonly link = input<string>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() =>
    formatarDataCurta(this.noticia().data, this.traducao.idioma()),
  );
}
