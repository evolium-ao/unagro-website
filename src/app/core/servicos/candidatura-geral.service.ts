import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AREAS_CANDIDATURA_GERAL_MOCK,
  CRITERIOS_CANDIDATURA_GERAL_MOCK,
  DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK,
  DOCUMENTOS_CANDIDATURA_GERAL_MOCK,
  GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK,
  INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK,
  PARCEIROS_CANDIDATURA_GERAL_MOCK,
  PASSOS_CANDIDATURA_GERAL_MOCK,
  PRAZO_CANDIDATURA_GERAL,
  TERMOS_REFERENCIA_CANDIDATURA_GERAL_MOCK,
} from '../dados/candidatura-geral.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

/** Conteúdo da convocatória docente (`/candidatura-geral`). */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralService {
  private readonly traducao = inject(TraducaoService);

  private readonly parceirosBrutos = signal(PARCEIROS_CANDIDATURA_GERAL_MOCK);
  private readonly destaquesBrutos = signal(DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK);
  private readonly areasBrutas = signal(AREAS_CANDIDATURA_GERAL_MOCK);
  private readonly termosBrutos = signal(TERMOS_REFERENCIA_CANDIDATURA_GERAL_MOCK);
  private readonly criteriosBrutos = signal(CRITERIOS_CANDIDATURA_GERAL_MOCK);
  private readonly passosBrutos = signal(PASSOS_CANDIDATURA_GERAL_MOCK);
  private readonly documentosBrutos = signal(DOCUMENTOS_CANDIDATURA_GERAL_MOCK);

  readonly prazo = signal(PRAZO_CANDIDATURA_GERAL).asReadonly();

  readonly parceiros = computed(() =>
    localizarProfundo(this.parceirosBrutos(), this.traducao.idioma()),
  );
  readonly destaquesVisao = computed(() =>
    localizarProfundo(this.destaquesBrutos(), this.traducao.idioma()),
  );
  readonly areas = computed(() => localizarProfundo(this.areasBrutas(), this.traducao.idioma()));
  readonly termosReferencia = computed(() =>
    localizarProfundo(this.termosBrutos(), this.traducao.idioma()),
  );
  readonly criterios = computed(() =>
    localizarProfundo(this.criteriosBrutos(), this.traducao.idioma()),
  );
  readonly passos = computed(() => localizarProfundo(this.passosBrutos(), this.traducao.idioma()));
  readonly documentos = computed(() =>
    localizarProfundo(this.documentosBrutos(), this.traducao.idioma()),
  );

  private readonly grausBrutos = signal(GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK);
  private readonly intervalosBrutos = signal(INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK);

  /** Etapa 2 — graus académicos (cartões) e intervalos de anos (selects). */
  readonly grausAcademicos = computed(() =>
    localizarProfundo(this.grausBrutos(), this.traducao.idioma()),
  );
  readonly intervalosExperiencia = computed(() =>
    localizarProfundo(this.intervalosBrutos(), this.traducao.idioma()),
  );
}
