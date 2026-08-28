import { Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CaminhoDicionario } from '../traducao/dicionario';
import { TraducaoService } from '../traducao/traducao.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly tituloDom = inject(Title);
  private readonly meta = inject(Meta);
  private readonly traducao = inject(TraducaoService);

  private tituloChaveAtual: CaminhoDicionario | null = null;
  private descricaoChaveAtual: CaminhoDicionario | null = null;
  private tituloDinamico: string | null = null;

  constructor() {
    this.lerDadosDaRota();

    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.tituloDinamico = null;
        this.lerDadosDaRota();
        this.atualizar();
      });

    effect(() => {
      this.traducao.idioma();
      this.atualizar();
    });
  }

  /** Sobrepõe o título estático da rota com um título resolvido a partir de conteúdo dinâmico (ex.: nome do curso). */
  definirTituloDinamico(titulo: string | null): void {
    this.tituloDinamico = titulo;
    this.atualizar();
  }

  private lerDadosDaRota(): void {
    let rota = this.router.routerState.root;
    while (rota.firstChild) {
      rota = rota.firstChild;
    }
    this.tituloChaveAtual = rota.snapshot.data['tituloChave'] ?? null;
    this.descricaoChaveAtual = rota.snapshot.data['descricaoChave'] ?? null;
  }

  private atualizar(): void {
    const tituloBase = this.tituloDinamico ?? (this.tituloChaveAtual ? this.traducao.t(this.tituloChaveAtual) : '');
    this.tituloDom.setTitle(tituloBase ? `${tituloBase} | UNAGRO` : 'UNAGRO');

    if (this.descricaoChaveAtual) {
      this.meta.updateTag({ name: 'description', content: this.traducao.t(this.descricaoChaveAtual) });
    }
  }
}
