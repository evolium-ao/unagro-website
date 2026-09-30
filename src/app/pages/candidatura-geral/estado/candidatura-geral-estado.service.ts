import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { debounceTime, filter, merge } from 'rxjs';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';

/** Chave do rascunho no `localStorage` do navegador. */
const CHAVE_RASCUNHO = 'unagro.candidatura-geral.rascunho';
/** Pausa na escrita a partir da qual o rascunho é gravado sozinho. */
const ESPERA_RASCUNHO_AUTOMATICO_MS = 800;
const MAXIMO_TEXTO_CURTO = 255;
/** Limite da "Síntese curricular" da etapa 2 — o contador do campo mostra-o. */
export const MAXIMO_SINTESE = 500;

/** Ligação do perfil de investigador (ORCID, CiênciaVitae, …): `http(s)://` e um domínio. */
const REGEX_LIGACAO = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

function validarLigacao(controlo: AbstractControl): ValidationErrors | null {
  const valor = (controlo.value ?? '').toString().trim();
  if (!valor) {
    return null;
  }
  return REGEX_LIGACAO.test(valor) ? null : { ligacaoInvalida: 'Ligação inválida (use https://…)' };
}

/** BI angolano (9 dígitos, 2 letras, 3 dígitos) ou passaporte (6 a 12 caracteres alfanuméricos). */
const REGEX_BI = /^\d{9}[A-Za-z]{2}\d{3}$/;
const REGEX_PASSAPORTE = /^[A-Za-z0-9]{6,12}$/;

function validarDocumentoIdentificacao(controlo: AbstractControl): ValidationErrors | null {
  const valor = (controlo.value ?? '').toString().trim();
  if (!valor) {
    return null;
  }
  return REGEX_BI.test(valor) || REGEX_PASSAPORTE.test(valor) ? null : { biInvalido: true };
}

/** Limites do dossier da etapa 3, em MB — os textos "Formatos: … até N MB" lêem-nos daqui. */
export const LIMITES_DOSSIER_MB = {
  curriculo: 10,
  certificados: 10,
  comprovativos: 15,
  carta: 5,
  total: 25,
} as const;

/** Campos de ficheiro: um `File` não se serializa, por isso nunca vão para o rascunho. */
const CAMPOS_FICHEIRO = new Set(['curriculo', 'certificados', 'comprovativos', 'carta']);

function semFicheiros(valores: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(valores).filter(([campo]) => !CAMPOS_FICHEIRO.has(campo)));
}

/** Soma dos anexos do dossier acima de `LIMITES_DOSSIER_MB.total` (validador do grupo). */
function validarTamanhoTotalDossier(grupo: AbstractControl): ValidationErrors | null {
  const valores = Object.values((grupo as FormGroup).getRawValue() as Record<string, unknown>);
  const bytes = valores.reduce<number>((soma, valor) => soma + (valor instanceof File ? valor.size : 0), 0);
  return bytes > LIMITES_DOSSIER_MB.total * 1024 * 1024 ? { dossierMuitoGrande: true } : null;
}

/** Etapas do formulário, pela ordem das rotas `etapa-1` … `etapa-4`. */
export type NumeroEtapa = 1 | 2 | 3 | 4;

