import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CandidaturasService } from '../../core/servicos/candidaturas.service';
import { PerguntasFrequentesService } from '../../core/servicos/perguntas-frequentes.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { AcordeaoComponent } from '../../shared/componentes/acordeao/acordeao.component';
import { ItemAcordeaoComponent } from '../../shared/componentes/acordeao/item-acordeao.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { IndicadorPassosComponent } from '../../shared/componentes/indicador-passos/indicador-passos.component';

const REQUISITOS_BRUTOS: TextoTraduzido[] = [
  { pt: 'Certificado de conclusão do ensino médio', en: 'High school completion certificate' },
  { pt: 'Bilhete de identidade válido', en: 'Valid national ID card' },
  { pt: '2 fotografias tipo passe', en: '2 passport-style photographs' },
  { pt: 'Comprovativo de pagamento da taxa de candidatura', en: 'Proof of application fee payment' },
  { pt: 'Aprovação no exame de admissão', en: 'Admission exam approval' },
];

@Component({
  selector: 'app-candidaturas',
  imports: [IndicadorPassosComponent, AcordeaoComponent, ItemAcordeaoComponent, IconeComponent],
  templateUrl: './candidaturas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidaturasComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly candidaturasService = inject(CandidaturasService);
  private readonly faqService = inject(PerguntasFrequentesService);

  protected readonly passos = this.candidaturasService.passos;
  protected readonly bolsas = this.candidaturasService.bolsas;
  protected readonly calendario = this.candidaturasService.calendario;
  protected readonly perguntas = this.faqService.perguntas;

  protected readonly requisitos = computed(() => localizarProfundo(REQUISITOS_BRUTOS, this.traducao.idioma()));
}
