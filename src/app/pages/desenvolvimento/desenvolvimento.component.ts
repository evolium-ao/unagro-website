import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

interface EixoBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const EIXOS_BRUTOS: EixoBruto[] = [
  {
    icone: 'flask-conical',
    titulo: { pt: 'Investigação aplicada', en: 'Applied research' },
    descricao: {
      pt: 'Estudos orientados para problemas concretos da produção agropecuária nacional.',
      en: 'Studies aimed at concrete problems in national agricultural production.',
    },
  },
  {
    icone: 'sprout',
    titulo: { pt: 'Extensão rural', en: 'Rural outreach' },
    descricao: {
      pt: 'Trabalho de campo com produtores e cooperativas para levar conhecimento à prática.',
      en: 'Fieldwork with farmers and cooperatives to bring knowledge into practice.',
    },
  },
  {
    icone: 'rocket',
    titulo: { pt: 'Transferência de tecnologia', en: 'Technology transfer' },
    descricao: {
      pt: 'Passagem de resultados de investigação para soluções utilizáveis no terreno.',
      en: 'Turning research results into solutions usable in the field.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Parcerias', en: 'Partnerships' },
    descricao: {
      pt: 'Colaboração com instituições, empresas e comunidades do sector.',
      en: 'Collaboration with institutions, companies and communities in the sector.',
    },
  },
];

@Component({
  selector: 'app-desenvolvimento',
  imports: [IconeComponent, EspacoImagemComponent],
  templateUrl: './desenvolvimento.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesenvolvimentoComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly eixos = computed(() =>
    localizarProfundo(EIXOS_BRUTOS, this.traducao.idioma()),
  );
}
