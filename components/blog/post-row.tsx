import { Link } from "@/i18n/navigation"
import type { PostMeta } from "@/lib/posts"
import { formatDate } from "@/lib/format"
import { listRowClassName } from "@/components/site/list-row"

/** One post in a list. `eyebrow` is a small line above the title, e.g. "Part 1 of 3 · Series". */
export function PostRow({ post, locale, eyebrow }: { post: PostMeta; locale: string; eyebrow?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className={listRowClassName}>
      {eyebrow && (
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{eyebrow}</span>
      )}
      <div className="flex items-baseline justify-between gap-6">
        <span className="font-medium">{post.title}</span>
        <time
          dateTime={post.date}
          className="shrink-0 text-sm text-muted-foreground tabular-nums"
        >
          {formatDate(post.date, locale, "short")}
        </time>
      </div>
      {post.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.description}
        </p>
      )}
    </Link>
  )
}
