import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExperienciaDocenteCandidaturaGeral } from '../../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import {
  descreverTempoTotalPeriodo,
  duracaoPeriodo,
  formatarDuracaoAnos,
  formatarPeriodo,
} from '../../../../core/servicos/tempo-experiencia';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../../shared/componentes/botao/botao.component';
import { CaixaConfirmacaoComponent } from '../../../../shared/componentes/caixa-confirmacao/caixa-confirmacao.component';
import { FormFieldInputComponentV2 } from '../../../../shared/componentes/input-field/form-input-field';
import { FormFieldSelectComponentV2, SelectOptionV2 } from '../../../../shared/componentes/select-field-v2/select-field-v2';
import { TituloBlocoComponent } from '../../../../shared/componentes/titulo-bloco/titulo-bloco.component';
import {
  CandidaturaGeralEstadoService,
  MAXIMO_EXPERIENCIAS,
  MAXIMO_TEXTO_CURTO,
} from '../../estado/candidatura-geral-estado.service';
import { ItemExperiencia, ListaExperienciasComponent } from './lista-experiencias.component';

/**
 * Etapa 2, secção 2 — experiência docente. Os campos são um rascunho de uma
 * experiência: «Adicionar» valida-os, junta a experiência a
 * `formacao.experienciasDocentes` e limpa-os para a seguinte.
 */
