"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { PostMeta } from "@/lib/posts"
import { PostRow } from "./post-row"

/** All posts with a tag filter. */
export function PostList({ posts }: { posts: PostMeta[] }) {
  const t = useTranslations("blog")
  const locale = useLocale()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort()
  const visible = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts

  return (
    <div className="flex flex-col gap-6">
      {tags.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t("filterByTag")}
        >
          {[null, ...tags].map((tag) => (
            <Button
              key={tag ?? "all"}
              variant={selectedTag === tag ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            >
              {tag ?? t("allTags")}
            </Button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="flex flex-col">
          {visible.map((post) => (
            <PostRow key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
