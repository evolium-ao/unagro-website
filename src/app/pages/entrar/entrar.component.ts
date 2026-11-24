import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ErroApi } from '../../core/api/erro-api';
import { Credenciais, Sessao } from '../../core/modelos/sessao.model';
import { AutenticacaoService } from '../../core/servicos/autenticacao.service';
import { SessaoService } from '../../core/servicos/sessao.service';
import { ValidacaoService } from '../../core/servicos/Validacao.service';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { BotaoSocialComponent } from '../../shared/componentes/botao-social/botao-social.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import {
  FormFieldInputComponentV2,
  LeftIconDirective,
} from '../../shared/componentes/input-field/form-input-field';
import { PainelMarcaAutenticacaoComponent } from '../../shared/componentes/painel-marca-autenticacao/painel-marca-autenticacao.component';
import { SeparadorTextoComponent } from '../../shared/componentes/separador-texto/separador-texto.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/**
 * Onde a entrada bem sucedida aterra. `/estudantes` é a página de portal que
 * existe hoje — TODO: apontar para o painel autenticado quando ele existir.
 */
const ROTA_APOS_ENTRAR = '/estudantes';

/**
 * Nome do campo na API → nome do campo no formulário, para os erros de
 * validação (422) do Laravel caírem no campo certo.
 */
const CAMPOS_DA_API: Record<string, string> = {
  email: 'email',
  password: 'palavraPasse',
};

@Component({
  selector: 'app-entrar',
  imports: [
    ReactiveFormsModule,
    BotaoComponent,
    BotaoSocialComponent,
    IconeComponent,
    FormFieldInputComponentV2,
    LeftIconDirective,
    PainelMarcaAutenticacaoComponent,
    SeparadorTextoComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './entrar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntrarComponent {
  protected readonly traducao = inject(TraducaoService);
  protected readonly validacao = inject(ValidacaoService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly sessaoService = inject(SessaoService);
  private readonly router = inject(Router);

  /**
   * O e-mail usa o `validarEmail` do `ValidacaoService` em vez do
   * `Validators.email` do Angular, que aceita endereços sem domínio de topo.
   */
  protected readonly formulario = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.validacao.validarEmail],
    }),
    palavraPasse: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lembrar: new FormControl(false, { nonNullable: true }),
  });

  protected readonly entrar = injectMutation<Sessao, ErroApi, Credenciais>(() => ({
    mutationFn: (credenciais) => this.autenticacao.entrar(credenciais),
    onSuccess: (sessao) => {
      this.sessaoService.guardar(sessao, this.formulario.getRawValue().lembrar);
      this.router.navigateByUrl(ROTA_APOS_ENTRAR);
    },
    onError: (erro) => this.distribuirErrosDeValidacao(erro),
  }));

  /**
   * Falha a mostrar em faixa. Os 422 ficam de fora: esses vão para os próprios
   * campos, e repeti-los aqui seria dizer duas vezes a mesma coisa.
   */
  protected readonly mensagemFalha = computed(() => {
    const erro = this.entrar.error();
    if (!erro || erro.estado === 422) return null;

    if (erro.estado === 401 || erro.estado === 403) {
      return this.traducao.getTraducao([
        'E-mail ou palavra-passe incorrectos.',
        'Incorrect email or password.',
      ]);
    }
    if (erro.estado === 0) {
      return this.traducao.getTraducao([
        'Não foi possível falar com o servidor. Verifique a ligação.',
        'Could not reach the server. Check your connection.',
      ]);
    }
    return this.traducao.getTraducao([
      'Não foi possível entrar. Tente de novo.',
      'Could not sign in. Please try again.',
    ]);
  });

  protected readonly anoAtual = new Date().getFullYear();

  protected readonly tituloPainel = computed(() =>
    this.traducao.getTraducao(['Portal\ndo estudante', 'Student\nportal']),
  );
  protected readonly subtituloPainel = computed(() =>
    this.traducao.getTraducao([
      'Excelência Académica e Agrária',
      'Academic and Agricultural Excellence',
    ]),
  );
  protected readonly descricaoPainel = computed(() =>
    this.traducao.getTraducao([
      'Bem-vindo ao portal institucional. Aceda aos seus recursos académicos, administrativos e de investigação num só lugar.',
      'Welcome to the institutional portal. Reach your academic, administrative and research resources in one place.',
    ]),
  );
  protected readonly altLogo = computed(() =>
    this.traducao.getTraducao(['Emblema da UNAGRO', 'UNAGRO emblem']),
  );
  protected readonly placeholderEmail = computed(() =>
    this.traducao.getTraducao(['exemploemail@gmail.com', 'exampleemail@gmail.com']),
  );
  protected readonly placeholderPalavraPasse = computed(() =>
    this.traducao.getTraducao(['Palavra-passe', 'Password']),
  );
  protected readonly rotuloLembrar = computed(() =>
    this.traducao.getTraducao(['Lembrar-me', 'Remember me']),
  );
  protected readonly rotuloEsqueci = computed(() =>
    this.traducao.getTraducao(['Esqueci a palavra-passe', 'Forgot my password']),
  );
  protected readonly rotuloEntrar = computed(() =>
    this.traducao.getTraducao(['Entrar no portal', 'Sign in to the portal']),
  );
  protected readonly textoSeparador = computed(() =>
    this.traducao.getTraducao(['ou entrar com', 'or sign in with']),
  );
  protected readonly rotuloDireitos = computed(() =>
    this.traducao.getTraducao([
      '© ' + this.anoAtual + ' Portal UNAGRO — todos os direitos reservados',
      '© ' + this.anoAtual + ' UNAGRO Portal — all rights reserved',
    ]),
  );

  protected submeter(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { email, palavraPasse } = this.formulario.getRawValue();
    this.entrar.mutate({ email: email.trim(), palavraPasse });
  }

  /** TODO: falta o fluxo de entrada por provedor externo — não há endpoint ainda. */
  protected entrarCom(provedor: 'google' | 'office365'): void {
    console.warn('Entrada por ' + provedor + ' ainda não está ligada à API.');
  }

  /**
   * Põe as mensagens de um 422 nos campos correspondentes. O `ValidacaoService`
   * mostra o texto tal como vem quando o valor do erro já é uma string, por
   * isso a mensagem da API chega ao ecrã sem tradução pelo meio.
   */
  private distribuirErrosDeValidacao(erro: ErroApi): void {
    for (const [campoApi, mensagens] of Object.entries(erro.errosValidacao)) {
      const controlo = this.formulario.get(CAMPOS_DA_API[campoApi] ?? campoApi);
      if (!controlo || !mensagens[0]) continue;
      controlo.setErrors({ erroApi: mensagens[0] });
      controlo.markAsTouched();
    }
  }
}
