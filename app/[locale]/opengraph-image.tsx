import { getTranslations } from "next-intl/server"
import { getContent, site } from "@/content"
import { routing, type Locale } from "@/i18n/routing"
import { ogSize, renderOgImage } from "@/lib/og"

// Default preview for every page under [locale]; blog posts have their own
export const alt = site.name
export const size = ogSize
export const contentType = "image/png"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale as Locale
  const { profile } = getContent(locale)
  // The short home description fits the image; the full bio would be cut mid-sentence
  const t = await getTranslations({ locale, namespace: "home" })
  return renderOgImage({
    title: `${profile.role} · ${profile.location}`,
    description: t("description"),
  })
}
