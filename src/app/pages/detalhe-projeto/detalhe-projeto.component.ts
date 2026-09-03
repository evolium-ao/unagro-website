import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetosService } from '../../core/servicos/projetos.service';
import { SeoService } from '../../core/seo/seo.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent, MetadadoBanner } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import { CartaoApoioComponent } from '../../shared/componentes/cartao-apoio/cartao-apoio.component';
import { CartaoRecursoComponent } from '../../shared/componentes/cartao-recurso/cartao-recurso.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { EtapaCronogramaComponent } from '../../shared/componentes/etapa-cronograma/etapa-cronograma.component';
import { GaleriaMosaicoComponent } from '../../shared/componentes/galeria-mosaico/galeria-mosaico.component';
import { ItemEstatisticaComponent } from '../../shared/componentes/item-estatistica/item-estatistica.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

@Component({
  selector: 'app-detalhe-projeto',
  imports: [
    EspacoImagemComponent,
    ReactiveFormsModule,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    ContainerPaginaComponent,
    CabecalhoSecaoComponent,
    CartaoApoioComponent,
    CartaoRecursoComponent,
    ItemEstatisticaComponent,
    EtapaCronogramaComponent,
    GaleriaMosaicoComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './detalhe-projeto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalheProjetoComponent {
  readonly id = input.required<string>();

  protected readonly traducao = inject(TraducaoService);
  private readonly projetosService = inject(ProjetosService);
  private readonly seo = inject(SeoService);

  protected readonly projeto = computed(() => this.projetosService.projetos().find((p) => p.id === this.id()));

  /** Os selos e metadados do hero são dados do projecto, não frases fixas da página. */
  protected readonly selosHero = computed(() => {
    const estado = this.projeto()?.estado;
    return estado ? [estado] : [];
  });

  protected readonly metadadosHero = computed<MetadadoBanner[]>(() => {
    const projeto = this.projeto();
    if (!projeto) {
      return [];
    }
    return [
      { icone: 'map-pin', texto: projeto.local },
      { icone: 'calendar', texto: projeto.periodo },
      { icone: 'sprout', texto: projeto.areaTematica },
    ];
  });

  /** Rótulos fixos da secção de contexto — o conteúdo em si vem já traduzido do serviço. */
  protected readonly tituloContexto = computed(() =>
    this.traducao.getTraducao(['Contexto e Desafio', 'Context and Challenge']),
  );
  protected readonly legendaImagemContexto = computed(() =>
    this.traducao.getTraducao(['Fotografia do projecto', 'Project photograph']),
  );

  /** Rótulos fixos da secção de objectivos — os objectivos em si vêm do projecto. */
  protected readonly tituloObjetivos = computed(() =>
    this.traducao.getTraducao(['Objetivos do Projecto', 'Project Objectives']),
  );
  protected readonly tituloObjetivoGeral = computed(() =>
    this.traducao.getTraducao(['Objetivo Geral', 'Overall Objective']),
  );

  /** Rótulo fixo da secção da solução — os componentes dela vêm do projecto. */
  protected readonly tituloSolucao = computed(() =>
    this.traducao.getTraducao(['Solução Implementada', 'Implemented Solution']),
  );

  /** Rótulo fixo da secção do cronograma — as etapas em si vêm do projecto. */
  protected readonly tituloCronograma = computed(() =>
    this.traducao.getTraducao(['Cronograma do Projecto', 'Project Timeline']),
  );

  /** Rótulo fixo da secção da galeria — as fotografias e legendas vêm do projecto. */
  protected readonly tituloGaleria = computed(() =>
    this.traducao.getTraducao(['Galeria Multimédia', 'Media Gallery']),
  );

  protected readonly estadoEnvio = signal<'ocioso' | 'enviando' | 'sucesso'>('ocioso');
  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    mensagem: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const projeto = this.projeto();
      this.seo.definirTituloDinamico(projeto ? projeto.titulo : null);
    });
  }

  protected enviarMensagem(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estadoEnvio.set('enviando');
    setTimeout(() => {
      this.estadoEnvio.set('sucesso');
      this.formulario.reset({ nome: '', email: '', mensagem: '' });
    }, 700);
  }
}
