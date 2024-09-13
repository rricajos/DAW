import fetch from 'node-fetch';
import { parseSubmodules, Submodule } from './submodules';
import { getSubmoduleLastCommitSha } from './submoduleUtils';
import { getRemoteRepoLastCommitSha } from './remoteRepoUtils';

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  latestBlob: string;
}

function isGitHubRepo(obj: any): obj is GitHubRepo {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.html_url === 'string'
  );
}

export async function fetchRepoData(): Promise<Submodule[]> {
  // Parse submodules from .gitmodules
  const submodules = parseSubmodules();

  const repoPromises = submodules.map(async (submodule) => {
    const repoPath = submodule.url.split('github.com/')[1];
    const apiUrl = `https://api.github.com/repos/${repoPath}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'node-fetch',
        },
      });

      if (!response.ok) {
        console.error(
          `Error al hacer fetch para ${submodule.name} (${apiUrl}): ${response.status} ${response.statusText}`
        );
        return null;
      }

      const result: unknown = await response.json();

      if (isGitHubRepo(result)) {

        // Obtener el SHA del último commit desde GitHub
        // fetch a `https://api.github.com/repos/${repoPath}/commits/main`;
        const latestCommitSha = (await getRemoteRepoLastCommitSha(repoPath));

        // Obtener el SHA del último commit en el submódulo local
        const currentCommitSha = getSubmoduleLastCommitSha(submodule.path); // Asegúrate de usar el path local del submódulo
      
        return {
          name: submodule.name.replace(/[_/-]/g, ' '),
          description: result.description,
          url: result.html_url,
          currentBlob: currentCommitSha.slice(0, 7),
          latestBlob: latestCommitSha.slice(0, 7),
          stat: submodule.stat
        };
      } else {
        console.error(`Datos inesperados para ${submodule.name}:`, result);
        return null;
      }
    } catch (error) {
      console.error(
        `Error al hacer fetch para ${submodule.name} (${apiUrl}):`,
        error
      );
      return null;
    }
  });

  // Filtrar los resultados nulos y asegurar que el tipo sea correcto
  return (await Promise.all(repoPromises)).filter((repo): repo is Submodule => repo !== null);
}


