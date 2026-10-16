import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

/**
 * Rodapé próprio do módulo da candidatura docente (mockup
 * `candidatura-geral-footer.png`): gabinete da comissão instaladora e contacto
 * institucional, com a nota de direitos por baixo.
 */
@Component({
  selector: 'app-rodape-candidatura',
  imports: [IconeComponent],
  template: `
    <footer class="border-t border-white/10 bg-primary-deep px-4 pb-10 pt-16 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
              {{ textos().gabineteTitulo }}
            </p>
            <p class="mt-4 max-w-md text-sm leading-relaxed text-white/75">{{ textos().gabineteTexto }}</p>
          </div>

          <div>
            <h2 class="text-base font-semibold text-accent">{{ textos().contactoTitulo }}</h2>
            <ul class="mt-4 flex flex-col gap-3 text-sm text-white/75">
              <li>
                <a [href]="'mailto:' + email" class="inline-flex items-center gap-2.5 hover:text-white">
                  <app-icone nome="mail" [tamanho]="16" class="shrink-0" />
                  {{ email }}
                </a>
              </li>
              <li class="inline-flex items-center gap-2.5">
                <app-icone nome="map-pin" [tamanho]="16" class="shrink-0" />
                {{ textos().sede }}
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-20 border-b border-white/10 pb-1">
          <p class="max-w-4xl text-sm text-white/70">{{ textos().direitos }}</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RodapeCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly email = 'agrosophia@yahoo.com';

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      gabineteTitulo: t('Gabinete da Comissão Instaladora', 'Installation Committee Office'),
      gabineteTexto: t(
        'Formação avançada em gestão e desenvolvimento sustentável das cadeias de valor do agronegócio',
        'Advanced training in management and sustainable development of agribusiness value chains',
      ),
      contactoTitulo: t('Contacto Institucional', 'Institutional Contact'),
      sede: t('Icolo e Bengo (50km de Luanda), República de Angola', 'Icolo e Bengo (50km from Luanda), Republic of Angola'),
      direitos: t(
        '© 2026 Projecto Académico em Fase de Constituição e Credenciamento Institucional. República de Angola. Todos os direitos reservados.',
        '© 2026 Academic Project under Institutional Establishment and Accreditation. Republic of Angola. All rights reserved.',
      ),
    };
  });
}
