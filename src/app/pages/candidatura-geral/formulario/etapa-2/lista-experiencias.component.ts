import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';

/** Uma linha da lista: o que se lê de cada experiência adicionada. */
export interface ItemExperiencia {
  titulo: string;
  detalhe: string;
  tempo: string;
}

/**
 * Lista numerada das experiências já adicionadas (01, 02…, com remover) e o
 * campo desactivado "Tempo estimado de experiência na área", com a soma.
 * Comum às secções 2 (docente) e 3 (profissional) da etapa 2; segue a lista do
 * registo de disciplinas da etapa 1.
 */
@Component({
  selector: 'app-etapa-2-lista-experiencias',
  imports: [IconeComponent],
  template: `
    <div class="flex flex-col gap-5">
      <div class="rounded-2xl border bg-bg-lighter p-4 sm:p-5" [class]="erro() ? 'border-red-400' : 'border-gray-200'">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p class="text-[11px] font-bold uppercase tracking-wide text-text-primary">{{ tituloLista() }}</p>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-text-primary"
            aria-live="polite">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-deep" aria-hidden="true"></span>
            {{ itens().length }}
          </span>
        </div>

        @if (itens().length) {
          <ol class="space-y-3">
            @for (item of itens(); track $index; let i = $index) {
              <li class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-[11px] font-bold text-text-primary">
                  {{ (i + 1).toString().padStart(2, '0') }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-text-primary">{{ item.titulo }}</p>
                  <p class="mt-0.5 truncate text-[11px] text-text-secondary">{{ item.detalhe }}</p>
                </div>
                <span
                  class="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  {{ item.tempo }}
                </span>
                <button type="button"
                  class="shrink-0 rounded-md p-1.5 text-text-secondary transition hover:bg-red-50 hover:text-red-600"
                  [attr.aria-label]="textoRemover() + ' ' + item.titulo" (click)="remover.emit(i)">
                  <app-icone nome="trash-2" [tamanho]="16" />
                </button>
              </li>
            }
          </ol>
        } @else {
          <p class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-text-secondary">
            {{ textoVazio() }}
          </p>
        }

        @if (erro(); as mensagem) {
          <p class="mt-3 text-xs text-red-600" role="alert">{{ mensagem }}</p>
        }
      </div>

      <!-- Calculado a partir da lista: só leitura. -->
      <div class="flex flex-col gap-y-1">
        <label [for]="idTotal" class="truncate text-xs font-medium text-black">{{ rotuloTotal() }}</label>
        <input [id]="idTotal" type="text" disabled [value]="total() || '—'"
          class="w-full cursor-not-allowed rounded-md border border-[#E2E8F0] bg-gray-50 px-3 py-2 text-sm text-[#585959]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaExperienciasComponent {
  readonly itens = input.required<ItemExperiencia[]>();
  readonly tituloLista = input.required<string>();
  readonly textoVazio = input.required<string>();
  readonly textoRemover = input.required<string>();
  readonly rotuloTotal = input.required<string>();
  /** Soma já formatada ("De 9 a 15 anos"); vazia mostra "—". */
  readonly total = input.required<string>();
  /** Mensagem de campos por preencher ao clicar «Adicionar». */
  readonly erro = input<string | null>(null);

  readonly remover = output<number>();

  protected readonly idTotal = crypto.randomUUID();
}
