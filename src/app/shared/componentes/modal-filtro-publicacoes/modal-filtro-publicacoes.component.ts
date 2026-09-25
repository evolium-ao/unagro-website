import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { ModalEventsService } from '../alert-modal/modal-events.service';
import { BotaoComponent } from '../botao/botao.component';
import { FiltroPilulaComponent, OpcaoFiltroPilula } from '../filtro-pilula/filtro-pilula.component';
import { IconeComponent } from '../icone/icone.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_FILTRO_PUBLICACOES = 'modal-filtro-publicacoes';

/** Evento emitido ao aplicar, com os `FiltrosPublicacoes` escolhidos. */
export const EVENTO_APLICAR_FILTROS_PUBLICACOES = 'aplicar';

/**
 * `com-en` = publicações com versão em inglês; `so-pt` = só em português.
 * Deduzido do ficheiro inglês (`documentoUrlEn`) — a API não tem um campo de língua.
 */
export type LinguaPublicacao = 'com-en' | 'so-pt';

/** Filtros da lista de publicações. `''` em cada campo é "sem filtro". */
export interface FiltrosPublicacoes {
  ano: string;
  lingua: LinguaPublicacao | '';
  projetoId: string;
}

export const FILTROS_PUBLICACOES_VAZIOS: FiltrosPublicacoes = { ano: '', lingua: '', projetoId: '' };

/** O que a página passa em `data` ao abrir o modal. */
export interface DadosFiltroPublicacoes {
  /** Filtros em vigor — o modal abre com eles já escolhidos. */
  filtros: FiltrosPublicacoes;
  /** Anos que existem nas publicações, do mais recente para o mais antigo. */
  anos: string[];
  /** Projectos que têm pelo menos uma publicação associada. */
  projectos: OpcaoFiltroPilula[];
}

/**
 * Filtros das "Publicações Recentes" (data, língua e projecto), renderizado como
 * template do `AlertModalService`. As escolhas só chegam à página ao "Aplicar",
 * pelo evento `EVENTO_APLICAR_FILTROS_PUBLICACOES`; fechar sem aplicar deixa
 * tudo como estava.
 */
@Component({
  selector: 'app-modal-filtro-publicacoes',
  imports: [BotaoComponent, FiltroPilulaComponent, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <!-- Fechar -->
      <button
        type="button"
        class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary-deep hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="16" />
      </button>

      <div class="border-b border-gray-200 px-6 pb-6 pt-9 sm:px-9">
        <h2 class="text-2xl font-bold leading-tight text-primary-deep">{{ textos().titulo }}</h2>
        <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ textos().subtitulo }}</p>
      </div>

      <div class="flex flex-col gap-6 px-6 py-7 sm:px-9">
        <div>
          <span class="block text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary">
            {{ textos().ano }}
          </span>
          <app-filtro-pilula class="mt-2 block" [rotulo]="textos().todosAnos" [opcoes]="opcoesAno()"
            [(valor)]="ano" />
        </div>

        <div>
          <span class="block text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary">
            {{ textos().lingua }}
          </span>
          <app-filtro-pilula class="mt-2 block" [rotulo]="textos().todasLinguas" [opcoes]="opcoesLingua()"
            [(valor)]="lingua" />
        </div>

        @if (opcoesProjecto().length) {
          <div>
            <span class="block text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary">
              {{ textos().projecto }}
            </span>
            <app-filtro-pilula class="mt-2 block" [rotulo]="textos().todosProjectos"
              [opcoes]="opcoesProjecto()" [(valor)]="projetoId" />
          </div>
        }
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-5 sm:px-9">
        <button
          type="button"
          class="cursor-pointer text-sm font-semibold text-text-secondary transition-colors hover:text-primary-deep disabled:cursor-not-allowed disabled:opacity-40"
          [disabled]="!temEscolhas()"
          (click)="limpar()"
        >
          {{ textos().limpar }}
        </button>

        <div class="flex items-center gap-3">
          <app-botao variante="contorno" (clicado)="fechar()">{{ textos().cancelar }}</app-botao>
          <app-botao variante="profundo" paddingX="px-6" (clicado)="aplicar()">
            {{ textos().aplicar }}
          </app-botao>
        </div>
      </div>
    </div>
  `,
})
export class ModalFiltroPublicacoesComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly eventos = inject(ModalEventsService);
  private readonly dados = inject(ModalDataService).obterDados<DadosFiltroPublicacoes>();

  private readonly iniciais = this.dados?.filtros ?? FILTROS_PUBLICACOES_VAZIOS;

  protected readonly ano = signal(this.iniciais.ano);
  protected readonly lingua = signal<string>(this.iniciais.lingua);
  protected readonly projetoId = signal(this.iniciais.projetoId);

  protected readonly temEscolhas = computed(() => !!(this.ano() || this.lingua() || this.projetoId()));

  protected readonly opcoesAno = computed<OpcaoFiltroPilula[]>(() =>
    (this.dados?.anos ?? []).map((ano) => ({ valor: ano, rotulo: ano })),
  );

  protected readonly opcoesLingua = computed<OpcaoFiltroPilula[]>(() => [
    {
      valor: 'com-en',
      rotulo: this.traducao.getTraducao(['Com versão em inglês', 'With English version']),
    },
    { valor: 'so-pt', rotulo: this.traducao.getTraducao(['Só em português', 'Portuguese only']) },
  ]);

  protected readonly opcoesProjecto = computed(() => this.dados?.projectos ?? []);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Filtrar publicações', 'Filter publications']),
    subtitulo: this.traducao.getTraducao([
      'Combine os filtros para encontrar a publicação que procura.',
      'Combine the filters to find the publication you are looking for.',
    ]),
    ano: this.traducao.getTraducao(['Ano de publicação', 'Publication year']),
    todosAnos: this.traducao.getTraducao(['Todos os anos', 'All years']),
    lingua: this.traducao.getTraducao(['Língua', 'Language']),
    todasLinguas: this.traducao.getTraducao(['Todas as línguas', 'All languages']),
    projecto: this.traducao.getTraducao(['Projecto', 'Project']),
    todosProjectos: this.traducao.getTraducao(['Todos os projectos', 'All projects']),
    limpar: this.traducao.getTraducao(['Limpar filtros', 'Clear filters']),
    cancelar: this.traducao.getTraducao(['Cancelar', 'Cancel']),
    aplicar: this.traducao.getTraducao(['Aplicar', 'Apply']),
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
  }));

  protected limpar(): void {
    this.ano.set('');
    this.lingua.set('');
    this.projetoId.set('');
  }

  protected aplicar(): void {
    const filtros: FiltrosPublicacoes = {
      ano: this.ano(),
      lingua: this.lingua() as FiltrosPublicacoes['lingua'],
      projetoId: this.projetoId(),
    };
    this.eventos.emitir(EVENTO_APLICAR_FILTROS_PUBLICACOES, filtros);
    this.fechar();
  }

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_FILTRO_PUBLICACOES);
  }
}
