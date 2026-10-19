import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DisciplinaEscolhidaCandidaturaGeral } from '../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { MAXIMO_DISCIPLINAS } from '../estado/candidatura-geral-estado.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../shared/componentes/select-field-v2/select-field-v2';

/**
 * "Registo de Intenção Curricular Multidisciplinar" (mockup
 * `selecionar-disciplina-lecionar-v2.png`): o docente escolhe um curso, uma
 * disciplina desse curso e clica em «Adicionar»; repete para juntar disciplinas
 * de vários cursos.
 *
 * É um `ControlValueAccessor` cujo valor são os `id`s das disciplinas, pela
 * ordem em que foram adicionadas — serve tanto o `ngModel` da página inicial
 * como o `formControlName="disciplinas"` da etapa 1. O que vier em
 * `<ng-content>` aparece no rodapé do cartão (p. ex. o «Confirmar Seleção»).
 */
@Component({
  selector: 'app-seletor-disciplinas',
  imports: [FormsModule, FormFieldSelectComponentV2, BotaoComponent, IconeComponent],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SeletorDisciplinasComponent), multi: true },
  ],
  template: `
    <div class="rounded-2xl border bg-bg-lighter sm:p-8" [class.p-1]="compacto()" [class.p-4]="!compacto()"
      [class]="erro() ? 'border-red-400' : 'border-gray-200'">
      <!-- Cabeçalho do registo + contador -->
      <div class="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="font-bold text-text-primary">{{ textos().titulo }}</p>
          <p class="mt-1 text-xs text-text-secondary">{{ textos().subtitulo }}</p>
        </div>
        <span
          class="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-text-primary"
          aria-live="polite">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-deep" aria-hidden="true"></span>
          {{ selecionadas().length }}
          {{ selecionadas().length === 1 ? textos().adicionada : textos().adicionadas }}
        </span>
      </div>

      <!-- Curso → disciplina → Adicionar -->
      <div class="border-b border-gray-200 py-5">
        <!-- minmax(0, …): as colunas nunca crescem com o nome escolhido no select
             (um 1fr sozinho é minmax(auto, 1fr) e alargava o cartão). -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
          <field-select-v2 [label]="textos().curso" [options]="opcoesCurso()"
            [placeholder]="aCarregar() ? textos().aCarregar : textos().cursoPlaceholder" [searchable]="true"
            [bgTransparent]="true" [disabled]="desativado() || aCarregar() || limiteAtingido()"
            [ngModel]="cursoEscolhido()" (ngModelChange)="mudarCurso($event)" [temError]="false" />
          <field-select-v2 [label]="textos().disciplina" [options]="opcoesDisciplina()"
            [placeholder]="textos().disciplinaPlaceholder" [searchable]="true" [bgTransparent]="true"
            [disabled]="desativado() || !cursoEscolhido() || limiteAtingido()" [ngModel]="disciplinaEscolhida()"
            (ngModelChange)="disciplinaEscolhida.set($event ?? '')" [temError]="false" />
          <app-botao class="md:inline-block md:w-auto" variante="primario" icone="plus" raio="medio" [larguraTotal]="true"
            [desativado]="desativado() || !disciplinaEscolhida() || limiteAtingido()" (clicado)="adicionar()">
            {{ textos().adicionar }}
          </app-botao>
        </div>

        @if (falhou()) {
          <p class="mt-3 flex flex-wrap items-center gap-2 text-xs text-red-600" role="alert">
            {{ textos().erroOferta }}
            <button type="button" class="cursor-pointer font-semibold underline hover:text-red-700"
              (click)="recarregar()">{{ textos().tentarNovamente }}</button>
          </p>
        } @else if (limiteAtingido()) {
          <p class="mt-3 text-xs text-text-secondary" aria-live="polite">{{ textos().limite }}</p>
        }
      </div>

      <!-- Disciplinas selecionadas -->
      <div class="py-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p class="text-[11px] font-bold uppercase tracking-wide text-text-primary">{{ textos().listaTitulo }}</p>
          @if (selecionadas().length) {
            <p class="text-[11px] text-text-secondary">{{ textos().listaDica }}</p>
          }
        </div>

        @if (selecionadas().length) {
          <ol class="space-y-3">
            @for (escolhida of selecionadas(); track escolhida.disciplina.id; let i = $index) {
              <li class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 text-[11px] font-bold text-text-primary">
                  {{ (i + 1).toString().padStart(2, '0') }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-text-primary">{{ escolhida.disciplina.nome }}</p>
                  <p class="mt-0.5 truncate text-[11px] text-text-secondary">{{ escolhida.curso.nome }}</p>
                </div>
                <button type="button"
                  class="shrink-0 rounded-md p-1.5 text-text-secondary transition hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
                  [disabled]="desativado()" [attr.aria-label]="textos().remover + ' ' + escolhida.disciplina.nome"
                  (click)="remover(escolhida.disciplina.id)">
                  <app-icone nome="trash-2" [tamanho]="16" />
                </button>
              </li>
            }
          </ol>
        } @else if (ids().length && aCarregar()) {
          <!-- Disciplinas do rascunho/URL à espera da oferta para se saber o nome. -->
          <p class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-text-secondary">
            {{ textos().aCarregar }}
          </p>
        } @else {
          <p class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-text-secondary">
            {{ textos().listaVazia }}
          </p>
        }

        @if (erro(); as mensagem) {
          <p class="mt-3 text-xs text-red-600" role="alert">{{ mensagem }}</p>
        }
      </div>

      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeletorDisciplinasComponent implements ControlValueAccessor {
  private readonly traducao = inject(TraducaoService);
  private readonly conteudo = inject(CandidaturaGeralService);

  /** Mensagem de validação vinda do formulário (p. ex. "campo obrigatório"). */
  readonly erro = input<string | null>(null);
  /** Só 4px de padding no telemóvel (etapa 1); por omissão 16px. */
  readonly compacto = input(false);

  /** `id` do curso no primeiro select, ou vazio. */
  protected readonly cursoEscolhido = signal('');
  /** `id` da disciplina no segundo select, ou vazio. */
  protected readonly disciplinaEscolhida = signal('');
  /** `id`s das disciplinas adicionadas — é o valor do controlo. */
  protected readonly ids = signal<string[]>([]);
  protected readonly desativado = signal(false);

  protected readonly aCarregar = this.conteudo.ofertaACarregar;
  protected readonly falhou = this.conteudo.ofertaFalhou;
  /** A API aceita no máximo `MAXIMO_DISCIPLINAS` por candidatura. */
  protected readonly limiteAtingido = computed(() => this.ids().length >= MAXIMO_DISCIPLINAS);

  private aoMudar: (ids: string[]) => void = () => {};
  private aoTocar: () => void = () => {};

  protected readonly opcoesCurso = computed<SelectOptionV2[]>(() =>
    this.conteudo.cursos().map((curso) => ({ value: curso.id, label: curso.nome })),
  );

  /** Disciplinas do curso escolhido; as que já estão na lista ficam desactivadas. */
  protected readonly opcoesDisciplina = computed<SelectOptionV2[]>(() => {
    const curso = this.conteudo.cursos().find((c) => c.id === this.cursoEscolhido());
    const adicionadas = new Set(this.ids());
    return (curso?.disciplinas ?? []).map((disciplina) => ({
      value: disciplina.id,
      label: disciplina.nome,
      disabled: adicionadas.has(disciplina.id),
    }));
  });

  /** Lista "Disciplinas selecionadas pelo docente"; `id`s desconhecidos ficam de fora. */
  protected readonly selecionadas = computed<DisciplinaEscolhidaCandidaturaGeral[]>(() =>
    this.ids().flatMap((id) => {
      const escolhida = this.conteudo.disciplinasPorId().get(id);
      return escolhida ? [escolhida] : [];
    }),
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      titulo: t('Registo de Intenção Curricular Multidisciplinar', 'Multidisciplinary Curricular Intention Record'),
      subtitulo: t(
        'Pode adicionar múltiplos cursos e unidades curriculares que pretende leccionar.',
        'You can add several degree programmes and course units you wish to teach.',
      ),
      adicionadas: t('Disciplinas Adicionadas', 'Courses Added'),
      adicionada: t('Disciplina Adicionada', 'Course Added'),
      curso: t('1. Escolha o curso', '1. Choose the degree programme'),
      cursoPlaceholder: t('-- Seleccione o curso --', '-- Select the degree programme --'),
      disciplina: t('2. Escolha a disciplina / Unidade curricular', '2. Choose the course / Course unit'),
      disciplinaPlaceholder: t('-- Seleccione a disciplina --', '-- Select the course --'),
      adicionar: t('Adicionar', 'Add'),
      listaTitulo: t('Disciplinas seleccionadas pelo docente:', 'Courses selected by the lecturer:'),
      listaDica: t('Clique no ícone de remoção para retirar', 'Click the remove icon to withdraw'),
      listaVazia: t(
        'Ainda não adicionou nenhuma disciplina. Escolha o curso, a disciplina e clique em «Adicionar».',
        'You have not added any course yet. Choose the programme, the course and click «Add».',
      ),
      remover: t('Remover', 'Remove'),
      aCarregar: t('A carregar cursos e disciplinas…', 'Loading programmes and courses…'),
      erroOferta: t(
        'Não foi possível carregar os cursos e disciplinas.',
        'The programmes and courses could not be loaded.',
      ),
      tentarNovamente: t('Tentar novamente', 'Try again'),
      limite: t(
        `Atingiu o máximo de ${MAXIMO_DISCIPLINAS} disciplinas. Remova uma para escolher outra.`,
        `You have reached the maximum of ${MAXIMO_DISCIPLINAS} courses. Remove one to choose another.`,
      ),
    };
  });

  protected mudarCurso(id: string): void {
    this.cursoEscolhido.set(id ?? '');
    this.disciplinaEscolhida.set('');
  }

  protected recarregar(): void {
    this.conteudo.recarregarOferta();
  }

  protected adicionar(): void {
    const id = this.disciplinaEscolhida();
    if (!id || this.ids().includes(id) || this.limiteAtingido()) {
      return;
    }
    this.atualizar([...this.ids(), id]);
    this.disciplinaEscolhida.set('');
  }

  protected remover(id: string): void {
    this.atualizar(this.ids().filter((atual) => atual !== id));
  }

  private atualizar(ids: string[]): void {
    this.ids.set(ids);
    this.aoMudar(ids);
    this.aoTocar();
  }

  writeValue(valor: string[] | null): void {
    this.ids.set(Array.isArray(valor) ? valor : []);
  }

  registerOnChange(fn: (ids: string[]) => void): void {
    this.aoMudar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.aoTocar = fn;
  }

  setDisabledState(desativado: boolean): void {
    this.desativado.set(desativado);
  }
}
