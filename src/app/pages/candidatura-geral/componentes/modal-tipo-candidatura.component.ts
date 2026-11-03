import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoCandidatura } from '../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { AlertOptions } from '../../../shared/componentes/alert-modal/alert-modal.types';
import { ModalDataService } from '../../../shared/componentes/alert-modal/modal-data.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import {
  FormFieldSelectComponentV2,
  SelectOptionV2,
} from '../../../shared/componentes/select-field-v2/select-field-v2';
import { CandidaturaGeralEstadoService } from '../estado/candidatura-geral-estado.service';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_TIPO_CANDIDATURA = 'modal-tipo-candidatura';

/** O que quem abre passa em `data`. */
export interface DadosTipoCandidatura {
  /** Corre com o perfil já guardado no estado, depois de o modal fechar — p. ex. abrir a etapa 1. */
  aoEscolher: (tipo: TipoCandidatura) => void;
}

/** Opções do `AlertModalService.modal()` para este modal. */
export function opcoesModalTipoCandidatura(data: DadosTipoCandidatura): AlertOptions {
  return {
    id: ID_MODAL_TIPO_CANDIDATURA,
    template: ModalTipoCandidaturaComponent,
    tamanho: 'grande',
    temHeader: false,
    semBotoes: true,
    data,
  };
}

/**
 * "Candidatar-se": o candidato escolhe a categoria (docente ou administrativa).
 * Com "Administrativa" aparece o select "Função" (de `GET /candidaturas-docentes/funcoes`)
 * e os requisitos gerais do recrutamento; com "Docente" ficam escondidos e a função
 * é reposta. Só «Continuar» grava a escolha no estado do formulário. Template do
 * `AlertModalService`.
 */
