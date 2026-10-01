import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { CandidaturaGeralEstadoService } from '../../estado/candidatura-geral-estado.service';
import { SecaoAreaCandidaturaComponent } from './secao-area-candidatura.component';
import { SecaoDadosPessoaisComponent } from './secao-dados-pessoais.component';

/**
 * Etapa 1 — Dados & Área (`/candidatura-geral/etapa-1`). Os botões de navegação
 * vivem na moldura do formulário; aqui só estão os campos.
 */
@Component({
  selector: 'app-etapa-1',
  imports: [ReactiveFormsModule, SecaoDadosPessoaisComponent, SecaoAreaCandidaturaComponent],
  templateUrl: './etapa-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etapa1Component {
  protected readonly estado = inject(CandidaturaGeralEstadoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly rota = inject(ActivatedRoute);

  constructor() {
    this.preencherVindoDaTelaInicial();
  }

  /**
   * O cartão "Submeter perfil" da tela inicial traz a área em `?area=`. É uma
   * escolha explícita acabada de fazer, por isso sobrepõe-se à do rascunho.
   */
  private preencherVindoDaTelaInicial(): void {
    const idArea = this.rota.snapshot.queryParamMap.get('area');
    if (idArea && this.conteudo.areas().some((opcao) => opcao.id === idArea)) {
      this.estado.dados.controls.area.setValue(idArea);
    }
  }
}
