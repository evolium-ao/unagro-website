import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CaminhoDicionario } from '../../core/traducao/dicionario';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AbasComponent, ItemAba } from '../../shared/componentes/abas/abas.component';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { SobreAbaUnagroComponent } from './aba-unagro/aba-unagro.component';
import { SobreCursosComponent } from './cursos/cursos.component';
import { SobreEstruturaOrganizacionalComponent } from './estrutura-organizacional/estrutura-organizacional.component';
import { SobreFaculdadesDepartamentosComponent } from './faculdades-departamentos/faculdades-departamentos.component';
import { SobreGovernancaComponent } from './governanca/governanca.component';
import { SobreNossaHistoriaComponent } from './nossa-historia/nossa-historia.component';
import { SobreOrgaosGestaoComponent } from './orgaos-gestao/orgaos-gestao.component';
import { SobrePilaresInstitucionaisComponent } from './pilares-institucionais/pilares-institucionais.component';

/** As abas de `/sobre`, na ordem do submenu que o cliente propôs. */
export type IdAbaSobre =
  | 'nossa-historia'
  | 'pilares'
  | 'orgaos-gestao'
  | 'estrutura-organizacional'
  | 'faculdades-departamentos'
  | 'cursos'
  | 'aba-unagro'
  | 'governanca';

/**
 * Os rótulos são as **mesmas** chaves do submenu (`nav.sobreMenu.*`): assim a aba e o
 * item de menu nunca dizem coisas diferentes, e voltar ao submenu
 * (`SOBRE_COM_SUBMENU_MODAIS`) não obriga a retocar textos. A aba "Cursos" não tem
 * item no submenu e usa o rótulo geral `nav.cursos`.
 *
 * "Aba UNAGRO" e "Governança" estão ocultas a pedido do cliente: os componentes e os
 * `@case` do template continuam lá, basta voltar a pôr as entradas nesta lista.
 */
const ABAS_SOBRE: readonly { id: IdAbaSobre; label: CaminhoDicionario }[] = [
  { id: 'nossa-historia', label: 'nav.sobreMenu.nossaHistoria' },
  { id: 'pilares', label: 'nav.sobreMenu.pilares' },
  { id: 'orgaos-gestao', label: 'nav.sobreMenu.orgaosGestao' },
  { id: 'estrutura-organizacional', label: 'nav.sobreMenu.estruturaOrganizacional' },
  { id: 'faculdades-departamentos', label: 'nav.sobreMenu.faculdadesDepartamentos' },
  { id: 'cursos', label: 'nav.cursos' },
  // { id: 'aba-unagro', label: 'nav.sobreMenu.abaUnagro' },
  // { id: 'governanca', label: 'nav.sobreMenu.governanca' },
];

/** Para validar o fragmento da URL (`/sobre#<id>`) antes de o usar como aba ativa. */
const IDS_ABAS_SOBRE = new Set<IdAbaSobre>(ABAS_SOBRE.map((aba) => aba.id));

/**
 * Página `/sobre` da proposta nova: banner de página (como em `/formacoes`) e, abaixo,
 * as sete abas que substituem os modais do submenu "Sobre UNAGRO". Cada aba é um
 * componente próprio em `./<aba>/`; esta página só escolhe qual mostrar.
 *
 * A implementação anterior está inteira em `./legado/sobre-legado.component.ts`.
 */
@Component({
  selector: 'app-sobre',
  imports: [
    AbasComponent,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    SobreNossaHistoriaComponent,
    SobrePilaresInstitucionaisComponent,
    SobreOrgaosGestaoComponent,
    SobreEstruturaOrganizacionalComponent,
    SobreFaculdadesDepartamentosComponent,
    SobreCursosComponent,
    SobreAbaUnagroComponent,
    SobreGovernancaComponent,
  ],
  templateUrl: './sobre.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly route = inject(ActivatedRoute);

  protected readonly abaAtiva = signal<string>(ABAS_SOBRE[0].id);

  /**
   * `/sobre#faculdades-departamentos` (por exemplo, a partir da barra do topo) abre
   * directamente nessa aba — sem isto o `switch` do template ignoraria o fragmento e
   * mostrar-se-ia sempre a primeira aba.
   */
  private readonly fragmentoUrl = toSignal(this.route.fragment);

  constructor() {
    effect(() => {
      const fragmento = this.fragmentoUrl();
      if (fragmento && IDS_ABAS_SOBRE.has(fragmento as IdAbaSobre)) {
        this.abaAtiva.set(fragmento);
      }
    });
  }

  protected readonly abas = computed<ItemAba[]>(() =>
    ABAS_SOBRE.map((aba) => ({ id: aba.id, rotulo: this.traducao.t(aba.label) })),
  );

  protected readonly tituloHero = computed(() => this.traducao.getTraducao(['Sobre a', 'About']));
  protected readonly tituloDestaqueHero = computed(() => 'UNAGRO');

  protected readonly subtituloHero = computed(() =>
    this.traducao.t('paginas.sobre.subtitulo'),
  );
}
