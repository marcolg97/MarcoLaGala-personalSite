import { Link } from "@/i18n/navigation"
import type { PostMeta } from "@/lib/posts"
import { formatDate } from "@/lib/format"
import { listRowClassName } from "@/components/site/list-row"

export function PostRow({ post, locale }: { post: PostMeta; locale: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className={listRowClassName}>
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
