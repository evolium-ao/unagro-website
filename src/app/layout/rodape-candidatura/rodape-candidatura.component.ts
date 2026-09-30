import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

interface LigacaoRodapeCandidatura {
  texto: string;
  /** Rota interna; o que vier depois de `#` é o fragmento. Sem rota, fica só texto. */
  link?: string;
}

/**
 * Rodapé próprio do módulo da candidatura docente (mockup
 * `candidatura-tela-inicio.png`): gabinete de instalação, contactos
 * institucionais e documentos do edital, com a faixa de direitos por baixo.
 */
@Component({
  selector: 'app-rodape-candidatura',
  imports: [RouterLink, IconeComponent],
  template: `
    <footer class="bg-primary-deep px-4 pb-10 pt-14 text-white sm:px-6 lg:px-8 mt-20">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-10 md:grid-cols-[1.4fr_1.2fr_1fr] md:gap-14">
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
                  <app-icone nome="mail" [tamanho]="16" class="shrink-0 text-accent" />
                  {{ email }}
                </a>
              </li>
              <li class="inline-flex items-center gap-2.5">
                <app-icone nome="phone" [tamanho]="16" class="shrink-0 text-accent" />
                <span>
                  @for (telefone of telefones; track telefone; let ultimo = $last) {
                    <a [href]="'tel:' + telefone.replaceAll(' ', '')" class="hover:text-white">{{ telefone }}</a>
                    @if (!ultimo) {
                      <span aria-hidden="true"> / </span>
                    }
                  }
                </span>
              </li>
              <li class="inline-flex items-center gap-2.5">
                <app-icone nome="map-pin" [tamanho]="16" class="shrink-0 text-accent" />
                {{ textos().sede }}
              </li>
            </ul>
          </div>

          <nav [attr.aria-label]="textos().documentosTitulo">
            <h2 class="text-base font-semibold text-accent">{{ textos().documentosTitulo }}</h2>
            <ul class="mt-4 flex flex-col gap-3 text-sm text-white">
              @for (ligacao of documentos(); track ligacao.texto) {
                <li>
                  @if (ligacao.link; as destino) {
                    <a
                      [routerLink]="destino.split('#')[0]"
                      [fragment]="destino.split('#')[1]"
                      class="hover:text-white"
                      >{{ ligacao.texto }}</a
                    >
                  } @else {
                    <span>{{ ligacao.texto }}</span>
                  }
                </li>
              } @empty {
                <li>—</li>
              }
            </ul>
          </nav>
        </div>

        <div
          class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/70 md:flex-row md:items-center md:justify-between"
        >
          <p class="max-w-3xl">{{ textos().direitos }}</p>
          <p class="text-xs font-semibold tracking-[0.06em] text-accent md:max-w-48">{{ textos().versao }}</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RodapeCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);

  protected readonly email = 'contacto@a-angola.org';
  protected readonly telefones = ['+244 923 000 000', '+244 222 000 000'];

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      gabineteTitulo: t('Gabinete de Instalação e Credenciamento', 'Installation and Accreditation Office'),
      gabineteTexto: t(
        'Iniciativa académica orientada para a investigação científica de excelência, formação avançada em gestão do agronegócio e desenvolvimento sustentável das cadeias agrárias em Angola.',
        'An academic initiative focused on excellent scientific research, advanced training in agribusiness management and the sustainable development of agricultural value chains in Angola.',
      ),
      contactoTitulo: t('Contacto Institucional', 'Institutional Contact'),
      sede: t('Sede Provisória: Luanda, República de Angola', 'Provisional Headquarters: Luanda, Republic of Angola'),
      documentosTitulo: t('Documentos & Termos', 'Documents & Terms'),
      direitos: t(
        '© 2026 Projecto Académico em Fase de Constituição e Credenciamento Institucional. República de Angola. Todos os direitos reservados.',
        '© 2026 Academic Project under Institutional Establishment and Accreditation. Republic of Angola. All rights reserved.',
      ),
      versao: t('Versão Provisória do Edital 01/2026', 'Provisional Version of Call 01/2026'),
    };
  });

  // TODO: as restantes entradas ainda não têm página; ficam como texto até existirem.
  protected readonly documentos = computed<LigacaoRodapeCandidatura[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return [
      { texto: t('Termos de Referência', 'Terms of Reference'), link: '/candidatura-geral#secao-areas' },
      { texto: t('Declaração Provisória', 'Provisional Statement') },
      { texto: t('Política de Privacidade', 'Privacy Policy') },
      { texto: t('Transparência Jurídica', 'Legal Transparency') },
      { texto: t('Gabinete de Instalação', 'Installation Office') },
    ];
  });
}
