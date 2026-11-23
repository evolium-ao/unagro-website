import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent } from '../selo/selo.component';

/** Identificador usado para abrir e fechar o modal a partir de qualquer ponto da app. */
export const ID_MODAL_NOSSA_HISTORIA = 'modal-nossa-historia';

/**
 * Conteúdo do modal "Nossa História" — renderizado como template do
 * `AlertModalService` (sem header nem botões: o fecho é feito pelo X do canto).
 */
@Component({
  selector: 'app-modal-nossa-historia',
  imports: [IconeComponent, SeloComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <!-- Fechar -->
      <button
        type="button"
        class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white/80 text-text-secondary transition-colors hover:border-primary hover:text-primary"
        [attr.aria-label]="traducao.t('modais.nossaHistoria.fechar')"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="16" />
      </button>

      <div class="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
        <!-- Texto -->
        <div>
          <app-selo variante="primario">
            <span class="text-[11px] font-semibold uppercase tracking-[0.12em]">
              {{ traducao.t('modais.nossaHistoria.selo') }}
            </span>
          </app-selo>

          <h2 class="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">
            {{ traducao.t('modais.nossaHistoria.titulo') }}
          </h2>

          <p class="mt-6 text-sm leading-relaxed text-text-secondary">
            {{ traducao.t('modais.nossaHistoria.paragrafoUm') }}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-text-secondary">
            {{ traducao.t('modais.nossaHistoria.paragrafoDois') }}
          </p>

          <!-- Destaque -->
          <div class="mt-8 flex items-center gap-4 rounded-xl border border-gray-200 bg-bg-lighter p-4">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white"
            >
              <app-icone nome="award" [tamanho]="20" />
            </span>
            <span class="flex flex-col">
              <span class="text-sm font-semibold text-text-primary">
                {{ traducao.t('modais.nossaHistoria.destaqueTitulo') }}
              </span>
              <span class="mt-0.5 text-xs text-text-secondary">
                {{ traducao.t('modais.nossaHistoria.destaqueTexto') }}
              </span>
            </span>
          </div>
        </div>

        <!-- Imagem com o arco decorativo -->
        <div class="relative">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -left-4 -top-4 h-32 w-32 rounded-tl-[2.5rem] border-l-2 border-t-2 border-secondary sm:-left-6 sm:-top-6 sm:h-40 sm:w-40"
          ></span>
          <img
            src="/imagens/campus-aereo.png"
            alt="Vista aérea do campus da UNAGRO"
            width="550"
            height="786"
            class="relative aspect-[3/4] w-full rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </div>
  `,
})
export class ModalNossaHistoriaComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_NOSSA_HISTORIA);
  }
}
