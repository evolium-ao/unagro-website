import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IntranetService } from '../../core/servicos/intranet.service';
import { NoticiasService } from '../../core/servicos/noticias.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CartaoNoticiaComponent } from '../../shared/componentes/cartao-noticia/cartao-noticia.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

@Component({
  selector: 'app-estudantes',
  imports: [BotaoComponent, IconeComponent, CartaoNoticiaComponent],
  templateUrl: './estudantes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstudantesComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly intranetService = inject(IntranetService);
  private readonly noticiasService = inject(NoticiasService);

  protected readonly avisos = this.intranetService.avisos;
  protected readonly noticiasAcademicas = this.noticiasService.academicas;

  protected readonly mostrarAvisoAcesso = signal(false);

  protected tentarAceder(): void {
    this.mostrarAvisoAcesso.set(true);
  }
}
