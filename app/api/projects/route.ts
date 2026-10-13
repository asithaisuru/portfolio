import { NextResponse } from 'next/server';
import { githubReposUrl, normalizeGithubProjects } from '@/lib/github-projects';

// Resolve the feed at request time. Building the site never requires GitHub access.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repositories: unknown[] = [];

    // Follow GitHub's pages so new public repositories also appear in the journey.
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        githubReposUrl(page),
        {
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
          },
          next: { revalidate: 900 },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      const pageRepos: unknown = await response.json();
      if (!Array.isArray(pageRepos)) throw new Error('Invalid GitHub response');
      repositories.push(...pageRepos);
      if (pageRepos.length < 100) break;
    }

    const projects = normalizeGithubProjects(repositories);

    return NextResponse.json(
      { projects, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    );
  } catch (error) {
    console.error('Unable to load GitHub projects:', error);
    return NextResponse.json(
      { error: 'GitHub projects are temporarily unavailable. Please try again.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
