import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent } from '../selo/selo.component';

/** `abertas` mostra o selo verde; `proxima-turma` mostra o selo escuro com o mês. */
export type EstadoInscricaoCurso = 'abertas' | 'proxima-turma';

/**
 * Dados de um curso de curta duração já localizados pela página. Os campos
 * numéricos chegam crus (`40`, `80250`) porque a formatação — "40 Horas",
 * "Kz 80.250,00" — depende do idioma e é responsabilidade do cartão.
 */
export interface CursoCurtaDuracaoCartao {
  id: string;
  titulo: string;
  resumo: string;
  /** Número de horas do módulo. */
  cargaHoraria: number;
  /** Valor em kwanzas. */
  preco: number;
  estadoInscricao: EstadoInscricaoCurso;
  /** Rótulo curto do mês da próxima turma, já traduzido — só conta em `proxima-turma`. */
  proximaTurma?: string;
  link: string;
  /** Sem fotografia fica o marcador cinzento do `app-espaco-imagem`. */
  imagem?: string;
}

/**
 * O ICU de `pt-PT` separa os milhares com espaço inquebrável; o mockup escreve-os
 * com ponto ("Kz 80.250,00"), por isso o separador é normalizado.
 */
function formatarPrecoKwanza(valor: number): string {
  const numero = valor
    .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/[\s\u00a0\u202f]/g, '.');
  return `Kz ${numero}`;
}

/**
 * Cartão de curso de curta duração: fotografia com o selo do estado de inscrição
 * sobreposto, carga horária, título, resumo a duas linhas e o rodapé com o preço
 * à esquerda e o botão de inscrição à direita. Distingue-se do `app-cartao-curso`
 * (variantes `padrao`/`academica`), que mostra faculdade, grau e regime e não tem
 * preço nem estado de inscrição.
 */
@Component({
  selector: 'app-cartao-curso-curta-duracao',
  imports: [BotaoComponent, EspacoImagemComponent, IconeComponent, SeloComponent],
  host: { class: 'block h-full' },
  template: `
    <article
      class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
    >
      <div class="relative">
        <app-espaco-imagem proporcao="video" alturaMinima="0px" [imagem]="curso().imagem" />
        <app-selo [variante]="varianteSelo()" class="absolute right-3 top-3">
          {{ rotuloEstado() }}
        </app-selo>
      </div>

      <div class="flex flex-1 flex-col p-5">
        <span class="flex items-center gap-1.5 text-xs text-text-secondary">
          <app-icone nome="clock" [tamanho]="13" />
          {{ cargaHorariaFormatada() }}
        </span>

        <h3 class="mt-3 text-base font-semibold leading-snug text-primary-deep">
          {{ curso().titulo }}
        </h3>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {{ curso().resumo }}
        </p>

        <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <span class="text-base font-bold text-text-primary">{{ precoFormatado() }}</span>
          <app-botao variante="primario" tamanho="sm" [link]="curso().link">
            {{ rotuloInscricao() }}
          </app-botao>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoCursoCurtaDuracaoComponent {
  readonly curso = input.required<CursoCurtaDuracaoCartao>();

  private readonly traducao = inject(TraducaoService);

  protected readonly cargaHorariaFormatada = computed(() => {
    const horas = this.curso().cargaHoraria;
    return this.traducao.getTraducao([`${horas} Horas`, `${horas} Hours`]);
  });

  protected readonly precoFormatado = computed(() => formatarPrecoKwanza(this.curso().preco));

  protected readonly varianteSelo = computed(() =>
    this.curso().estadoInscricao === 'abertas' ? 'sobreFoto' : 'sobreFotoEscuro',
  );

  protected readonly rotuloEstado = computed(() => {
    const curso = this.curso();
    if (curso.estadoInscricao === 'abertas') {
      return this.traducao.getTraducao(['Inscrições Abertas', 'Enrolment Open']);
    }
    const turma = curso.proximaTurma ?? '';
    return this.traducao.getTraducao([`Próxima Turma: ${turma}`, `Next Intake: ${turma}`]);
  });

  protected readonly rotuloInscricao = computed(() =>
    this.traducao.getTraducao(['Inscrever-se', 'Enrol']),
  );
}
