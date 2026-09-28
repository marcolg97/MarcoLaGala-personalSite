import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // Enables the "use cache" directive used to cache posts fetched from GitHub
  cacheComponents: true,
  experimental: {
    // app/global-not-found.tsx: the root layout is app/[locale]/layout.tsx
    globalNotFound: true,
  },
}

export default withNextIntl(nextConfig)
