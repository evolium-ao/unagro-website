import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

@Component({
  selector: 'app-registo',
  imports: [RouterLink, IconeComponent],
  template: `
    <section class="flex flex-1 items-center justify-center px-4 py-24 sm:px-6">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm sm:p-10">
        <div
          class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <app-icone nome="id-card" [tamanho]="22" />
        </div>

        <h1 class="text-2xl font-bold text-text-primary">
          {{ traducao.getTraducao(['Criar conta', 'Create account']) }}
        </h1>
        <p class="mt-2 text-sm text-text-secondary">
          {{
            traducao.getTraducao([
              'Cria a tua conta UNAGRO para te candidatares aos cursos e acompanhares o processo.',
              'Create your UNAGRO account to apply for courses and follow the process.',
            ])
          }}
        </p>

        <p class="mt-8 text-sm text-text-secondary">
          {{ traducao.getTraducao(['Já tens conta?', 'Already have an account?']) }}
          <a
            routerLink="/entrar"
            class="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {{ traducao.getTraducao(['Entrar', 'Sign in']) }}
          </a>
        </p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistoComponent {
  protected readonly traducao = inject(TraducaoService);
}
