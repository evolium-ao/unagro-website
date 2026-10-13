import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { debounceTime, filter, merge } from 'rxjs';
import { PAIS_PADRAO_CANDIDATURA_GERAL } from '../../../core/dados/candidatura-geral.mock';
import {
  ExperienciaDocenteCandidaturaGeral,
  ExperienciaProfissionalCandidaturaGeral,
} from '../../../core/modelos/candidatura-geral.model';
import { ValidacaoService } from '../../../core/servicos/Validacao.service';
import { CandidaturaGeralService } from '../../../core/servicos/candidatura-geral.service';

/** Chave do rascunho no `localStorage` do navegador. */
const CHAVE_RASCUNHO = 'unagro.candidatura-geral.rascunho';
/** Pausa na escrita a partir da qual o rascunho é gravado sozinho. */
const ESPERA_RASCUNHO_AUTOMATICO_MS = 800;
export const MAXIMO_TEXTO_CURTO = 255;
/** Disciplinas por candidatura — o `maxItems` de `areas` no `CandidaturaDocenteRequest`. */
export const MAXIMO_DISCIPLINAS = 5;
/** Entradas de cada lista de experiências — o `maxItems` da API. */
export const MAXIMO_EXPERIENCIAS = 10;

/** `id`s em texto, sem repetidos (o rascunho e o URL podem trazer qualquer coisa). */
function idsUnicos(ids: unknown): string[] {
  return Array.isArray(ids) ? [...new Set(ids.filter((id): id is string => typeof id === 'string' && !!id))] : [];
}

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

/**
 * Limites do dossier da etapa 3, em MB — os textos "Formatos: … até N MB" lêem-nos daqui.
 * São os da API (`POST /candidaturas-docentes`, medidos a 2026-10-13): por ficheiro
 * recusa com 422 acima destes valores; o pedido inteiro acima de ~25 MB é cortado
 * pelo servidor com 413, antes da validação — daí o total de 24 MB, com folga
 * para os campos de texto.
 */
export const LIMITES_DOSSIER_MB = {
  curriculo: 10,
  certificados: 10,
  comprovativos: 15,
  carta: 5,
  total: 24,
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

/** Entradas de uma lista do rascunho que têm todos os `campos` preenchidos com texto. */
function entradasValidas<T>(lista: unknown, campos: (keyof T & string)[]): T[] {
  if (!Array.isArray(lista)) {
    return [];
  }
  return lista.filter(
    (entrada): entrada is T =>
      !!entrada &&
      typeof entrada === 'object' &&
      campos.every((campo) => {
        const valor = (entrada as Record<string, unknown>)[campo];
        return typeof valor === 'string' && valor.trim() !== '';
      }),
  );
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
    /** `id`s das disciplinas a lecionar (secção 2). O `required` recusa a lista vazia. */
    disciplinas: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_DISCIPLINAS)],
    }),
  });

  /** Etapa 2 — formação académica e experiência docente/profissional. */
  readonly formacao = new FormGroup({
    grau: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    universidade: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    faculdade: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    curso: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(MAXIMO_TEXTO_CURTO)],
    }),
    pais: new FormControl(PAIS_PADRAO_CANDIDATURA_GERAL, { nonNullable: true }),
    identificadorInvestigador: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(MAXIMO_TEXTO_CURTO), validarLigacao],
    }),
    /** Lista da secção 2 — cada «Adicionar» junta uma. Pode ficar vazia. */
    experienciasDocentes: new FormControl<ExperienciaDocenteCandidaturaGeral[]>([], { nonNullable: true }),
    /** Lista da secção 3 — cada «Adicionar» junta uma. Pode ficar vazia. */
    experienciasProfissionais: new FormControl<ExperienciaProfissionalCandidaturaGeral[]>([], { nonNullable: true }),
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

  private readonly idsDisciplinas = toSignal(this.dados.controls.disciplinas.valueChanges, {
    initialValue: this.dados.controls.disciplinas.value,
  });

  /** Disciplinas escolhidas na etapa 1, com o curso — cartão do topo, revisão e modal. */
  readonly disciplinasSelecionadas = computed(() =>
    this.idsDisciplinas().flatMap((id) => {
      const escolhida = this.conteudo.disciplinasPorId().get(id);
      return escolhida ? [escolhida] : [];
    }),
  );

  /**
   * Pré-preenche as disciplinas vindas da página inicial (`?disciplinas=`). É uma
   * escolha acabada de fazer, por isso substitui a do rascunho. Com a oferta já
   * carregada, os `id`s que lá não existem caem logo; senão caem quando ela
   * chegar (ver `limparDisciplinasInexistentes`). Devolve se aplicou alguma.
   */
  preencherDisciplinas(ids: string[]): boolean {
    let escolhidas = idsUnicos(ids);
    if (this.conteudo.ofertaCarregada()) {
      const porId = this.conteudo.disciplinasPorId();
      escolhidas = escolhidas.filter((id) => porId.has(id));
    }
    if (!escolhidas.length) {
      return false;
    }
    const controlo = this.dados.controls.disciplinas;
    controlo.setValue(escolhidas.slice(0, MAXIMO_DISCIPLINAS));
    // "Sujo" para o rascunho automático gravar a escolha.
    controlo.markAsDirty();
    return true;
  }

  constructor() {
    this.restaurarRascunho();
    this.guardarRascunhoAutomaticamente();
    this.limparDisciplinasInexistentes();
  }

  /**
   * A oferta chega da API depois de o rascunho ser lido: só então se sabe que
   * `id`s ainda existem (um rascunho antigo, do tempo do mock, tem `id`s em
   * texto que a API não conhece). Corre quando a oferta chega ou muda; as
   * escolhas feitas depois disso já vêm do seletor, sempre válidas.
   */
  private limparDisciplinasInexistentes(): void {
    effect(() => {
      if (!this.conteudo.ofertaCarregada()) {
        return;
      }
      const porId = this.conteudo.disciplinasPorId();
      untracked(() => {
        const controlo = this.dados.controls.disciplinas;
        const validos = controlo.value.filter((id) => porId.has(id));
        if (validos.length !== controlo.value.length) {
          controlo.setValue(validos);
        }
      });
    });
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
      // Um rascunho antigo (com `area`) não tem disciplinas. Os `id`s que já não
      // existam na oferta só caem quando ela chegar da API.
      const disciplinas = this.dados.controls.disciplinas;
      disciplinas.setValue(idsUnicos(disciplinas.value).slice(0, MAXIMO_DISCIPLINAS));
      // As listas da etapa 2 vêm do JSON tal como foram gravadas: só passam as
      // entradas com todos os campos em texto (um rascunho antigo não as tem).
      const { experienciasDocentes, experienciasProfissionais } = this.formacao.controls;
      experienciasDocentes.setValue(
        entradasValidas(experienciasDocentes.value, ['universidade', 'faculdade', 'disciplina', 'tempo']),
      );
      experienciasProfissionais.setValue(
        entradasValidas(experienciasProfissionais.value, ['empresa', 'area', 'tempo']),
      );
      const pais = this.formacao.controls.pais;
      if (!pais.value) {
        pais.setValue(PAIS_PADRAO_CANDIDATURA_GERAL);
      }
    } catch {
      // Rascunho ilegível ou armazenamento bloqueado: começa em branco.
    }
  }
}
