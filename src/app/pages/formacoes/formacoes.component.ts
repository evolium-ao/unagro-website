import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursosService } from '../../core/servicos/cursos.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";

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
  imports: [ReactiveFormsModule, BannerDestaqueComponent, ContainerBannerFaixaEstatisticaComponent],
  selector: 'app-formacoes',
  templateUrl: './formacoes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormacoesComponent {
  protected readonly traducao = inject(TraducaoService);
  private readonly cursosService = inject(CursosService);
  protected readonly cursosCurtaDuracao = this.cursosService.cursosCurtaDuracao;
  protected readonly vantagens = computed(() => localizarProfundo(VANTAGENS_BRUTAS, this.traducao.idioma()));

  protected readonly tituloHero = computed(() =>
    this.traducao.getTraducao(['Centro de Formação Profissional', 'Professional Training Centre']),
  );

  protected readonly tituloDestaqueHero = computed(() => 'UNAGRO');

  protected readonly subtituloHero = computed(() =>
    this.traducao.getTraducao([
      'Capacitação Técnica e Excelência para o Agronegócio. Formando os líderes da revolução sustentável no campo.',
      'Technical training and excellence for agribusiness. Shaping the leaders of the sustainable revolution in the field.',
    ]),
  );

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
