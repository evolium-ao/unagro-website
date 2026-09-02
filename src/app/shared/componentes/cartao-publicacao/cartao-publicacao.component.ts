import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Publicacao } from '../../../core/modelos/publicacao.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent, VarianteBotao } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';

/**
 * Linha de uma lista vertical de publicações: quadrado com o ícone do artigo à
 * esquerda, revista/data, título e autores no meio, e as acções de resumo e
 * descarga à direita. Recebe a linha da API tal como ela vem (`Publicacao`) e
 * resolve aqui os textos bilingues. Em ecrã pequeno o conteúdo empilha e as
 * acções descem para baixo do texto.
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
        <app-icone [nome]="icone()" [tamanho]="18" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-bold uppercase tracking-wider text-text-primary">
          {{ revista() }}
          <span class="font-medium text-text-secondary">· {{ data() }}</span>
        </p>
        <h3 class="mt-1.5 text-[15px] font-semibold leading-snug text-text-primary sm:text-base">
          {{ titulo() }}
        </h3>
        <p class="mt-1.5 text-xs leading-relaxed text-text-secondary">{{ autores() }}</p>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <app-botao
          variante="contorno"
          tamanho="sm"
          raio="medio"
          [link]="publicacao().link_abstract"
        >
          {{ traducao.getTraducao(['Abstract', 'Abstract']) }}
        </app-botao>

        <app-botao
          [variante]="varianteDownload()"
          tamanho="sm"
          raio="medio"
          icone="download"
          [link]="publicacao().link_download"
        >
          {{ traducao.getTraducao(['Download', 'Download']) }}
        </app-botao>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoPublicacaoComponent {
  readonly publicacao = input.required<Publicacao>();
  /** Cor do botão sólido de descarga, para acompanhar o acento da secção. */
  readonly varianteDownload = input<VarianteBotao>('profundo');

  protected readonly traducao = inject(TraducaoService);

  protected readonly icone = computed(() => this.publicacao().icone ?? 'file-text');
  protected readonly revista = computed(() => this.traducao.getTraducao(this.publicacao().revista));
  protected readonly data = computed(() => this.traducao.getTraducao(this.publicacao().data));
  protected readonly titulo = computed(() => this.traducao.getTraducao(this.publicacao().titulo));
  protected readonly autores = computed(() => this.traducao.getTraducao(this.publicacao().autores));
}
