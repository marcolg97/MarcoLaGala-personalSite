import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowLeft, Layers } from "lucide-react"
import { ArticleTracking } from "@/components/blog/article-tracking"
import { SeriesCard } from "@/components/blog/series-card"
import { MdxContent } from "@/components/mdx/mdx-content"
import { MobileTOC, TOC } from "@/components/mdx/toc"
import { JsonLd } from "@/components/site/json-ld"
import { Badge } from "@/components/ui/badge"
import { site } from "@/content"
import { Link } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"
import { formatDate } from "@/lib/format"
import { getAllPostsMeta, getPostBySlug, getPublishedPosts } from "@/lib/posts"
import { seriesOf } from "@/lib/series"
import { extractHeadings } from "@/lib/mdx"
import { pageMetadata } from "@/lib/seo"
import { postData } from "@/lib/structured-data"

type Props = PageProps<"/[locale]/blog/[slug]">

export async function generateStaticParams() {
  const posts = BLOG_ENABLED ? await getPublishedPosts() : []
  // Cache Components requires at least one entry: with no posts, prerender a 404
  const slugs = posts.length > 0 ? posts.map((post) => post.slug) : ["_none"]
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post?.published) return {}

  // A post exists in one language: the canonical URL points there, whatever the UI locale
  return pageMetadata({
    locale: post.lang,
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    translated: false,
    image: `/${post.lang}/blog/${post.slug}/opengraph-image`,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
  })
}

export default async function BlogPostPage({ params }: Props) {
  if (!BLOG_ENABLED) notFound()
  const locale = await getLocale()
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post?.published) notFound()

  const t = await getTranslations("blog")
  const headings = extractHeadings(post.content)
  const series = seriesOf(post, locale as Locale)
  const published = series ? getAllPostsMeta(await getPublishedPosts()) : []

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16 xl:max-w-6xl 2xl:max-w-7xl">
      <BackToBlog label={t("backToBlog")} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] xl:gap-20 2xl:gap-24">
        <article lang={post.lang} className="min-w-0">
          <JsonLd data={postData(post, post.lang)} />
          <ArticleTracking slug={post.slug} />
          {/* Same width as the article text (.article in globals.css) */}
          <header className="mb-12 flex max-w-2xl flex-col gap-4 border-b pb-10 xl:max-w-3xl 2xl:max-w-[52rem]">
            {series && (
              <Link
                href={`/blog#series-${series.series.slug}`}
                className="inline-flex w-fit items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
              >
                <Layers className="size-3.5" aria-hidden />
                {t("partOf", { part: series.part, total: series.total })} · {series.series.title}
              </Link>
            )}
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span aria-hidden>·</span>
              <span>{t("minRead", { count: post.readingTime })}</span>
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-lg text-pretty text-muted-foreground">
                {post.description}
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {headings.length > 0 && <MobileTOC headings={headings} />}

          <MdxContent
            source={post.content}
            labels={{
              footnotes: t("footnotes"),
              backToContent: t("backToContent"),
            }}
          />

          {series && (
            <div className="mt-16 max-w-2xl xl:max-w-3xl 2xl:max-w-[52rem]">
              <SeriesCard series={series.series} posts={published} locale={locale} current={post.slug} />
            </div>
          )}
        </article>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <TOC headings={headings} />
          </aside>
        )}
      </div>
    </div>
  )
}

function BackToBlog({ label }: { label: string }) {
  return (
    <Link
      href="/blog"
      className="mb-10 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  )
}
