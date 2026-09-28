import { getContent, site } from "@/content"
import type { Locale } from "@/i18n/routing"
import type { PostMeta } from "@/lib/posts"

/** schema.org Person: who the site is about. */
export function personData(locale: Locale) {
  const { profile } = getContent(locale)

  return {
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: `${site.url}${site.avatar}`,
    jobTitle: profile.role,
    worksFor: { "@type": "Organization", ...site.employer },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.links),
  }
}

/** schema.org BlogPosting for a post page. */
export function postData(post: PostMeta, locale: Locale) {
  const url = `${site.url}/${locale}/blog/${post.slug}`
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: post.lang,
    keywords: post.tags.join(", "),
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: { "@type": "Person", name: site.name, url: site.url },
  }
}
