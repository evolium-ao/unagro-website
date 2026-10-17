/** Botão de partilha: o rótulo é a marca (excepto "Email"); `cor` pinta o ícone. */
export interface RedePartilha {
  id: string;
  rotulo: string;
  icone: string;
  cor: string;
  endereco: string;
}

/** O que se partilha, com os textos já traduzidos. */
export interface ConteudoPartilha {
  /** Endereço absoluto que se divulga. */
  url: string;
  /** Texto que acompanha o link (WhatsApp, Telegram e corpo do e-mail). */
  mensagem: string;
  /** Assunto do e-mail. */
  assunto: string;
  /** Rótulo do botão de e-mail, no idioma actual. */
  rotuloEmail: string;
}

/** WhatsApp, LinkedIn, Telegram e Email, com o endereço de partilha já montado. */
export function redesPartilha({ url, mensagem, assunto, rotuloEmail }: ConteudoPartilha): RedePartilha[] {
  const urlCodificada = encodeURIComponent(url);
  return [
    {
      id: 'whatsapp',
      rotulo: 'WhatsApp',
      icone: 'message-circle',
      cor: 'text-[#25D366]',
      endereco: `https://wa.me/?text=${encodeURIComponent(`${mensagem} ${url}`)}`,
    },
    {
      id: 'linkedin',
      rotulo: 'LinkedIn',
      icone: 'linkedin',
      cor: 'text-[#0A66C2]',
      endereco: `https://www.linkedin.com/sharing/share-offsite/?url=${urlCodificada}`,
    },
    {
      id: 'telegram',
      rotulo: 'Telegram',
      icone: 'send',
      cor: 'text-[#229ED9]',
      endereco: `https://t.me/share/url?url=${urlCodificada}&text=${encodeURIComponent(mensagem)}`,
    },
    {
      id: 'email',
      rotulo: rotuloEmail,
      icone: 'mail',
      cor: 'text-text-secondary',
      endereco: `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(`${mensagem}\n\n${url}`)}`,
    },
  ];
}
