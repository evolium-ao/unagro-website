import { Injectable, computed, inject, signal } from '@angular/core';
import { BOLSAS_MOCK } from '../dados/bolsas.mock';
import { CALENDARIO_ACADEMICO_MOCK } from '../dados/calendario-academico.mock';
import { PASSOS_CANDIDATURA_MOCK } from '../dados/passos-candidatura.mock';
import {
  DOCUMENTOS_CANDIDATURA_MOCK,
  REQUISITOS_POR_NIVEL_MOCK,
} from '../dados/requisitos-candidatura.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class CandidaturasService {
  private readonly traducao = inject(TraducaoService);
  private readonly passosBrutos = signal(PASSOS_CANDIDATURA_MOCK);
  private readonly bolsasBrutas = signal(BOLSAS_MOCK);
  private readonly calendarioBruto = signal(CALENDARIO_ACADEMICO_MOCK);
  private readonly documentosBrutos = signal(DOCUMENTOS_CANDIDATURA_MOCK);
  private readonly requisitosPorNivelBrutos = signal(REQUISITOS_POR_NIVEL_MOCK);

  readonly passos = computed(() => localizarProfundo(this.passosBrutos(), this.traducao.idioma()));
  readonly bolsas = computed(() => localizarProfundo(this.bolsasBrutas(), this.traducao.idioma()));
  readonly calendario = computed(() => localizarProfundo(this.calendarioBruto(), this.traducao.idioma()));
  readonly documentos = computed(() => localizarProfundo(this.documentosBrutos(), this.traducao.idioma()));
  readonly requisitosPorNivel = computed(() =>
    localizarProfundo(this.requisitosPorNivelBrutos(), this.traducao.idioma()),
  );
}
