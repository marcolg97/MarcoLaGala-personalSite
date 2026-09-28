import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { MdxContent } from "@/components/mdx/mdx-content"
import { MobileTOC, TOC } from "@/components/mdx/toc"
import { JsonLd } from "@/components/site/json-ld"
import { Badge } from "@/components/ui/badge"
import { site } from "@/content"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"
import { formatDate } from "@/lib/format"
import { getPostBySlug, getPublishedPosts } from "@/lib/posts"
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <BackToBlog label={t("backToBlog")} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article lang={post.lang} className="min-w-0">
          <JsonLd data={postData(post, post.lang)} />
          <header className="mb-12 flex flex-col gap-4 border-b pb-10">
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
