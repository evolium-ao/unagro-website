import { DestroyRef, Signal, computed, inject, signal } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  const diretiva = inject(FormGroupDirective);
  const destroyRef = inject(DestroyRef);

  /**
   * O `[formGroup]` só é ligado depois de os filhos serem construídos: um componente
   * criado dentro de um `@if` já apanha a diretiva preenchida, mas um filho directo do
   * `<form>` vê `form` a nulo. Por isso o grupo é lido a cada leitura, e a subscrição
   * dos eventos é feita na primeira vez que ele existe.
   */
  const versao = signal(0);
  let inscricao: Subscription | null = null;

  const grupoLigado = (): FormGroup | null => {
    const grupo: FormGroup | null = diretiva.form ?? null;
    if (grupo && !inscricao) {
      inscricao = grupo.events.subscribe(() => versao.update((numero) => numero + 1));
      destroyRef.onDestroy(() => inscricao?.unsubscribe());
    }
    return grupo;
  };

  const erros = {} as Record<C, Signal<string | null>>;
  for (const campo of campos) {
    erros[campo] = computed(() => {
      versao();
      const grupo = grupoLigado();
      return grupo ? validacao.getErro(grupo, campo) : null;
    });
  }

  return erros;
}
