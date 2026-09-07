import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Estado de aba **sem conteúdo aprovado ainda**.
 *
 * Duas das sete abas de `/sobre` ("Aba Unagro" e "Governança") não tinham modal nem
 * texto na proposta do cliente. Em vez de se inventar conteúdo institucional — que
 * seria publicado como se fosse oficial — a aba assume-o e encaminha para os contactos.
 * Quando o texto chegar, substitui-se o `app-sobre-conteudo-em-preparacao` do componente
 * da aba pelo conteúdo real; nada mais precisa de mudar.
 */
@Component({
  selector: 'app-sobre-conteudo-em-preparacao',
  imports: [BotaoComponent, IconeComponent, RevelarAoScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-bg-lighter px-6 py-14 text-center sm:px-10"
      appRevelarAoScroll
    >
      <span
        class="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-primary-deep"
      >
        <app-icone [nome]="icone()" [tamanho]="26" />
      </span>

      <h2 class="mt-6 text-2xl font-semibold text-text-primary sm:text-3xl">{{ titulo() }}</h2>

      <p class="mt-4 text-sm leading-relaxed text-text-secondary">{{ descricao() }}</p>

      <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ textos().aviso }}</p>

      <app-botao class="mt-8" variante="contorno" tamanho="md" link="/contactos" icone="mail">
        {{ textos().acao }}
      </app-botao>
    </div>
  `,
})
export class SobreConteudoEmPreparacaoComponent {
  private readonly traducao = inject(TraducaoService);

  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  /** Nome de um ícone de `dados-icones.ts`. */
  readonly icone = input<string>('file-text');

  protected readonly textos = computed(() => ({
    aviso: this.traducao.getTraducao([
      'Estamos a preparar esta informação e publicamo-la nesta página assim que estiver validada.',
      'We are preparing this information and will publish it on this page as soon as it is approved.',
    ]),
    acao: this.traducao.getTraducao(['Falar com a UNAGRO', 'Contact UNAGRO']),
  }));
}
