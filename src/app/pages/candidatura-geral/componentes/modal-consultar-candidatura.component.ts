import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { descarregarFicheiro } from '../../../core/api/descarregar-ficheiro';
import { ErroApi } from '../../../core/api/erro-api';
import { CandidaturaGeralConsultada } from '../../../core/modelos/candidatura-geral.model';
import { CandidaturaGeralConsultaService } from '../../../core/servicos/candidatura-geral-consulta.service';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../../../shared/componentes/alert-modal/alert-modal.service';
import { BotaoComponent } from '../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../shared/componentes/icone/icone.component';
import { FormFieldInputComponentV2 } from '../../../shared/componentes/input-field/form-input-field';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_CONSULTAR_CANDIDATURA = 'modal-consultar-candidatura';

/** Um par rótulo/valor das grelhas do resultado. */
interface CampoConsulta {
  rotulo: string;
  valor: string;
  ligacao?: string;
}

const VAZIO = '—';
const FUSO_LUANDA = 'Africa/Luanda';

/** Cores da etiqueta do estado, sobre o cartão escuro do topo. */
const CLASSES_ESTADO: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-900',
  em_analise: 'bg-sky-100 text-sky-900',
  aprovada: 'bg-emerald-100 text-emerald-900',
  rejeitada: 'bg-red-100 text-red-800',
};

/**
 * "Consultar candidatura" do hero de `/candidatura-geral`: o candidato indica o
 * código (`AGRO-2026-DOC-849204`) ou o nº do BI / passaporte e vê o que
 * submeteu, pela ordem das secções do formulário, com o nome e o estado no
 * topo. Renderizado como template do `AlertModalService` (sem header nem botões).
 */
