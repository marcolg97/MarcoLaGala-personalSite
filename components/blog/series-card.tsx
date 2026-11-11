import { Layers } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { Series } from "@/content"
import type { PostMeta } from "@/lib/posts"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * A series as a card: what it is about, and its parts in order. Published parts link to
 * the post, the one being read is marked, the others say "Coming soon".
 */
export function SeriesCard({
  series,
  posts,
  locale,
  current,
}: {
  series: Series
  /** Published posts, to know which parts are out */
  posts: PostMeta[]
  locale: string
  /** Slug of the post being read, if the card sits inside it */
  current?: string
}) {
  const t = useTranslations("blog")
  const bySlug = new Map(posts.map((p) => [p.slug, p]))

  return (
    <section id={`series-${series.slug}`} className="not-prose scroll-mt-24 rounded-xl border bg-muted/30 p-5 sm:p-6">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        <Layers className="size-3.5" aria-hidden />
        {t("series")} · {t("parts", { count: series.parts.length })}
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-balance">{series.title}</h2>
      <p className="mt-1 text-pretty text-muted-foreground">{series.description}</p>

      <ol className="mt-5 flex flex-col">
        {series.parts.map((part, i) => {
          const post = part.post ? bySlug.get(part.post) : undefined
          const isCurrent = post !== undefined && post.slug === current
          const number = (
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
                post ? "border-foreground/40" : "border-dashed border-muted-foreground/40 text-muted-foreground",
                isCurrent && "border-foreground bg-foreground text-background"
              )}
            >
              {i + 1}
            </span>
          )
          const meta = isCurrent
            ? t("reading")
            : post
              ? formatDate(post.date, locale)
              : t("comingSoon")
          const body = (
            <>
              {number}
              <span className="flex min-w-0 flex-col">
                <span className={cn("font-medium", !post && "text-muted-foreground")}>{part.title}</span>
                <span className="text-sm text-muted-foreground">{meta}</span>
              </span>
            </>
          )
          return (
            <li key={part.title} className="relative">
              {i < series.parts.length - 1 && (
                <span aria-hidden className="absolute top-10 bottom-0 left-[1.6rem] w-px -translate-x-1/2 bg-border" />
              )}
              {post && !isCurrent ? (
                <Link
                  href={`/blog/${post.slug}`}
                  className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
                >
                  {body}
                </Link>
              ) : (
                <div className="-mx-2 flex items-start gap-3 px-2 py-2" aria-current={isCurrent ? "page" : undefined}>
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
