import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraTopoComponent } from '../../shared/componentes/barra-topo/barra-topo.component';

/**
 * Moldura das páginas de autenticação (`/entrar`, `/registo`).
 *
 * Traz a barra de topo — que é onde vivem a troca de idioma e as ligações de
 * serviço —, mas não o cabeçalho nem o rodapé: sem a navegação principal, o
 * resto do ecrã pertence à página, que pode usar composições de largura e
 * altura totais (imagem de um lado, formulário do outro).
 *
 * A barra fica **dentro** do contentor `min-h-dvh`, e não acima dele: por fora,
 * a altura dela somava-se à do ecrã inteiro e a página ficava sempre mais alta
 * do que a janela, com barra de deslocamento e uma faixa vazia no fundo.
 */
@Component({
  selector: 'app-layout-autenticacao',
  imports: [RouterOutlet, BarraTopoComponent],
  template: `
    <div class="relative flex min-h-dvh flex-col bg-primary-dark">
      <app-barra-topo />

      <main class="flex flex-1 flex-col">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutAutenticacaoComponent {}
