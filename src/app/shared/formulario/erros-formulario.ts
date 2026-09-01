import { Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { ValidacaoService } from '../../core/servicos/Validacao.service';

/**
 * Mensagens de erro do `ValidacaoService` como signals, uma por campo.
 *
 * O `getErro(campo)` devolve uma função que só é reavaliada quando a referência muda,
 * o que nunca acontece com componentes `OnPush`: aqui a fonte de verdade é o fluxo
 * `events` do formulário, pelo que tocar ou escrever num campo repinta a mensagem.
 *
 * Só pode ser chamada num contexto de injeção (inicializador de campo do componente),
 * e dentro de um componente que viva debaixo de um `[formGroup]`.
 */
export function criarErrosFormulario<C extends string>(
  campos: readonly C[],
): Record<C, Signal<string | null>> {
  const validacao = inject(ValidacaoService);
  const grupo = inject(FormGroupDirective).form;
  const eventos = toSignal(grupo.events, { initialValue: null });

  const erros = {} as Record<C, Signal<string | null>>;
  for (const campo of campos) {
    erros[campo] = computed(() => {
      eventos();
      return validacao.getErro(grupo, campo);
    });
  }

  return erros;
}