@Component({
  selector: 'app-modal-consultar-candidatura',
  imports: [FormsModule, BotaoComponent, IconeComponent, FormFieldInputComponentV2],
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

      <div class="px-5 pb-6 pt-10 sm:px-10 sm:pt-12">
        <!-- Cabeçalho -->
        <div class="flex items-start gap-3 pr-12">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-deep text-secondary" aria-hidden="true">
            <app-icone nome="search" [tamanho]="20" />
          </span>
          <div>
            <h2 class="text-xl font-bold leading-tight text-primary-deep sm:text-2xl">{{ textos().titulo }}</h2>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">{{ textos().descricao }}</p>
          </div>
        </div>

        <!-- Pesquisa -->
        <form class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start" (submit)="consultar($event)" novalidate>
          <form-input-field
            class="min-w-0 flex-1"
            [label]="textos().campo"
            [placeholder]="textos().campoPlaceholder"
            [ngModel]="termo()"
            [ngModelOptions]="{ standalone: true }"
            (ngModelChange)="termo.set($event)"
            [erro]="erro()"
          />
          <app-botao
            class="whitespace-nowrap sm:mt-[22px]"
            tipo="submit"
            variante="profundo"
            icone="search"
            tamanho="sm"
            paddingX="px-5"
            paddingY="py-2.5"
            [aCarregar]="aConsultar()"
          >
            {{ textos().consultar }}
          </app-botao>
        </form>

        @if (candidatura(); as c) {
          <!-- Destaque: nome e estado -->
          <section class="mt-4 rounded-xl bg-primary-deep p-5 text-white sm:p-6" aria-live="polite">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-white/60">{{ textos().candidato }}</p>
                <p class="mt-1 break-words text-xl font-bold leading-tight sm:text-2xl">{{ c.dados.nome || vazio }}</p>
              </div>
              <span class="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold"
                [class]="classeEstado()">
                <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
                {{ textos().estado }}: {{ c.estadoRotulo || vazio }}
              </span>
            </div>

            <div class="mt-5 flex flex-col gap-4 border-t border-white/15 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <dl class="grid gap-3 text-xs sm:grid-cols-2 sm:gap-8">
                <div>
                  <dt class="text-[10px] uppercase tracking-wider text-white/60">{{ textos().codigo }}</dt>
                  <dd class="mt-1 font-mono text-sm font-bold tracking-wide">{{ c.codigo || vazio }}</dd>
                </div>
                <div>
                  <dt class="text-[10px] uppercase tracking-wider text-white/60">{{ textos().submetidaEm }}</dt>
                  <dd class="mt-1 text-sm">{{ submetidaEm() }}</dd>
                </div>
              </dl>
              @if (c.pdfUrl) {
                <app-botao class="whitespace-nowrap" variante="branco" icone="download" tamanho="sm" paddingX="px-4"
                  [aCarregar]="aDescarregar()" (clicado)="descarregar(c)">
                  {{ textos().descarregar }}
                </app-botao>
              }
            </div>
          </section>

          <!-- 1. Dados pessoais & disciplinas -->
          <section class="mt-4 rounded-xl border border-gray-200 p-5 sm:p-6">
            <h3 class="flex items-center gap-2 border-b border-gray-200 pb-3 text-base font-bold text-primary-deep">
              <app-icone nome="user" [tamanho]="18" class="text-primary" />
              {{ textos().secaoDados }}
            </h3>
            <dl class="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              @for (campo of camposDados(); track campo.rotulo) {
                <div>
                  <dt class="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{{ campo.rotulo }}</dt>
                  <dd class="mt-1 break-words text-sm text-primary-deep">{{ campo.valor }}</dd>
                </div>
              }
            </dl>
            <div class="mt-4 border-t border-gray-200 pt-4">
              <p class="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{{ textos().disciplinas }}</p>
              @if (c.disciplinas.length) {
                <ol class="mt-2 flex flex-col gap-2">
                  @for (escolhida of c.disciplinas; track $index) {
                    <li class="flex flex-wrap items-center gap-2">
                      <span class="rounded bg-[#E3F1E7] px-2.5 py-1 text-sm text-primary-deep">{{ escolhida.disciplina || vazio }}</span>
                      <span class="text-xs text-primary">{{ escolhida.curso }}</span>
                    </li>
                  }
                </ol>
              } @else {
                <p class="mt-1 text-sm text-primary-deep">{{ vazio }}</p>
              }
            </div>
          </section>

          <!-- 2. Formação & experiência -->
          <section class="mt-4 rounded-xl border border-gray-200 p-5 sm:p-6">
            <h3 class="flex items-center gap-2 border-b border-gray-200 pb-3 text-base font-bold text-primary-deep">
              <app-icone nome="graduation-cap" [tamanho]="18" class="text-primary" />
              {{ textos().secaoFormacao }}
            </h3>
            <dl class="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              @for (campo of camposFormacao(); track campo.rotulo) {
                <div>
                  <dt class="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{{ campo.rotulo }}</dt>
                  <dd class="mt-1 break-words text-sm">
                    @if (campo.ligacao) {
                      <a [href]="campo.ligacao" target="_blank" rel="noopener noreferrer"
                        class="break-all text-primary hover:underline">{{ campo.valor }}</a>
                    } @else {
                      <span class="text-primary-deep">{{ campo.valor }}</span>
                    }
                  </dd>
                </div>
              }
            </dl>

            <div class="mt-4 grid gap-x-8 gap-y-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
              <div>
                <p class="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{{ textos().experienciaDocente }}</p>
                @if (c.experienciasDocentes.length) {
                  <ol class="mt-2 flex flex-col gap-2">
                    @for (e of c.experienciasDocentes; track $index) {
                      <li>
                        <p class="text-sm text-primary-deep">
                          {{ e.disciplina || vazio }}
                          @if (e.tempo) {
                            <span class="ml-1 rounded bg-[#E3F1E7] px-2 py-0.5 text-xs">{{ e.tempo }}</span>
                          }
                        </p>
                        <p class="text-xs text-primary">{{ juntar(e.universidade, e.faculdade) }}</p>
                      </li>
                    }
                  </ol>
                  @if (c.experienciasDocentes[0].tempoArea) {
                    <p class="mt-2 text-xs text-text-secondary">{{ textos().total }}: {{ c.experienciasDocentes[0].tempoArea }}</p>
                  }
                } @else {
                  <p class="mt-1 text-sm text-primary-deep">{{ textos().nenhuma }}</p>
                }
              </div>
              <div>
                <p class="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{{ textos().experienciaProfissional }}</p>
                @if (c.experienciasProfissionais.length) {
                  <ol class="mt-2 flex flex-col gap-2">
                    @for (e of c.experienciasProfissionais; track $index) {
                      <li>
                        <p class="text-sm text-primary-deep">
                          {{ e.empresa || vazio }}
                          @if (e.tempo) {
                            <span class="ml-1 rounded bg-[#E3F1E7] px-2 py-0.5 text-xs">{{ e.tempo }}</span>
                          }
                        </p>
                        <p class="text-xs text-primary">{{ e.area }}</p>
                      </li>
                    }
                  </ol>
                  @if (c.experienciasProfissionais[0].tempoArea) {
                    <p class="mt-2 text-xs text-text-secondary">{{ textos().total }}: {{ c.experienciasProfissionais[0].tempoArea }}</p>
                  }
                } @else {
                  <p class="mt-1 text-sm text-primary-deep">{{ textos().nenhuma }}</p>
                }
              </div>
            </div>
          </section>

          <!-- 3. Dossier & declarações -->
          <section class="mt-4 rounded-xl border border-gray-200 p-5 sm:p-6">
            <h3 class="flex items-center gap-2 border-b border-gray-200 pb-3 text-base font-bold text-primary-deep">
              <app-icone nome="folder-input" [tamanho]="18" class="text-primary" />
              {{ textos().secaoDossier }}
            </h3>
            <ul class="mt-4 flex flex-col gap-2">
              @for (documento of documentos(); track documento.titulo) {
                <li class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-[#FBF8F6] px-4 py-3">
                  <span class="flex min-w-0 items-center gap-3">
                    <app-icone [nome]="documento.icone" [tamanho]="16" class="shrink-0 text-text-secondary" />
                    <span class="truncate text-sm font-medium text-primary-deep">{{ documento.titulo }}</span>
                  </span>
                  @if (documento.anexado) {
                    <span class="inline-flex shrink-0 items-center gap-1 rounded bg-[#E3F1E7] px-2 py-0.5 text-xs text-primary-deep">
                      <app-icone nome="badge-check" [tamanho]="13" class="text-primary" />
                      {{ textos().anexado }}
                    </span>
                  } @else {
                    <span class="shrink-0 text-xs text-text-secondary">{{ textos().naoAnexado }}</span>
                  }
                </li>
              }
            </ul>
            <ul class="mt-4 flex flex-col gap-2 text-sm text-primary-deep">
              @for (declaracao of declaracoes(); track declaracao.texto) {
                <li class="flex items-start gap-2">
                  <app-icone [nome]="declaracao.aceite ? 'circle-check' : 'x'" [tamanho]="16"
                    [class]="declaracao.aceite ? 'mt-0.5 shrink-0 text-primary' : 'mt-0.5 shrink-0 text-red-600'" />
                  {{ declaracao.texto }}
                </li>
              }
            </ul>
          </section>

          <div class="mt-6 flex justify-end">
            <app-botao variante="contorno" icone="search" tamanho="sm" paddingX="px-5" (clicado)="novaConsulta()">
              {{ textos().novaConsulta }}
            </app-botao>
          </div>
        }
      </div>
    </div>
  `,
})
export class ModalConsultarCandidaturaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly servico = inject(CandidaturaGeralConsultaService);
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly vazio = VAZIO;

  protected readonly termo = signal('');
  protected readonly aConsultar = signal(false);
  protected readonly aDescarregar = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly candidatura = signal<CandidaturaGeralConsultada | null>(null);
  private pedido: AbortController | null = null;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    return {
      fechar: t('Fechar', 'Close'),
      titulo: t('Consultar Candidatura', 'Check Application'),
      descricao: t(
        'Indique o código de identificação da candidatura ou o número do documento (BI / passaporte) usado ao candidatar-se.',
        'Enter the application identification code or the document number (ID card / passport) used when applying.',
      ),
      campo: t('Código ou Número do Documento (BI/Passaporte)', 'Code or Document Number (ID Card/Passport)'),
      campoPlaceholder: t('Ex.: AGRO-2026-DOC-849204 ou 006835372LA040', 'E.g. AGRO-2026-DOC-849204 or 006835372LA040'),
      consultar: t('Consultar', 'Search'),
      obrigatorio: t(
        'Indique o código da candidatura ou o nº do BI / passaporte.',
        'Enter the application code or the ID card / passport number.',
      ),
      naoEncontrada: t(
        'Não encontrámos nenhuma candidatura com esse código ou documento. Confirme o que escreveu.',
        'No application was found with that code or document. Please check what you typed.',
      ),
      erroRede: t(
        'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.',
        'Could not reach the server. Check your connection and try again.',
      ),
      erroGenerico: t(
        'Não foi possível consultar a candidatura. Tente novamente dentro de alguns instantes.',
        'The application could not be checked. Please try again in a few moments.',
      ),
      candidato: t('Candidato', 'Applicant'),
      estado: t('Estado', 'Status'),
      codigo: t('Código da candidatura', 'Application code'),
      submetidaEm: t('Submetida a', 'Submitted on'),
      descarregar: t('Descarregar ficha (PDF)', 'Download form (PDF)'),
      secaoDados: t('1. Dados Pessoais & Disciplinas', '1. Personal Details & Courses'),
      disciplinas: t('Disciplinas a Lecionar', 'Courses to Teach'),
      secaoFormacao: t('2. Formação Académica & Experiência', '2. Academic Background & Experience'),
      experienciaDocente: t('Experiência Docente', 'Teaching Experience'),
      experienciaProfissional: t('Experiência Profissional', 'Professional Experience'),
      total: t('Tempo estimado na área', 'Estimated time in the field'),
      nenhuma: t('Nenhuma indicada', 'None given'),
      secaoDossier: t('3. Dossier Documental & Declarações', '3. Document Dossier & Declarations'),
      anexado: t('Anexado', 'Attached'),
      naoAnexado: t('Não anexado', 'Not attached'),
      novaConsulta: t('Nova consulta', 'New search'),
    };
  });

  protected readonly classeEstado = computed(
    () => CLASSES_ESTADO[this.candidatura()?.estado ?? ''] ?? 'bg-white/15 text-white',
  );

  protected readonly submetidaEm = computed(() => {
    const data = this.candidatura()?.submetidaEm;
    if (!data || Number.isNaN(data.getTime())) {
      return VAZIO;
    }
    return new Intl.DateTimeFormat(this.traducao.idioma() === 'pt' ? 'pt-PT' : 'en-GB', {
      timeZone: FUSO_LUANDA,
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(data);
  });

  protected readonly camposDados = computed<CampoConsulta[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const dados = this.candidatura()?.dados;
    if (!dados) {
      return [];
    }
    return [
      { rotulo: t('Nome Completo', 'Full Name'), valor: dados.nome || VAZIO },
      { rotulo: t('Data de Nascimento', 'Date of Birth'), valor: formatarData(dados.nascimento) },
      { rotulo: t('N.º de BI / Passaporte', 'ID Card / Passport No.'), valor: dados.documento || VAZIO },
      { rotulo: t('Contacto Telefónico', 'Phone Number'), valor: formatarTelefone(dados.telefone) },
      { rotulo: t('E-mail Principal', 'Main E-mail'), valor: dados.email || VAZIO },
    ];
  });

  protected readonly camposFormacao = computed<CampoConsulta[]>(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const formacao = this.candidatura()?.formacao;
    if (!formacao) {
      return [];
    }
    const identificador = formacao.identificadorInvestigador;
    return [
      { rotulo: t('Grau Académico Mais Elevado', 'Highest Academic Degree'), valor: formacao.grau || VAZIO },
      { rotulo: t('Curso', 'Degree programme'), valor: formacao.curso || VAZIO },
      {
        rotulo: t('Universidade / Faculdade', 'University / Faculty'),
        valor: this.juntar(formacao.universidade, formacao.faculdade) || VAZIO,
      },
      { rotulo: t('País', 'Country'), valor: formacao.pais || VAZIO },
      {
        rotulo: t('Identificador de Investigador', 'Researcher Identifier'),
        valor: identificador ? identificador.replace(/^https?:\/\//i, '') : VAZIO,
        // Só links http(s): o valor vem do candidato e não pode virar `javascript:`.
        ligacao: /^https?:\/\//i.test(identificador) ? identificador : undefined,
      },
    ];
  });

  protected readonly documentos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const documentos = this.candidatura()?.documentos;
    if (!documentos) {
      return [];
    }
    return [
      { titulo: t('Curriculum Vitae Circunstanciado', 'Detailed Curriculum Vitae'), icone: 'file-text', anexado: documentos.curriculo },
      {
        titulo: t('Certificados de Habilitações & Equivalência', 'Qualification Certificates & Equivalence'),
        icone: 'graduation-cap',
        anexado: documentos.certificados,
      },
      { titulo: t('Comprovativos de Docência / I&D', 'Proof of Teaching / R&D'), icone: 'archive', anexado: documentos.comprovativos },
      { titulo: t('Carta de Motivação & Enquadramento', 'Motivation Letter & Institutional Fit'), icone: 'mail', anexado: documentos.carta },
    ];
  });

  protected readonly declaracoes = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const c = this.candidatura();
    if (!c) {
      return [];
    }
    return [
      { texto: t('Declaração sob compromisso de honra', 'Declaration on my honour'), aceite: c.declaracaoHonra },
      { texto: t('Consentimento para tratamento de dados pessoais', 'Consent to personal data processing'), aceite: c.consentimentoDados },
    ];
  });

  protected juntar(...partes: string[]): string {
    return partes.filter(Boolean).join(' · ');
  }

  protected async consultar(evento?: Event): Promise<void> {
    evento?.preventDefault();
    const termo = this.termo().trim();
    if (!termo) {
      this.erro.set(this.textos().obrigatorio);
      return;
    }
    // Uma consulta nova cancela a que ainda estiver a meio.
    this.pedido?.abort();
    const pedido = new AbortController();
    this.pedido = pedido;
    this.erro.set(null);
    this.aConsultar.set(true);
    try {
      this.candidatura.set(await this.servico.consultar(termo, pedido.signal));
    } catch (falha) {
      if (pedido.signal.aborted) {
        return;
      }
      this.candidatura.set(null);
      this.erro.set(this.mensagemErro(ErroApi.aPartirDe(falha)));
    } finally {
      if (this.pedido === pedido) {
        this.aConsultar.set(false);
        this.pedido = null;
      }
    }
  }

  protected novaConsulta(): void {
    this.candidatura.set(null);
    this.termo.set('');
    this.erro.set(null);
  }

  protected async descarregar(candidatura: CandidaturaGeralConsultada): Promise<void> {
    if (!this.ehBrowser || !candidatura.pdfUrl || this.aDescarregar()) {
      return;
    }
    this.aDescarregar.set(true);
    try {
      await descarregarFicheiro(candidatura.pdfUrl, `${candidatura.codigo || 'candidatura'}.pdf`);
    } finally {
      this.aDescarregar.set(false);
    }
  }

  protected fechar(): void {
    this.pedido?.abort();
    this.modais.fechar(ID_MODAL_CONSULTAR_CANDIDATURA);
  }

  /** 404 é "não encontrada"; o 422 do Laravel já diz o que falta, em português. */
  private mensagemErro(erro: ErroApi): string {
    const t = this.textos();
    if (erro.estado === 404) {
      return t.naoEncontrada;
    }
    const doServidor = Object.values(erro.errosValidacao).flat();
    if (doServidor.length) {
      // `codigo` e `n_documento` repetem a mesma frase: basta uma.
      return [...new Set(doServidor)].join(' ');
    }
    return erro.estado === 0 ? t.erroRede : t.erroGenerico;
  }
}

/** `1982-05-14` → `14/05/1982`. */
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : VAZIO;
}

/** `923000000` → `+244 923 000 000`; outros formatos ficam como vieram. */
function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  return digitos.length === 9 ? `+244 ${digitos.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}` : telefone || VAZIO;
}
