import { Component, inject } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { EstatisticasService } from '../../../core/servicos/estatisticas.service';
import { FaixaEstatisticasComponent } from "../faixa-estatisticas/faixa-estatisticas.component";

@Component({
  selector: 'app-container-banner-faixa-estatistica',
  imports: [FaixaEstatisticasComponent],
  templateUrl: './container-banner-faixa-estatistica.component.html',
})
export class ContainerBannerFaixaEstatisticaComponent {
  private readonly estatisticasService = inject(EstatisticasService);
  protected readonly estatisticas = this.estatisticasService.institucionais;
}
