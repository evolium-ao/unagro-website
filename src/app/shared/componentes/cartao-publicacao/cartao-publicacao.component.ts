import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Publicacao } from '../../../core/modelos/publicacao.model';
import { formatarDataCurta } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent, VarianteBotao } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';

/**
 * Linha de uma lista vertical de publicações: quadrado com o ícone do artigo à
 * esquerda, data e título e resumo no meio, e as acções de descarga à
 * direita. Recebe a linha já resolvida da API (`Publicacao`) — sem
 * `getTraducao` para `titulo`/`resumo` aqui, o texto já vem traduzido (ver
 * `desenvolvimento.component.ts`). Em ecrã pequeno o conteúdo empilha e as
 * acções descem para baixo do texto.
 *
 * **"Baixar" está sempre presente** quando há `documentoUrl` (o ficheiro em
 * português). **"Baixar Abstract" só aparece com `documentoUrlEn`** — não
 * depende do idioma do site, depende só de a publicação ter ou não a versão
 * inglesa carregada no backoffice.
 */
@Component({
  selector: 'app-cartao-publicacao',
  imports: [BotaoComponent, IconeComponent],
  host: { class: 'block' },
  template: `
    <article
      class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-deep/10 text-primary-deep"
        aria-hidden="true"
      >
        <app-icone nome="file-text" [tamanho]="18" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-bold uppercase tracking-wider text-text-primary">{{ data() }}</p>
        <h3 class="mt-1.5 text-[15px] font-semibold leading-snug text-text-primary sm:text-base">
          {{ publicacao().titulo }}
        </h3>
        @if (publicacao().resumo) {
          <p class="mt-1.5 text-xs leading-relaxed text-text-secondary">{{ publicacao().resumo }}</p>
        }
      </div>

      @if (publicacao().documentoUrl || publicacao().documentoUrlEn) {
        <div class="flex shrink-0 flex-wrap items-center gap-2">
          @if (publicacao().documentoUrlEn; as abstract) {
            <app-botao variante="contorno" tamanho="sm" raio="medio" icone="download" [link]="abstract" [download]="true">
              {{ traducao.getTraducao(['Baixar Abstract', 'Get Abstract']) }}
            </app-botao>
          }
          @if (publicacao().documentoUrl; as ficheiro) {
            <app-botao
              [variante]="varianteDownload()"
              tamanho="sm"
              raio="medio"
              icone="download"
              [link]="ficheiro"
              [download]="true"
            >
              {{ traducao.getTraducao(['Baixar', 'Download']) }}
            </app-botao>
          }
        </div>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoPublicacaoComponent {
  readonly publicacao = input.required<Publicacao>();
  /** Cor do botão sólido de descarga, para acompanhar o acento da secção. */
  readonly varianteDownload = input<VarianteBotao>('profundo');

  protected readonly traducao = inject(TraducaoService);

  protected readonly data = computed(() =>
    formatarDataCurta(this.publicacao().data, this.traducao.idioma()),
  );
}
