import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { PostList } from "@/components/blog/post-list"
import { PageHeader } from "@/components/site/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { BLOG_ENABLED } from "@/lib/flags"
import { getAllPostsMeta, getPublishedPosts } from "@/lib/posts"
import { pageMetadata } from "@/lib/seo"

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
        <Posts />
      </Suspense>
    </div>
  )
}

async function Posts() {
  const posts = await getPublishedPosts()
  return <PostList posts={getAllPostsMeta(posts)} />
}
