import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TraducaoService } from '../../../core/traducao/traducao.service';

/**
 * Mapa do Google embutido, de bordo a bordo e sem moldura.
 *
 * Usa o embed **sem chave de API** (`output=embed`), que aceita só coordenadas e nível
 * de zoom. O Angular recusa um URL em `[src]` de `<iframe>` sem o marcar como recurso
 * de confiança, por isso o endereço passa pelo `DomSanitizer` aqui dentro — é o único
 * sítio do projecto com um iframe, e quem usa o componente só dá números.
 *
 * A altura vem de quem o usa (`class="min-h-[420px]"`, célula de grelha, …): o host é
 * `block h-full` e o iframe ocupa-o todo.
 */
@Component({
  selector: 'app-mapa-google',
  host: { class: 'block h-full w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <iframe
      class="h-full w-full border-0"
      [src]="urlSeguro()"
      [title]="tituloAcessivel()"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  `,
})
export class MapaGoogleComponent {
  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly zoom = input<number>(12);
  /** Sem título entra o rótulo genérico traduzido — o `title` é obrigatório num iframe. */
  readonly titulo = input<string>('');

  private readonly sanitizador = inject(DomSanitizer);
  private readonly traducao = inject(TraducaoService);

  protected readonly urlSeguro = computed(() =>
    this.sanitizador.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${this.latitude()},${this.longitude()}&z=${this.zoom()}&output=embed`,
    ),
  );

  protected readonly tituloAcessivel = computed(
    () => this.titulo() || this.traducao.getTraducao(['Mapa da localização', 'Location map']),
  );
}
