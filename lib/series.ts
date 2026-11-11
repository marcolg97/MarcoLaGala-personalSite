import { getContent, type Series } from "@/content"
import type { Locale } from "@/i18n/routing"
import type { PostMeta } from "@/lib/posts"

export function getSeries(locale: Locale): Series[] {
  return getContent(locale).series
}

/** The series a post belongs to, and which part it is (1-based). */
export function seriesOf(post: Pick<PostMeta, "slug" | "series">, locale: Locale) {
  if (!post.series) return null
  const series = getSeries(locale).find((s) => s.slug === post.series)
  if (!series) return null
  const index = series.parts.findIndex((p) => p.post === post.slug)
  if (index < 0) return null
  return { series, part: index + 1, total: series.parts.length }
}
