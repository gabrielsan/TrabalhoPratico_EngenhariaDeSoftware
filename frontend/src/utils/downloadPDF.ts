/**
 * Função para baixar um arquivo a partir de um Blob ou dados binários.
 *
 * @param pdfInBase64 - conteúdo do pdf em string base64
 */
export const downloadPdf = (
  pdfInBase64: string
): void => {
  const byteCharacters = atob(pdfInBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  window.open(url, '_blank');
};
