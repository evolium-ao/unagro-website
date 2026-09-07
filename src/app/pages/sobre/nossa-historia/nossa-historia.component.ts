import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { SeloComponent } from '../../../shared/componentes/selo/selo.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Aba "Nossa História" de `/sobre`.
 *
 * É o conteúdo do `app-modal-nossa-historia` sem a moldura do modal (sem o X de
 * fecho): lê as **mesmas** chaves `modais.nossaHistoria.*` do dicionário, para os
 * dois caminhos — modal e aba — nunca divergirem no texto.
 */
@Component({
  selector: 'app-sobre-nossa-historia',
  imports: [IconeComponent, SeloComponent, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      <!-- Texto -->
      <div appRevelarAoScroll>
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
        <div
          class="mt-8 flex items-center gap-4 rounded-xl border border-gray-200 bg-bg-lighter p-4"
        >
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
      <div class="relative" [appRevelarAoScroll]="1">
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
  `,
})
export class SobreNossaHistoriaComponent {
  protected readonly traducao = inject(TraducaoService);
}
