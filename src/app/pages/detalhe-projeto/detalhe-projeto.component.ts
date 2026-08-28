import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetosService } from '../../core/servicos/projetos.service';
import { SeoService } from '../../core/seo/seo.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../../shared/componentes/selo/selo.component';

@Component({
  selector: 'app-detalhe-projeto',
  imports: [EspacoImagemComponent, SeloComponent, ReactiveFormsModule, CampoTextoComponent, BotaoComponent],
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
