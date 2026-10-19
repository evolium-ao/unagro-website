import { OpcaoTempoCandidaturaGeral } from '../modelos/candidatura-geral.model';
import { Idioma } from '../traducao/idioma';
import { formatarMesAno } from '../traducao/formatar-data';

/** Um período "De ___ à ___" (etapa 2, secção 2 — experiência docente). */
export interface PeriodoExperiencia {
  /** "AAAA-MM", formato do `<input type="month">`. */
  inicio: string;
  /** "AAAA-MM"; ignorado (pode vir vazio) quando `atual` é `true`. */
  fim: string;
  /** Ainda em curso: a duração conta até ao mês de `hoje`, em vez de `fim`. */
  atual: boolean;
}

/** Meses entre dois "AAAA-MM", inclusivo (de set/2015 a set/2015 já conta 1 mês). */
function mesesEntreMeses(inicio: string, fim: string): number {
  const [anoInicio, mesInicio] = inicio.split('-').map(Number);
  const [anoFim, mesFim] = fim.split('-').map(Number);
  const total = (anoFim - anoInicio) * 12 + (mesFim - mesInicio) + 1;
  return Math.max(total, 0);
}

/** "AAAA-MM" do mês de `data` (por omissão hoje), para fechar um período `atual`. */
function mesAtual(data: Date): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

/** Duração de um período, em meses. `inicio` vazio devolve 0. */
export function duracaoPeriodo(periodo: PeriodoExperiencia, hoje = new Date()): number {
  if (!periodo.inicio) {
    return 0;
  }
  const fim = periodo.atual ? mesAtual(hoje) : periodo.fim;
  return fim ? mesesEntreMeses(periodo.inicio, fim) : 0;
}

/** "7 anos e 3 meses" / "1 ano" / "Menos de 1 ano" — a partir de uma duração em meses. */
export function formatarDuracaoAnos(meses: number, idioma: Idioma): string {
  const en = idioma === 'en';
  if (meses < 12) {
    return meses <= 0 ? '' : en ? 'Less than 1 year' : 'Menos de 1 ano';
  }
  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;
  const txtAnos = en ? `${anos} ${anos === 1 ? 'year' : 'years'}` : `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  if (!restoMeses) {
    return txtAnos;
  }
  const txtMeses = en
    ? `${restoMeses} ${restoMeses === 1 ? 'month' : 'months'}`
    : `${restoMeses} ${restoMeses === 1 ? 'mês' : 'meses'}`;
  return en ? `${txtAnos} and ${txtMeses}` : `${txtAnos} e ${txtMeses}`;
}

/** "set 2015 – jul 2020" / "set 2015 – Actualmente" / "set 2015" (sem fim nem `atual`). */
export function formatarPeriodo(periodo: PeriodoExperiencia, idioma: Idioma): string {
  if (!periodo.inicio) {
    return '';
  }
  const inicio = formatarMesAno(periodo.inicio, idioma);
  if (periodo.atual) {
    return `${inicio} – ${idioma === 'en' ? 'Present' : 'Actualmente'}`;
  }
  return periodo.fim ? `${inicio} – ${formatarMesAno(periodo.fim, idioma)}` : inicio;
}

/** Soma a duração de vários períodos e devolve o texto total; '' se a lista for vazia. */
export function descreverTempoTotalPeriodo(
  periodos: PeriodoExperiencia[],
  idioma: Idioma,
  hoje = new Date(),
): string {
  if (!periodos.length) {
    return '';
  }
  const totalMeses = periodos.reduce((soma, periodo) => soma + duracaoPeriodo(periodo, hoje), 0);
  return formatarDuracaoAnos(totalMeses, idioma);
}

/**
 * "Tempo estimado de experiência na área" da etapa 2: soma os tempos de cada
 * experiência adicionada. Cada opção é um intervalo (`min`–`max` anos), por isso
 * o total também o é — "De 9 a 15 anos" — e fica aberto ("N anos ou mais") se
 * alguma experiência o for. Sem experiências devolve cadeia vazia.
 */
export function descreverTempoTotal(
  idsTempo: string[],
  opcoes: Pick<OpcaoTempoCandidaturaGeral, 'id' | 'min' | 'max'>[],
  idioma: Idioma,
): string {
  const escolhidas = idsTempo.flatMap((id) => opcoes.filter((opcao) => opcao.id === id));
  if (!escolhidas.length) {
    return '';
  }
  const min = escolhidas.reduce((soma, opcao) => soma + opcao.min, 0);
  const aberto = escolhidas.some((opcao) => opcao.max === null);
  const max = escolhidas.reduce((soma, opcao) => soma + (opcao.max ?? 0), 0);
  const en = idioma === 'en';
  const anos = (n: number) => (n === 1 ? (en ? '1 year' : '1 ano') : en ? `${n} years` : `${n} anos`);

  if (aberto) {
    // `min` conta (inclusivo): "5 anos ou mais" + "2 anos" → "7 anos ou mais".
    return en ? `${anos(min)} or more` : `${anos(min)} ou mais`;
  }
  if (max <= 1) {
    // Só experiências de "Menos de 1 ano".
    return en ? 'Less than 1 year' : 'Menos de 1 ano';
  }
  if (min === max) {
    return anos(min);
  }
  if (min === 0) {
    return en ? `Up to ${anos(max)}` : `Até ${anos(max)}`;
  }
  return en ? `${min} to ${anos(max)}` : `De ${min} a ${anos(max)}`;
}
