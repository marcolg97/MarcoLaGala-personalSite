import type { Metadata } from "next"
import { site } from "@/content"
import { routing, type Locale } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"

const ogLocales: Record<Locale, string> = { en: "en_US", it: "it_IT" }

/** URLs of a page in every language, e.g. languageUrls("/about") → { en: "/en/about", it: "/it/about" } */
export function languageUrls(path: string, base = ""): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}${path}`])
  ) as Record<Locale, string>
}

type PageMetadataInput = {
  locale: Locale
  /** Path without the locale prefix, e.g. "/about" */
  path: string
  title: string
  description: string
  /** Pages that exist in one language only (blog posts) get no hreflang alternates */
  translated?: boolean
  /** Preview image path, default: app/[locale]/opengraph-image.tsx */
  image?: string
  openGraph?: Metadata["openGraph"]
}

/**
 * Complete metadata for a page: canonical URL, hreflang, Open Graph and Twitter.
 * Next merges metadata objects shallowly, so each page returns the full set.
 * Config-based images override file-based ones inherited from a parent segment,
 * so the preview image is always set explicitly here.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  translated = true,
  image: imagePath = `/${locale}/opengraph-image`,
  openGraph,
}: PageMetadataInput): Metadata {
  const url = `/${locale}${path}`
  const image = {
    url: imagePath,
    width: 1200,
    height: 630,
    alt: site.name,
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: translated ? languageUrls(path) : undefined,
      types: BLOG_ENABLED
        ? { "application/rss+xml": `${site.url}/feed.xml` }
        : undefined,
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocales[locale],
      url,
      title,
      description,
      images: [image],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
