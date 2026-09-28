import { cacheLife, cacheTag } from "next/cache"

export type RepoInfo = { name: string; url: string; stars: number | null }

/** "https://github.com/owner/repo" → { owner, repo } */
function parseRepoUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  return match
    ? { owner: match[1], repo: match[2].replace(/\.git$/, "") }
    : null
}

/**
 * Name and star count of a public GitHub repository, refreshed hourly.
 * If the repo is private or the API fails, stars is null and only the name is shown.
 */
export async function getRepoInfo(url: string): Promise<RepoInfo | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("github-repos")

  const parsed = parseRepoUrl(url)
  if (!parsed) return null

  const token = process.env.GITHUB_TOKEN
  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(token &&
            token !== "placeholder" && { Authorization: `Bearer ${token}` }),
        },
      }
    )
    if (!response.ok) return { name: parsed.repo, url, stars: null }
    const data = (await response.json()) as {
      name: string
      stargazers_count: number
    }
    return { name: data.name, url, stars: data.stargazers_count }
  } catch {
    return { name: parsed.repo, url, stars: null }
  }
}
