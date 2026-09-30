import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { ContainerPaginaComponent } from '../../../shared/componentes/container-pagina/container-pagina.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { PassosFormularioComponent } from '../../../shared/componentes/passos-formulario/passos-formulario.component';
import { CandidaturaGeralEstadoService, NumeroEtapa } from '../estado/candidatura-geral-estado.service';

export const ROTA_CANDIDATURA_GERAL = '/candidatura-geral';
const TOTAL_ETAPAS = 4;

/**
 * Moldura comum às etapas do formulário: migalhas, título, cartão da área
 * escolhida, stepper e barra de botões. Cada etapa é uma rota filha
 * (`etapa-N`, com `data.etapa`) que só traz os seus campos.
 */
@Component({
  selector: 'app-formulario-candidatura',
  imports: [RouterOutlet, RouterLink, BotaoComponent, ContainerPaginaComponent, IconeComponent, PassosFormularioComponent],
  templateUrl: './formulario-candidatura.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly router = inject(Router);
  private readonly modais = inject(AlertModalService);
  protected readonly estado = inject(CandidaturaGeralEstadoService);

  protected readonly rotaInicio = ROTA_CANDIDATURA_GERAL;
  protected readonly totalEtapas = TOTAL_ETAPAS;

  /** Etapa activa, lida do `data.etapa` da rota filha a cada navegação. */
  protected readonly etapa = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => this.lerEtapa()),
    ),
    { initialValue: this.lerEtapa() },
  );

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const n = this.etapa();
    return {
      inicio: t('Início', 'Home'),
      migalha: t(`Candidatura — Etapa ${n} de ${TOTAL_ETAPAS}`, `Application — Step ${n} of ${TOTAL_ETAPAS}`),
      voltarPrincipal: t('Voltar à Página Principal / Convocatória', 'Back to Main Page / Call'),
      selo: t('Fase Provisória / Manifestação de Interesse Oficial', 'Provisional Stage / Official Expression of Interest'),
      titulo: t('Candidatura ao Corpo Docente', 'Faculty Application'),
      subtitulo: t(
        'Preencha os seus dados pessoais, percurso académico e anexe o dossier documental obrigatório para formalizar a sua manifestação de interesse.',
        'Fill in your personal details and academic background and attach the mandatory document dossier to formalise your expression of interest.',
      ),
      areaSelecionada: t('Área seleccionada', 'Selected area'),
      semArea: t('Nenhuma área seleccionada', 'No area selected'),
      vagas: t('Vagas Disponíveis', 'Available Positions'),
      alterar: t('Alterar', 'Change'),
      etapa: t('Etapa', 'Step'),
      ativa: t('(activa)', '(active)'),
      progresso: t('Progresso da candidatura', 'Application progress'),
      guardar: t('Guardar Rascunho', 'Save Draft'),
      cancelar: t('Cancelar', 'Cancel'),
      voltarEtapa: t(`Voltar para Etapa ${n - 1}`, `Back to Step ${n - 1}`),
      avancar: t(`Avançar para Etapa ${n + 1}`, `Continue to Step ${n + 1}`),
      submeter: t('Submeter a Candidatura', 'Submit Application'),
      rascunhoTitulo: t('Rascunho guardado', 'Draft saved'),
      rascunhoMensagem: t(
        'Os dados preenchidos ficaram guardados neste navegador. Os ficheiros anexados não são guardados no rascunho.',
        'Your answers were saved in this browser. Attached files are not kept in the draft.',
      ),
      rascunhoErro: t(
        'Não foi possível guardar o rascunho neste navegador.',
        'The draft could not be saved in this browser.',
      ),
      cancelarTitulo: t('Cancelar candidatura?', 'Cancel application?'),
      cancelarMensagem: t(
        'Os dados preenchidos e o rascunho guardado serão apagados.',
        'Your answers and the saved draft will be deleted.',
      ),
      corrigir: t(
        'Há campos obrigatórios por preencher ou com erros. Reveja os campos assinalados a vermelho.',
        'Some required fields are empty or invalid. Please review the fields marked in red.',
      ),
      corrigirTitulo: t('Reveja o formulário', 'Review the form'),
    };
  });

  protected readonly passos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return [
      t('Dados & Área', 'Details & Area'),
      t('Formação & Experiência', 'Education & Experience'),
      t('Dossier & Declaração', 'Dossier & Declaration'),
      t('Revisão & Submissão', 'Review & Submission'),
    ];
  });

  protected async guardarRascunho(): Promise<void> {
    const t = this.textos();
    if (this.estado.guardarRascunho()) {
      await this.modais.sucesso(t.rascunhoMensagem, t.rascunhoTitulo);
    } else {
      await this.modais.erro(t.rascunhoErro);
    }
  }

  protected async cancelar(): Promise<void> {
    const t = this.textos();
    const { confirmado } = await this.modais.confirmar(t.cancelarMensagem, t.cancelarTitulo);
    if (!confirmado) {
      return;
    }
    this.estado.limpar();
    void this.router.navigateByUrl(ROTA_CANDIDATURA_GERAL);
  }

  protected voltar(): void {
    void this.router.navigate([ROTA_CANDIDATURA_GERAL, `etapa-${this.etapa() - 1}`]);
  }

  protected async avancar(): Promise<void> {
    const etapa = this.etapa();
    if (!this.estado.validarEtapa(etapa)) {
      const t = this.textos();
      await this.modais.aviso(t.corrigir, t.corrigirTitulo);
      return;
    }
    // TODO: a etapa 4 submete a candidatura e abre o modal de sucesso.
    if (etapa < TOTAL_ETAPAS) {
      void this.router.navigate([ROTA_CANDIDATURA_GERAL, `etapa-${etapa + 1}`]);
    }
  }

  /**
   * Lê do snapshot do router e não do `ActivatedRoute`: numa navegação dentro da
   * app esta moldura é construída antes de a rota filha estar activada, e o
   * `firstChild.snapshot` ainda não existe.
   */
  private lerEtapa(): NumeroEtapa {
    let atual = this.router.routerState.snapshot.root;
    while (atual.firstChild) {
      atual = atual.firstChild;
    }
    const etapa = Number(atual.data['etapa']);
    return (etapa >= 1 && etapa <= TOTAL_ETAPAS ? etapa : 1) as NumeroEtapa;
  }
}
