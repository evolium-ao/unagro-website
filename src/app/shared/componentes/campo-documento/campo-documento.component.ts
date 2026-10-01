import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';

/**
 * Anexo de um documento de um dossier: cartão com título, descrição e formatos,
 * em dois estados.
 *
 * - **vazio**: moldura tracejada centrada, ícone, botão "Selecionar" e linha de
 *   formatos. Aceita largar o ficheiro em cima;
 * - **anexado**: cartão sólido com selo "Anexado", nome e tamanho do ficheiro, e
 *   as acções Substituir e Remover.
 *
 * Implementa `ControlValueAccessor`: o valor do controlo é o próprio `File`
 * (ou `null`). Não traz texto fixo — todos os rótulos entram por input, já
 * traduzidos. Documentação e exemplos no `README.md` ao lado.
 */
@Component({
  selector: 'app-campo-documento',
  imports: [IconeComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoDocumentoComponent),
      multi: true,
    },
  ],
  host: { class: 'block' },
  template: `
    <div
      role="group"
      [attr.aria-labelledby]="id + '-titulo'"
      [attr.aria-describedby]="id + '-descricao ' + id + '-erro'"
      [attr.aria-invalid]="erro() ? true : null"
    >
      @if (ficheiro(); as anexo) {
        <div
          class="flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
          [class]="erro() ? 'border-red-400 bg-red-50/40' : 'border-gray-200 bg-[#FBF8F6]'"
        >
          <div class="flex min-w-0 items-start gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E3F1E7] text-primary">
              <app-icone [nome]="iconeAnexado()" [tamanho]="20" />
            </span>
            <div class="min-w-0">
              <p class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span [id]="id + '-titulo'" class="text-sm font-bold text-primary-deep">{{ titulo() }}</span>
                @if (obrigatorio()) {
                  <span class="text-red-600" aria-hidden="true">*</span>
                }
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-[#E3F1E7] px-2.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true"></span>
                  {{ textoAnexado() }}
                </span>
              </p>
              @if (descricao()) {
                <p [id]="id + '-descricao'" class="mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">
                  {{ descricao() }}
                </p>
              }
              <p
                class="mt-2 inline-flex max-w-full items-center gap-2 rounded bg-gray-100 px-2.5 py-1 text-xs tracking-wide text-primary-deep"
              >
                <app-icone nome="circle-check" [tamanho]="13" class="shrink-0 text-primary" />
                <span class="truncate">{{ anexo.name }}</span>
                <span class="shrink-0 text-text-secondary">({{ tamanhoLegivel() }})</span>
              </p>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2 sm:self-center">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-primary-deep transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="desativado()"
              (click)="abrirSeletor()"
            >
              <app-icone nome="rotate-cw" [tamanho]="13" />
              {{ textoSubstituir() }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="desativado()"
              (click)="remover()"
            >
              <app-icone nome="trash-2" [tamanho]="13" />
              {{ textoRemover() }}
            </button>
          </div>
        </div>
      } @else {
        <div
          class="flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors"
          [class]="classesMoldura()"
          (dragover)="aoArrastar($event, true)"
          (dragleave)="aoArrastar($event, false)"
          (drop)="aoLargar($event)"
        >
          <span class="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E9E6E3] text-primary">
            <app-icone [nome]="icone()" [tamanho]="20" />
          </span>
          <p class="mt-4 text-sm">
            <span [id]="id + '-titulo'" class="font-bold text-primary-deep">{{ titulo() }}</span>
            @if (obrigatorio()) {
              <span class="ml-1 text-red-600" aria-hidden="true">*</span>
            } @else if (rotuloOpcional()) {
              <span class="ml-1 text-[11px] text-text-secondary">{{ rotuloOpcional() }}</span>
            }
          </p>
          @if (descricao()) {
            <p [id]="id + '-descricao'" class="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              {{ descricao() }}
            </p>
          }
          <button
            type="button"
            class="mt-5 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-primary-deep shadow-sm transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            [disabled]="desativado()"
            (click)="abrirSeletor()"
          >
            <app-icone nome="paperclip" [tamanho]="15" />
            {{ textoSelecionar() }}
          </button>
          @if (textoFormatos()) {
            <p class="mt-3 text-xs tracking-wide text-text-secondary">{{ textoFormatos() }}</p>
          }
        </div>
      }

      <input
        #seletor
        type="file"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        [accept]="aceita()"
        [disabled]="desativado()"
        (change)="aoEscolher($event)"
      />

      <p [id]="id + '-erro'" class="min-h-2 pt-1 text-xs text-red-600" role="alert">{{ erro() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoDocumentoComponent implements ControlValueAccessor {
  /** Título do documento, ex.: "1. Curriculum Vitae". Obrigatório. */
  readonly titulo = input.required<string>();
  /** Texto de apoio por baixo do título. */
  readonly descricao = input<string>('');
  /** Mostra o asterisco vermelho. Não valida — a validação é do `FormControl`. */
  readonly obrigatorio = input(false, { transform: booleanAttribute });
  /** Rótulo ao lado do título quando não é obrigatório, ex.: "(Opcional)". */
  readonly rotuloOpcional = input<string>('');
  /** Ícone do estado vazio (nome de `dados-icones.ts`). */
  readonly icone = input<string>('file-up');
  /** Ícone do estado anexado. */
  readonly iconeAnexado = input<string>('file-text');
  /** Filtro nativo do seletor de ficheiros, ex.: `.pdf,application/pdf`. */
  readonly aceita = input<string>('');
  /** Rótulo do botão do estado vazio. */
  readonly textoSelecionar = input<string>('Selecionar ficheiro');
  /** Linha de formatos/limite por baixo do botão, ex.: "Formatos: PDF até 10MB". */
  readonly textoFormatos = input<string>('');
  readonly textoAnexado = input<string>('Anexado');
  readonly textoSubstituir = input<string>('Substituir');
  readonly textoRemover = input<string>('Remover');
  /** Mensagem de erro já resolvida (ver `criarErrosFormulario`). Pinta a moldura a vermelho. */
  readonly erro = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly id = `campo-documento-${crypto.randomUUID()}`;
  protected readonly ficheiro = signal<File | null>(null);
  private readonly desativadoPeloForm = signal(false);
  private readonly aArrastar = signal(false);
  private readonly seletor = viewChild.required<ElementRef<HTMLInputElement>>('seletor');

  protected readonly desativado = computed(() => this.disabled() || this.desativadoPeloForm());

  protected readonly classesMoldura = computed(() => {
    if (this.erro()) {
      return 'border-red-400 bg-red-50/40';
    }
    return this.aArrastar() ? 'border-primary bg-primary/5' : 'border-gray-300 bg-[#F6F3F1]';
  });

  protected readonly tamanhoLegivel = computed(() => formatarTamanho(this.ficheiro()?.size ?? 0));

  private onChange: (valor: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(valor: File | null): void {
    this.ficheiro.set(valor instanceof File ? valor : null);
  }

  registerOnChange(fn: (valor: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desativado: boolean): void {
    this.desativadoPeloForm.set(desativado);
  }

  protected abrirSeletor(): void {
    this.seletor().nativeElement.click();
  }

  protected remover(): void {
    this.definir(null);
  }

  protected aoEscolher(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const escolhido = campo.files?.[0] ?? null;
    // Cancelar o diálogo nativo não deve apagar o anexo que já lá estava.
    if (escolhido) {
      this.definir(escolhido);
    }
  }

  protected aoArrastar(evento: DragEvent, ativo: boolean): void {
    if (this.desativado()) {
      return;
    }
    evento.preventDefault();
    this.aArrastar.set(ativo);
  }

  protected aoLargar(evento: DragEvent): void {
    if (this.desativado()) {
      return;
    }
    evento.preventDefault();
    this.aArrastar.set(false);
    const largado = evento.dataTransfer?.files?.[0] ?? null;
    if (largado) {
      this.definir(largado);
    }
  }

  private definir(ficheiro: File | null): void {
    // Limpa o input nativo para que escolher de novo o mesmo ficheiro dispare `change`.
    this.seletor().nativeElement.value = '';
    this.ficheiro.set(ficheiro);
    this.onChange(ficheiro);
    this.onTouched();
  }
}

/** "3.4 MB" / "820 KB" — o mesmo formato do cartão e da revisão da etapa 4. */
export function formatarTamanho(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
