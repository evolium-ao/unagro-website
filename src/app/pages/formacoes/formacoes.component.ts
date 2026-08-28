import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursosService } from '../../core/servicos/cursos.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CampoTextoComponent } from '../../shared/componentes/campo-texto/campo-texto.component';
import { CartaoCursoComponent } from '../../shared/componentes/cartao-curso/cartao-curso.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';

type EstadoValidacao = 'ocioso' | 'validando' | 'valido' | 'invalido';

interface VantagemBruta {
  icone: string;
  titulo: TextoTraduzido;
  descricao: TextoTraduzido;
}

const VANTAGENS_BRUTAS: VantagemBruta[] = [
  {
    icone: 'badge-check',
    titulo: { pt: 'Certificado Reconhecido', en: 'Recognized Certificate' },
    descricao: {
      pt: 'Emitido pela UNAGRO e validável publicamente por qualquer entidade empregadora.',
      en: 'Issued by UNAGRO and publicly verifiable by any employer.',
    },
  },
  {
    icone: 'clock',
    titulo: { pt: 'Formato Flexível', en: 'Flexible Format' },
    descricao: {
      pt: 'Cursos de curta duração compatíveis com a vida profissional.',
      en: 'Short courses compatible with working life.',
    },
  },
  {
    icone: 'users',
    titulo: { pt: 'Docentes Especializados', en: 'Specialized Instructors' },
    descricao: {
      pt: 'Formação ministrada por docentes e investigadores das faculdades da UNAGRO.',
      en: "Training delivered by UNAGRO's own faculty and researchers.",
    },
  },
  {
    icone: 'award',
    titulo: { pt: 'Progressão de Carreira', en: 'Career Progression' },
    descricao: {
      pt: 'Competências práticas valorizadas por empregadores do sector agropecuário.',
      en: 'Practical skills valued by employers in the agricultural sector.',
    },
  },
];

@Component({
  selector: 'app-formacoes',
  imports: [CartaoCursoComponent, IconeComponent, ReactiveFormsModule, CampoTextoComponent, BotaoComponent],
  templateUrl: './formacoes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormacoesComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);

  protected readonly cursosCurtaDuracao = this.cursosService.cursosCurtaDuracao;
  protected readonly vantagens = computed(() => localizarProfundo(VANTAGENS_BRUTAS, this.traducao.idioma()));

  protected readonly estadoValidacao = signal<EstadoValidacao>('ocioso');
  protected readonly formularioValidacao = new FormGroup({
    codigo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected validarCertificado(): void {
    if (this.formularioValidacao.invalid) {
      this.formularioValidacao.markAllAsTouched();
      return;
    }
    this.estadoValidacao.set('validando');
    const codigo = this.formularioValidacao.controls.codigo.value.trim().toUpperCase();
    setTimeout(() => {
      this.estadoValidacao.set(codigo.startsWith('UNAGRO-') ? 'valido' : 'invalido');
    }, 600);
  }
}
