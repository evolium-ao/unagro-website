import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

interface ServicoBruto {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const SERVICOS_BRUTOS: ServicoBruto[] = [
  {
    icone: 'rocket',
    titulo: { pt: 'Incubação de projetos', en: 'Project incubation' },
    descricao: {
      pt: 'Acompanhamento de ideias com potencial de negócio no sector agropecuário.',
      en: 'Support for ideas with business potential in the agricultural sector.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Mentoria', en: 'Mentoring' },
    descricao: {
      pt: 'Orientação por docentes, investigadores e profissionais do sector.',
      en: 'Guidance from faculty, researchers and sector professionals.',
    },
  },
  {
    icone: 'flask-conical',
    titulo: { pt: 'Acesso a laboratórios', en: 'Access to laboratories' },
    descricao: {
      pt: 'Utilização de infraestruturas da universidade para testar e validar soluções.',
      en: 'Use of university facilities to test and validate solutions.',
    },
  },
  {
    icone: 'briefcase',
    titulo: { pt: 'Ligação ao mercado', en: 'Market connection' },
    descricao: {
      pt: 'Contacto com empresas, cooperativas e parceiros institucionais do sector.',
      en: 'Contact with companies, cooperatives and institutional partners in the sector.',
    },
  },
];

@Component({
  selector: 'app-hub-unagro',
  imports: [IconeComponent, EspacoImagemComponent, BotaoComponent],
  templateUrl: './hub-unagro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubUnagroComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly servicos = computed(() =>
    localizarProfundo(SERVICOS_BRUTOS, this.traducao.idioma()),
  );
}
