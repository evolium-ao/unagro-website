import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

interface ValorBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const VALORES_BRUTOS: ValorBruto[] = [
  {
    icone: 'sprout',
    titulo: { pt: 'Sustentabilidade', en: 'Sustainability' },
    descricao: {
      pt: 'Práticas agrícolas e de gestão que respeitam o ambiente e as gerações futuras.',
      en: 'Agricultural and management practices that respect the environment and future generations.',
    },
  },
  {
    icone: 'flask-conical',
    titulo: { pt: 'Rigor Científico', en: 'Scientific Rigor' },
    descricao: {
      pt: 'Investigação aplicada com metodologia sólida e resultados verificáveis.',
      en: 'Applied research with solid methodology and verifiable results.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Compromisso Comunitário', en: 'Community Commitment' },
    descricao: {
      pt: 'Trabalho lado a lado com produtores e cooperativas locais.',
      en: 'Working side by side with local farmers and cooperatives.',
    },
  },
  {
    icone: 'award',
    titulo: { pt: 'Excelência Académica', en: 'Academic Excellence' },
    descricao: {
      pt: 'Formação exigente que prepara profissionais para os desafios reais do sector.',
      en: "Demanding training that prepares professionals for the sector's real challenges.",
    },
  },
];

@Component({
  selector: 'app-sobre',
  imports: [IconeComponent, EspacoImagemComponent],
  templateUrl: './sobre.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly valores = computed(() => localizarProfundo(VALORES_BRUTOS, this.traducao.idioma()));
}
