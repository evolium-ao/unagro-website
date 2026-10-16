import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';
import { SecaoAreaCandidaturaComponent } from './secao-area-candidatura.component';
import { SecaoDadosPessoaisComponent } from './secao-dados-pessoais.component';

/**
 * Etapa 1 — Dados & Disciplinas (`/candidatura-geral/etapa-1`). Os botões de
 * navegação vivem na moldura do formulário; aqui só estão os campos.
 */
@Component({
  selector: 'app-etapa-1',
  imports: [ReactiveFormsModule, SecaoDadosPessoaisComponent, SecaoAreaCandidaturaComponent],
  templateUrl: './etapa-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa1Component {
  protected readonly estado = inject(CandidaturaGeralEstadoService);
  private readonly rota = inject(ActivatedRoute);

  constructor() {
    this.preencherVindoDaTelaInicial();
  }

  /**
   * O «Confirmar Seleção» da página inicial traz as disciplinas em
   * `?disciplinas=id1,id2`; o estado valida-as e sobrepõe-nas às do rascunho.
   */
  private preencherVindoDaTelaInicial(): void {
    const ids = this.rota.snapshot.queryParamMap.get('disciplinas');
    if (ids) {
      this.estado.preencherDisciplinas(ids.split(','));
    }
  }
}
