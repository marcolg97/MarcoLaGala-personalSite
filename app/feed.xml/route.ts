import { cacheLife, cacheTag } from "next/cache"
import { site } from "@/content"
import { BLOG_ENABLED } from "@/lib/flags"
import { getPublishedPosts } from "@/lib/posts"

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

async function buildFeed() {
  "use cache"
  cacheLife("hours")
  cacheTag("posts")

  const posts = await getPublishedPosts()
  const items = posts
    .map((post) => {
      const url = `${site.url}/${post.lang}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(`${site.name} — blog`)}</description>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
}

/** RSS feed of all published posts, in every language. */
export async function GET() {
  if (!BLOG_ENABLED) return new Response("Not found", { status: 404 })
  return new Response(await buildFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
