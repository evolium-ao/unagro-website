import { CanalContacto } from '../modelos/canal-contacto.model';

export const CANAIS_CONTACTO_ADMISSOES_MOCK: CanalContacto[] = [
  {
    id: 'telefone',
    icone: 'phone',
    rotulo: { pt: 'Telefone', en: 'Phone' },
    valor: { pt: '+244 923 000 000', en: '+244 923 000 000' },
    detalhe: { pt: 'Seg - Sex, 08:00 - 16:00', en: 'Mon - Fri, 08:00 - 16:00' },
  },
  {
    id: 'email',
    icone: 'mail',
    rotulo: { pt: 'Email', en: 'Email' },
    valor: { pt: 'admissao@unagro.ao', en: 'admissao@unagro.ao' },
    detalhe: { pt: 'Resposta em 24h úteis', en: 'Reply within 24 business hours' },
  },
  {
    id: 'localizacao',
    icone: 'map-pin',
    rotulo: { pt: 'Localização', en: 'Location' },
    valor: { pt: 'Campus Central, Luanda', en: 'Central Campus, Luanda' },
    detalhe: { pt: 'Edifício A, Piso 0', en: 'Building A, Ground floor' },
  },
];
