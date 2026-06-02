import { z } from 'zod';

/** Shape from GitHub API /repos response */
const githubRepoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()),
  html_url: z.string(),
});

export type GitHubRepo = z.infer<typeof githubRepoSchema>;

const GITHUB_API = 'https://api.github.com/users/SamppaFIN/repos?per_page=100&sort=updated';

/**
 * Fetch all public repos for SamppaFIN from GitHub API.
 * Returns empty array on failure (build should not break if API is unavailable).
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(GITHUB_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Infinite-Portfolio/1.0',
      },
    });

    if (!res.ok) {
      console.warn(`[github] API returned ${res.status}, skipping enrichment`);
      return [];
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const parsed = z.array(githubRepoSchema).safeParse(data);
    if (!parsed.success) {
      console.warn('[github] Unexpected API response shape, skipping enrichment');
      return [];
    }

    return parsed.data;
  } catch (err) {
    console.warn('[github] Fetch failed:', err);
    return [];
  }
}

/**
 * Match a GitHub repo to a project slug.
 * Tries: exact name match, then common slug transformations.
 */
export function matchGitHubRepo(repos: GitHubRepo[], slug: string): GitHubRepo | undefined {
  return repos.find((r) => {
    const normalized = r.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return (
      normalized === slug ||
      r.name.toLowerCase() === slug
    );
  });
}
