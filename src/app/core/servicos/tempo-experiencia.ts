import { OpcaoTempoCandidaturaGeral } from '../modelos/candidatura-geral.model';
import { Idioma } from '../traducao/idioma';

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
