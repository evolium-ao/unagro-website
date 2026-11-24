import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocenciaService } from '../../core/servicos/docencia.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ItemRequisitoComponent } from '../../shared/componentes/item-requisito/item-requisito.component';
import { PainelLateralComponent } from '../../shared/componentes/painel-lateral/painel-lateral.component';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { FaixaEstatisticasComponent } from "../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component";
import { FormularioDocenteComponent } from './formulario/formulario-docente.component';

@Component({
  selector: 'app-candidatura-docentes',
  imports: [
    BannerDestaqueComponent,
    ContainerPaginaComponent,
    CartaoRecursoComponent,
    ItemRequisitoComponent,
    PainelLateralComponent,
    IconeComponent,
    RouterLink,
    FaixaEstatisticasComponent,
    FormularioDocenteComponent,
  ],
  templateUrl: './candidatura-docentes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidaturaDocentesComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly docencia = inject(DocenciaService);

  protected readonly vantagens = this.docencia.vantagens;
  protected readonly requisitos = this.docencia.requisitos;
  private readonly estatisticasService = inject(EstatisticasService);
  protected readonly estatisticas = this.estatisticasService.institucionais;
  protected readonly selosHero = computed(() => [
    this.traducao.t('paginas.candidaturaDocentes.heroSelo'),
  ]);

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/candidaturas/docentes#secao-formulario',
      texto: this.traducao.t('paginas.candidaturaDocentes.heroCtaCandidatar'),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
    {
      link: '/candidaturas/docentes#secao-requisitos',
      texto: this.traducao.t('paginas.candidaturaDocentes.heroCtaBrochura'),
      variante: 'glass',
    },
  ]);
}
