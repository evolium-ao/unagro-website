import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { EstadoEtapaCronograma, EtapaCronograma } from '../../../core/modelos/projeto.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';

const CLASSES_BOLA: Record<EstadoEtapaCronograma, string> = {
  concluida: 'bg-primary-deep text-white',
  atual: 'bg-accent text-white ring-4 ring-accent/25',
  futura: 'bg-gray-100 text-text-secondary',
};

const CLASSES_SEGMENTO: Record<EstadoEtapaCronograma, string> = {
  concluida: 'bg-primary-deep',
  atual: 'bg-accent',
  futura: 'bg-gray-200',
};

const CLASSES_DESCRICAO: Record<EstadoEtapaCronograma, string> = {
  concluida: 'text-text-secondary',
  atual: 'font-semibold text-text-primary',
  futura: 'text-text-secondary',
};

/**
 * Uma etapa da linha temporal de um projecto: bola numerada em cima, o seu
 * troço da régua horizontal a seguir e, por baixo, o título e a descrição
 * alinhados à esquerda.
 *
 * A régua não é desenhada pela secção: cada etapa desenha o **seu** segmento,
 * o que faz o progresso sair sozinho dos estados das etapas — a página não
 * calcula percentagens nem posiciona linhas absolutas. O segmento só aparece a
 * partir de `lg`, onde as etapas estão em fila; empilhadas, uma régua
 * horizontal não se leria.
 *
 * O número vem da ordem da etapa na lista e a cor vem do `estado`, por isso
 * nenhum dos dois se guarda nos dados.
 */
@Component({
  selector: 'app-etapa-cronograma',
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full flex-col">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        [class]="classeBola()"
        >{{ numero() }}</span
      >

      <span aria-hidden="true" class="mt-5 hidden h-px w-full lg:block" [class]="classeSegmento()"></span>

      <div class="mt-4">
        <h3 class="text-sm font-semibold text-primary-dark">{{ etapa().titulo }}</h3>
        <p class="mt-1.5 text-xs leading-relaxed" [class]="classeDescricao()">{{ textoDescricao() }}</p>
      </div>
    </div>
  `,
})
export class EtapaCronogramaComponent {
  readonly etapa = input.required<EtapaCronograma>();
  /** Posição da etapa no cronograma — é o número que aparece na bola. */
  readonly numero = input.required<number>();

  private readonly traducao = inject(TraducaoService);

  protected readonly classeBola = computed(() => CLASSES_BOLA[this.etapa().estado]);
  protected readonly classeSegmento = computed(() => CLASSES_SEGMENTO[this.etapa().estado]);
  protected readonly classeDescricao = computed(() => CLASSES_DESCRICAO[this.etapa().estado]);

  /**
   * A etapa em curso não guarda o texto "Fase Atual" nos dados: ele é o rótulo
   * do estado, traduzido aqui, e só entra quando não há período marcado.
   */
  protected readonly textoDescricao = computed(() => {
    const etapa = this.etapa();
    const prefixo =
      etapa.periodo ??
      (etapa.estado === 'atual'
        ? this.traducao.getTraducao(['Fase Atual', 'Current Phase'])
        : undefined);

    return prefixo ? `${prefixo} - ${etapa.descricao}` : etapa.descricao;
  });
}
