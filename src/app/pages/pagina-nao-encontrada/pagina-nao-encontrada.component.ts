import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [BotaoComponent, IconeComponent],
  template: `
    <section class="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <app-icone nome="search" [tamanho]="28" />
      </div>
      <h1 class="text-2xl font-bold text-text-primary sm:text-3xl">404</h1>
      <p class="text-lg font-medium text-text-primary">{{ traducao.t('rotas.naoEncontrada.titulo') }}</p>
      <p class="text-text-secondary">{{ traducao.t('rotas.naoEncontrada.descricao') }}</p>
      <app-botao variante="primario" link="/" class="mt-2">{{ traducao.t('comum.voltarInicio') }}</app-botao>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaNaoEncontradaComponent {
  protected readonly traducao = inject(TraducaoService);
}
