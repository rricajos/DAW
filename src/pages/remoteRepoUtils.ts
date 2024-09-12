import fetch from 'node-fetch';

export async function getRemoteRepoLastCommitSha(repoPath: string): Promise<string> {
    const apiUrl = `https://api.github.com/repos/${repoPath}/commits/main`; // Cambia `main` por la rama adecuada si es necesario

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'node-fetch',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al hacer fetch: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.sha;
    } catch (error) {
        console.error(`Error al obtener el SHA del último commit para ${repoPath}:`, error);
        return 'N/A';
    }
}
