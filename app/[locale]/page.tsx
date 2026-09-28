import { Suspense } from "react"
import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight, FileText, MapPin } from "lucide-react"
import { PostRow } from "@/components/blog/post-row"
import { ProjectRow } from "@/components/projects/project-row"
import { Section } from "@/components/site/section"
import { JsonLd } from "@/components/site/json-ld"
import { SocialLinks } from "@/components/site/social-links"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getContent, site } from "@/content"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"
import { getFeaturedPosts } from "@/lib/posts"
import { cn } from "@/lib/utils"
import { pageMetadata } from "@/lib/seo"
import { personData } from "@/lib/structured-data"

// Staggered entrance, disabled for users who prefer reduced motion
function reveal(step: 0 | 1 | 2) {
  return cn(
    "animate-in duration-700 ease-out fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
    ["delay-0", "delay-100", "delay-200"][step]
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const { profile } = getContent(locale)
  const title = `${site.name} — ${profile.role}`

  return {
    ...pageMetadata({ locale, path: "", title, description: t("description") }),
    title: { absolute: title },
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const { profile, projects } = getContent(locale)
  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-16 px-6 py-20 sm:py-28">
      <JsonLd data={personData(locale)} />
      <section className={cn("flex flex-col gap-8", reveal(0))}>
        <div className="flex items-center gap-4">
          <Avatar className="size-14 ring-1 ring-border">
            <AvatarImage src={site.avatar} alt={site.name} />
            <AvatarFallback>{site.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold tracking-tight">{site.name}</h1>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {profile.role}
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {profile.location}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t("intro")}
          </p>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            {profile.bio}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <SocialLinks showLabels />
          <a
            href={site.cv}
            download
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText className="size-4" aria-hidden />
            {t("cv")}
          </a>
          <Link
            href="/about"
            className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("aboutMe")}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {BLOG_ENABLED && (
        <Section
          title={t("latestPosts")}
          link={{ href: "/blog", label: t("viewAll") }}
          className={reveal(1)}
        >
          <Suspense fallback={<Skeleton className="h-16 rounded-lg" />}>
            <FeaturedPosts locale={locale} />
          </Suspense>
        </Section>
      )}

      <Section
        title={t("projects")}
        link={{ href: "/projects", label: t("viewAll") }}
        className={reveal(BLOG_ENABLED ? 2 : 1)}
      >
        {featuredProjects.map((project) => (
          <ProjectRow key={project.title} project={project} />
        ))}
      </Section>
    </div>
  )
}

async function FeaturedPosts({ locale }: { locale: Locale }) {
  const posts = await getFeaturedPosts()
  return posts
    .slice(0, 5)
    .map((post) => <PostRow key={post.slug} post={post} locale={locale} />)
}