@Component({
  selector: 'app-modal-tipo-candidatura',
  imports: [FormsModule, BotaoComponent, FormFieldSelectComponentV2, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div class="h-2 bg-secondary" aria-hidden="true"></div>

      <button
        type="button"
        class="absolute right-4 top-6 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-text-primary transition-colors hover:bg-gray-200 hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="fechar()"
      >
        <app-icone nome="x" [tamanho]="18" />
      </button>

      <div class="max-h-[85vh] overflow-y-auto px-5 pb-6 pt-10 sm:px-8">
        <h2 class="pr-12 text-lg font-bold leading-tight text-primary-deep sm:text-xl">{{ textos().titulo }}</h2>
        <p class="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">{{ textos().mensagem }}</p>

        <div class="mt-5 flex flex-col gap-4">
          <field-select-v2
            [label]="textos().categoria"
            [placeholder]="textos().selecione"
            [obrigatorio]="true"
            [options]="opcoesCategoria()"
            [ngModel]="categoria()"
            (ngModelChange)="mudarCategoria($event)"
          />

          @if (administrativa()) {
            <field-select-v2
              [label]="textos().funcao"
              [placeholder]="aCarregar() ? textos().aCarregar : textos().selecione"
              [obrigatorio]="true"
              [searchable]="true"
              [disabled]="aCarregar()"
              [options]="opcoesFuncao()"
              [ngModel]="funcaoId()"
              (ngModelChange)="funcaoId.set($event ?? '')"
              [erro]="tentouContinuar() && !funcaoId() ? textos().funcaoObrigatoria : null"
            />
            @if (falhou()) {
              <p class="flex flex-wrap items-center gap-2 text-xs text-red-600" role="alert">
                {{ textos().erroFuncoes }}
                <button type="button" class="font-semibold underline underline-offset-2" (click)="recarregar()">
                  {{ textos().tentarNovamente }}
                </button>
              </p>
            }

            @if (funcaoEscolhida(); as funcao) {
              <div class="rounded-lg border border-gray-200 bg-bg-light p-4 text-xs leading-relaxed text-text-secondary">
                <p class="text-sm font-semibold text-primary-deep">{{ funcao.nome }}</p>
                <p class="mt-1">
                  {{ detalheFuncao() }}
                  @if (funcao.vagas) {
                    · {{ funcao.vagas }} {{ funcao.vagas === 1 ? textos().vaga : textos().vagas }}
                  }
                </p>
                @if (funcao.perfil) {
                  <p class="mt-1"><span class="font-semibold text-primary-deep">{{ textos().perfil }}:</span> {{ funcao.perfil }}</p>
                }
              </div>
            }

            <!-- Conteúdo fixo do documento de recrutamento. -->
            <section class="rounded-lg border border-gray-200 bg-white p-4">
              <h3 class="text-sm font-bold text-primary-deep">{{ textos().requisitosTitulo }}</h3>
              <ul class="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-xs leading-relaxed text-text-secondary">
                @for (requisito of requisitos(); track $index) {
                  <li>{{ requisito }}</li>
                }
              </ul>
            </section>
          }
        </div>

        <div class="mt-6 flex justify-end">
          <app-botao variante="profundo" tamanho="md" icone="arrow-right" posicaoIcone="direita" (clicado)="continuar()">
            {{ textos().continuar }}
          </app-botao>
        </div>
      </div>
    </div>
  `,
})
export class ModalTipoCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly estado = inject(CandidaturaGeralEstadoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly dados = inject(ModalDataService).obterDados<DadosTipoCandidatura>();

  /** Escolha em curso: só vai para o estado ao «Continuar». Parte do que o rascunho já tem. */
  protected readonly categoria = signal<TipoCandidatura>(this.estado.tipo());
  protected readonly funcaoId = signal(this.estado.dados.controls.funcaoId.value);
  protected readonly tentouContinuar = signal(false);

  protected readonly administrativa = computed(() => this.categoria() === 'ADMINISTRATIVO');
  protected readonly aCarregar = this.conteudo.funcoesACarregar;
  protected readonly falhou = this.conteudo.funcoesFalharam;

  constructor() {
    // As funções só são pedidas quando "Administrativa" está escolhida.
    effect(() => {
      if (this.administrativa()) {
        this.conteudo.pedirFuncoes();
      }
    });
  }

  protected readonly opcoesCategoria = computed<SelectOptionV2[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return [
      { value: 'DOCENTE', label: t('Docente', 'Faculty') },
      { value: 'ADMINISTRATIVO', label: t('Administrativa', 'Administrative') },
    ];
  });

  protected readonly opcoesFuncao = computed<SelectOptionV2[]>(() =>
    this.conteudo.funcoes().map((funcao) => ({ value: funcao.id, label: funcao.nome })),
  );

  protected readonly funcaoEscolhida = computed(() => this.conteudo.funcoesPorId().get(this.funcaoId()) ?? null);

  /** "Direcção e chefia · Administração e finanças · Secretaria-Geral" */
  protected readonly detalheFuncao = computed(() => {
    const funcao = this.funcaoEscolhida();
    return funcao ? [funcao.grupoRotulo, funcao.area, funcao.servico].filter(Boolean).join(' · ') : '';
  });

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      fechar: t('Fechar', 'Close'),
      titulo: t('A que se candidata?', 'What are you applying for?'),
      mensagem: t(
        'Escolha a categoria: o formulário ajusta as secções e os documentos pedidos.',
        'Choose the category: the form adjusts the sections and documents requested.',
      ),
      categoria: t('Categoria', 'Category'),
      funcao: t('Função', 'Position'),
      selecione: t('Selecione...', 'Select...'),
      aCarregar: t('A carregar funções…', 'Loading positions…'),
      funcaoObrigatoria: t('Escolha a função a que se candidata.', 'Choose the position you are applying for.'),
      erroFuncoes: t('Não foi possível carregar as funções.', 'Could not load the positions.'),
      tentarNovamente: t('Tentar novamente', 'Try again'),
      vaga: t('vaga', 'vacancy'),
      vagas: t('vagas', 'vacancies'),
      perfil: t('Perfil', 'Profile'),
      requisitosTitulo: t(
        '3. Requisitos gerais e notas de recrutamento',
        '3. General requirements and recruitment notes',
      ),
      continuar: t('Continuar', 'Continue'),
    };
  });

  protected readonly requisitos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return [
      t(
        'Nacionalidade angolana ou autorização de trabalho válida em Angola.',
        'Angolan nationality or a valid work permit in Angola.',
      ),
      t(
        'Habilitações reconhecidas pelo órgão competente; os graus obtidos no estrangeiro devem estar homologados.',
        'Qualifications recognised by the competent body; degrees obtained abroad must be validated.',
      ),
      t(
        'Domínio da língua portuguesa; o inglês é valorizado nas funções técnicas e de investigação.',
        'Command of Portuguese; English is valued in technical and research positions.',
      ),
      t(
        'Disponibilidade para trabalhar no Icolo e Bengo. Nas Estações Experimentais e na Restauração é exigida disponibilidade para turnos e fins-de-semana.',
        'Availability to work in Icolo e Bengo. The Experimental Stations and Catering require availability for shifts and weekends.',
      ),
      t(
        'Documentos de candidatura: curriculum vitae, carta de candidatura com a função pretendida, certificados de habilitações e cópia do Bilhete de Identidade.',
        'Application documents: curriculum vitae, application letter stating the desired position, qualification certificates and a copy of the ID card.',
      ),
      t(
        'As candidaturas são recebidas em https://candidaturas.agrosophia.ao, à semelhança do recrutamento de docentes.',
        'Applications are received at https://candidaturas.agrosophia.ao, as with faculty recruitment.',
      ),
      t(
        'Faseamento: o recrutamento acompanha o crescimento do número de alunos. Na primeira fase têm prioridade as chefias dos serviços centrais; os Serviços Académicos, as TIC, as Finanças e os Serviços Gerais; e a equipa das Estações Experimentais. Os restantes lugares abrem com a entrada de novos cursos e departamentos.',
        'Phasing: recruitment follows the growth in student numbers. In the first phase priority goes to the heads of the central services; the Academic Services, ICT, Finance and General Services; and the Experimental Stations team. The remaining posts open as new courses and departments are introduced.',
      ),
    ];
  });

  protected mudarCategoria(valor: string | null): void {
    this.categoria.set(valor === 'ADMINISTRATIVO' ? 'ADMINISTRATIVO' : 'DOCENTE');
    // Fora de "Administrativa" o select desaparece: repõe-se a função, para não seguir um id escondido.
    if (!this.administrativa()) {
      this.funcaoId.set('');
      this.tentouContinuar.set(false);
    }
  }

  protected recarregar(): void {
    this.conteudo.recarregarFuncoes();
  }

  protected continuar(): void {
    const tipo = this.categoria();
    if (tipo === 'ADMINISTRATIVO' && !this.funcaoId()) {
      this.tentouContinuar.set(true);
      return;
    }
    this.estado.definirTipo(tipo, this.funcaoId());
    this.fechar();
    this.dados?.aoEscolher(tipo);
  }

  protected fechar(): void {
    this.modais.fechar(ID_MODAL_TIPO_CANDIDATURA);
  }
}
