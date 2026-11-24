import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CandidaturasService } from '../../core/servicos/candidaturas.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoApoioComponent } from '../../shared/componentes/cartao-apoio/cartao-apoio.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { ItemRequisitoComponent } from '../../shared/componentes/item-requisito/item-requisito.component';
import { PainelLateralComponent } from '../../shared/componentes/painel-lateral/painel-lateral.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';
import { FormularioInscricaoComponent } from './formulario/formulario-inscricao.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import {
  BannerDestaqueComponent,
  CtaBannerDestaque,
} from '../../shared/componentes/banner-destaque/banner-destaque.component';

@Component({
  selector: 'app-inscricao',
  imports: [
    ContainerPaginaComponent,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    CabecalhoSecaoComponent,
    FormularioInscricaoComponent,
    PainelLateralComponent,
    ItemRequisitoComponent,
    CartaoApoioComponent,
    BotaoComponent,
    IconeComponent,
    RevelarAoScrollDirective,
    RouterLink,
  ],
  templateUrl: './inscricao.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InscricaoComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly candidaturas = inject(CandidaturasService);

  protected readonly requisitosGerais = this.candidaturas.requisitosGeraisInscricao;

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Estude na UNAGRO', 'Study at UNAGRO']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'A Universidade de Agronomia está com portas abertas para a próxima geração de líderes rurais. Junte-se a um ecossistema de excelência e inovação tecnológica voltada para a sustentabilidade e o agronegócio global.',
      'The University of Agronomy has opened its doors to the next generation of rural leaders. Join an ecosystem of excellence and technological innovation focused on sustainability and global agribusiness.',
    ]),
  );

  protected readonly selosHero = computed(() => [
    this.traducao.getTraducao(['PROCESSO SELECTIVO 2026', '2026 ADMISSIONS CYCLE']),
  ]);

  protected readonly ctasHero = computed<CtaBannerDestaque[]>(() => [
    {
      link: '/candidaturas/estudantes#secao-formulario',
      texto: this.traducao.getTraducao(['Candidatar-me', 'Apply now']),
      variante: 'branco',
      icone: 'arrow-right',
      posicaoIcone: 'direita',
    },
    {
      // TODO: apontar para o PDF da brochura assim que o ficheiro/rota existir.
      link: '/candidaturas/estudantes#secao-formulario',
      texto: this.traducao.getTraducao(['Baixar a brochura em PDF', 'Download the PDF brochure']),
      variante: 'glass',
    },
  ]);

  protected readonly tituloFormulario = computed(() =>
    this.traducao.getTraducao(['Inicie a sua Candidatura', 'Start your Application']),
  );

  protected readonly descricaoFormulario = computed(() =>
    this.traducao.getTraducao([
      'Preencha o formulário abaixo para submeter o seu perfil para análise inicial.',
      'Fill in the form below to submit your profile for initial review.',
    ]),
  );

  protected readonly tituloRequisitos = computed(() =>
    this.traducao.getTraducao(['Requisitos Gerais', 'General Requirements']),
  );

  protected readonly textoSemRequisitos = computed(() =>
    this.traducao.getTraducao([
      'Os requisitos de admissão serão publicados em breve.',
      'The admission requirements will be published soon.',
    ]),
  );

  protected readonly textoDuvidas = computed(() =>
    this.traducao.getTraducao(['Dúvidas sobre o processo?', 'Questions about the process?']),
  );

  protected readonly textoLinkApoio = computed(() =>
    this.traducao.getTraducao(['Contacte o Apoio Académico', 'Contact Academic Support']),
  );

  protected readonly tituloAjuda = computed(() =>
    this.traducao.getTraducao(['Precisa de Ajuda?', 'Need Help?']),
  );

  protected readonly descricaoAjuda = computed(() =>
    this.traducao.getTraducao([
      'A nossa equipa de admissões está disponível para o orientar durante todo o processo selectivo.',
      'Our admissions team is available to guide you throughout the selection process.',
    ]),
  );

  protected readonly textoBotaoAjuda = computed(() =>
    this.traducao.getTraducao(['Falar com o consultor', 'Talk to an adviser']),
  );
}
