import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
// Definir la ruta hacia el archivo .gitmodules
const gitmodulesPath = join(process.cwd(), '.gitmodules');
async function fetchUrls() {
    try {
        // Leer el contenido del archivo .gitmodules
        const data = readFileSync(gitmodulesPath, 'utf-8');
        // Expresión regular para encontrar todas las secciones de submódulos
        const submoduleRegex = /\[submodule\s*"([^"]+)"\]\s*path\s*=\s*([^\s]+)\s*url\s*=\s*(https:\/\/[^\s]+)/g;
        // Array para almacenar los submódulos
        const submodules = [];
        let match;
        // Extraer los submódulos usando la expresión regular
        while ((match = submoduleRegex.exec(data)) !== null) {
            const name = match[1];
            const url = match[3].replace(/\.git$/, ''); // Eliminar ".git" de la URL
            submodules.push({ name, url });
        }
        // Ordenar los submódulos alfabéticamente por nombre
        submodules.sort((a, b) => a.name.localeCompare(b.name));
        // Mostrar los submódulos ordenados en la consola
        console.log('Submódulos ordenados por nombre:');
        console.log(submodules);
        // Realizar peticiones a la API de GitHub para cada submódulo
        for (const submodule of submodules) {
            const repoPath = submodule.url.split('github.com/')[1];
            const apiUrl = `https://api.github.com/repos/${repoPath}`;
            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'node-fetch'
                    }
                });
                // Verificar si la respuesta es OK antes de intentar parsear el JSON
                if (!response.ok) {
                    console.error(`Error al hacer fetch para ${submodule.name} (${apiUrl}): ${response.status} ${response.statusText}`);
                    continue;
                }
                const result = await response.json();
                console.log(`Resultado de ${submodule.name}:`);
                console.log(result);
            }
            catch (error) {
                console.error(`Error al hacer fetch para ${submodule.name} (${apiUrl}):`, error);
            }
        }
    }
    catch (err) {
        console.error('Error al leer el archivo .gitmodules:', err);
    }
}
// Llamar a la función asincrónica
fetchUrls();
