import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { descarregarFicheiro } from '../../../core/api/descarregar-ficheiro';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { AlertModalService } from '../alert-modal/alert-modal.service';
import { ModalDataService } from '../alert-modal/modal-data.service';
import { BotaoComponent } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';

/** Identificador do modal, para o abrir e fechar a partir de qualquer ponto da app. */
export const ID_MODAL_CANDIDATURA_SUBMETIDA = 'modal-candidatura-submetida';

/** O que quem abre passa em `data`: a candidatura que a API acabou de criar. */
export interface DadosCandidaturaSubmetida {
  /** `codigo` devolvido pela API, p. ex. `AGRO-2026-DOC-849204`. */
  codigo: string;
  /** Disciplinas a lecionar, já em texto (`Drones Agrícolas, Avicultura`); vazio mostra "—". */
  area: string;
  submetidaEm: Date;
  /** `pdf_url` da API — a ficha de candidatura. Sem ele, o comprovativo é impresso pelo browser. */
  pdfUrl?: string | null;
}

/** Página pública da convocatória — o que o bloco "Partilhar vaga" divulga. */
const ROTA_CONVOCATORIA = '/candidatura-geral';

/** Botão de partilha: o rótulo é a marca (excepto "Email"); `cor` pinta o ícone. */
interface RedePartilha {
  id: string;
  rotulo: string;
  icone: string;
  cor: string;
  endereco: string;
}

const FUSO_LUANDA = 'Africa/Luanda';
const DURACAO_COPIADO_MS = 2000;

/**
 * Confirmação final da candidatura docente, renderizada como template do
 * `AlertModalService` (sem header nem botões próprios). O formulário já foi
 * limpo quando o modal abre, por isso todas as saídas levam à página principal.
 */
