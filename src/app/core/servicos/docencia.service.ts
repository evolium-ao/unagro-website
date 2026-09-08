import { Injectable, computed, inject, signal } from '@angular/core';
import {
  REQUISITOS_DOCENCIA_MOCK,
  TITULACOES_DOCENCIA_MOCK,
  VANTAGENS_DOCENCIA_MOCK,
} from '../dados/docencia.mock';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

/** Conteúdo do recrutamento docente (`/candidaturas/docentes`). */
@Injectable({ providedIn: 'root' })
export class DocenciaService {
  private readonly traducao = inject(TraducaoService);
  private readonly vantagensBrutas = signal(VANTAGENS_DOCENCIA_MOCK);
  private readonly requisitosBrutos = signal(REQUISITOS_DOCENCIA_MOCK);
  private readonly titulacoesBrutas = signal(TITULACOES_DOCENCIA_MOCK);

  readonly vantagens = computed(() =>
    localizarProfundo(this.vantagensBrutas(), this.traducao.idioma()),
  );
  readonly requisitos = computed(() =>
    localizarProfundo(this.requisitosBrutos(), this.traducao.idioma()),
  );
  readonly titulacoes = computed(() =>
    localizarProfundo(this.titulacoesBrutas(), this.traducao.idioma()),
  );

  /**
   * Rótulo **em português** da titulação escolhida, a partir do `id` que o select
   * guarda. É o que vai no `maior_titulo` da candidatura: a API é monolingue e
   * guarda texto livre, por isso o backoffice tem de receber sempre a mesma
   * cadeia, mesmo quando o candidato preenche o formulário em inglês.
   */
  rotuloTitulacaoEmPortugues(id: string): string {
    return this.titulacoesBrutas().find((titulacao) => titulacao.id === id)?.rotulo.pt ?? id;
  }
}
