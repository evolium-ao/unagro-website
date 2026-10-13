import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AREAS_CANDIDATURA_GERAL_MOCK,
  AREAS_TRABALHO_CANDIDATURA_GERAL_MOCK,
  PAISES_CANDIDATURA_GERAL,
  TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK,
  CRITERIOS_CANDIDATURA_GERAL_MOCK,
  DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK,
  DOCUMENTOS_CANDIDATURA_GERAL_MOCK,
  GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK,
  INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK,
  PASSOS_CANDIDATURA_GERAL_MOCK,
  PRAZO_CANDIDATURA_GERAL,
} from '../dados/candidatura-geral.mock';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ofertaCurricularQueries } from '../consultas/oferta-curricular.queries';
import { DisciplinaEscolhidaCandidaturaGeral } from '../modelos/candidatura-geral.model';
import { OfertaCurricularService } from './oferta-curricular.service';
import { localizarProfundo } from '../traducao/localizar-profundo';
import { TraducaoService } from '../traducao/traducao.service';

/** Conteúdo da convocatória docente (`/candidatura-geral`). */
@Injectable({ providedIn: 'root' })
export class CandidaturaGeralService {
  private readonly traducao = inject(TraducaoService);
  private readonly ofertaCurricular = inject(OfertaCurricularService);

  private readonly destaquesBrutos = signal(DESTAQUES_VISAO_CANDIDATURA_GERAL_MOCK);
  private readonly areasBrutas = signal(AREAS_CANDIDATURA_GERAL_MOCK);
  private readonly criteriosBrutos = signal(CRITERIOS_CANDIDATURA_GERAL_MOCK);
  private readonly passosBrutos = signal(PASSOS_CANDIDATURA_GERAL_MOCK);
  private readonly documentosBrutos = signal(DOCUMENTOS_CANDIDATURA_GERAL_MOCK);

  readonly prazo = signal(PRAZO_CANDIDATURA_GERAL).asReadonly();

  readonly destaquesVisao = computed(() =>
    localizarProfundo(this.destaquesBrutos(), this.traducao.idioma()),
  );
  readonly areas = computed(() => localizarProfundo(this.areasBrutas(), this.traducao.idioma()));
  readonly criterios = computed(() =>
    localizarProfundo(this.criteriosBrutos(), this.traducao.idioma()),
  );
  readonly passos = computed(() => localizarProfundo(this.passosBrutos(), this.traducao.idioma()));
  readonly documentos = computed(() =>
    localizarProfundo(this.documentosBrutos(), this.traducao.idioma()),
  );

  /**
   * Faculdade → curso → disciplinas, de `GET /candidaturas-docentes/areas`.
   * O serviço vive na raiz: a página inicial e o formulário partilham a mesma
   * consulta (e a cache), por isso a etapa 1 já a encontra carregada.
   */
  private readonly consultaOferta = injectQuery(() => ofertaCurricularQueries.lista(this.ofertaCurricular));

  readonly faculdades = computed(() => this.consultaOferta.data() ?? []);
  /** A oferta ainda não chegou (primeiro pedido). */
  readonly ofertaACarregar = computed(() => this.consultaOferta.isPending());
  /** O pedido falhou e não há oferta em cache para mostrar. */
  readonly ofertaFalhou = computed(() => this.consultaOferta.isError() && !this.consultaOferta.data());
  /** A oferta já chegou — só então os `id`s do rascunho e do URL podem ser validados. */
  readonly ofertaCarregada = computed(() => this.consultaOferta.isSuccess());

  readonly cursos = computed(() => this.faculdades().flatMap((faculdade) => faculdade.cursos));
  /** Volta a pedir a oferta (botão "Tentar novamente" do registo de disciplinas). */
  recarregarOferta(): void {
    void this.consultaOferta.refetch();
  }

  /** Cada disciplina (com o seu curso) por `id`, para validar as que chegam por URL ou rascunho. */
  readonly disciplinasPorId = computed(
    () =>
      new Map<string, DisciplinaEscolhidaCandidaturaGeral>(
        this.cursos().flatMap((curso) => curso.disciplinas.map((disciplina) => [disciplina.id, { disciplina, curso }])),
      ),
  );

  private readonly grausBrutos = signal(GRAUS_ACADEMICOS_CANDIDATURA_GERAL_MOCK);
  private readonly intervalosBrutos = signal(INTERVALOS_EXPERIENCIA_CANDIDATURA_GERAL_MOCK);
  private readonly temposDocenciaBrutos = signal(TEMPOS_DOCENCIA_CANDIDATURA_GERAL_MOCK);
  private readonly areasTrabalhoBrutas = signal(AREAS_TRABALHO_CANDIDATURA_GERAL_MOCK);

  /** Etapa 2 — graus académicos (cartões) e opções dos selects. */
  readonly grausAcademicos = computed(() =>
    localizarProfundo(this.grausBrutos(), this.traducao.idioma()),
  );
  /** Tempo de cada experiência profissional, em intervalos ("De 8 a 12 anos"). */
  readonly intervalosExperiencia = computed(() =>
    localizarProfundo(this.intervalosBrutos(), this.traducao.idioma()),
  );
  /** Tempo de cada experiência docente, em anos ("12 anos"). */
  readonly temposDocencia = computed(() =>
    localizarProfundo(this.temposDocenciaBrutos(), this.traducao.idioma()),
  );
  readonly areasTrabalho = computed(() =>
    localizarProfundo(this.areasTrabalhoBrutas(), this.traducao.idioma()),
  );

  /** Países por ordem alfabética no idioma do site (`{ id: 'AO', rotulo: 'Angola' }`). */
  readonly paises = computed(() => {
    const idioma = this.traducao.idioma();
    const nomes = new Intl.DisplayNames([idioma], { type: 'region' });
    return PAISES_CANDIDATURA_GERAL.map((id) => ({ id, rotulo: nomes.of(id) ?? id })).sort((a, b) =>
      a.rotulo.localeCompare(b.rotulo, idioma),
    );
  });

  /** Nomes das disciplinas da oferta, sem repetidos — opções de "Disciplina lecionada". */
  readonly nomesDisciplinas = computed(() =>
    [...new Set(this.cursos().flatMap((curso) => curso.disciplinas.map((disciplina) => disciplina.nome)))].sort(
      (a, b) => a.localeCompare(b, 'pt'),
    ),
  );
}
