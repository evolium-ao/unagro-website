import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';
import { SecaoExperienciaComponent } from './secao-experiencia.component';
import { SecaoFormacaoAcademicaComponent } from './secao-formacao-academica.component';

/**
 * Etapa 2 — Formação & Experiência (`/candidatura-geral/etapa-2`). Os botões de
 * navegação vivem na moldura do formulário; aqui só estão os campos.
 */
@Component({
  selector: 'app-etapa-2',
  imports: [ReactiveFormsModule, SecaoFormacaoAcademicaComponent, SecaoExperienciaComponent],
  templateUrl: './etapa-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa2Component {
  protected readonly estado = inject(CandidaturaGeralEstadoService);
}
