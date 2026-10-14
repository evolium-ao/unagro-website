/**
 * Descarrega `url` com o nome `nomeFicheiro` (p. ex. a ficha de candidatura do
 * `pdf_url` da API). O link vai tal como veio — os da API são assinados e não
 * aceitam cabeçalhos nem parâmetros a mais.
 *
 * Pede o ficheiro e guarda-o por um `<a download>` local, porque o `download`
 * de um link de outra origem é ignorado pelo browser. Se o pedido falhar (CORS,
 * rede), abre o link num separador novo: o browser mostra ou guarda o PDF.
 * Só no browser.
 */
export async function descarregarFicheiro(url: string, nomeFicheiro: string): Promise<void> {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }
    const endereco = URL.createObjectURL(await resposta.blob());
    const ligacao = document.createElement('a');
    ligacao.href = endereco;
    ligacao.download = nomeFicheiro;
    document.body.appendChild(ligacao);
    ligacao.click();
    ligacao.remove();
    // Dá tempo ao browser para começar a guardar antes de libertar o blob.
    setTimeout(() => URL.revokeObjectURL(endereco), 10_000);
  } catch {
    window.open(url, '_blank', 'noopener');
  }
}
