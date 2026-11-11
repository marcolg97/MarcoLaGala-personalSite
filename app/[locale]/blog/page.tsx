import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { PostList } from "@/components/blog/post-list"
import { SeriesCard } from "@/components/blog/series-card"
import { Section } from "@/components/site/section"
import type { Locale } from "@/i18n/routing"
import { PageHeader } from "@/components/site/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { BLOG_ENABLED } from "@/lib/flags"
import { getAllPostsMeta, getPublishedPosts } from "@/lib/posts"
import { pageMetadata } from "@/lib/seo"
import { getSeries, seriesOf } from "@/lib/series"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("blog")
  return pageMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
  })
}

export default async function BlogPage() {
  if (!BLOG_ENABLED) notFound()
  const t = await getTranslations("blog")

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-12 md:py-20">
      <PageHeader title={t("title")} description={t("description")} />
      <Suspense fallback={<Skeleton className="h-40" />}>
        <Posts locale={(await getLocale()) as Locale} />
      </Suspense>
    </div>
  )
}

async function Posts({ locale }: { locale: Locale }) {
  const t = await getTranslations("blog")
  const posts = getAllPostsMeta(await getPublishedPosts())
  // A series shows up once at least one of its parts is out
  const series = getSeries(locale).filter((s) => s.parts.some((p) => posts.some((post) => post.slug === p.post)))
  const eyebrows: Record<string, string> = {}
  for (const post of posts) {
    const info = seriesOf(post, locale)
    if (info) eyebrows[post.slug] = `${t("partOf", { part: info.part, total: info.total })} · ${info.series.title}`
  }

  return (
    <>
      {series.length > 0 && (
        <div className="flex flex-col gap-4">
          {series.map((s) => (
            <SeriesCard key={s.slug} series={s} posts={posts} locale={locale} />
          ))}
        </div>
      )}
      <Section title={t("allPosts")}>
        <PostList posts={posts} eyebrows={eyebrows} />
      </Section>
    </>
  )
}
