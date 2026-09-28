/** Site-wide settings that don't change with the language. */
export const site = {
  name: "Marco La Gala",
  url: siteUrl(),
  avatar: "/profilePhoto.jpeg",
  initials: "ML",
  cv: "/CV_Marco_LaGala.pdf",
  links: {
    github: "https://github.com/marcolg97",
    linkedin: "https://linkedin.com/in/marco-la-gala",
  },
  /** Structured data (schema.org Person) */
  employer: { name: "TheFork", url: "https://www.thefork.com" },
  address: { locality: "Turin", country: "IT" },
} as const

// NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is a safe fallback,
// so canonical URLs and the sitemap never point to localhost in production
function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return "http://localhost:3000"
}
