import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { CabecalhoSecaoComponent } from '../../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import {
  PILARES,
  PilarInstitucional,
} from '../../../shared/componentes/modal-pilares-institucionais/modal-pilares-institucionais.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Aba "Pilares institucionais" de `/sobre`.
 *
 * É o conteúdo do `app-modal-pilares-institucionais` sem a moldura do modal, e reusa
 * a **mesma** lista `PILARES` exportada por esse componente — os dois caminhos nunca
 * divergem no conteúdo. O cabeçalho (título + três traços dourados) passa a vir do
 * `app-cabecalho-secao`, que já faz exactamente esse desenho.
 */
@Component({
  selector: 'app-sobre-pilares-institucionais',
  imports: [CabecalhoSecaoComponent, IconeComponent, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cabecalho-secao
      [titulo]="textos().titulo"
      [descricao]="textos().subtitulo"
      posicaoTracos="abaixo"
      tamanhoDescricao="pequeno"
    />

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      @for (pilar of pilares(); track pilar.id) {
        <article
          class="h-full rounded-2xl border border-gray-200 bg-white p-6"
          [appRevelarAoScroll]="$index"
        >
          <span
            class="inline-flex h-13 w-13 items-center justify-center rounded-xl bg-bg-light text-primary-deep"
          >
            <app-icone [nome]="pilar.icone" [tamanho]="24" />
          </span>

          <h3 class="mt-6 text-base font-bold text-text-primary">{{ pilar.titulo }}</h3>

          @if (pilar.itens.length) {
            <ul class="mt-3 space-y-2">
              @for (item of pilar.itens; track item) {
                <li class="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                  <app-icone
                    nome="check"
                    [tamanho]="16"
                    class="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{{ item }}</span>
                </li>
              }
            </ul>
          } @else {
            <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ pilar.texto }}</p>
          }
        </article>
      }
    </div>
  `,
})
export class SobrePilaresInstitucionaisComponent {
  private readonly traducao = inject(TraducaoService);

  /** Aberto para o dia em que os pilares vierem da API; por omissão é a lista local. */
  readonly pilaresInstitucionais = input<readonly PilarInstitucional[]>(PILARES);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Pilares Institucionais', 'Institutional Pillars']),
    subtitulo: this.traducao.getTraducao([
      'A missão, a visão e os valores que orientam cada decisão académica e de gestão da UNAGRO.',
      "The mission, vision and values that guide every academic and management decision at UNAGRO.",
    ]),
  }));

  protected readonly pilares = computed(() =>
    this.pilaresInstitucionais().map((pilar) => ({
      id: pilar.id,
      icone: pilar.icone,
      titulo: this.traducao.getTraducao(pilar.titulo),
      texto: pilar.texto ? this.traducao.getTraducao(pilar.texto) : '',
      itens: (pilar.itens ?? []).map((item) => this.traducao.getTraducao(item)),
    })),
  );
}
