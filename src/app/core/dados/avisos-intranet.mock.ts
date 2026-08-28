import { AvisoIntranet } from '../modelos/aviso-intranet.model';

export const AVISOS_INTRANET_MOCK: AvisoIntranet[] = [
  {
    id: 'manutencao-portal',
    tipo: 'manutencao',
    titulo: { pt: 'Manutenção programada', en: 'Scheduled maintenance' },
    mensagem: {
      pt: 'O portal do estudante estará indisponível no sábado das 02h00 às 06h00 para manutenção.',
      en: 'The student portal will be unavailable on Saturday from 2:00 to 6:00 AM for maintenance.',
    },
    data: '2026-08-22',
  },
  {
    id: 'inscricao-epocas-exame',
    tipo: 'inscricao',
    titulo: { pt: 'Inscrições em épocas de exame abertas', en: 'Exam period registration open' },
    mensagem: {
      pt: 'As inscrições para a época normal de exames decorrem até 5 de setembro.',
      en: 'Registration for the regular exam period runs until September 5.',
    },
    data: '2026-08-18',
  },
  {
    id: 'aviso-geral-biblioteca',
    tipo: 'geral',
    titulo: { pt: 'Novo horário da biblioteca', en: 'New library hours' },
    mensagem: {
      pt: 'A biblioteca passa a funcionar das 08h00 às 20h00 durante o período de exames.',
      en: 'The library will now operate from 8:00 AM to 8:00 PM during the exam period.',
    },
    data: '2026-08-15',
  },
];
