import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { UnidadeInvestigacao } from '../../../core/modelos/investigacao.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';

/**
 * Cartão de um centro, laboratório ou unidade: a fotografia ocupa o cartão todo e
 * a área, o nome e o botão assentam sobre um gradiente verde. O botão é `glass`,
 * o vidro translúcido do `app-botao`.
 */
@Component({
  selector: 'app-cartao-unidade',
  imports: [EspacoImagemComponent, BotaoComponent],
  host: { class: 'block h-full' },
  template: `
    <article
      class="relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-xl bg-primary-dark"
    >
      <app-espaco-imagem
        class="absolute inset-0"
        proporcao="cover"
        alturaMinima="100%"
        [imagem]="unidade().imagem_url"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-dark/75 to-primary-dark/20"
      ></div>

      <div class="relative flex flex-col items-start p-5">
        <span
          class="rounded-md bg-white/15 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm"
        >
          {{ area() }}
        </span>

        <h3 class="mt-3 text-lg font-semibold leading-snug text-white">{{ nome() }}</h3>
        <app-botao
          variante="glass"
          tamanho="sm"
          icone="arrow-right"
          posicaoIcone="direita"
          paddingY="py-2.5"
          [larguraTotal]="true"
          [link]="destino()"
          (clicado)="visitarSolicitado.emit(unidade())"
          class="mt-4"
        >
          {{ traducao.getTraducao(['Visitar Unidade', 'Visit Unit']) }}
        </app-botao>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoUnidadeComponent {
  readonly unidade = input.required<UnidadeInvestigacao>();
  /**
   * Por omissão o botão é um link para `unidade().link`, como sempre foi. A `true`,
   * passa a ser um botão que emite `visitarSolicitado` e deixa a acção a quem usa o
   * cartão — é assim que a página de desenvolvimento abre o modal de agendamento.
   */
  readonly acaoComoBotao = input(false);

  /** Pedido de visita à unidade do cartão. Só emite com `acaoComoBotao` a `true`. */
  readonly visitarSolicitado = output<UnidadeInvestigacao>();

  protected readonly traducao = inject(TraducaoService);

  /** Sem destino, o `app-botao` renderiza um `<button>` em vez de um `<a>`. */
  protected readonly destino = computed(() =>
    this.acaoComoBotao() ? undefined : this.unidade().link,
  );

  protected readonly area = computed(() => this.traducao.getTraducao(this.unidade().area));
  protected readonly nome = computed(() => this.traducao.getTraducao(this.unidade().nome));
}
