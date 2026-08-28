import { Component, input } from '@angular/core';
import { BotaoComponent, VarianteBotao } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';
import { ContainerPaginaComponent } from "../container-pagina/container-pagina.component";

export interface CtaBannerDestaque {
  texto: string;
  variante: VarianteBotao;
  link: string;
  icone?: string;
}

@Component({
  selector: 'app-banner-destaque',
  imports: [BotaoComponent, EspacoImagemComponent, SeloComponent, ContainerPaginaComponent],
  template: `
    <section class="bg-bg-light">
      <app-container-pagina
        class=" grid  items-center gap-10"
      >
        <div  class="absolute">
          @if (selos().length) {
            <div class="mb-4 flex flex-wrap gap-2">
              @for (selo of selos(); track selo) {
                <app-selo variante="acento">{{ selo }}</app-selo>
              }
            </div>
          }
          @if(titulo()){
            <h1 class="text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">{{ titulo() }}</h1>
          }
          @if (subtitulo()) {
            <p class="mt-4 max-w-xl text-lg text-text-secondary">{{ subtitulo() }}</p>
          }
          @if (ctas().length) {
            <div class="mt-8 flex flex-wrap gap-4">
              @for (cta of ctas(); track cta.texto) {
                <app-botao [variante]="cta.variante" [link]="cta.link" [icone]="cta.icone" tamanho="lg">
                  {{ cta.texto }}
                </app-botao>
              }
            </div>
          }
        </div>
        <ng-content select="[banner-visual]">
          <app-espaco-imagem proporcao="video" alturaMinima="500px" />
        </ng-content>
      </app-container-pagina>
    </section>
  `,
})
export class BannerDestaqueComponent {
  readonly titulo = input<string>();
  readonly subtitulo = input<string>();
  readonly selos = input<string[]>([]);
  readonly ctas = input<CtaBannerDestaque[]>([]);
  readonly tipo = input<'HOME' | 'PAGINA'>();
}
