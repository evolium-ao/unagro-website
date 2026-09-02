import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { ContainerBannerFaixaEstatisticaComponent } from '../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { OpcaoSeletor, SeletorComponent } from '../../shared/componentes/seletor/seletor.component';

type EstadoEnvio = 'ocioso' | 'enviando' | 'sucesso' | 'erro';

@Component({
  selector: 'app-contactos',
  imports: [
    ReactiveFormsModule,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
  ],
  templateUrl: './contactos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactosComponent {
  protected readonly traducao = inject(TraducaoService);

  protected readonly estadoEnvio = signal<EstadoEnvio>('ocioso');

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Entre em', 'Get in']),
  );

  protected readonly tituloDestaqueHero = computed(() =>
    this.traducao.getTraducao(['Contacto', 'Touch']),
  );

  protected readonly tituloFimHero = computed(() =>
    this.traducao.getTraducao(['com a Excelência', 'with Excellence']),
  );

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Estamos aqui para apoiar a sua jornada académica e profissional no agronegócio. Escolha o canal mais adequado à sua necessidade.',
      'We are here to support your academic and professional journey in agribusiness. Choose the channel that best suits your needs.',
    ]),
  );

  protected readonly opcoesAssunto = computed<OpcaoSeletor[]>(() => [
    { valor: 'geral', rotulo: this.traducao.t('paginas.contactos.assuntoGeral') },
    { valor: 'candidaturas', rotulo: this.traducao.t('paginas.contactos.assuntoCandidaturas') },
    { valor: 'cursos', rotulo: this.traducao.t('paginas.contactos.assuntoCursos') },
    { valor: 'imprensa', rotulo: this.traducao.t('paginas.contactos.assuntoImprensa') },
  ]);

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    assunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estadoEnvio.set('enviando');
    setTimeout(() => {
      this.estadoEnvio.set('sucesso');
      this.formulario.reset({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 700);
  }
}
