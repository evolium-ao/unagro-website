import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import {
  COLUNAS_RODAPE,
  CONTACTOS_RODAPE,
  LEGAIS_RODAPE,
  REDES_SOCIAIS_RODAPE,
} from './rodape.config';

@Component({
  selector: 'app-rodape',
  imports: [RouterLink, IconeComponent],
  templateUrl: './rodape.component.html',
})
export class RodapeComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly anoAtual = new Date().getFullYear();

  protected readonly colunas = COLUNAS_RODAPE;
  protected readonly contactos = CONTACTOS_RODAPE;
  protected readonly redesSociais = REDES_SOCIAIS_RODAPE;
  protected readonly legais = LEGAIS_RODAPE;
}
