import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';
import { SecaoDeclaracoesComponent } from './secao-declaracoes.component';
import { SecaoDossierComponent } from './secao-dossier.component';

/**
 * Etapa 3 — Dossier & Declaração (`/candidatura-geral/etapa-3`). Os botões de
 * navegação vivem na moldura do formulário; aqui só estão os campos.
 */
@Component({
  selector: 'app-etapa-3',
  imports: [ReactiveFormsModule, SecaoDossierComponent, SecaoDeclaracoesComponent],
  templateUrl: './etapa-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa3Component {
  protected readonly estado = inject(CandidaturaGeralEstadoService);
}
