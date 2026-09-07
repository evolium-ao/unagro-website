import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { SobreConteudoEmPreparacaoComponent } from '../conteudo-em-preparacao/conteudo-em-preparacao.component';

/**
 * Aba "Aba Unagro" de `/sobre`.
 *
 * TODO: falta o conteúdo. Este item do submenu não tinha modal na proposta do cliente e
 * o próprio rótulo ("Aba Unagro") não diz o que a secção deve mostrar — pode ser a
 * associação, um boletim ou um documento institucional. Enquanto isso não estiver
 * esclarecido, a aba mostra o `app-sobre-conteudo-em-preparacao` em vez de conteúdo
 * inventado. Para a preencher, troca-se o componente pelo conteúdo real.
 */
@Component({
  selector: 'app-sobre-aba-unagro',
  imports: [SobreConteudoEmPreparacaoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-sobre-conteudo-em-preparacao
      icone="square-text"
      [titulo]="textos().titulo"
      [descricao]="textos().descricao"
    />
  `,
})
export class SobreAbaUnagroComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Aba Unagro', 'Unagro Tab']),
    descricao: this.traducao.getTraducao([
      'Esta secção vai reunir a informação institucional da Aba Unagro.',
      'This section will bring together the institutional information for the Unagro Tab.',
    ]),
  }));
}
