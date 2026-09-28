import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { Octokit } from "@octokit/rest"
import matter from "gray-matter"
import { cacheLife, cacheTag } from "next/cache"
import { hasLocale } from "next-intl"
import { routing, type Locale } from "@/i18n/routing"

/**
 * Posts live as `posts/<slug>.mdx` in a private GitHub repo (PRIVATE_CONTENT_REPO).
 * For local writing, set LOCAL_CONTENT_DIR to a checkout of that repo:
 * posts are then read from disk and drafts (`published: false`) are shown too.
 */

const POSTS_DIR = "posts"
const LOCAL_CONTENT_DIR = process.env.LOCAL_CONTENT_DIR

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

function isGithubConfigured(): boolean {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.PRIVATE_CONTENT_REPO
  return Boolean(
    token && token !== "placeholder" && repo && repo !== "owner/repo"
  )
}

function getRepoInfo() {
  const repo = process.env.PRIVATE_CONTENT_REPO
  if (!repo) throw new Error("PRIVATE_CONTENT_REPO env var is not set")
  const [owner, rawRepoName] = repo.split("/")
  if (!owner || !rawRepoName)
    throw new Error("PRIVATE_CONTENT_REPO must be in the format owner/repo")
  // Strip .git suffix if present (e.g. cloned URLs like owner/repo.git)
  return { owner, repo: rawRepoName.replace(/\.git$/, "") }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 404
  )
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  /** Language the post is written in (`lang` in the frontmatter, default: English) */
  lang: Locale
  published: boolean
  featured: boolean
  readingTime: number
}

export type Post = PostMeta & {
  content: string
}

function parsePost(slug: string, rawContent: string): Post {
  const { data, content: body } = matter(rawContent)
  // The page header already shows the title: drop a leading "# Title" line
  const content = body.replace(/^\s*# .+\n/, "")
  const readingTime = Math.max(
    1,
    Math.ceil(content.trim().split(/\s+/).length / 200)
  )
  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString(),
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    lang: hasLocale(routing.locales, data.lang)
      ? data.lang
      : routing.defaultLocale,
    // Local preview shows drafts, production only what is explicitly published
    published: LOCAL_CONTENT_DIR ? true : data.published === true,
    featured: data.featured === true,
    readingTime,
    content,
  }
}

// Files starting with "_" (e.g. `_template.mdx`) are only listed in local preview
function isPostFile(name: string): boolean {
  return (
    name.endsWith(".mdx") &&
    (Boolean(LOCAL_CONTENT_DIR) || !name.startsWith("_"))
  )
}

// ===== Sources =====

async function readLocalFile(slug: string): Promise<string | null> {
  try {
    return await readFile(
      path.join(LOCAL_CONTENT_DIR!, POSTS_DIR, `${slug}.mdx`),
      "utf-8"
    )
  } catch {
    return null
  }
}

async function listLocalSlugs(): Promise<string[]> {
  try {
    const files = await readdir(path.join(LOCAL_CONTENT_DIR!, POSTS_DIR))
    return files.filter(isPostFile).map((f) => f.replace(/\.mdx$/, ""))
  } catch {
    return []
  }
}

async function readGithubFile(slug: string): Promise<string | null> {
  const { owner, repo } = getRepoInfo()
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: `${POSTS_DIR}/${slug}.mdx`,
    })
    if (Array.isArray(data) || data.type !== "file") return null
    return Buffer.from(data.content, "base64").toString("utf-8")
  } catch (error) {
    if (isNotFound(error)) return null
    // Rethrow so 'use cache' doesn't cache a failure
    throw error
  }
}

async function listGithubSlugs(): Promise<string[]> {
  const { owner, repo } = getRepoInfo()
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: POSTS_DIR,
    })
    if (!Array.isArray(data)) return []
    return data
      .filter((f) => f.type === "file" && isPostFile(f.name))
      .map((f) => f.name.replace(/\.mdx$/, ""))
  } catch (error) {
    // 404 = empty repo or posts/ dir doesn't exist yet
    if (isNotFound(error)) return []
    throw error
  }
}

async function readPostFile(slug: string): Promise<string | null> {
  if (LOCAL_CONTENT_DIR) return readLocalFile(slug)
  if (!isGithubConfigured()) return null
  return readGithubFile(slug)
}

async function listSlugs(): Promise<string[]> {
  if (LOCAL_CONTENT_DIR) return listLocalSlugs()
  if (!isGithubConfigured()) return []
  return listGithubSlugs()
}

// In development, edits to posts show up within seconds
function applyCacheLife() {
  if (process.env.NODE_ENV === "development") cacheLife("seconds")
  else cacheLife("hours")
}

// ===== Public API =====

export async function getAllPosts(): Promise<Post[]> {
  "use cache"
  applyCacheLife()
  cacheTag("posts")

  const slugs = await listSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readPostFile(slug)
      return raw ? parsePost(slug, raw) : null
    })
  )

  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.published)
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.featured && p.published)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache"
  applyCacheLife()
  cacheTag("posts")

  // Slugs come from the URL: never let them escape posts/, and apply the same
  // visibility rule as the post list (no "_" files outside local preview)
  if (!/^[\w-]+$/.test(slug) || !isPostFile(`${slug}.mdx`)) return null

  const raw = await readPostFile(slug)
  return raw ? parsePost(slug, raw) : null
}

export function getAllPostsMeta(posts: Post[]): PostMeta[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return posts.map(({ content, ...meta }) => meta)
}
