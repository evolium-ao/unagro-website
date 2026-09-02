import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetosService } from '../../core/servicos/projetos.service';
import { SeoService } from '../../core/seo/seo.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent, MetadadoBanner } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';

@Component({
  selector: 'app-detalhe-projeto',
  imports: [
    EspacoImagemComponent,
    ReactiveFormsModule,
    CampoTextoComponent,
    BotaoComponent,
    SeloComponent,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
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
  protected readonly imagensGaleria = computed(() =>
    Array.from({ length: this.projeto()?.numeroImagensGaleria ?? 0 }, (_, indice) => indice),
  );

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
      { icone: 'sprout', texto: projeto.categoria },
    ];
  });

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
