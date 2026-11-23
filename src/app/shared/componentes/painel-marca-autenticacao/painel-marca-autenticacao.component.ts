import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Meia-página de marca dos ecrãs de autenticação: fotografia de fundo coberta
 * por um véu verde, com ícone, título, subtítulo e um parágrafo, tudo centrado.
 *
 * O título aceita quebras de linha (`'Portal\ndo estudante'`) — é o texto que
 * decide onde parte, não a largura do painel.
 */
@Component({
  selector: 'app-painel-marca-autenticacao',
  host: { class: 'block' },
  template: `
    <div
      class="relative isolate flex h-full flex-col items-center justify-center overflow-hidden px-8 py-14 text-center"
    >
      <img
        [src]="imagemFundo()"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 -z-20 size-full object-cover"
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-primary/85 to-primary-dark/95"></div>

      @if (icone(); as caminhoIcone) {
        <span class="flex size-20 items-center justify-center rounded-full bg-white">
          <img [src]="caminhoIcone" alt="" aria-hidden="true" class="size-9" />
        </span>
      }

      <h2 class="mt-7 whitespace-pre-line text-2xl font-bold leading-tight text-white sm:text-[26px]">
        {{ titulo() }}
      </h2>

      @if (subtitulo()) {
        <p class="mt-3 text-sm text-white/85">{{ subtitulo() }}</p>
      }

      @if (descricao()) {
        <span class="mt-7 h-0.5 w-14 rounded-full bg-white/70"></span>
        <p class="mt-7 max-w-64 text-xs leading-relaxed text-white/70">{{ descricao() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainelMarcaAutenticacaoComponent {
  readonly imagemFundo = input.required<string>();
  readonly titulo = input.required<string>();
  /** Caminho de um SVG/PNG; sem ele o círculo não aparece. */
  readonly icone = input<string>();
  readonly subtitulo = input<string>();
  /** Quando presente, traz consigo o traço separador acima. */
  readonly descricao = input<string>();
}
