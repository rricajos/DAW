import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
// Función para obtener los blobs de submódulos
async function getSubmoduleBlobs() {
    try {
        // Ejecutamos el comando git submodule status
        const { stdout } = await execAsync('git submodule status');
        // Parseamos la salida para obtener el hash de cada submódulo
        const submodules = stdout
            .trim() // Eliminamos espacios en blanco
            .split('\n') // Dividimos en líneas
            .map(line => {
            const [blob, path] = line.trim().split(' '); // Dividimos la línea en blob y path
            return { blob, path }; // Retornamos un objeto con el hash y la ruta del submódulo
        });
        // Mostramos los blobs de los submódulos
        console.log('Submódulos y sus blobs:', submodules);
    }
    catch (error) {
        console.error('Error obteniendo blobs de submódulos:', error);
    }
}
