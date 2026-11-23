import { Component, computed, inject, input } from '@angular/core';
import { TraducaoService } from '../../../core/traducao/traducao.service';
import { BotaoComponent } from '../botao/botao.component';
import { IconeComponent } from '../icone/icone.component';
import { SeloComponent, VarianteSelo } from '../selo/selo.component';

export interface EventoExibidoCard {
  titulo: string;
  categoria: string;
  ambito: 'nacional' | 'internacional';
  local: string;
  dataInicio: string;
}

@Component({
  selector: 'app-cartao-evento',
  imports: [IconeComponent, SeloComponent, BotaoComponent],
  template: `
    <article
      class="flex gap-4 rounded-lg border border-gray-100 p-4 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div class="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary py-2 text-white">
        <span class="text-2xl font-bold leading-none">{{ dia() }}</span>
        <span class="text-xs uppercase tracking-wide">{{ mes() }}</span>
      </div>
      <div class="flex flex-1 flex-col gap-1">
        <div class="flex flex-wrap items-center gap-2">
          <app-selo [variante]="varianteSelo()">{{
            evento().ambito === 'internacional' ? traducao.t('eventos.internacional') : traducao.t('eventos.nacional')
          }}</app-selo>
          <span class="text-xs text-text-secondary">{{ evento().categoria }}</span>
        </div>
        <h3 class="font-semibold text-text-primary">{{ evento().titulo }}</h3>
        <p class="flex items-center gap-1 text-sm text-text-secondary">
          <app-icone nome="map-pin" [tamanho]="14" />
          {{ evento().local }}
        </p>
        <app-botao variante="contorno" tamanho="sm" link="/contactos" class="mt-2 self-start">
          {{ traducao.t('comum.inscreverSe') }}
        </app-botao>
      </div>
    </article>
  `,
})
export class CartaoEventoComponent {
  readonly evento = input.required<EventoExibidoCard>();

  protected readonly traducao = inject(TraducaoService);

  protected readonly varianteSelo = computed<VarianteSelo>(() =>
    this.evento().ambito === 'internacional' ? 'acento' : 'primario',
  );
  protected readonly dia = computed(() => new Date(this.evento().dataInicio).getDate().toString().padStart(2, '0'));
  protected readonly mes = computed(() =>
    new Date(this.evento().dataInicio).toLocaleDateString(this.traducao.idioma() === 'pt' ? 'pt-PT' : 'en-GB', {
      month: 'short',
    }),
  );
}
