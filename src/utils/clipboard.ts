/**
 * Copia texto plano al portapapeles del usuario
 * @param text - El texto que se copiará al portapapeles
 * @returns Promise que se resuelve cuando el texto se copia exitosamente
 * @throws Error si no se puede copiar al portapapeles
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Verificar si la API del portapapeles está disponible
    if (navigator.clipboard && window.isSecureContext) {
      // Usar la API moderna del portapapeles
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback para navegadores más antiguos o contextos no seguros
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Hacer el textarea invisible y temporal
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((resolve, reject) => {
        // Usar el comando de copia obsoleto
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (success) {
          resolve();
        } else {
          reject(new Error('No se pudo copiar el texto al portapapeles'));
        }
      });
    }
  } catch (error) {
    throw new Error(`Error al copiar al portapapeles: ${error}`);
  }
};
