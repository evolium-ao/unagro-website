import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent } from '../selo/selo.component';

/** Projecto inovador com os textos já localizados por quem usa o cartão. */
export interface ProjectoInovadorCartao {
  id: string;
  titulo: string;
  descricao: string;
  destaque?: boolean;
  icone?: string;
  imagem_url?: string;
  estagio?: string;
  metaFinanciamento?: number;
  moeda?: string;
  percentagemMeta?: number;
  link?: string;
}

export type FormatoCartaoProjectoInovador = 'destaque' | 'simples';

/**
 * Cartão de um projecto inovador do Hub, em dois formatos:
 *
 * - `simples` (omissão): cartão branco alto, ícone num quadrado `bg-accent/20`,
 *   título, descrição e rodapé encostado ao fundo com "Estágio: <fase>" à esquerda
 *   e o coração de guardar à direita.
 * - `destaque`: cartão largo (feito para ocupar duas colunas da grelha) com a
 *   fotografia à esquerda a ~40%, a pílula da meta de financiamento e a
 *   percentagem atingida numa linha, título maior, descrição, barra de progresso
 *   e o botão "Apoiar Projeto".
 *
 * Recebe os valores **crus** e formata-os ele mesmo: `metaFinanciamento` 120000 +
 * `moeda` 'USD' dão "Buscando $120k" e `percentagemMeta` 85 dá "85% Meta atingida"
 * e a largura da barra.
 */
@Component({
  selector: 'app-cartao-projecto-inovador',
  imports: [BotaoComponent, EspacoImagemComponent, IconeComponent, SeloComponent],
  host: { class: 'block h-full' },
  template: `
    @if (formato() === 'destaque') {
      <article
        class="flex h-full flex-col gap-5 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:gap-6 sm:p-5"
      >
        @if (projecto().imagem_url; as imagem) {
          <div class="relative shrink-0 overflow-hidden rounded-lg sm:w-2/5">
            <img
              [src]="imagem"
              [alt]="projecto().titulo"
              class="h-48 w-full object-cover sm:absolute sm:inset-0 sm:h-full"
            />
          </div>
        } @else {
          <!-- TODO: falta a fotografia definitiva deste projecto. -->
          <div class="shrink-0 sm:w-2/5">
            <app-espaco-imagem proporcao="video" [arredondado]="true" />
          </div>
        }

        <div class="flex flex-1 flex-col">
          <div class="flex flex-wrap items-center gap-3">
            @if (textoMeta(); as meta) {
              <app-selo variante="neutro" tamanho="pequeno">{{ meta }}</app-selo>
            }
            @if (textoPercentagem(); as percentagem) {
              <span class="text-xs text-text-secondary">{{ percentagem }}</span>
            }
          </div>

          <h3 class="mt-4 text-xl font-bold leading-snug text-primary-dark sm:text-2xl">
            {{ projecto().titulo }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ projecto().descricao }}</p>

          @if (percentagem() !== undefined) {
            <div
              class="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              [attr.aria-valuenow]="percentagem()"
              aria-valuemin="0"
              aria-valuemax="100"
              [attr.aria-label]="rotuloProgresso()"
            >
              <span class="block h-full rounded-full bg-primary" [style.width.%]="percentagem()">
              </span>
            </div>
          }

          <div class="mt-6">
            <app-botao variante="contorno" raio="medio" tamanho="sm" [link]="projecto().link">
              {{ textoApoiar() }}
            </app-botao>
          </div>
        </div>
      </article>
    } @else {
      <article class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6">
        @if (projecto().icone; as nome) {
          <div
            class="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/20 text-primary"
          >
            <app-icone [nome]="nome" [tamanho]="20" />
          </div>
        }

        <h3 class="mt-5 text-base font-bold leading-snug text-primary-dark">
          {{ projecto().titulo }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ projecto().descricao }}</p>

        <footer class="mt-auto flex items-end justify-between gap-3 pt-6">
          @if (textoEstagio(); as estagio) {
            <p class="text-xs font-semibold text-text-primary">{{ estagio }}</p>
          }

          <!-- TODO: falta o endpoint de favoritos — quem usa o cartão ainda não liga
               o output guardarSolicitado, o coração é só a afordância do mockup. -->
          <button
            type="button"
            class="ml-auto text-gray-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            [attr.aria-label]="rotuloGuardar()"
            (click)="guardarSolicitado.emit(projecto())"
          >
            <app-icone nome="heart" [tamanho]="18" />
          </button>
        </footer>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoProjectoInovadorComponent {
  readonly projecto = input.required<ProjectoInovadorCartao>();
  /** `simples` é o cartão de uma coluna; `destaque` é o cartão largo com fotografia. */
  readonly formato = input<FormatoCartaoProjectoInovador>('simples');

  readonly guardarSolicitado = output<ProjectoInovadorCartao>();

  private readonly traducao = inject(TraducaoService);

  protected readonly percentagem = computed(() => this.projecto().percentagemMeta);

  protected readonly textoMeta = computed(() => {
    const meta = this.projecto().metaFinanciamento;
    if (meta === undefined) return undefined;
    const compacta = this.metaCompacta(meta);
    return this.traducao.getTraducao([`Buscando ${compacta}`, `Seeking ${compacta}`]);
  });

  protected readonly textoPercentagem = computed(() => {
    const valor = this.percentagem();
    if (valor === undefined) return undefined;
    const parte = new Intl.NumberFormat(this.localeCorrente(), { style: 'percent' }).format(
      valor / 100,
    );
    return this.traducao.getTraducao([`${parte} Meta atingida`, `${parte} of goal reached`]);
  });

  protected readonly textoEstagio = computed(() => {
    const estagio = this.projecto().estagio;
    if (!estagio) return undefined;
    return this.traducao.getTraducao([`Estágio: ${estagio}`, `Stage: ${estagio}`]);
  });

  protected readonly textoApoiar = computed(() =>
    this.traducao.getTraducao(['Apoiar Projecto', 'Support Project']),
  );

  protected readonly rotuloProgresso = computed(() =>
    this.traducao.getTraducao(['Progresso do financiamento', 'Funding progress']),
  );

  protected readonly rotuloGuardar = computed(() =>
    this.traducao.getTraducao(['Guardar projecto', 'Save project']),
  );

  private localeCorrente(): string {
    return this.traducao.idioma() === 'en' ? 'en-US' : 'pt-PT';
  }

  /**
   * "$120k" — o `en-US` é fixo de propósito: em `pt` a notação compacta com moeda
   * dá "120 mil US$", que não é o formato curto que a pílula do mockup mostra. O
   * símbolo continua a vir do `Intl` a partir da `moeda`, nunca escrito à mão.
   */
  private metaCompacta(valor: number): string {
    const formatado = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.projecto().moeda ?? 'USD',
      currencyDisplay: 'narrowSymbol',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(valor);

    return formatado.replace(/[KMBT]/g, (letra) => letra.toLowerCase());
  }
}
