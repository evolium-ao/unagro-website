import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatarDataCurta } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { NoticiaCartao } from '../../modelos/noticia-cartao.model';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Cartão de notícia secundário: imagem em cima, texto em baixo. A imagem absorve
 * a altura sobrante da célula, o que mantém cartões de alturas diferentes alinhados.
 */
@Component({
  selector: 'app-cartao-noticia-resumo',
  imports: [EspacoImagemComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div class="relative min-h-32 flex-1">
        <app-espaco-imagem
          class="absolute inset-0"
          alturaMinima="100%"
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoNoticiaResumoComponent {
  readonly noticia = input.required<NoticiaCartao>();
  /** Descrição da fotografia a colocar no espaço reservado enquanto não há imagem real. */
  readonly legendaImagem = input<string>();
  /** Destino da ligação "Ler mais"; sem destino, a ligação não é apresentada. */
  readonly link = input<string>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() =>
    formatarDataCurta(this.noticia().data, this.traducao.idioma()),
  );
}
