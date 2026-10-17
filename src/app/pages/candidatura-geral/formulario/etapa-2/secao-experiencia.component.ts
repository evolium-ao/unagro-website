import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExperienciaProfissionalCandidaturaGeral } from '../../../../core/modelos/candidatura-geral.model';
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
 * Etapa 2, secção 3 — experiência profissional. Como na secção 2, os campos
 * descrevem uma experiência: «Adicionar» junta-a a
 * `formacao.experienciasProfissionais` e o tempo total é calculado da lista.
 */
@Component({
  selector: 'app-etapa-2-experiencia',
  imports: [
    FormsModule,
    BotaoComponent,
    FormFieldInputComponentV2,
    FormFieldSelectComponentV2,
    ListaExperienciasComponent,
    TituloBlocoComponent,
  ],
  template: `
    <app-titulo-bloco icone="briefcase" [titulo]="textos().titulo" [descricao]="textos().descricao">
     
    </app-titulo-bloco>

    <div class="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <form-input-field [obrigatorio]="true" [label]="textos().empresa" [placeholder]="textos().empresaPlaceholder"
        [ngModel]="empresa()" (ngModelChange)="empresa.set($event)" [erro]="erroCampo(empresa())" />
      <field-select-v2 [obrigatorio]="true" [label]="textos().area" [placeholder]="textos().selecione"
        [searchable]="true" [options]="opcoesArea()" [ngModel]="area()" (ngModelChange)="area.set($event ?? '')"
        [erro]="erroCampo(area())" />
      <field-select-v2 class="sm:col-span-2" [obrigatorio]="true" [label]="textos().tempo"
        [placeholder]="textos().selecione" [options]="opcoesTempo()" [ngModel]="tempo()"
        (ngModelChange)="tempo.set($event ?? '')" [erro]="erroCampo(tempo())" />
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
export class SecaoExperienciaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly controlo = inject(CandidaturaGeralEstadoService).formacao.controls.experienciasProfissionais;

  protected readonly empresa = signal('');
  protected readonly area = signal('');
  protected readonly tempo = signal('');
  /** A API aceita no máximo MAXIMO_EXPERIENCIAS entradas por lista. */
  protected readonly limiteAtingido = computed(() => this.experiencias().length >= MAXIMO_EXPERIENCIAS);
  /** Ligado no primeiro «Adicionar» com campos em falta: só então os erros aparecem. */
  protected readonly tentouAdicionar = signal(false);

  private readonly experiencias = toSignal(this.controlo.valueChanges, { initialValue: this.controlo.value });

  protected readonly opcoesArea = computed<SelectOptionV2[]>(() =>
    this.conteudo.areasTrabalho().map((opcao) => ({ value: opcao.id, label: opcao.rotulo })),
  );
  protected readonly opcoesTempo = computed<SelectOptionV2[]>(() =>
    this.conteudo.intervalosExperiencia().map((opcao) => ({ value: opcao.id, label: opcao.rotulo })),
  );

  protected readonly itens = computed<ItemExperiencia[]>(() => {
    const areas = this.conteudo.areasTrabalho();
    const tempos = this.conteudo.intervalosExperiencia();
    return this.experiencias().map((experiencia) => ({
      titulo: experiencia.empresa,
      detalhe: areas.find((opcao) => opcao.id === experiencia.area)?.rotulo ?? '',
      tempo: tempos.find((opcao) => opcao.id === experiencia.tempo)?.rotulo ?? '',
    }));
  });

  protected readonly total = computed(() =>
    descreverTempoTotal(
      this.experiencias().map((experiencia) => experiencia.tempo),
      this.conteudo.intervalosExperiencia(),
      this.traducao.idioma(),
    ),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Secção 3: Experiência Profissional', 'Section 3: Professional Experience'),
      descricao: t(
        'Trajetória e experiência no agronegócio ou investigação agrária.',
        'Career and experience in agribusiness or agricultural research.',
      ),
      adicionar: t('Adicionar experiência', 'Add experience'),
      empresa: t('Empresa', 'Company'),
      empresaPlaceholder: t('Ex.: Fazenda Agro-Industrial do Cuanza', 'E.g. Cuanza Agro-Industrial Farm'),
      area: t('Área de trabalho', 'Field of work'),
      tempo: t('Tempo de Experiência', 'Length of Experience'),
      selecione: t('Selecione...', 'Select...'),
      obrigatorio: t('Campo obrigatório', 'Required field'),
      lista: t('Experiências profissionais adicionadas', 'Professional experience added'),
      vazia: t(
        'Ainda não adicionou nenhuma experiência profissional. Preencha os campos acima e clique em «Adicionar».',
        'You have not added any professional experience yet. Fill in the fields above and click «Add».',
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
    const experiencia: ExperienciaProfissionalCandidaturaGeral = {
      empresa: this.empresa().trim().slice(0, MAXIMO_TEXTO_CURTO),
      area: this.area(),
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
    this.empresa.set('');
    this.area.set('');
    this.tempo.set('');
    this.tentouAdicionar.set(false);
  }

  protected remover(indice: number): void {
    this.atualizar(this.controlo.value.filter((_, i) => i !== indice));
  }

  private atualizar(experiencias: ExperienciaProfissionalCandidaturaGeral[]): void {
    this.controlo.setValue(experiencias);
    // "Sujo" para o rascunho automático gravar.
    this.controlo.markAsDirty();
  }
}
