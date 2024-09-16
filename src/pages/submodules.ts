import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const gitmodulesPath = join(process.cwd(), '.gitmodules');

export interface Submodule {
  path: string;
  name: string;
  description: string;
  url: string;
  currentBlob: string;
  latestBlob: string;
  stat: string;
}

export function parseSubmodules(): Submodule[] {

  const data = readFileSync(gitmodulesPath, 'utf-8');
  const submoduleRegex = /\[submodule\s*"([^"]+)"\]\s*path\s*=\s*([^\s]+)\s*url\s*=\s*(https:\/\/[^\s]+)/g;
  const submodules: Submodule[] = [];
  let match: RegExpExecArray | null;

  while ((match = submoduleRegex.exec(data)) !== null) {
    const description = '';
    const name = match[1];
    const path: string = match[2]; // Aquí obtenemos el path local
    const url = match[3].replace(/\.git$/, '');

    if (typeof path !== 'string' || path.trim() === '') {
      console.error('Error: El path del submódulo no es válido');
      continue;
    }

    const statusOutput = execSync(`git submodule status ${path}`).toString().trim();

    // Dividimos la salida para extraer el estado (primer carácter) y el SHA
    const arr = statusOutput.split(' ');

    const stat = arr[0][0]; // Primer carácter que indica el estado del submódulo (-, +, U, espacio)
    const currentBlob = arr[0].slice(1); // SHA del commit (sin el primer carácter que indica el estado)

    const latestBlob = currentBlob; // Temporarily set to currentBlob; to be updated later

    submodules.push({
      path,
      name, url, description, currentBlob, latestBlob,
      stat
    });
  }

  return submodules.sort((a, b) => a.name.localeCompare(b.name));
}
