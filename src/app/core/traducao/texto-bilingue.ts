/**
 * Texto nos dois idiomas, na ordem de `IDIOMAS_DISPONIVEIS` (`[pt, en]`), pronto
 * a ser resolvido por `TraducaoService.getTraducao`. É a forma que os dados
 * vindos da API tomam, ao contrário do `TextoTraduzido` (`{ pt, en }`) usado
 * pelos mocks antigos com o `localizarProfundo`.
 */
export type TextoBilingue = [string, string];
