import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { noticiasQueries } from '../../core/consultas/noticias.queries';
import { NOTICIAS_FALLBACK } from '../../core/dados/noticias.mock';
import { Noticia } from '../../core/modelos/noticia.model';
import { SeoService } from '../../core/seo/seo.service';
import { NoticiasService } from '../../core/servicos/noticias.service';
import { formatarDataCurta } from '../../core/traducao/formatar-data';
import { localizarProfundo } from '../../core/traducao/localizar-profundo';
import { TraducaoService } from '../../core/traducao/traducao.service';
import { BotaoComponent } from '../../shared/componentes/botao/botao.component';
import { CartaoNoticiaResumoComponent } from '../../shared/componentes/cartao-noticia-resumo/cartao-noticia-resumo.component';
import { CartaoNoticiaResumoEsqueletoComponent } from '../../shared/componentes/cartao-noticia-resumo-esqueleto/cartao-noticia-resumo-esqueleto.component';
import { ContainerPaginaComponent } from '../../shared/componentes/container-pagina/container-pagina.component';
import { EspacoImagemComponent } from '../../shared/componentes/espaco-imagem/espaco-imagem.component';
import { IconeComponent } from '../../shared/componentes/icone/icone.component';
import { RevelarAoScrollDirective } from '../../shared/diretivas/revelar-ao-scroll.directive';

/** Quantas notícias acompanham o artigo na coluna da direita. */
const OUTRAS_NOTICIAS = 4;

@Component({
  selector: 'app-detalhe-noticia',
  imports: [
    RouterLink,
    BotaoComponent,
    ContainerPaginaComponent,
    CartaoNoticiaResumoComponent,
    CartaoNoticiaResumoEsqueletoComponent,
    EspacoImagemComponent,
    IconeComponent,
    RevelarAoScrollDirective,
  ],
  templateUrl: './detalhe-noticia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalheNoticiaComponent {
  /** Vem do segmento `:id` da rota, pelo `withComponentInputBinding`. */
  readonly id = input.required<string>();

  protected readonly traducao = inject(TraducaoService);
  private readonly noticiasService = inject(NoticiasService);
  private readonly seo = inject(SeoService);

  /**
   * Os ids da API são inteiros. Um id que não seja número só pode ser do
   * conteúdo de recurso (`NOTICIAS_FALLBACK`, com ids em texto), e nesse caso
   * não se chama `GET /noticias/{id}` — daria 404 garantido.
   */
  private readonly idApi = computed(() => {
    const numero = Number(this.id());
    return Number.isInteger(numero) && numero > 0 ? numero : null;
  });

  protected readonly consultaNoticia = injectQuery(() => ({
    ...noticiasQueries.porId(this.noticiasService, this.idApi() ?? 0),
    enabled: this.idApi() !== null,
  }));

  /** A lista inteira serve a coluna da direita — a API não tem endpoint de "relacionadas". */
  protected readonly consultaOutras = injectQuery(() =>
    noticiasQueries.lista(this.noticiasService),
  );

  private readonly noticiasFallback = computed<Noticia[]>(() =>
    localizarProfundo(NOTICIAS_FALLBACK, this.traducao.idioma()),
  );

  /** A notícia da API; sem ela, a do conteúdo de recurso com o mesmo id. */
  protected readonly noticia = computed<Noticia | undefined>(
    () => this.consultaNoticia.data() ?? this.noticiasFallback().find((n) => n.id === this.id()),
  );

  /** Enquanto o pedido corre ainda não se pode dizer que a notícia não existe. */
  protected readonly aCarregar = computed(
    () => this.idApi() !== null && this.consultaNoticia.isPending(),
  );

  protected readonly outrasNoticias = computed<Noticia[]>(() => {
    const daApi = this.consultaOutras.data();
    const lista = daApi?.length ? daApi : this.noticiasFallback();
    return lista
      .filter((n) => n.id !== this.id())
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, OUTRAS_NOTICIAS);
  });

  protected readonly dataFormatada = computed(() => {
    const noticia = this.noticia();
    return noticia ? formatarDataCurta(noticia.data, this.traducao.idioma()) : '';
  });

  /**
   * O `conteudo` da API é texto corrido, sem marcação: parte-se por linhas em
   * branco (ou por linhas simples, quando é assim que vem escrito) para o artigo
   * sair em parágrafos em vez de um bloco só.
   */
  protected readonly paragrafos = computed(() =>
    (this.noticia()?.conteudo ?? '')
      .split(/\r?\n\s*\r?\n|\r?\n/)
      .map((paragrafo) => paragrafo.trim())
      .filter(Boolean),
  );

  protected readonly rotuloVoltar = computed(() =>
    this.traducao.getTraducao(['Voltar às notícias', 'Back to news']),
  );
  protected readonly outrasTitulo = computed(() =>
    this.traducao.getTraducao(['Outras notícias', 'Other news']),
  );
  protected readonly semOutras = computed(() =>
    this.traducao.getTraducao(['Não há outras notícias.', 'There is no other news.']),
  );
  protected readonly naoEncontradaTitulo = computed(() =>
    this.traducao.getTraducao(['Notícia não encontrada', 'News article not found']),
  );
  protected readonly naoEncontradaTexto = computed(() =>
    this.traducao.getTraducao([
      'A notícia que procura já não está disponível ou o endereço está incorrecto.',
      'The article you are looking for is no longer available, or the address is wrong.',
    ]),
  );

  constructor() {
    effect(() => {
      const noticia = this.noticia();
      this.seo.definirTituloDinamico(noticia ? noticia.titulo : null);
    });
  }
}
