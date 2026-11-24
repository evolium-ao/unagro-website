import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Sessao } from '../modelos/sessao.model';

const CHAVE_ARMAZENAMENTO = 'unagro.sessao';

/**
 * Guarda quem está autenticado. Separado do `AutenticacaoService` de propósito:
 * aquele fala HTTP e não tem estado, este tem estado e não fala HTTP.
 *
 * O "Lembrar-me" do formulário de entrada é o que escolhe onde a sessão fica:
 * `localStorage` sobrevive a fechar o navegador, `sessionStorage` morre com o
 * separador. Nada disto existe no servidor, por isso todos os acessos passam
 * pelo `isPlatformBrowser` e por `try`/`catch` — em janela privada o próprio
 * acesso ao armazenamento pode lançar.
 */
@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly estado = signal<Sessao | null>(null);

  readonly sessao = this.estado.asReadonly();
  readonly autenticado = computed(() => this.estado() !== null);
  readonly token = computed(() => this.estado()?.token ?? null);
  readonly utilizador = computed(() => this.estado()?.utilizador ?? null);

  constructor() {
    this.estado.set(this.ler());
  }

  guardar(sessao: Sessao, lembrar: boolean): void {
    this.estado.set(sessao);
    if (!this.ehNavegador) return;

    // Trocar de opção sem limpar o outro armazenamento deixaria duas sessões
    // em disco, e a leitura apanharia a mais antiga.
    this.apagarDoArmazenamento();
    try {
      const destino = lembrar ? localStorage : sessionStorage;
      destino.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(sessao));
    } catch {
      // Sessão só em memória: dura o que durar o separador, mas o login vale.
    }
  }

  terminar(): void {
    this.estado.set(null);
    this.apagarDoArmazenamento();
  }

  private ler(): Sessao | null {
    if (!this.ehNavegador) return null;
    try {
      const cru =
        localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? sessionStorage.getItem(CHAVE_ARMAZENAMENTO);
      return cru ? (JSON.parse(cru) as Sessao) : null;
    } catch {
      return null;
    }
  }

  private apagarDoArmazenamento(): void {
    if (!this.ehNavegador) return;
    try {
      localStorage.removeItem(CHAVE_ARMAZENAMENTO);
      sessionStorage.removeItem(CHAVE_ARMAZENAMENTO);
    } catch {
      // Nada a apagar se o armazenamento não está acessível.
    }
  }
}
