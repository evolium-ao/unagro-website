import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { CursosService } from '../../core/servicos/cursos.service';
import { SeoService } from '../../core/seo/seo.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AcordeaoComponent } from '../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../shared/componentes/acordeao/item-acordeao.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';

@Component({
  selector: 'app-detalhe-curso',
  imports: [AcordeaoComponent, ItemAcordeaoComponent, EspacoImagemComponent, SeloComponent],
  templateUrl: './detalhe-curso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalheCursoComponent {
  readonly id = input.required<string>();

  protected readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);
  private readonly seo = inject(SeoService);

  protected readonly curso = computed(() => this.cursosService.cursos().find((c) => c.id === this.id()));

  protected readonly totalDisciplinas = computed(() =>
    (this.curso()?.planoCurricular ?? []).reduce((total, ano) => total + ano.disciplinas.length, 0),
  );

  constructor() {
    effect(() => {
      const curso = this.curso();
      this.seo.definirTituloDinamico(curso ? curso.titulo : null);
    });
  }
}