@Component({
  selector: 'app-etapa-2-experiencia-docente',
  imports: [
    FormsModule,
    BotaoComponent,
    CaixaConfirmacaoComponent,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    ListaExperienciasComponent,
    TituloBlocoComponent,
  ],
  template: `
    <app-titulo-bloco icone="landmark" [titulo]="textos().titulo" [descricao]="textos().descricao">

    </app-titulo-bloco>

    <div class="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <form-input-field [obrigatorio]="true" [label]="textos().universidade" [placeholder]="textos().universidadePlaceholder"
        [ngModel]="universidade()" (ngModelChange)="universidade.set($event)"
        [erro]="erroCampo(universidade())" />
      <form-input-field [obrigatorio]="true" [label]="textos().faculdade" [placeholder]="textos().faculdadePlaceholder"
        [ngModel]="faculdade()" (ngModelChange)="faculdade.set($event)" [erro]="erroCampo(faculdade())" />
      <!-- permitirNovo: a disciplina pode ter sido lecionada noutro plano curricular e não estar na lista. -->
      <field-select-v2 class="sm:col-span-2" [obrigatorio]="true" [label]="textos().disciplina" [placeholder]="textos().selecione"
        [searchable]="true" [permitirNovo]="true" [textoNovo]="textos().adicionarDisciplina"
        [dicaNovo]="textos().dicaDisciplina"
        [options]="opcoesDisciplina()" [ngModel]="disciplina()"
        (ngModelChange)="disciplina.set($event ?? '')" [erro]="erroCampo(disciplina())" />
    </div>

    <!-- Período lectivo: "De ___ à ___", com "Actualmente" a dispensar o fim e a
         duração calculada ao vivo — ver tempo-experiencia.ts. -->
    <div class="mt-4 flex flex-col gap-3">
      <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <form-input-field type="month" [obrigatorio]="true" [label]="textos().inicio"
          [ngModel]="inicio()" (ngModelChange)="inicio.set($event)" [erro]="erroInicio()" />
        <form-input-field type="month" [obrigatorio]="!atual()" [disabled]="atual()" [label]="textos().fim"
          [ngModel]="fim()" (ngModelChange)="fim.set($event)" [erro]="erroFim()" />
      </div>
      <app-caixa-confirmacao [ngModel]="atual()" (ngModelChange)="mudarAtual($event)">
        {{ textos().atual }}
      </app-caixa-confirmacao>
      @if (duracaoTexto(); as duracao) {
        <p class="text-xs text-text-secondary">
          {{ textos().duracaoRotulo }} <span class="font-semibold text-primary-deep">{{ duracao }}</span>
        </p>
      }
    </div>
    <div class="my-6 sm:my-10">
      <app-botao class="sm:inline-block sm:w-auto sm:shrink-0" [larguraTotal]="true" variante="primario" icone="plus" raio="medio" [desativado]="limiteAtingido()"
              (clicado)="adicionar()">
              {{ textos().adicionar }}
            </app-botao>

    </div>
    <app-etapa-2-lista-experiencias class="mt-2 block" [itens]="itens()" [tituloLista]="textos().lista"
      [textoVazio]="textos().vazia" [textoRemover]="textos().remover" [rotuloTotal]="textos().total"
      [total]="total()" [erro]="limiteAtingido() ? textos().limite : null" (remover)="remover($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecaoExperienciaDocenteComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly controlo = inject(CandidaturaGeralEstadoService).formacao.controls.experienciasDocentes;

  protected readonly universidade = signal('');
  protected readonly faculdade = signal('');
  protected readonly disciplina = signal('');
  protected readonly inicio = signal('');
  protected readonly fim = signal('');
  /** Ainda lecciona esta disciplina: dispensa o "Até" e conta a duração até hoje. */
  protected readonly atual = signal(false);
  /** A API aceita no máximo MAXIMO_EXPERIENCIAS entradas por lista. */
  protected readonly limiteAtingido = computed(() => this.experiencias().length >= MAXIMO_EXPERIENCIAS);
  /** Ligado no primeiro «Adicionar» com campos em falta: só então os erros aparecem. */
  protected readonly tentouAdicionar = signal(false);

  private readonly experiencias = toSignal(this.controlo.valueChanges, { initialValue: this.controlo.value });

  protected readonly opcoesDisciplina = computed<SelectOptionV2[]>(() =>
    this.conteudo.nomesDisciplinas().map((nome) => ({ value: nome, label: nome })),
  );

  /** Duração do período em preenchimento, antes de «Adicionar» — feedback ao vivo. */
  protected readonly duracaoTexto = computed(() => {
    const periodo = { inicio: this.inicio(), fim: this.fim(), atual: this.atual() };
    return formatarDuracaoAnos(duracaoPeriodo(periodo), this.traducao.idioma());
  });

  protected readonly itens = computed<ItemExperiencia[]>(() => {
    const idioma = this.traducao.idioma();
    return this.experiencias().map((experiencia) => ({
      titulo: experiencia.disciplina,
      detalhe: `${experiencia.universidade} · ${experiencia.faculdade} · ${formatarPeriodo(experiencia, idioma)}`,
      tempo: formatarDuracaoAnos(duracaoPeriodo(experiencia), idioma),
    }));
  });

  protected readonly total = computed(() => descreverTempoTotalPeriodo(this.experiencias(), this.traducao.idioma()));

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Experiência Docente', 'Section 2: Teaching Experience'),
      descricao: t(
        'Trajectória lectiva no ensino superior e experiência no agronegócio ou investigação agrária.',
        'Higher education teaching record and experience in agribusiness or agricultural research.',
      ),
      adicionar: t('Adicionar experiência', 'Add experience'),
      universidade: t('Universidade', 'University'),
      universidadePlaceholder: t('Ex.: Universidade Agostinho Neto', 'E.g. Agostinho Neto University'),
      faculdade: t('Faculdade', 'Faculty'),
      faculdadePlaceholder: t('Ex.: Agronómica e Produção Vegetal', 'E.g. Agronomy and Crop Production'),
      disciplina: t('Disciplina leccionada', 'Course taught'),
      adicionarDisciplina: t('Adicionar disciplina', 'Add course'),
      dicaDisciplina: t(
        'Não encontra a disciplina? Escreva-a na pesquisa para a adicionar.',
        'Can’t find the course? Type it in the search box to add it.',
      ),
      inicio: t('Início', 'Start'),
      fim: t('Até', 'End'),
      atual: t('Actualmente lecciono esta disciplina', 'I currently teach this course'),
      duracaoRotulo: t('Duração:', 'Duration:'),
      fimAntesDoInicio: t(
        'O fim do período tem de ser depois do início.',
        'The end of the period must be after the start.',
      ),
      selecione: t('Selecione...', 'Select...'),
      obrigatorio: t('Campo obrigatório', 'Required field'),
      lista: t('Experiências docentes adicionadas', 'Teaching experience added'),
      vazia: t(
        'Ainda não adicionou nenhuma experiência docente. Preencha os campos acima e clique em «Adicionar».',
        'You have not added any teaching experience yet. Fill in the fields above and click «Add».',
      ),
      remover: t('Remover', 'Remove'),
      limite: t(
        `Atingiu o máximo de ${MAXIMO_EXPERIENCIAS} experiências.`,
        `You have reached the maximum of ${MAXIMO_EXPERIENCIAS} entries.`,
      ),
      total: t('Tempo estimado de experiência na área', 'Estimated experience in the field'),
    };
  });

  protected erroCampo(valor: string): string | null {
    return this.tentouAdicionar() && !valor.trim() ? this.textos().obrigatorio : null;
  }

  protected erroInicio(): string | null {
    return this.tentouAdicionar() && !this.inicio() ? this.textos().obrigatorio : null;
  }

  protected erroFim(): string | null {
    if (!this.tentouAdicionar() || this.atual()) {
      return null;
    }
    if (!this.fim()) {
      return this.textos().obrigatorio;
    }
    return this.fimAntesDoInicio() ? this.textos().fimAntesDoInicio : null;
  }

  /** Independente de `tentouAdicionar`: usado também na validação de `adicionar()`. */
  private fimAntesDoInicio(): boolean {
    return !this.atual() && !!this.inicio() && !!this.fim() && this.fim() < this.inicio();
  }

  /** "Actualmente" dispensa o "Até": limpa-o para não ficar um valor escondido. */
  protected mudarAtual(valor: boolean): void {
    this.atual.set(valor);
    if (valor) {
      this.fim.set('');
    }
  }

  protected adicionar(): void {
    if (this.limiteAtingido()) {
      return;
    }
    const experiencia: ExperienciaDocenteCandidaturaGeral = {
      universidade: this.universidade().trim().slice(0, MAXIMO_TEXTO_CURTO),
      faculdade: this.faculdade().trim().slice(0, MAXIMO_TEXTO_CURTO),
      // Pode ser texto escrito pelo candidato (não só uma opção da lista): limita como os outros.
      disciplina: this.disciplina().trim().slice(0, MAXIMO_TEXTO_CURTO),
      inicio: this.inicio(),
      fim: this.atual() ? '' : this.fim(),
      atual: this.atual(),
    };
    const periodoValido =
      !!experiencia.inicio && (experiencia.atual || !!experiencia.fim) && !this.fimAntesDoInicio();
    const camposValidos = !!experiencia.universidade && !!experiencia.faculdade && !!experiencia.disciplina;
    if (!camposValidos || !periodoValido) {
      this.tentouAdicionar.set(true);
      return;
    }
    this.atualizar([...this.controlo.value, experiencia]);
    this.universidade.set('');
    this.faculdade.set('');
    this.disciplina.set('');
    this.inicio.set('');
    this.fim.set('');
    this.atual.set(false);
    this.tentouAdicionar.set(false);
  }

  protected remover(indice: number): void {
    this.atualizar(this.controlo.value.filter((_, i) => i !== indice));
  }

  private atualizar(experiencias: ExperienciaDocenteCandidaturaGeral[]): void {
    this.controlo.setValue(experiencias);
    // "Sujo" para o rascunho automático gravar.
    this.controlo.markAsDirty();
  }
}
