import type { Metadata, Viewport } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getTranslations } from "next-intl/server"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/content"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import "../globals.css"

const fontSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1113" },
  ],
}

// Defaults for every page; each page returns its full metadata via pageMetadata()
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home")

  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: t("description"),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
  }
}

// Root layout: every page lives under [locale], so <html lang> is rendered here
export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale()
  const t = await getTranslations("common")

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <NextIntlClientProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-2 focus:text-foreground focus:shadow-md"
            >
              {t("skipToContent")}
            </a>
            <Header />
            <main id="main-content" className="min-h-[calc(100svh-8rem)]">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
