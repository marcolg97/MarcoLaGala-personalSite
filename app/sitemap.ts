import type { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { site } from "@/content"
import { routing } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"
import { getPublishedPosts } from "@/lib/posts"
import { languageUrls } from "@/lib/seo"

const pages = ["", "/about", "/projects", ...(BLOG_ENABLED ? ["/blog"] : [])]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"
  cacheLife("hours")
  cacheTag("posts")

  const posts = BLOG_ENABLED ? await getPublishedPosts() : []

  // One entry per page, listing every language version as an alternate
  const entry = (
    path: string,
    extra: Partial<MetadataRoute.Sitemap[number]> = {}
  ) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: { languages: languageUrls(path, site.url) },
      ...extra,
    }))

  return [
    ...pages.flatMap((path) =>
      entry(path, { priority: path === "" ? 1 : 0.8 })
    ),
    // A post exists only in its own language: one entry, no alternates
    ...posts.map((post) => ({
      url: `${site.url}/${post.lang}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.6,
    })),
  ]
}
