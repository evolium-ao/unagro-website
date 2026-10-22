import { DOCUMENT, Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CaminhoDicionario } from '../traducao/dicionario';
import { TraducaoService } from '../traducao/traducao.service';

/** Nome da marca no título do separador e nas pré-visualizações das redes sociais. */
export const MARCA = 'AgroSophia';

/** Imagem de partilha por omissão (Open Graph): 1200×630, JPG — as redes não aceitam SVG. */
const IMAGEM_PADRAO = '/imagens/og-candidatura-geral-v1.jpg';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly tituloDom = inject(Title);
  private readonly meta = inject(Meta);
  private readonly documento = inject(DOCUMENT);
  private readonly traducao = inject(TraducaoService);

  private tituloChaveAtual: CaminhoDicionario | null = null;
  private descricaoChaveAtual: CaminhoDicionario | null = null;
  private imagemAtual = IMAGEM_PADRAO;
  private indexarAtual = true;
  private dadosEstruturadosAtuais: object | null = null;
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
    this.imagemAtual = rota.snapshot.data['imagem'] ?? IMAGEM_PADRAO;
    this.indexarAtual = rota.snapshot.data['indexar'] ?? true;
    this.dadosEstruturadosAtuais = rota.snapshot.data['dadosEstruturados'] ?? null;
  }

  private atualizar(): void {
    const tituloBase = this.tituloDinamico ?? (this.tituloChaveAtual ? this.traducao.t(this.tituloChaveAtual) : '');
    const titulo = tituloBase ? `${tituloBase} | ${MARCA}` : MARCA;
    this.tituloDom.setTitle(titulo);

    // O WhatsApp e o Facebook não correm JavaScript: estas tags só lhes chegam
    // porque a página é pré-renderizada (ver `app.routes.server.ts`).
    const ingles = this.traducao.idioma() === 'en';
    const url = this.urlAbsoluto(this.router.url.split(/[?#]/)[0]);
    const imagem = this.urlAbsoluto(this.imagemAtual);
    this.documento.documentElement.lang = ingles ? 'en' : 'pt';

    this.propriedade('og:site_name', MARCA);
    this.propriedade('og:type', 'website');
    this.propriedade('og:locale', ingles ? 'en_GB' : 'pt_AO');
    // O idioma troca no mesmo URL (botão PT/EN), não por rota — por isso só um
    // `og:locale:alternate`, o outro dos dois que o site serve.
    this.propriedade('og:locale:alternate', ingles ? 'pt_AO' : 'en_GB');
    this.propriedade('og:title', titulo);
    this.propriedade('og:url', url);
    this.propriedade('og:image', imagem);
    this.propriedade('og:image:secure_url', imagem);
    this.propriedade('og:image:type', 'image/jpeg');
    this.propriedade('og:image:width', '1200');
    this.propriedade('og:image:height', '630');
    this.propriedade('og:image:alt', titulo);
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: titulo });
    this.meta.updateTag({ name: 'twitter:image', content: imagem });
    this.meta.updateTag({ name: 'robots', content: this.indexarAtual ? 'index, follow' : 'noindex, follow' });
    this.definirCanonico(url);
    this.definirDadosEstruturados(this.dadosEstruturadosAtuais);

    if (this.descricaoChaveAtual) {
      const descricao = this.traducao.t(this.descricaoChaveAtual);
      this.meta.updateTag({ name: 'description', content: descricao });
      this.propriedade('og:description', descricao);
      this.meta.updateTag({ name: 'twitter:description', content: descricao });
    }
  }

  /** As tags Open Graph usam `property`, não `name`. */
  private propriedade(propriedade: string, content: string): void {
    this.meta.updateTag({ property: propriedade, content }, `property="${propriedade}"`);
  }

  /** As redes sociais só aceitam endereços absolutos — base no domínio público do site. */
  private urlAbsoluto(caminho: string): string {
    return new URL(caminho, environment.siteUrl).href;
  }

  /** JSON-LD da rota (`data.dadosEstruturados`) num único `<script>` do `<head>`; sem dados, sai. */
  private definirDadosEstruturados(dados: object | null): void {
    let script = this.documento.head.querySelector<HTMLScriptElement>('script#dados-estruturados');
    if (!dados) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.documento.createElement('script');
      script.id = 'dados-estruturados';
      script.type = 'application/ld+json';
      this.documento.head.appendChild(script);
    }
    // `<` escapado: um `</script>` dentro do texto fecharia a tag antes do tempo.
    script.textContent = JSON.stringify(dados).replace(/</g, '\\u003c');
  }

  private definirCanonico(url: string): void {
    let link = this.documento.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.documento.createElement('link');
      link.rel = 'canonical';
      this.documento.head.appendChild(link);
    }
    link.href = url;
  }
}
