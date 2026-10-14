import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { filter, map } from 'rxjs';
import { ErroApi } from '../../../core/api/erro-api';
import { CandidaturaGeralSubmetida, NovaCandidaturaGeral } from '../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralEnvioService } from '../../../core/servicos/candidatura-geral-envio.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { ContainerPaginaComponent } from '../../../shared/componentes/container-pagina/container-pagina.component';
import {
  DadosCandidaturaSubmetida,
  ID_MODAL_CANDIDATURA_SUBMETIDA,
  ModalCandidaturaSubmetidaComponent,
} from '../../../shared/componentes/modal-candidatura-submetida/modal-candidatura-submetida.component';
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
  imports: [RouterOutlet, RouterLink, BotaoComponent, ContainerPaginaComponent, PassosFormularioComponent],
  templateUrl: './formulario-candidatura.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly router = inject(Router);
  private readonly modais = inject(AlertModalService);
  private readonly envio = inject(CandidaturaGeralEnvioService);
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
      disciplinasSelecionadas: t('Disciplinas seleccionadas', 'Selected courses'),
      semDisciplinas: t('Nenhuma disciplina seleccionada', 'No course selected'),
      outra: t('outra', 'other'),
      outras: t('outras', 'others'),
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
      submetendo: t('A submeter…', 'Submitting…'),
      erroTitulo: t('Candidatura não submetida', 'Application not submitted'),
      erroRede: t(
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ),
      // 413: o servidor cortou o pedido pelo tamanho, antes de validar os campos.
      erroTamanho: t(
        'Os documentos anexados excedem o tamanho total aceite. Substitua ou comprima algum ficheiro na etapa 3.',
        'The attached documents exceed the accepted total size. Replace or compress a file in step 3.',
      ),
      erroGenerico: t(
        'Não foi possível submeter a candidatura. Tente novamente dentro de alguns instantes.',
        'Could not submit the application. Please try again in a few moments.',
      ),
    };
  });

  /**
   * `POST /candidaturas-docentes` — endpoint público. Nada a invalidar a seguir:
   * a lista de candidaturas da API pede autenticação e o site nunca a lê.
   */
  protected readonly enviar = injectMutation<CandidaturaGeralSubmetida, ErroApi, NovaCandidaturaGeral>(() => ({
    mutationFn: (candidatura) => this.envio.criar(candidatura),
  }));

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
    console.log('[Candidatura] dados do formulário', {
      dados: this.estado.dados.getRawValue(),
      formacao: this.estado.formacao.getRawValue(),
      dossier: this.estado.dossier.getRawValue(),
    });
    if (!this.estado.validarEtapa(etapa)) {
      const t = this.textos();
      await this.modais.aviso(t.corrigir, t.corrigirTitulo);
      return;
    }
    if (etapa < TOTAL_ETAPAS) {
      void this.router.navigate([ROTA_CANDIDATURA_GERAL, `etapa-${etapa + 1}`]);
      return;
    }
    await this.submeter();
  }

  /**
   * Etapa 4: envia as três etapas à API. Em caso de sucesso apaga o rascunho
   * (os dados já estão no servidor) e abre o modal de sucesso; em caso de erro
   * mostra o motivo e mantém tudo preenchido para nova tentativa.
   */
  private async submeter(): Promise<void> {
    if (this.enviar.isPending()) {
      return;
    }
    // Lida antes do `limpar()`: o modal mostra as disciplinas e o formulário fica em branco.
    const disciplinas = this.estado
      .disciplinasSelecionadas()
      .map((escolhida) => escolhida.disciplina.nome)
      .join(', ');
    try {
      const submetida = await this.enviar.mutateAsync({
        dados: this.estado.dados.getRawValue(),
        formacao: this.estado.formacao.getRawValue(),
        dossier: this.estado.dossier.getRawValue(),
      });
      this.estado.limpar();
      await this.abrirModalSucesso(submetida, disciplinas);
    } catch (erro) {
      await this.modais.erro(this.mensagemErro(ErroApi.aPartirDe(erro)), this.textos().erroTitulo);
    }
  }

  private async abrirModalSucesso(submetida: CandidaturaGeralSubmetida, area: string): Promise<void> {
    const data: DadosCandidaturaSubmetida = {
      codigo: submetida.codigo,
      area,
      submetidaEm: submetida.submetidaEm,
      pdfUrl: submetida.pdfUrl,
    };
    // Sem `await`: o modal fecha por `modais.fechar()`, que não resolve esta promessa,
    // e é ele que navega para `/` (pelo X e pelo "Voltar à Página Principal").
    void this.modais.modal({
      id: ID_MODAL_CANDIDATURA_SUBMETIDA,
      template: ModalCandidaturaSubmetidaComponent,
      tamanho: 'xgrande',
      temHeader: false,
      semBotoes: true,
      // O formulário já foi limpo: um clique no fundo não pode deixar o candidato sem o código.
      fecharAoClicarFundo: false,
      data,
    });
  }

  /**
   * Os 422 do Laravel trazem a mensagem por campo, só em português (a API é
   * monolingue), mas dizem exactamente o que falhou — passam à frente do genérico.
   */
  private mensagemErro(erro: ErroApi): string {
    const doServidor = Object.values(erro.errosValidacao).flat();
    if (doServidor.length) {
      return doServidor.join(' ');
    }
    const t = this.textos();
    if (erro.estado === 413) {
      return t.erroTamanho;
    }
    return erro.estado === 0 ? t.erroRede : t.erroGenerico;
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
