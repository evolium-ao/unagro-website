import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExperienciaDocenteCandidaturaGeral } from '../../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralService } from '../../../../core/servicos/candidatura-geral.service';
import { descreverTempoTotal } from '../../../../core/servicos/tempo-experiencia';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../../shared/componentes/botao/botao.component';
import { FormFieldInputComponentV2 } from '../../../../shared/componentes/input-field/form-input-field';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../../shared/componentes/select-field-v2/select-field-v2';
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
      <field-select-v2 [obrigatorio]="true" [label]="textos().disciplina" [placeholder]="textos().selecione"
        [searchable]="true" [permitirNovo]="true" [textoNovo]="textos().adicionarDisciplina"
        [dicaNovo]="textos().dicaDisciplina"
        [options]="opcoesDisciplina()" [ngModel]="disciplina()"
        (ngModelChange)="disciplina.set($event ?? '')" [erro]="erroCampo(disciplina())" />
      <field-select-v2 [obrigatorio]="true" [label]="textos().tempo" [placeholder]="textos().selecione"
        [options]="opcoesTempo()" [ngModel]="tempo()" (ngModelChange)="tempo.set($event ?? '')"
        [erro]="erroCampo(tempo())" />
    </div>
    <div class="my-10">
      <app-botao class="shrink-0" variante="primario" icone="plus" raio="medio" [desativado]="limiteAtingido()"
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
  protected readonly tempo = signal('');
  /** A API aceita no máximo MAXIMO_EXPERIENCIAS entradas por lista. */
  protected readonly limiteAtingido = computed(() => this.experiencias().length >= MAXIMO_EXPERIENCIAS);
  /** Ligado no primeiro «Adicionar» com campos em falta: só então os erros aparecem. */
  protected readonly tentouAdicionar = signal(false);

  private readonly experiencias = toSignal(this.controlo.valueChanges, { initialValue: this.controlo.value });

  protected readonly opcoesDisciplina = computed<SelectOptionV2[]>(() =>
    this.conteudo.nomesDisciplinas().map((nome) => ({ value: nome, label: nome })),
  );
  protected readonly opcoesTempo = computed<SelectOptionV2[]>(() =>
    this.conteudo.temposDocencia().map((opcao) => ({ value: opcao.id, label: opcao.rotulo })),
  );

  protected readonly itens = computed<ItemExperiencia[]>(() => {
    const tempos = this.conteudo.temposDocencia();
    return this.experiencias().map((experiencia) => ({
      titulo: experiencia.disciplina,
      detalhe: `${experiencia.universidade} · ${experiencia.faculdade}`,
      tempo: tempos.find((opcao) => opcao.id === experiencia.tempo)?.rotulo ?? '',
    }));
  });

  protected readonly total = computed(() =>
    descreverTempoTotal(
      this.experiencias().map((experiencia) => experiencia.tempo),
      this.conteudo.temposDocencia(),
      this.traducao.idioma(),
    ),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 2: Experiência Docente', 'Section 2: Teaching Experience'),
      descricao: t(
        'Trajetória letiva no ensino superior e experiência no agronegócio ou investigação agrária.',
        'Higher education teaching record and experience in agribusiness or agricultural research.',
      ),
      adicionar: t('Adicionar experiência', 'Add experience'),
      universidade: t('Universidade', 'University'),
      universidadePlaceholder: t('Ex.: Universidade Agostinho Neto', 'E.g. Agostinho Neto University'),
      faculdade: t('Faculdade', 'Faculty'),
      faculdadePlaceholder: t('Ex.: Agronómica e Produção Vegetal', 'E.g. Agronomy and Crop Production'),
      disciplina: t('Disciplina lecionada', 'Course taught'),
      adicionarDisciplina: t('Adicionar disciplina', 'Add course'),
      dicaDisciplina: t(
        'Não encontra a disciplina? Escreva-a na pesquisa para a adicionar.',
        'Can’t find the course? Type it in the search box to add it.',
      ),
      tempo: t('Tempo de docência', 'Teaching time'),
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

  protected adicionar(): void {
    const experiencia: ExperienciaDocenteCandidaturaGeral = {
      universidade: this.universidade().trim().slice(0, MAXIMO_TEXTO_CURTO),
      faculdade: this.faculdade().trim().slice(0, MAXIMO_TEXTO_CURTO),
      // Pode ser texto escrito pelo candidato (não só uma opção da lista): limita como os outros.
      disciplina: this.disciplina().trim().slice(0, MAXIMO_TEXTO_CURTO),
      tempo: this.tempo(),
    };
    if (this.limiteAtingido()) {
      return;
    }
    if (Object.values(experiencia).some((valor) => !valor)) {
      this.tentouAdicionar.set(true);
      return;
    }
    this.atualizar([...this.controlo.value, experiencia]);
    this.universidade.set('');
    this.faculdade.set('');
    this.disciplina.set('');
    this.tempo.set('');
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
