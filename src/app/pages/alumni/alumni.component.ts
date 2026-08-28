import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumniService } from '../../core/servicos/alumni.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { FaixaEstatisticasComponent } from '../../shared/componentes/faixa-estatisticas/faixa-estatisticas.component';

@Component({
  selector: 'app-alumni',
  imports: [FaixaEstatisticasComponent, ReactiveFormsModule, CampoTextoComponent, BotaoComponent],
  templateUrl: './alumni.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlumniComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly alumniService = inject(AlumniService);

  protected readonly historias = this.alumniService.historias;
  protected readonly estatisticasImpacto = this.alumniService.estatisticasImpacto;

  protected readonly estadoEnvio = signal<'ocioso' | 'enviando' | 'sucesso'>('ocioso');

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    valor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true }),
  });

  protected contribuir(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estadoEnvio.set('enviando');
    setTimeout(() => {
      this.estadoEnvio.set('sucesso');
      this.formulario.reset({ nome: '', email: '', valor: '', mensagem: '' });
    }, 700);
  }
}
