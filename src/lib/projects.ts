import { z } from 'zod';
import projectData from '../data/projects.json';
import { fetchGitHubRepos, matchGitHubRepo, type GitHubRepo } from './github';

/** Shape of our curated project data */
export const projectSchema = z.object({
  slug: z.string(),
  title: z.object({ en: z.string(), fi: z.string() }),
  description: z.object({ en: z.string(), fi: z.string() }),
  learnings: z.object({ en: z.string(), fi: z.string() }),
  tags: z.array(z.string()),
  image: z.string(),
  demoUrl: z.string(),
  repoUrl: z.string(),
  featured: z.boolean(),
  order: z.number(),
});

/** Enriched project used in templates */
export interface EnrichedProject extends z.infer<typeof projectSchema> {
  github?: {
    stars: number;
    forks: number;
    language: string | null;
    updatedAt: string;
    topics: string[];
  };
}

/**
 * Load all projects, validate, and enrich with GitHub API data.
 * Cached in module scope so the API fetch happens once per build.
 */
let _projectsCache: EnrichedProject[] | null = null;

export async function getProjects(): Promise<EnrichedProject[]> {
  if (_projectsCache) return _projectsCache;

  // Validate curated data
  const parsed = z.array(projectSchema).safeParse(projectData);
  if (!parsed.success) {
    console.error('[projects] Invalid projects.json:', parsed.error.format());
    return [];
  }

  const projects = parsed.data;

  // Enrich with GitHub API data
  const repos = await fetchGitHubRepos();

  const enriched: EnrichedProject[] = projects.map((p) => {
    const repo = p.repoUrl ? matchGitHubRepo(repos, p.slug) : undefined;
    return {
      ...p,
      github: repo
        ? {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            updatedAt: repo.updated_at,
            topics: repo.topics,
          }
        : undefined,
    };
  });

  // Sort by order field
  enriched.sort((a, b) => a.order - b.order);

  _projectsCache = enriched;
  return enriched;
}

/**
 * Get a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<EnrichedProject | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

/**
 * Get the featured project (first with featured: true).
 */
export async function getFeaturedProject(): Promise<EnrichedProject | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.featured);
}

/**
 * Get all unique tags from all projects, sorted alphabetically.
 */
export async function getAllTags(): Promise<string[]> {
  const projects = await getProjects();
  const tagSet = new Set<string>();
  for (const p of projects) {
    for (const tag of p.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