/**
 * Estado partilhado do formulário da candidatura docente. Vive na raiz para
 * sobreviver à navegação entre `/candidatura-geral/etapa-N`: cada etapa é uma
 * rota própria, mas os dados são um só.
 *
 * O grupo da etapa 4 (revisão) entra aqui se precisar de campos próprios.
 */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralEstadoService {
  private readonly validacao = inject(ValidacaoService);
  private readonly conteudo = inject(CandidaturaGeralService);
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /** Etapa 1 — dados pessoais, contacto e área de candidatura. */
  readonly dados = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    nascimento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (c) => this.validacao.maiorDeIdadeValidator(c)],
    }),
    documento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarDocumentoIdentificacao],
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (c) => this.validacao.validarTelefone(c)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (c) => this.validacao.validarEmail(c)],
    }),
    area: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    areaComplementar: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
  });

  /** Etapa 2 — formação académica e experiência docente/profissional. */
  readonly formacao = new FormGroup({
    grau: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    instituicao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    especializacao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    identificadorInvestigador: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(MAXIMO_TEXTO_CURTO), validarLigacao],
    }),
    tempoDocencia: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    experienciaPratica: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    sintese: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_SINTESE)],
    }),
  });

  /** Etapa 3 — dossier documental (ficheiros) e declarações. */
  readonly dossier = new FormGroup(
    {
      curriculo: new FormControl<File | null>(null, {
        validators: [Validators.required, this.validacao.validarFicheiro(['pdf'], LIMITES_DOSSIER_MB.curriculo)],
      }),
      certificados: new FormControl<File | null>(null, {
        validators: [Validators.required, this.validacao.validarFicheiro(['pdf'], LIMITES_DOSSIER_MB.certificados)],
      }),
      comprovativos: new FormControl<File | null>(null, {
        validators: [this.validacao.validarFicheiro(['pdf', 'zip'], LIMITES_DOSSIER_MB.comprovativos)],
      }),
      carta: new FormControl<File | null>(null, {
        validators: [Validators.required, this.validacao.validarFicheiro(['pdf'], LIMITES_DOSSIER_MB.carta)],
      }),
      compromissoHonra: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
      consentimentoDados: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    },
    { validators: [validarTamanhoTotalDossier] },
  );

  private readonly grupos: Record<number, FormGroup> = { 1: this.dados, 2: this.formacao, 3: this.dossier };

  private readonly idAreaSelecionada = toSignal(this.dados.controls.area.valueChanges, {
    initialValue: this.dados.controls.area.value,
  });

  /** Área escolhida na etapa 1, já traduzida — é o cartão "Área seleccionada" do topo. */
  readonly areaSelecionada = computed(
    () => this.conteudo.areas().find((area) => area.id === this.idAreaSelecionada()) ?? null,
  );

  constructor() {
    this.restaurarRascunho();
    this.guardarRascunhoAutomaticamente();
  }

  /** Marca os campos da etapa como tocados (para mostrar os erros) e diz se é válida. */
  validarEtapa(etapa: NumeroEtapa): boolean {
    const grupo = this.grupos[etapa];
    if (!grupo) {
      return true;
    }
    grupo.markAllAsTouched();
    return grupo.valid;
  }

  /**
   * Primeira etapa anterior a `etapa` ainda por completar, ou `null` se todas
   * estiverem válidas. Não marca campos — é o que a guarda das rotas consulta.
   */
  primeiraEtapaInvalidaAntes(etapa: NumeroEtapa): NumeroEtapa | null {
    for (let anterior = 1; anterior < etapa; anterior++) {
      if (this.grupos[anterior]?.invalid) {
        return anterior as NumeroEtapa;
      }
    }
    return null;
  }

  /** Grava os campos de texto de todas as etapas. Ficheiros nunca vão para o rascunho. */
  guardarRascunho(): boolean {
    if (!this.ehNavegador) {
      return false;
    }
    try {
      const rascunho = Object.fromEntries(
        Object.entries(this.grupos).map(([etapa, grupo]) => [etapa, semFicheiros(grupo.getRawValue())]),
      );
      localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho));
      return true;
    } catch {
      return false;
    }
  }

  /** Apaga o rascunho e volta a pôr o formulário em branco. */
  limpar(): void {
    Object.values(this.grupos).forEach((grupo) => grupo.reset());
    if (!this.ehNavegador) {
      return;
    }
    try {
      localStorage.removeItem(CHAVE_RASCUNHO);
    } catch {
      // Armazenamento bloqueado: não há rascunho para apagar.
    }
  }

  /**
   * Grava o rascunho sozinho a cada pausa na escrita, em todas as etapas. O
   * serviço vive na raiz, por isso a subscrição dura o tempo da aplicação.
   * O botão "Guardar Rascunho" continua a gravar na hora e a confirmar.
   */
  private guardarRascunhoAutomaticamente(): void {
    if (!this.ehNavegador) {
      return;
    }
    const grupos = Object.values(this.grupos);
    merge(...grupos.map((grupo) => grupo.valueChanges))
      .pipe(
        debounceTime(ESPERA_RASCUNHO_AUTOMATICO_MS),
        // Nada mexido pelo utilizador: é o `reset()` do "Cancelar", que acabou de
        // apagar o rascunho — gravar agora escreveria um rascunho vazio.
        filter(() => grupos.some((grupo) => grupo.dirty)),
      )
      .subscribe(() => this.guardarRascunho());
  }

  private restaurarRascunho(): void {
    if (!this.ehNavegador) {
      return;
    }
    try {
      const bruto = localStorage.getItem(CHAVE_RASCUNHO);
      if (!bruto) {
        return;
      }
      const rascunho = JSON.parse(bruto) as Record<string, Record<string, unknown>>;
      for (const [etapa, valores] of Object.entries(rascunho)) {
        // `semFicheiros` também aqui: um rascunho antigo com `{}` num campo de
        // ficheiro faria o `required` passar sem haver anexo.
        this.grupos[Number(etapa)]?.patchValue(semFicheiros(valores ?? {}));
      }
    } catch {
      // Rascunho ilegível ou armazenamento bloqueado: começa em branco.
    }
  }
}
