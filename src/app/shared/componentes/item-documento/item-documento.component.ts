import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DocumentoProjeto } from '../../../core/modelos/projeto.model';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { IconeComponent } from '../icone/icone.component';

/**
 * Linha de um ficheiro para descarregar: rectângulo branco de cantos arredondados
 * com borda cinzenta muito clara e, por dentro, o ícone do documento a vermelho
 * seguido do nome do ficheiro em verde escuro.
 *
 * O rectângulo **inteiro** é a área de clique quando o documento traz `url`. Sem
 * `url` desenha-se o mesmo bloco, mas não clicável — é o que evita links para
 * lado nenhum enquanto os ficheiros não existem no servidor.
 */
@Component({
  selector: 'app-item-documento',
  imports: [IconeComponent, NgTemplateOutlet],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (documento().url; as url) {
      <a
        [href]="url"
        download
        [attr.aria-label]="rotuloAcessivel()"
        class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3.5 hover:border-primary/40 hover:bg-primary/5"
      >
        <ng-container [ngTemplateOutlet]="conteudo" />
      </a>
    } @else {
      <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
        <ng-container [ngTemplateOutlet]="conteudo" />
      </div>
    }

    <ng-template #conteudo>
      <app-icone [nome]="icone()" [tamanho]="18" class="shrink-0 text-red-600" />
      <span class="text-sm font-semibold text-primary-deep">{{ documento().titulo }}</span>
    </ng-template>
  `,
})
export class ItemDocumentoComponent {
  private readonly traducao = inject(TraducaoService);

  readonly documento = input.required<DocumentoProjeto>();
  /** Nome do ícone em `dados-icones.ts`; não há ícone de PDF, por isso o padrão é o de documento. */
  readonly icone = input<string>('file-text');

  protected readonly rotuloAcessivel = computed(
    () =>
      `${this.traducao.getTraducao(['Descarregar', 'Download'])} ${this.documento().titulo}`,
  );
}