@Component({
  selector: 'app-modal-candidatura-submetida',
  imports: [BotaoComponent, IconeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div class="h-2 bg-secondary" aria-hidden="true"></div>

      <button
        type="button"
        class="absolute right-4 top-6 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-text-primary transition-colors hover:bg-gray-200 hover:text-primary-deep"
        [attr.aria-label]="textos().fechar"
        (click)="voltarAoInicio()"
      >
        <app-icone nome="x" [tamanho]="18" />
      </button>

      <div class="px-5 pb-6 pt-12 sm:px-10 sm:pt-14">
        <div class="flex flex-col items-center text-center">
          <div class="rounded-2xl bg-primary/10 p-1.5" aria-hidden="true">
            <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-deep text-secondary">
              <app-icone nome="badge-check" [tamanho]="30" />
            </div>
          </div>

          <h2 class="mt-4 text-xl font-bold leading-tight text-primary-deep sm:text-2xl">
            {{ textos().titulo }}
          </h2>
          <p class="mt-2 max-w-md text-xs leading-relaxed text-text-secondary sm:text-sm">
            {{ textos().mensagem }}
          </p>
        </div>

        <div class="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {{ textos().rotuloCodigo }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <span class="break-all font-mono text-lg font-bold tracking-wide text-primary-deep sm:text-xl">
                  {{ codigo }}
                </span>
                <button
                  type="button"
                  class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
                  (click)="copiar()"
                >
                  <app-icone [nome]="copiado() ? 'check' : 'copy'" [tamanho]="14" />
                  <span aria-live="polite">{{ copiado() ? textos().copiado : textos().copiar }}</span>
                </button>
              </div>
            </div>

            <div class="sm:max-w-[45%] sm:text-right">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {{ textos().rotuloArea }}
              </p>
              <p class="mt-2 text-xs font-bold leading-snug text-primary sm:text-sm">{{ area }}</p>
            </div>
          </div>

          <div class="mt-5 flex items-start gap-2 border-t border-gray-200 pt-4 text-[11px] text-text-secondary sm:text-xs">
            <app-icone nome="clock" [tamanho]="16" class="mt-px shrink-0 text-primary" />
            <span>{{ textos().submetidoEm }}</span>
          </div>
        </div>

        <!-- Partilhar a convocatória -->
        <section class="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6" [attr.aria-label]="textos().partilharTitulo">
          <div class="flex items-start gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <app-icone nome="share-2" [tamanho]="16" />
            </span>
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {{ textos().partilharTitulo }}
              </p>
              <p class="mt-1 text-[11px] text-text-secondary sm:text-xs">{{ textos().partilharTexto }}</p>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-2 sm:flex-row">
            <label class="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
              <app-icone nome="link" [tamanho]="15" class="shrink-0 text-text-secondary" />
              <span class="sr-only">{{ textos().linkConvocatoria }}</span>
              <input
                #campoLink
                type="text"
                readonly
                class="min-w-0 flex-1 truncate bg-transparent font-mono text-xs text-text-primary outline-none"
                [value]="linkConvocatoria()"
                (focus)="selecionarTexto($event)"
              />
            </label>
            <button
              type="button"
              class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              (click)="copiarLink(campoLink)"
            >
              <app-icone [nome]="linkCopiado() ? 'check' : 'copy'" [tamanho]="14" />
              <span aria-live="polite">{{ linkCopiado() ? textos().linkCopiado : textos().copiarLink }}</span>
            </button>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            @for (rede of redes(); track rede.id) {
              <a
                [href]="rede.endereco"
                [attr.target]="rede.id === 'email' ? null : '_blank'"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:border-primary hover:text-primary-deep"
                [attr.aria-label]="textos().partilharEm + ' ' + rede.rotulo"
              >
                <app-icone [nome]="rede.icone" [tamanho]="16" [class]="rede.cor" />
                {{ rede.rotulo }}
              </a>
            }
          </div>
        </section>

        <div class="mt-8 grid gap-3 sm:grid-cols-[auto_auto] sm:items-center sm:justify-between sm:gap-6">
          <app-botao
            class="whitespace-nowrap"
            variante="profundo"
            icone="download"
            paddingX="px-5"
            paddingY="py-2.5"
            tamanho="sm"
            [larguraTotal]="true"
            [aCarregar]="aDescarregar()"
            (clicado)="descarregarComprovativo()"
          >
            {{ textos().descarregar }}
          </app-botao>
          <app-botao
            class="whitespace-nowrap"
            variante="contorno"
            icone="arrow-left"
            paddingX="px-5"
            paddingY="py-2.5"
            tamanho="sm"
            [larguraTotal]="true"
            (clicado)="voltarAoInicio()"
          >
            {{ textos().voltar }}
          </app-botao>
        </div>
      </div>
    </div>
  `,
})
export class ModalCandidaturaSubmetidaComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly modais = inject(AlertModalService);
  private readonly router = inject(Router);
  private readonly ehBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly dados = inject(ModalDataService).obterDados<DadosCandidaturaSubmetida>();

  protected readonly codigo = this.dados?.codigo ?? '—';
  protected readonly area = this.dados?.area?.trim() || '—';
  private readonly submetidaEm = this.dados?.submetidaEm ? new Date(this.dados.submetidaEm) : new Date();
  private readonly pdfUrl = this.dados?.pdfUrl?.trim() || null;

  /** A ficha em PDF está a ser descarregada (o botão mostra o indicador). */
  protected readonly aDescarregar = signal(false);

  protected readonly copiado = signal(false);
  private temporizadorCopiado: ReturnType<typeof setTimeout> | undefined;
  protected readonly linkCopiado = signal(false);
  private temporizadorLink: ReturnType<typeof setTimeout> | undefined;

  /**
   * Endereço público da convocatória, que o candidato partilha. Só existe no
   * browser (o modal nunca abre no SSR); no servidor fica o caminho relativo.
   */
  protected readonly linkConvocatoria = signal(
    this.ehBrowser ? new URL(ROTA_CONVOCATORIA, window.location.origin).href : ROTA_CONVOCATORIA,
  );

  /** WhatsApp, LinkedIn, Telegram e Email, com o endereço de partilha já montado. */
  protected readonly redes = computed<RedePartilha[]>(() => {
    const url = encodeURIComponent(this.linkConvocatoria());
    const t = this.textos();
    const mensagem = encodeURIComponent(t.mensagemPartilha);
    return [
      {
        id: 'whatsapp',
        rotulo: 'WhatsApp',
        icone: 'message-circle',
        cor: 'text-[#25D366]',
        endereco: `https://wa.me/?text=${encodeURIComponent(`${t.mensagemPartilha} ${this.linkConvocatoria()}`)}`,
      },
      {
        id: 'linkedin',
        rotulo: 'LinkedIn',
        icone: 'linkedin',
        cor: 'text-[#0A66C2]',
        endereco: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      },
      {
        id: 'telegram',
        rotulo: 'Telegram',
        icone: 'send',
        cor: 'text-[#229ED9]',
        endereco: `https://t.me/share/url?url=${url}&text=${mensagem}`,
      },
      {
        id: 'email',
        rotulo: t.email,
        icone: 'mail',
        cor: 'text-text-secondary',
        endereco: `mailto:?subject=${encodeURIComponent(t.assuntoEmail)}&body=${encodeURIComponent(
          `${t.mensagemPartilha}\n\n${this.linkConvocatoria()}`,
        )}`,
      },
    ];
  });
  private molduraImpressao: HTMLIFrameElement | null = null;

  protected readonly textos = computed(() => {
    const t = (pt: string, en: string) => this.traducao.getTraducao([pt, en]);
    const data = formatarDataLuanda(this.submetidaEm, this.traducao.idioma() === 'pt');
    return {
      fechar: t('Fechar e voltar à página principal', 'Close and return to the main page'),
      titulo: t('Candidatura Submetida com Sucesso!', 'Application Submitted Successfully!'),
      mensagem: t(
        'A sua manifestação de interesse preliminar para o corpo docente foi registada e encaminhada ao Gabinete de Instalação.',
        'Your preliminary expression of interest in joining the faculty has been recorded and forwarded to the Installation Office.',
      ),
      rotuloCodigo: t('Código de identificação da candidatura', 'Application identification code'),
      rotuloArea: t('Disciplinas a leccionar', 'Courses to teach'),
      copiar: t('Copiar', 'Copy'),
      copiado: t('Copiado', 'Copied'),
      submetidoEm: t(
        `Submetido a ${data.dia} às ${data.hora} (Hora de Luanda, GMT+1)`,
        `Submitted on ${data.dia} at ${data.hora} (Luanda time, GMT+1)`,
      ),
      descarregar: t('Descarregar Comprovativo (PDF)', 'Download Receipt (PDF)'),
      voltar: t('Voltar à Página Principal', 'Back to Main Page'),
      partilharTitulo: t('Partilhar vaga com colegas & investigadores', 'Share the call with colleagues & researchers'),
      partilharTexto: t(
        'Ajude a divulgar esta oportunidade académica na sua rede profissional',
        'Help spread this academic opportunity across your professional network',
      ),
      linkConvocatoria: t('Endereço da convocatória', 'Call address'),
      copiarLink: t('Copiar Link', 'Copy Link'),
      linkCopiado: t('Link copiado', 'Link copied'),
      partilharEm: t('Partilhar no', 'Share on'),
      email: t('Email', 'Email'),
      mensagemPartilha: t(
        'A AgroSophia está a recrutar docentes, investigadores e especialistas no sector do agronegócio. Candidate-se:',
        'AgroSophia is recruiting lecturers, researchers and specialists in the agribusiness sector. Apply here:',
      ),
      assuntoEmail: t(
        'Recrutamento de docentes no agronegócio — AgroSophia',
        'Agribusiness faculty recruitment — AgroSophia',
      ),
      // Rodapé do comprovativo em PDF (a nota antiga sobre o MESCTI saiu a pedido do cliente).
      rodape: t(
        'AgroSophia · Gabinete da Comissão Instaladora · Icolo e Bengo, República de Angola',
        'AgroSophia · Installation Committee Office · Icolo e Bengo, Republic of Angola',
      ),
      instituicao: t('Universidade Nacional de Agronomia (UNAGRO)', 'National University of Agronomy (UNAGRO)'),
      comprovativoTitulo: t('Comprovativo de Submissão de Candidatura', 'Application Submission Receipt'),
      comprovativoData: t('Data e hora de submissão', 'Submission date and time'),
      comprovativoNota: t(
        'Guarde este comprovativo. O código de identificação será pedido em qualquer contacto com o Gabinete de Instalação.',
        'Keep this receipt. The identification code will be requested in any contact with the Installation Office.',
      ),
    };
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.temporizadorCopiado);
      clearTimeout(this.temporizadorLink);
      this.removerMolduraImpressao();
    });
  }

  protected voltarAoInicio(): void {
    this.modais.fechar(ID_MODAL_CANDIDATURA_SUBMETIDA);
    void this.router.navigateByUrl('/candidatura-geral');
  }

  protected async copiar(): Promise<void> {
    if (!this.ehBrowser || !navigator.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.codigo);
    } catch {
      // Sem permissão (ou contexto não seguro): o código continua visível para copiar à mão.
      return;
    }
    this.copiado.set(true);
    clearTimeout(this.temporizadorCopiado);
    this.temporizadorCopiado = setTimeout(() => this.copiado.set(false), DURACAO_COPIADO_MS);
  }

  /** Copia o endereço; sem acesso à área de transferência, deixa-o seleccionado no campo para Ctrl+C. */
  protected async copiarLink(campo: HTMLInputElement): Promise<void> {
    if (!this.ehBrowser) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.linkConvocatoria());
    } catch {
      campo.focus();
      campo.select();
      return;
    }
    this.linkCopiado.set(true);
    clearTimeout(this.temporizadorLink);
    this.temporizadorLink = setTimeout(() => this.linkCopiado.set(false), DURACAO_COPIADO_MS);
  }

  /** Foco no campo do endereço selecciona-o todo, para copiar à mão num toque. */
  protected selecionarTexto(evento: Event): void {
    (evento.target as HTMLInputElement).select();
  }

  /**
   * Descarrega a ficha de candidatura do `pdf_url` da API, como `<codigo>.pdf`.
   * Sem `pdf_url`, imprime o comprovativo local.
   */
  protected async descarregarComprovativo(): Promise<void> {
    if (!this.ehBrowser || this.aDescarregar()) {
      return;
    }
    if (!this.pdfUrl) {
      this.imprimirComprovativo();
      return;
    }
    this.aDescarregar.set(true);
    try {
      await descarregarFicheiro(this.pdfUrl, `${this.codigo}.pdf`);
    } finally {
      this.aDescarregar.set(false);
    }
  }

  /**
   * Alternativa quando a API não devolve `pdf_url`: imprime um HTML simples num
   * iframe escondido e o "Guardar como PDF" do browser faz o resto. O iframe
   * evita o bloqueador de janelas que um `window.open` pode apanhar.
   */
  private imprimirComprovativo(): void {
    this.removerMolduraImpressao();

    const moldura = document.createElement('iframe');
    moldura.setAttribute('aria-hidden', 'true');
    moldura.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    moldura.onload = () => {
      const janela = moldura.contentWindow;
      if (!janela) {
        return;
      }
      janela.addEventListener('afterprint', () => this.removerMolduraImpressao());
      janela.focus();
      janela.print();
    };
    moldura.srcdoc = this.htmlComprovativo();
    document.body.appendChild(moldura);
    this.molduraImpressao = moldura;
  }

  private removerMolduraImpressao(): void {
    this.molduraImpressao?.remove();
    this.molduraImpressao = null;
  }

  private htmlComprovativo(): string {
    const t = this.textos();
    const e = escaparHtml;
    const idioma = this.traducao.idioma();
    return `<!doctype html>
<html lang="${idioma}">
<head>
<meta charset="utf-8">
<title>${e(t.comprovativoTitulo)} — ${e(this.codigo)}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 0; }
  .faixa { height: 6px; background: #C4A37D; }
  header { padding: 18px 0 14px; border-bottom: 1px solid #e5e7eb; }
  .instituicao { font-size: 18px; font-weight: 700; color: #0a2a1b; margin: 0; }
  h1 { font-size: 22px; color: #0a2a1b; margin: 24px 0 18px; }
  dl { margin: 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 18px; }
  .linha { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
  .linha:last-child { border-bottom: 0; }
  dt { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; margin-bottom: 4px; }
  dd { margin: 0; font-size: 15px; font-weight: 600; }
  .codigo { font-family: "Courier New", monospace; font-size: 22px; letter-spacing: .04em; color: #0a2a1b; }
  .nota { font-size: 13px; color: #374151; margin-top: 20px; line-height: 1.5; }
  footer { margin-top: 36px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; text-align: center; }
</style>
</head>
<body>
  <div class="faixa"></div>
  <header><p class="instituicao">${e(t.instituicao)}</p></header>
  <h1>${e(t.comprovativoTitulo)}</h1>
  <dl>
    <div class="linha"><dt>${e(t.rotuloCodigo)}</dt><dd class="codigo">${e(this.codigo)}</dd></div>
    <div class="linha"><dt>${e(t.rotuloArea)}</dt><dd>${e(this.area)}</dd></div>
    <div class="linha"><dt>${e(t.comprovativoData)}</dt><dd>${e(t.submetidoEm)}</dd></div>
  </dl>
  <p class="nota">${e(t.comprovativoNota)}</p>
  <footer>${e(t.rodape)}</footer>
</body>
</html>`;
  }
}

/**
 * Data e hora em Luanda, montadas peça a peça: o `pt-PT` do Intl dá o mês em
 * minúsculas e o mockup pede-o capitalizado ("24 de Maio de 2026").
 */
function formatarDataLuanda(data: Date, emPortugues: boolean): { dia: string; hora: string } {
  const valida = Number.isNaN(data.getTime()) ? new Date() : data;
  const partes = new Intl.DateTimeFormat(emPortugues ? 'pt-PT' : 'en-GB', {
    timeZone: FUSO_LUANDA,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(valida);
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? '';
  const mes = parte('month');
  const dia = emPortugues
    ? `${parte('day')} de ${mes.charAt(0).toUpperCase()}${mes.slice(1)} de ${parte('year')}`
    : `${parte('day')} ${mes} ${parte('year')}`;
  return { dia, hora: `${parte('hour')}:${parte('minute')}` };
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
