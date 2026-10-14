import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { ModalDataService } from '../../../shared/componentes/alert-modal/modal-data.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { CampoEmFalta, ROTULOS_CAMPOS, irParaCampo } from '../estado/campos-formulario';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_CAMPOS_EM_FALTA = 'modal-campos-em-falta';

/** Um pouco mais do que a animação de saída do `AlertModalService` (300 ms). */
const ESPERA_FECHO_MODAL_MS = 320;

/** O que quem abre passa em `data`: os campos da etapa por corrigir, pela ordem da página. */
export interface DadosCamposEmFalta {
  campos: CampoEmFalta[];
}

/**
 * "Reveja o formulário" — regra geral do formulário da candidatura: ao avançar
 * com campos por preencher ou com erros, lista-os pelo nome; cada um leva ao
 * campo (desce até ele e põe-lhe o foco). Template do `AlertModalService`.
 */
@Component({
  selector: 'app-modal-campos-em-falta',
  imports: [BotaoComponent, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div class="h-2 bg-amber-400" aria-hidden="true"></div>

      <button
        type="button"
        class="absolute right-4 top-6 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-text-primary transition-colors hover:bg-gray-200 hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="18" />
      </button>

      <div class="px-5 pb-6 pt-10 sm:px-8">
        <div class="flex items-start gap-3 pr-12">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700" aria-hidden="true">
            <app-icone nome="clipboard-check" [tamanho]="20" />
          </span>
          <div>
            <h2 class="text-lg font-bold leading-tight text-primary-deep sm:text-xl">{{ textos().titulo }}</h2>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">{{ textos().mensagem }}</p>
          </div>
        </div>

        <ul class="mt-5 flex max-h-80 flex-col gap-2 overflow-y-auto">
          @for (campo of campos(); track campo.chave) {
            <li>
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                (click)="irPara(campo.chave)"
              >
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-primary-deep">{{ campo.rotulo }}</span>
                  <span class="mt-0.5 block text-xs" [class]="campo.motivo === 'vazio' ? 'text-amber-700' : 'text-red-600'">
                    {{ campo.motivo === 'vazio' ? textos().vazio : textos().invalido }}
                  </span>
                </span>
                <span class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                  {{ textos().irPara }}
                  <app-icone nome="arrow-right" [tamanho]="14" />
                </span>
              </button>
            </li>
          }
        </ul>

        <div class="mt-6 flex justify-end">
          <app-botao variante="profundo" tamanho="sm" icone="arrow-right" posicaoIcone="direita" paddingX="px-5"
            (clicado)="irParaPrimeiro()">
            {{ textos().irParaPrimeiro }}
          </app-botao>
        </div>
      </div>
    </div>
  `,
})
export class ModalCamposEmFaltaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly dados = inject(ModalDataService).obterDados<DadosCamposEmFalta>();

  protected readonly campos = computed(() => {
    const idioma = this.traducao.idioma();
    return (this.dados?.campos ?? []).map((campo) => ({
      ...campo,
      rotulo: ROTULOS_CAMPOS[campo.chave]?.[idioma] ?? campo.chave,
    }));
  });

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const n = this.campos().length;
    return {
      fechar: t('Fechar', 'Close'),
      titulo: t('Reveja o formulário', 'Review the form'),
      mensagem:
        n === 1
          ? t('Há 1 campo por preencher ou com erros:', 'There is 1 field that is empty or invalid:')
          : t(`Há ${n} campos por preencher ou com erros:`, `There are ${n} fields that are empty or invalid:`),
      vazio: t('Por preencher', 'Not filled in'),
      invalido: t('Preenchido com erro — corrija o valor', 'Invalid value — please correct it'),
      irPara: t('Ir para o campo', 'Go to field'),
      irParaPrimeiro: t('Ir para o primeiro campo', 'Go to the first field'),
    };
  });

  protected irPara(chave: string): void {
    this.fechar();
    // Depois de o modal sair (o `AlertModalService` destrói-o 300 ms após fechar):
    // com ele ainda montado, o foco ficava preso no modal e não no campo.
    setTimeout(() => irParaCampo(chave), ESPERA_FECHO_MODAL_MS);
  }

  protected irParaPrimeiro(): void {
    const primeiro = this.campos()[0];
    if (primeiro) {
      this.irPara(primeiro.chave);
    } else {
      this.fechar();
    }
  }

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_CAMPOS_EM_FALTA);
  }
}
