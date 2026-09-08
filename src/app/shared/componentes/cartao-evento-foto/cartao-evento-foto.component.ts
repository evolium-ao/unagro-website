import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { formatarDataCurta } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent } from '../selo/selo.component';

/** `vertical` = fotografia em cima; `destaque` = fotografia à esquerda, para ocupar duas colunas. */
export type FormatoCartaoEventoFoto = 'vertical' | 'destaque';

export interface EventoFotoCartao {
  id: string;
  titulo: string;
  descricao: string;
  /** Rótulo do selo — âmbito ou tipo do evento, já traduzido pela página. */
  categoria: string;
  /** A API ainda não dá a data do evento; sem ela o selo de data não aparece. */
  dataInicio?: string;
  local: string;
  link: string;
  /** Sem fotografia fica o marcador cinzento do `app-espaco-imagem`. */
  imagem?: string;
}

/**
 * Cartão de evento com fotografia, sem sombra e com moldura `border-gray-200`.
 * No formato `destaque` o selo passa para dentro do texto, porque sobre a
 * fotografia recortada à esquerda ficaria colado ao canto do cartão.
 */
@Component({
  selector: 'app-cartao-evento-foto',
  imports: [BotaoComponent, EspacoImagemComponent, IconeComponent, SeloComponent],
  host: { class: 'block h-full' },
  template: `
    @if (formato() === 'destaque') {
      <article
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:flex-row"
      >
        <div class="h-52 shrink-0 sm:h-auto sm:w-2/5">
          <app-espaco-imagem proporcao="cover" alturaMinima="100%" [imagem]="evento().imagem" />
        </div>

        <div class="flex flex-1 flex-col p-6">
          <div class="flex flex-wrap items-center gap-3">
            <app-selo variante="neutro" class="uppercase tracking-wide">
              {{ evento().categoria }}
            </app-selo>
            @if (dataFormatada(); as data) {
              <span class="flex items-center gap-1.5 text-xs text-text-secondary">
                <app-icone nome="calendar" [tamanho]="13" />
                {{ data }}
              </span>
            }
          </div>

          <h3 class="mt-4 text-lg font-bold leading-snug text-text-primary sm:text-xl">
            {{ evento().titulo }}
          </h3>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">
            {{ evento().descricao }}
          </p>

          <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            <span class="flex items-center gap-1.5 text-xs text-text-secondary">
              <app-icone nome="map-pin" [tamanho]="13" />
              {{ evento().local }}
            </span>
            <app-botao variante="primario" tamanho="sm" [link]="evento().link">
              {{ textoInscricao() }}
            </app-botao>
          </div>
        </div>
      </article>
    } @else {
      <article
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <div class="relative">
          <app-espaco-imagem proporcao="video" alturaMinima="0px" [imagem]="evento().imagem" />
          <app-selo variante="sobreFoto" class="absolute right-3 top-3">
            {{ evento().categoria }}
          </app-selo>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
            @if (dataFormatada(); as data) {
              <span class="flex items-center gap-1.5">
                <app-icone nome="calendar" [tamanho]="13" />
                {{ data }}
              </span>
            }
            <span class="flex items-center gap-1.5">
              <app-icone nome="map-pin" [tamanho]="13" />
              {{ evento().local }}
            </span>
          </div>

          <h3 class="mt-3 text-base font-bold leading-snug text-text-primary">
            {{ evento().titulo }}
          </h3>
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {{ evento().descricao }}
          </p>

          <div class="mt-auto pt-5">
            <app-botao
              [variante]="varianteBotao()"
              tamanho="sm"
              raio="medio"
              [larguraTotal]="true"
              [link]="evento().link"
            >
              {{ textoInscricao() }}
            </app-botao>
          </div>
        </div>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoEventoFotoComponent {
  readonly evento = input.required<EventoFotoCartao>();
  readonly formato = input<FormatoCartaoEventoFoto>('vertical');
  /** Só no formato `vertical`; o `destaque` mantém sempre o botão cheio. */
  readonly varianteBotao = input<'primario' | 'contorno'>('primario');

  protected readonly traducao = inject(TraducaoService);

  protected readonly dataFormatada = computed(() => {
    const dataInicio = this.evento().dataInicio;
    return dataInicio ? formatarDataCurta(dataInicio, this.traducao.idioma()) : undefined;
  });

  protected readonly textoInscricao = computed(() =>
    this.traducao.getTraducao(['Inscrever-se', 'Register']),
  );
}
