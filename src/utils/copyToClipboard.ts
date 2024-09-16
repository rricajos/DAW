// Define la función para copiar al portapapeles
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    alert(`Texto copiado: ${text}`);
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
  }
}

// Configura el evento de clic para el botón con id 'copy-button'
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('copy-button');
  if (button) {
    button.addEventListener('click', () => {
      copyToClipboard('SHA'); // Cambia 'SHA' por el texto que desees copiar
    });
  }
});