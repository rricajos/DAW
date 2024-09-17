export const fetchRepoLanguages = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch('https://api.github.com/repos/rricajos/DAW_M06_UF1/languages');
    if (!response.ok) {
      throw new Error('Error fetching languages data');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getLanguageColor = (language: string): string => {
  const languageColors: Record<string, string> = {
    HTML: '#500000',       // Rojo oscuro
    CSS: '#264de4',        // Azul oscuro
    JavaScript: '#3f4000',  // Oscuro verdoso-amarillo
    Python: '#003b4d',     // Azul muy oscuro
    Ruby: '#500f0f',       // Rojo burdeos oscuro
    Java: '#2e2b00',       // Marrón oscuro
    CSharp: '#2e003f',     // Púrpura oscuro
    TypeScript: '#003f5e', // Azul oscuro
    PHP: '#402f44',        // Púrpura oscuro
    Swift: '#3f2600',      // Naranja oscuro
    Kotlin: '#4d002f',     // Vino oscuro
    Rust: '#2f3f00',       // Verde oliva oscuro
    Go: '#004d3f',         // Verde oscuro
    Dart: '#1e002f',       // Azul profundo
    Shell: '#17191e',      // Muy oscuro, gris-negro
    // Añade más lenguajes con colores oscuros según necesites
  };
  
  return languageColors[language] || '#17191e'; // Color por defecto si no está definido
};
