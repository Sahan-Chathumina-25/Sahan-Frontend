import { siteConfig } from "@/config/site";

export interface GithubRepo {
  readonly id: number;
  readonly name: string;
  readonly html_url: string;
  readonly description: string | null;
  readonly stargazers_count: number;
  readonly language: string | null;
}

function isGithubRepo(value: unknown): value is GithubRepo {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.html_url === "string" &&
    (typeof v.description === "string" || v.description === null) &&
    typeof v.stargazers_count === "number" &&
    (typeof v.language === "string" || v.language === null)
  );
}

/** Fetches public repos for the configured GitHub user. Returns null on any failure. */
export async function fetchGithubRepos(limit = 6): Promise<readonly GithubRepo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${siteConfig.githubUsername}/repos?per_page=${limit}&sort=updated`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data.filter(isGithubRepo).slice(0, limit);
  } catch {
    return null;
  }
}

export function githubProfileUrl(): string {
  return `https://github.com/${siteConfig.githubUsername}`;
}
