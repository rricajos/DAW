import { execSync } from "child_process";
export function getSubmoduleBlobHash(path: string): string {
    try {
        console.log(`Obteniendo hash del blob para el submódulo en el path: ${path}`);

        // Obtener el hash del último commit en el submódulo
        const submoduleHeadCommit = execSync(`git -C ${path} rev-parse HEAD`).toString().trim();
        console.log(`Último commit en ${path}: ${submoduleHeadCommit}`);

        // Obtener todos los blobs del último commit
        const blobsOutput = execSync(`git -C ${path} ls-tree -r ${submoduleHeadCommit}`).toString();
        console.log(`Output de blobs para ${path}: ${blobsOutput}`);

        // Obtener el último blob
        const blobs = blobsOutput.trim().split('\n');
        const lastBlobLine = blobs.pop(); // Última línea de blobs
        if (lastBlobLine) {
            const lastBlobHash = lastBlobLine.split(' ')[2];
            console.log(`Último blob hash para ${path}: ${lastBlobHash}`);
            return lastBlobHash;
        } else {
            console.warn(`No se encontraron blobs para el commit en ${path}`);
            return "N/A";
        }
    } catch (error) {
        console.error(`Error al obtener el hash del blob para el submódulo en ${path}:`, error);
        return "N/A";
    }
}


export function getSubmoduleLastCommitSha(path: string): string {
    try {
        // Obtener el SHA del último commit en el submódulo
        //   const lastCommitSha = execSync(`git -C ${path} rev-parse HEAD`).toString().trim();

        // Usar el comando `git submodule status` para obtener el SHA del submódulo
        const submoduleStatus = execSync(`git submodule status ${path}`).toString().trim();

        // El SHA está en la primera parte de la salida del comando
        const lastCommitSha = submoduleStatus.split(' ')[0];
        
        return lastCommitSha;
    } catch (error) {
        console.error(`Error al obtener el último commit SHA para el submódulo en ${path}:`, error);
        return 'N/A';
    }
}