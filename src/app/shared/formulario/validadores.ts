import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Telefone escrito com indicativo (`+244 900 000 000`), formato que o
 * `ValidacaoService.validarTelefone` recusa por só aceitar os nove dígitos. Aceita-se
 * aqui o indicativo e os espaços, mas reaproveita-se a chave `telefoneInvalido` para a
 * mensagem continuar a vir do catálogo do serviço.
 */
export function validarTelefoneComIndicativo(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const limpo = control.value.toString().replace(/[\s-]/g, '');
  return /^(\+?244)?\d{9}$/.test(limpo) ? null : { telefoneInvalido: true };
}
