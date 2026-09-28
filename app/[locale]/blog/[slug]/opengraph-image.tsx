import { site } from "@/content"
import { getPostBySlug } from "@/lib/posts"
import { ogSize, renderOgImage } from "@/lib/og"

export const alt = site.name
export const size = ogSize
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return renderOgImage({
    title: post?.published ? post.title : site.name,
    description: post?.published ? post.description : undefined,
  })
}
