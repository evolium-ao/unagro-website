import { Idioma } from './idioma';
import { TextoTraduzido } from './texto-traduzido';

type Localizado<T> = T extends TextoTraduzido
  ? string
  : T extends Array<infer U>
    ? Localizado<U>[]
    : T extends object
      ? { [K in keyof T]: Localizado<T[K]> }
      : T;

function ehTextoTraduzido(valor: unknown): valor is TextoTraduzido {
  return (
    !!valor &&
    typeof valor === 'object' &&
    !Array.isArray(valor) &&
    typeof (valor as Record<string, unknown>)['pt'] === 'string' &&
    typeof (valor as Record<string, unknown>)['en'] === 'string' &&
    Object.keys(valor as object).length === 2
  );
}

/** Percorre recursivamente um objeto/array e resolve todos os campos `TextoTraduzido` para o idioma dado. */
export function localizarProfundo<T>(valor: T, idioma: Idioma): Localizado<T> {
  if (ehTextoTraduzido(valor)) {
    return valor[idioma] as Localizado<T>;
  }
  if (Array.isArray(valor)) {
    return valor.map((item) => localizarProfundo(item, idioma)) as Localizado<T>;
  }
  if (valor && typeof valor === 'object') {
    const resultado: Record<string, unknown> = {};
    for (const chave of Object.keys(valor)) {
      resultado[chave] = localizarProfundo((valor as Record<string, unknown>)[chave], idioma);
    }
    return resultado as Localizado<T>;
  }
  return valor as Localizado<T>;
}
