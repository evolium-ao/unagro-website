import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Evento, ROTULOS_AMBITO_EVENTO } from '../../../core/modelos/evento.model';
import { formatarIntervaloDatas } from '../../../core/traducao/formatar-data';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';
import {
  DadosInscricaoEvento,
  ID_MODAL_INSCRICAO_EVENTO,
  ModalInscricaoEventoComponent,
} from '../modal-inscricao-evento/modal-inscricao-evento.component';
import { SeloComponent } from '../selo/selo.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_DETALHE_EVENTO = 'modal-detalhe-evento';

/** O que a página passa em `data` ao abrir o modal. */
export interface DadosDetalheEvento {
  /** Evento já no idioma da página (a tradução automática é feita por quem abre). */
  evento: Evento;
}

/**
 * Detalhes de um evento, renderizado como template do `AlertModalService` (sem
 * header nem botões próprios). "Inscrever-se" troca este modal pelo de
 * inscrição, com o evento já escolhido.
 */
@Component({
  selector: 'app-modal-detalhe-evento',
  imports: [BotaoComponent, EspacoImagemComponent, IconeComponent, SeloComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (evento; as evento) {
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

        <app-espaco-imagem proporcao="video" alturaMinima="0px" [imagem]="evento.imagem_url" />

        <div class="px-6 py-7 sm:px-9">
          <app-selo variante="neutro" class="uppercase tracking-wide">{{ categoria() }}</app-selo>

          <h2 class="mt-4 text-2xl font-bold leading-tight text-primary-deep sm:text-3xl">
            {{ evento.titulo }}
          </h2>

          <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
            <span class="flex items-center gap-1.5">
              <app-icone nome="calendar" [tamanho]="15" />
              <span class="capitalize">{{ intervaloDatas() }}</span>
            </span>
            @if (evento.local) {
              <span class="flex items-center gap-1.5">
                <app-icone nome="map-pin" [tamanho]="15" />
                {{ evento.local }}
              </span>
            }
          </div>

          <p class="mt-6 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
            {{ evento.descricao }}
          </p>
        </div>

        <div
          class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 px-6 py-5 sm:px-9"
        >
          <app-botao variante="contorno" (clicado)="fechar()">
            {{ textos().fechar }}
          </app-botao>
          <app-botao
            variante="profundo"
            icone="arrow-right"
            posicaoIcone="direita"
            paddingX="px-6"
            (clicado)="inscrever()"
          >
            {{ textos().inscrever }}
          </app-botao>
        </div>
      </div>
    }
  `,
})
export class ModalDetalheEventoComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly dadosModal = inject(ModalDataService);

  protected readonly evento = this.dadosModal.obterDados<DadosDetalheEvento>()?.evento;

  protected readonly categoria = computed(() =>
    this.evento ? this.traducao.getTraducao(ROTULOS_AMBITO_EVENTO[this.evento.ambito]) : '',
  );

  protected readonly intervaloDatas = computed(() =>
    this.evento
      ? formatarIntervaloDatas(this.evento.dataInicio, this.evento.dataFim, this.traducao.idioma())
      : '',
  );

  protected readonly textos = computed(() => ({
    fechar: this.traducao.getTraducao(['Fechar', 'Close']),
    inscrever: this.traducao.getTraducao(['Inscrever-se', 'Register']),
  }));

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_DETALHE_EVENTO);
  }

  /** O modal de detalhes fecha primeiro: o de inscrição ocupa o lugar dele, não se empilha por cima. */
  protected inscrever(): void {
    const evento = this.evento;
    if (!evento) {
      return;
    }

    this.fechar();

    const dados: DadosInscricaoEvento = {
      eventoSelecionado: {
        id: evento.id,
        titulo: evento.titulo,
        descricao: evento.descricao,
        categoria: this.categoria(),
        dataInicio: evento.dataInicio,
        local: evento.local,
        link: '/eventos',
        imagem: evento.imagem_url,
      },
    };

    void this.modais.modal({
      id: ID_MODAL_INSCRICAO_EVENTO,
      template: ModalInscricaoEventoComponent,
      tamanho: 'xgrande',
      temHeader: false,
      semBotoes: true,
      // É um formulário: um clique no fundo não o pode fazer desaparecer.
      fecharAoClicarFundo: false,
      data: dados,
    });
  }
}
