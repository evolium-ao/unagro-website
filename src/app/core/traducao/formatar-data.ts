import { Idioma } from './idioma';

/**
 * `pt` em vez de `pt-PT`: para este conjunto de campos o CLDR resolve `pt-PT`
 * num padrão numérico ("10/08/2026"), perdendo o nome abreviado do mês.
 */
const LOCAIS: Record<Idioma, string> = { pt: 'pt', en: 'en-GB' };

/**
 * Formata uma data ISO como "24 out 2026" — dia, mês abreviado e ano.
 * Usa `formatToParts` para descartar os conectores que o português insere
 * ("24 de out. de 2026"), deixando a capitalização ao cuidado do CSS.
 */
export function formatarDataCurta(iso: string, idioma: Idioma): string {
  const partes = new Intl.DateTimeFormat(LOCAIS[idioma], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(new Date(iso));

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? '';

  return `${valor('day')} ${valor('month').replace('.', '')} ${valor('year')}`;
}

/**
 * Formata um mês no formato do `<input type="month">` ("AAAA-MM") como "set 2015"
 * — mês abreviado e ano, sem o ponto final que o português insere.
 */
export function formatarMesAno(mesAno: string, idioma: Idioma): string {
  const [ano, mes] = mesAno.split('-').map(Number);
  const partes = new Intl.DateTimeFormat(LOCAIS[idioma], { month: 'short', year: 'numeric' }).formatToParts(
    new Date(ano, mes - 1, 1),
  );
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? '';

  return `${valor('month').replace('.', '')} ${valor('year')}`;
}

/**
 * Formata a antiguidade de uma data como "há 2 dias" / "2 days ago", escolhendo
 * a unidade mais legível (horas até um dia, depois dias, meses e anos).
 */
export function formatarTempoRelativo(iso: string, idioma: Idioma): string {
  const formatador = new Intl.RelativeTimeFormat(LOCAIS[idioma], { numeric: 'auto' });
  const horas = Math.round((new Date(iso).getTime() - Date.now()) / 3_600_000);

  if (Math.abs(horas) < 24) {
    return formatador.format(horas, 'hour');
  }
  const dias = Math.round(horas / 24);
  if (Math.abs(dias) < 30) {
    return formatador.format(dias, 'day');
  }
  const meses = Math.round(dias / 30);
  return Math.abs(meses) < 12
    ? formatador.format(meses, 'month')
    : formatador.format(Math.round(meses / 12), 'year');
}

/**
 * Formata o intervalo de um evento, condensando o que as duas datas têm em comum:
 * "15-17 agosto 2026", "30 agosto - 2 setembro 2026" ou, sem data de fim,
 * "15 agosto 2026". A capitalização fica ao cuidado do CSS.
 */
export function formatarIntervaloDatas(
  inicioIso: string,
  fimIso: string | undefined,
  idioma: Idioma,
): string {
  const formatador = new Intl.DateTimeFormat(LOCAIS[idioma], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const campos = (iso: string) => {
    const partes = formatador.formatToParts(new Date(iso));
    const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
      partes.find((parte) => parte.type === tipo)?.value ?? '';
    return { dia: valor('day'), mes: valor('month'), ano: valor('year') };
  };

  const inicio = campos(inicioIso);
  if (!fimIso) {
    return `${inicio.dia} ${inicio.mes} ${inicio.ano}`;
  }

  const fim = campos(fimIso);
  if (inicio.mes === fim.mes && inicio.ano === fim.ano) {
    return `${inicio.dia}-${fim.dia} ${fim.mes} ${fim.ano}`;
  }
  if (inicio.ano === fim.ano) {
    return `${inicio.dia} ${inicio.mes} - ${fim.dia} ${fim.mes} ${fim.ano}`;
  }
  return `${inicio.dia} ${inicio.mes} ${inicio.ano} - ${fim.dia} ${fim.mes} ${fim.ano}`;
}
