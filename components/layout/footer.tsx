import { cacheLife } from "next/cache"
import { SocialLinks } from "@/components/site/social-links"
import { site } from "@/content"

// Cached so pages stay static; refreshed daily, which is plenty for a copyright year
async function getCurrentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}

export async function Footer() {
  const year = await getCurrentYear()

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <p className="text-xs text-muted-foreground">
          &copy; {year} {site.name}
        </p>
        <div className="flex items-center gap-3">
          <SocialLinks />
        </div>
      </div>
    </footer>
  )
}
