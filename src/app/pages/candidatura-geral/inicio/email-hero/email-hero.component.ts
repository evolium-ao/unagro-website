import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidacaoService } from '../../../../core/servicos/Validacao.service';
import { TraducaoService } from '../../../../core/traducao/traducao.service';
import { BotaoComponent } from '../../../../shared/componentes/botao/botao.component';
import { IconeComponent } from '../../../../shared/componentes/icone/icone.component';
import {
  FormFieldInputComponentV2,
  LeftIconDirective,
  RightIconDirective,
} from '../../../../shared/componentes/input-field/form-input-field';

/**
 * Campo de e-mail com o botão "Candidatar" do hero da convocatória docente.
 * Não submete nada: valida o endereço e entrega-o à página, que abre a etapa 1
 * com ele já preenchido.
 */
@Component({
  selector: 'app-email-hero-candidatura',
  imports: [
    ReactiveFormsModule,
    FormFieldInputComponentV2,
    LeftIconDirective,
    RightIconDirective,
    BotaoComponent,
    IconeComponent,
  ],
  template: `
    <form
      [formGroup]="formulario"
      (ngSubmit)="submeter()"
      class="mx-auto mt-8 w-full max-w-md md:mx-0"
      data-animar="ctas"
      novalidate
    >
      <form-input-field
        formControlName="email"
        type="email"
        [placeholder]="textos().placeholder"
        [erro]="erroEmail()"
        [ocultarRotuloVazio]="true"
        class="[&_[role=alert]]:text-red-300"
      >
        <app-icone leftIcon nome="mail" [tamanho]="18" class="text-text-secondary" />
        <app-botao rightIcon tipo="submit" variante="primario" tamanho="sm" icone="arrow-right" posicaoIcone="direita">
          {{ textos().botao }}
        </app-botao>
      </form-input-field>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailHeroComponent {
  private readonly traducao = inject(TraducaoService);
  private readonly validacao = inject(ValidacaoService);

  /** E-mail já validado, pronto para pré-preencher a etapa 1. */
  readonly enviado = output<string>();

  protected readonly formulario = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, (controlo) => this.validacao.validarEmail(controlo)],
    }),
  });

  /** O erro acompanha os eventos do formulário, como o `criarErrosFormulario`. */
  private readonly eventos = toSignal(this.formulario.events);
  protected readonly erroEmail = computed(() => {
    this.eventos();
    return this.validacao.getErro(this.formulario, 'email');
  });

  protected readonly textos = computed(() => ({
    placeholder: this.traducao.getTraducao(['Insira o seu e-mail profissional', 'Enter your professional e-mail']),
    botao: this.traducao.getTraducao(['Candidatar', 'Apply']),
  }));

  protected submeter(): void {
    const controlo = this.formulario.controls.email;
    controlo.markAsTouched();
    if (controlo.invalid) {
      return;
    }
    this.enviado.emit(controlo.value.trim());
  }
}
