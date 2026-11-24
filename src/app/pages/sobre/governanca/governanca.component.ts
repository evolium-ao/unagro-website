import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { SobreConteudoEmPreparacaoComponent } from '../conteudo-em-preparacao/conteudo-em-preparacao.component';

/**
 * Aba "Governança" de `/sobre`.
 *
 * TODO: falta o conteúdo. Este item do submenu não tinha modal na proposta do cliente, e
 * governança é matéria oficial — regulamentos, estatutos, políticas, prestação de contas.
 * Nada disso se escreve por aproximação, por isso a aba mostra o
 * `app-sobre-conteudo-em-preparacao` em vez de texto inventado. Quem tiver os documentos
 * substitui o componente pelo conteúdo real.
 *
 * Nota: a liderança e o organograma, que muitas vezes se esperam aqui, já estão nas abas
 * "Orgãos de gestão" e "Estrutura organizacional" — esta aba fica para os documentos.
 */
@Component({
  selector: 'app-sobre-governanca',
  imports: [SobreConteudoEmPreparacaoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-sobre-conteudo-em-preparacao
      icone="landmark"
      [titulo]="textos().titulo"
      [descricao]="textos().descricao"
    />
  `,
})
export class SobreGovernancaComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly textos = computed(() => ({
    titulo: this.traducao.getTraducao(['Governança', 'Governance']),
    descricao: this.traducao.getTraducao([
      'Esta secção vai reunir os estatutos, regulamentos e políticas que regem a UNAGRO.',
      'This section will bring together the statutes, regulations and policies that govern UNAGRO.',
    ]),
  }));
}
