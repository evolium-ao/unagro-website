import {
  ChangeDetectionStrategy,
  Component,
  Host,
  OnInit,
  Optional,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';

type ErroFnOuTexto = (form: FormGroup) => string | null | boolean;

/**
 * `primario` = moldura tracejada verde e ícone solto (por omissão);
 * `neutro` = moldura tracejada cinzenta com o ícone dentro de um círculo claro.
 */
export type TemaCampoUpload = 'primario' | 'neutro';

/**
 * Área de carregamento com moldura tracejada verde: ícone de nuvem e, assim que há
 * anexo, o nome do ficheiro logo por baixo do ícone. Aceita largar ficheiros e
 * implementa `ControlValueAccessor` — o valor do controlo é o próprio `File`.
 */
@Component({
  selector: 'app-campo-upload',
  imports: [IconeComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoUploadComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-y-1">
      @if (label()) {
        <label
          [for]="id"
          class="truncate text-[11px] font-medium uppercase tracking-[0.09em] text-text-secondary"
        >
          {{ label() }}
          @if (optional()) {
            <span class="font-normal normal-case text-[#9A9A9A]">{{ textoOpcional() }}</span>
          }
        </label>
      }

      <label
        [for]="id"
        class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors"
        [class]="classesMoldura()"
        (dragover)="aoArrastar($event, true)"
        (dragleave)="aoArrastar($event, false)"
        (drop)="aoLargar($event)"
      >
        @if (tema() === 'neutro') {
          <span
            class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-text-secondary"
          >
            <app-icone [nome]="ficheiro() ? 'file-check' : 'cloud-upload'" [tamanho]="22" />
          </span>
        } @else {
          <app-icone
            [nome]="ficheiro() ? 'file-check' : 'cloud-upload'"
            [tamanho]="34"
            class="text-primary-dark"
          />
        }

        @if (ficheiro(); as anexo) {
          <p class="mt-3 max-w-full truncate text-sm font-semibold text-primary-dark">{{ anexo.name }}</p>
          <p class="mt-1 text-xs text-text-secondary">{{ tamanhoLegivel() }} · {{ textoTrocar() }}</p>
        } @else {
          <p class="mt-4 text-sm text-text-secondary">
            <span
              class="font-semibold"
              [class]="tema() === 'neutro' ? 'text-text-primary' : 'text-primary-dark'"
              >{{ textoAcao() }}</span
            >
            {{ textoArraste() }}
          </p>
          @if (textoLimite()) {
            <p class="mt-1 text-xs text-text-secondary">{{ textoLimite() }}</p>
          }
        }

        <input
          [id]="id"
          type="file"
          class="sr-only"
          [accept]="aceita()"
          [disabled]="disabled()"
          (change)="aoEscolher($event)"
          (blur)="onTouched()"
        />
      </label>

      <span class="min-h-2 text-xs text-red-600" role="alert">{{ __erro() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoUploadComponent implements ControlValueAccessor, OnInit {
  public parentForm!: FormGroup;

  constructor(@Optional() @Host() private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    if (this.controlContainer) {
      this.parentForm = this.controlContainer.control as FormGroup;
    }
  }

  readonly label = input<string>('');
  readonly erro = input<string | null | boolean | ErroFnOuTexto>(null);
  readonly optional = input<boolean>(false);
  /** Sufixo do rótulo quando `optional` — recebe o texto já traduzido. */
  readonly textoOpcional = input<string>('(opcional)');
  readonly disabled = input<boolean>(false);
  /** Filtro nativo do seletor de ficheiros, ex.: `.pdf` ou `application/pdf`. */
  readonly aceita = input<string>('');
  readonly textoAcao = input<string>('Seleccione um arquivo');
  readonly textoArraste = input<string>('ou arraste e solte');
  readonly textoLimite = input<string>('');
  readonly textoTrocar = input<string>('Clique para trocar');
  readonly tema = input<TemaCampoUpload>('primario');

  protected readonly id = crypto.randomUUID();
  protected readonly ficheiro = signal<File | null>(null);
  private readonly aArrastar = signal(false);

  protected readonly __erro = computed(() => {
    if (typeof this.erro() === 'function') {
      return (this.erro() as ErroFnOuTexto)?.(this.parentForm);
    }
    return this.erro();
  });

  protected readonly classesMoldura = computed(() => {
    if (this.__erro()) {
      return 'border-red-400 bg-red-50/40';
    }
    if (this.tema() === 'neutro') {
      return this.aArrastar()
        ? 'border-primary bg-primary/5'
        : 'border-gray-300 bg-white hover:border-primary hover:bg-primary/5';
    }
    return this.aArrastar()
      ? 'border-primary bg-primary/10'
      : 'border-primary bg-bg-light hover:bg-primary/5';
  });

  protected readonly tamanhoLegivel = computed(() => {
    const bytes = this.ficheiro()?.size ?? 0;
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  });

  onChange = (_valor: File | null) => {};
  onTouched = () => {};

  writeValue(valor: File | null): void {
    this.ficheiro.set(valor ?? null);
  }

  registerOnChange(fn: (valor: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected aoEscolher(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.definir(input.files?.[0] ?? null);
  }

  protected aoArrastar(evento: DragEvent, ativo: boolean): void {
    if (this.disabled()) {
      return;
    }
    evento.preventDefault();
    this.aArrastar.set(ativo);
  }

  protected aoLargar(evento: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    evento.preventDefault();
    this.aArrastar.set(false);
    this.definir(evento.dataTransfer?.files?.[0] ?? null);
  }

  private definir(ficheiro: File | null): void {
    this.ficheiro.set(ficheiro);
    this.onChange(ficheiro);
    this.onTouched();
  }
}
