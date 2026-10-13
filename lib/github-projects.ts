export type GithubProject = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
};

export type ProjectsResponse = {
  projects: GithubProject[];
  updatedAt: string;
};

export const GITHUB_USERNAME = 'asithaisuru';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

export function githubReposUrl(page = 1) {
  return `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated&direction=desc`;
}

type PublicGithubRepository = GithubProject & {
  fork?: boolean;
  archived?: boolean;
  private?: boolean;
};

/** Apply the same filtering and data validation to server and browser API responses. */
export function normalizeGithubProjects(repositories: unknown): GithubProject[] {
  if (!Array.isArray(repositories)) throw new Error('Invalid GitHub repositories');

  return (repositories as PublicGithubRepository[])
    .filter((repo) =>
      repo &&
      Number.isSafeInteger(repo.id) &&
      typeof repo.name === 'string' &&
      typeof repo.html_url === 'string' &&
      repo.html_url.startsWith(`${GITHUB_PROFILE_URL}/`) &&
      !repo.fork && !repo.archived && !repo.private &&
      !['portfolio', GITHUB_USERNAME].includes(repo.name.toLowerCase()),
    )
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: typeof repo.description === 'string' ? repo.description : null,
      html_url: repo.html_url,
      homepage: typeof repo.homepage === 'string' && /^https?:\/\//i.test(repo.homepage) ? repo.homepage : null,
      language: typeof repo.language === 'string' ? repo.language : null,
      stargazers_count: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0,
      topics: Array.isArray(repo.topics) ? repo.topics.filter((tag): tag is string => typeof tag === 'string') : [],
      updated_at: typeof repo.updated_at === 'string' ? repo.updated_at : '',
    }));
}

/** Browser fallback when a deployment cannot reach GitHub from its server. */
export async function fetchPublicGithubProjects(signal: AbortSignal): Promise<GithubProject[]> {
  const repositories: unknown[] = [];

  for (let page = 1; page <= 5; page++) {
    const response = await fetch(githubReposUrl(page), {
      signal,
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid GitHub API response');
    repositories.push(...data);
    if (data.length < 100) break;
  }

  return normalizeGithubProjects(repositories);
}

export function projectTitle(name: string) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}
