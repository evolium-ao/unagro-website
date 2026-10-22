import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NovoContacto } from '../modelos/contacto.model';

/**
 * Espelha o `ContatoRequest` do OpenAPI. Só `nome` e `email` são obrigatórios do
 * lado da API — confirmado com um `POST` vazio, que devolve 422 só nesses dois
 * campos ("O campo nome é obrigatório.", "O campo email é obrigatório.").
 * `tipo_interesse` e `mensagem` são texto livre, sem lista fechada de valores
 * (confirmado a mandar um `tipo_interesse` arbitrário, que passou a validação).
 */
interface ContatoRequest {
  nome: string;
  email: string;
  tipo_interesse?: string;
  mensagem?: string;
}

/**
 * Rótulo **em português** de cada opção do select "Assunto" do formulário de
 * `/contactos`, pelo `id` que o `FormControl` guarda. A API é monolingue e
 * `tipo_interesse` é texto livre — vai sempre a mesma cadeia para o backoffice,
 * mesmo quando o visitante preenche o formulário em inglês (mesmo padrão do
 * `DocenciaService.rotuloTitulacaoEmPortugues`, para o `maior_titulo` das
 * candidaturas de docentes).
 *
 * O canal de dúvidas da candidatura (`candidatura-geral/inicio`) tem o seu
 * próprio `POST /duvidas` (ver `DuvidasService`) e não passa por aqui.
 */
const ROTULOS_ASSUNTO_PT: Record<string, string> = {
  geral: 'Informação geral',
  candidaturas: 'Candidaturas',
  cursos: 'Cursos e formações',
  imprensa: 'Imprensa e parcerias',
};

/**
 * `POST /contatos` — a mensagem do formulário de contacto de `/contactos`. É
 * público (`security: []` no esquema): não leva `Authorization`.
 *
 * **Sem `listar()` nem ficheiro em `core/consultas/`**: `GET /contatos` pede
 * autenticação ("Não autenticado.") e o site nunca lê a lista — mesma decisão
 * de `CandidaturaDocentesService` e `InscricoesService`.
 */
@Injectable({ providedIn: 'root' })
export class ContatosService {
  private readonly api = inject(ApiService);

  /**
   * A resposta traz o contacto criado; o formulário só precisa de saber que
   * passou, por isso descarta-se o corpo em vez de se inventar um modelo que
   * ninguém lê.
   */
  criar(dados: NovoContacto, signal?: AbortSignal): Promise<void> {
    return this.api.post<unknown>('contatos', paraPedido(dados), { signal }).then(() => undefined);
  }
}

/** Onde os nomes dos campos do formulário viram os nomes da API. */
function paraPedido(dados: NovoContacto): ContatoRequest {
  return {
    nome: dados.nome,
    email: dados.email,
    tipo_interesse: dados.assunto ? (ROTULOS_ASSUNTO_PT[dados.assunto] ?? dados.assunto) : undefined,
    mensagem: dados.mensagem || undefined,
  };
}
