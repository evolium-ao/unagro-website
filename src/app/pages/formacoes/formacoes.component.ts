import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursosService } from '../../core/servicos/cursos.service';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TextoTraduzido } from '../../core/traducao/texto-traduzido';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BannerDestaqueComponent } from '../../shared/componentes/banner-destaque/banner-destaque.component';
import { EstatisticasService } from '../../core/servicos/estatisticas.service';
import { ContainerBannerFaixaEstatisticaComponent } from "../../shared/componentes/container-banner-faixa-estatistica/container-banner-faixa-estatistica.component";
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CabecalhoSecaoComponent } from '../../shared/componentes/cabecalho-secao/cabecalho-secao.component';
import {
  CartaoCursoCurtaDuracaoComponent,
  CursoCurtaDuracaoCartao,
} from '../../shared/componentes/cartao-curso-curta-duracao/cartao-curso-curta-duracao.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/** Cursos de curta duração revelados de cada vez pelo botão "Ver mais". */
const CURSOS_CURTA_POR_LOTE = 3;

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
  imports: [
    ReactiveFormsModule,
    BannerDestaqueComponent,
    ContainerBannerFaixaEstatisticaComponent,
    BotaoComponent,
    CabecalhoSecaoComponent,
    CartaoCursoCurtaDuracaoComponent,
    ContainerPaginaComponent,
    RevelarAoScrollDirective,
  ],
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

  // Cursos de curta duração — a lista vem do serviço; a página só guarda quantos
  // lotes estão revelados, para trocar o mock por HTTP não mexer no template.
  protected readonly cursosCurtaPorLote = CURSOS_CURTA_POR_LOTE;
  private readonly lotesCursosCurta = signal(1);

  private readonly cartoesCursosCurta = computed<CursoCurtaDuracaoCartao[]>(() =>
    this.cursosCurtaDuracao().flatMap((curso) => {
      const { cargaHoraria, preco } = curso;
      // Sem carga horária nem preço o cartão do mockup não tem o que mostrar.
      if (cargaHoraria === undefined || preco === undefined) {
        return [];
      }
      return [
        {
          id: curso.id,
          titulo: curso.titulo,
          resumo: curso.resumo,
          cargaHoraria,
          preco,
          estadoInscricao: curso.estadoInscricao ?? 'abertas',
          proximaTurma: curso.proximaTurma,
          link: `/cursos/${curso.id}`,
          imagem: curso.imagem,
        },
      ];
    }),
  );

  protected readonly cursosCurtaVisiveis = computed(() =>
    this.cartoesCursosCurta().slice(0, this.lotesCursosCurta() * CURSOS_CURTA_POR_LOTE),
  );

  protected readonly temMaisCursosCurta = computed(
    () => this.cursosCurtaVisiveis().length < this.cartoesCursosCurta().length,
  );

  /** Com um lote ou menos não há nada a revelar nem a recolher. */
  protected readonly mostrarBotaoCursosCurta = computed(
    () => this.cartoesCursosCurta().length > CURSOS_CURTA_POR_LOTE,
  );

  protected alternarCursosCurta(): void {
    if (this.temMaisCursosCurta()) {
      this.lotesCursosCurta.update((lotes) => lotes + 1);
      return;
    }
    this.lotesCursosCurta.set(1);
  }

  protected readonly tituloCursosCurta = computed(() =>
    this.traducao.getTraducao([
      'Cursos de Curta Duração e Treinamentos Técnicos',
      'Short Courses and Technical Training',
    ]),
  );

  protected readonly descricaoCursosCurta = computed(() =>
    this.traducao.getTraducao([
      'Módulos intensivos desenhados para actualização rápida e aplicação imediata no sector produtivo.',
      'Intensive modules designed for rapid upskilling and immediate use in the productive sector.',
    ]),
  );

  protected readonly rotuloVerMaisCursosCurta = computed(() =>
    this.temMaisCursosCurta()
      ? this.traducao.getTraducao(['Ver mais', 'See more'])
      : this.traducao.getTraducao(['Ver menos', 'See less']),
  );

  protected readonly vazioCursosCurta = computed(() =>
    this.traducao.getTraducao([
      'Ainda não há cursos de curta duração com inscrições anunciadas.',
      'There are no short courses with announced enrolment yet.',
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
