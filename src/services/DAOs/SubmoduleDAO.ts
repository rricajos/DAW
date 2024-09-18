// SubmoduleDAO.ts
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { DAO } from '../DAO';
import { OfflineSubmodule } from '../models/OfflineSubmodule';

export class SubmoduleDAO implements DAO<OfflineSubmodule> {
  private submodulesRootPath: string;
  private submoduleRegex: RegExp;
  private submodules: OfflineSubmodule[];

  constructor(submodulesRootPath: string) {
    this.submodulesRootPath = submodulesRootPath;
    this.submoduleRegex = /\[submodule\s*"([^"]+)"\]\s*path\s*=\s*([^\s]+)\s*url\s*=\s*(https:\/\/[^\s]+)/g;
    this.submodules = [];
    this.loadSubmodules();
  }

  // Carga inicial de submódulos desde el archivo
  private loadSubmodules(): void {
    const data = readFileSync(this.submodulesRootPath, 'utf-8');
    let match;

    while ((match = this.submoduleRegex.exec(data)) !== null) {
      const submoduleInfo = this.getSubmoduleInfo(match[2]);

      // Verificar que obtenemos valores válidos de los blobs y el stat
      const currentBlob = submoduleInfo?.currentBlob || 'N/A';
      const lastBlob = submoduleInfo?.lastBlob || 'N/A';
      const stat = submoduleInfo?.stat || 'N/A';

      // Obtener los lenguajes del submódulo actual y del último commit
      const currentSubmoduleLanguages = this.getSubmoduleLanguages(match[2], currentBlob);
      const lastSubmoduleLanguages = this.getSubmoduleLanguages(match[2], lastBlob, true);

      const submodule: OfflineSubmodule = {
        name: match[1],
        path: match[2],
        currentBlobURL: `${match[3]}/commit/${currentBlob}`,
        currentBlob: currentBlob,
        lastBlobURL: `${match[3]}/commit/${lastBlob}`,
        lastBlob: lastBlob,
        stat: stat,
        size: 0,
        currentBlobLanguages: currentSubmoduleLanguages,
        lastBlobLanguages: lastSubmoduleLanguages
      };

      this.submodules.push(submodule);
    }
  }

  // Implementación de getAll: retorna todos los submódulos
  public async getAll(): Promise<OfflineSubmodule[]> {
    return this.submodules;
  }

  // Implementación de getByBlob: busca un submódulo por su blob (SHA-1)
  public async getByBlob(blob: string): Promise<OfflineSubmodule | null> {
    const submodule = this.submodules.find(s => s.currentBlob === blob || s.lastBlob === blob);
    return submodule || null;
  }

  // Método para obtener blob y stat de un submódulo
  private getSubmoduleInfo(submodulePath: string): { currentBlob?: string; lastBlob?: string; stat?: string } | undefined {
    try {
      const statusResult = execSync(`git submodule status ${submodulePath}`).toString().trim();
      const statusMatch = statusResult.match(/^(\S+)/);
      const currentBlob = statusMatch ? statusMatch[1].trim() : 'N/A';

      const lsTreeResult = execSync(`git ls-tree HEAD ${submodulePath}`).toString();
      const lsTreeMatch = lsTreeResult.match(/^(\S+)\s+commit\s+(\S+)/);
      const lastBlob = lsTreeMatch ? lsTreeMatch[2] : 'N/A';

      return {
        currentBlob,
        lastBlob,
        stat: statusResult
      };
    } catch (error) {
      console.error(`Error obteniendo información del submódulo en la ruta ${submodulePath}:`, error);
    }

    return {
      currentBlob: 'N/A',
      lastBlob: 'N/A',
      stat: 'N/A'
    };
  }

  // Método para obtener los lenguajes del submódulo
  private getSubmoduleLanguages(submodulePath: string, blob: string, isCommit: boolean = false): { [language: string]: number } {
    try {
      // Obtener la lista de archivos, ya sea del commit o del directorio de trabajo
      const files = isCommit
        ? execSync(`git ls-tree -r --name-only ${blob} ${submodulePath}`).toString().trim().split('\n')
        : execSync(`git ls-files ${submodulePath}`).toString().trim().split('\n');

      const languageMap: { [language: string]: number } = {};

      files.forEach(file => {
        const extension = file.split('.').pop();  // Obtener la extensión del archivo
        const language = this.mapExtensionToLanguage(extension || '');  // Mapear la extensión a un lenguaje

        if (language) {
          languageMap[language] = (languageMap[language] || 0) + 1;  // Contar el número de archivos por lenguaje
        }
      });

      return languageMap;
    } catch (error) {
      console.error(`Error obteniendo lenguajes para el submódulo en la ruta ${submodulePath}:`, error);
      return {};
    }
  }

  // Método para mapear la extensión del archivo a un lenguaje
  private mapExtensionToLanguage(extension: string): string {
    const extensionMap: { [key: string]: string } = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'rb': 'Ruby',
      'go': 'Go',
      'php': 'PHP',
      'html': 'HTML',
      'css': 'CSS',
      'md': 'Markdown',
      // Agregar más mapeos si es necesario
    };

    return extensionMap[extension.toLowerCase()] || 'Desconocido';
  }
}
