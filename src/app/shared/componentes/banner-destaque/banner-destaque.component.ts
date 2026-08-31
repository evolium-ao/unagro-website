import { Component, input } from '@angular/core';
import { BotaoComponent, VarianteBotao } from '../botao/botao.component';
import { EspacoImagemComponent } from '../espaco-imagem/espaco-imagem.component';
import { SeloComponent } from '../selo/selo.component';
import { ContainerPaginaComponent } from '../container-pagina/container-pagina.component';

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
    <section class="relative h-125 w-full overflow-hidden bg-bg-light">
      <app-espaco-imagem
        proporcao="cover"
        alturaMinima="500px"
        class="absolute inset-0"
        [imagem]="'/imagens/campus-hero.png'" />

      <div class="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent"></div>

      <app-container-pagina class="relative z-10 flex h-full flex-col">
        <img src="/imagens/estudante.png" alt="Estudante" class="absolute bottom-0 left-0 h-[90%] object-contain" />

        <div class=" bottom-0 left-2 w-[90%] ml-100 mt-40">
          @if (selos().length) {
            <div class="mb-4 flex flex-wrap gap-2">
              @for (selo of selos(); track selo) {
                <app-selo variante="acento">{{ selo }}</app-selo>
              }
            </div>
          }
          //
          {{titulo()}}
          @if (titulo()) {
            <h1 class="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{{ titulo() }}</h1>
          }
          @if (subtitulo()) {
            <p class="mt-4 max-w-xl text-lg text-white/90">{{ subtitulo() }}</p>
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
