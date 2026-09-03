import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Projeto, ROTULOS_CATEGORIA_PROJECTO } from '../../../core/modelos/projeto.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';

/**
 * Cartão de um projecto de desenvolvimento. Recebe a linha da API tal como ela
 * vem (`Projeto`, já em texto simples) — só a categoria, que é rótulo de UI e
 * não dado da API, passa por `getTraducao`.
 */
@Component({
  selector: 'app-cartao-projecto',
  imports: [EspacoImagemComponent, IconeComponent, RouterLink],
  host: { class: 'block h-full' },
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white  shadow-xs transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div class="relative">
        <app-espaco-imagem
          proporcao="video"
          [arredondado]="false"
          [imagem]="projecto().imagem_url"
        />
        <span
          class="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-primary"
        >
          {{ rotuloCategoria() }}
        </span>
      </div>

      <div class="flex flex-1 flex-col p-6  pt-5">
        <h3 class="text-lg font-semibold leading-snug text-text-primary">{{ projecto().titulo }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-text-secondary mb-20">{{ projecto().resumo }}</p>

        <div class="mt-auto flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {{ traducao.getTraducao(['Resultado principal', 'Key outcome']) }}
            </p>
            <p class="mt-1 font-semibold text-text-primary">{{ projecto().resultado_principal }}</p>
          </div>

          <a
            [routerLink]="['/projetos', projecto().id]"
            [attr.aria-label]="traducao.getTraducao(['Ver projecto', 'View project'])"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-text-primary transition-colors hover:border-primary hover:text-primary"
          >
            <app-icone nome="arrow-up-right" [tamanho]="16" />
          </a>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoProjectoComponent {
  readonly projecto = input.required<Projeto>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly rotuloCategoria = computed(() =>
    this.traducao.getTraducao(ROTULOS_CATEGORIA_PROJECTO[this.projecto().categoria]),
  );
}
