import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Download, MapPin } from "lucide-react"
import { WithAppMentions } from "@/components/about/app-mentions"
import { AppShowcase } from "@/components/about/app-showcase"
import { Section } from "@/components/site/section"
import { SocialLinks } from "@/components/site/social-links"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getContent, site, type App, type TimelineEntry } from "@/content"
import { cn } from "@/lib/utils"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("about")
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
    openGraph: { type: "profile" },
  })
}

export default async function AboutPage() {
  const locale = await getLocale()
  const t = await getTranslations("about")
  const { profile, skills, apps, work, courses, education } = getContent(locale)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-14 px-6 py-12 md:py-20">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Avatar className="size-24 shrink-0 ring-1 ring-border">
          <AvatarImage src={site.avatar} alt={site.name} />
          <AvatarFallback className="text-xl">{site.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {site.name}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-medium">{profile.role}</span>
              <span className="text-muted-foreground" aria-hidden>
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden />
                {profile.location}
              </span>
            </p>
          </div>
          <p className="leading-relaxed text-pretty text-muted-foreground">
            {profile.bio}
          </p>
          <div className="flex items-center gap-4">
            <SocialLinks />
            <Button size="sm" variant="outline" asChild>
              <a href={site.cv} download>
                <Download aria-hidden />
                {t("downloadCv")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Section title={t("apps")}>
        <AppShowcase apps={apps} />
      </Section>

      <Section title={t("skills")}>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title={t("work")}>
        <Timeline entries={work} apps={apps} />
      </Section>

      <Section title={t("courses")}>
        <Timeline entries={courses} />
      </Section>

      <Section title={t("education")}>
        <ul className="flex flex-col gap-4">
          {education.map((item) => (
            <li
              key={item.degree}
              className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-semibold">{item.institution}</p>
                <p className="text-sm text-muted-foreground">{item.degree}</p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="text-sm text-muted-foreground">
                  {item.period}
                </span>
                {item.grade && (
                  <Badge variant="outline" className="text-xs">
                    {item.grade}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Timeline({
  entries,
  apps = [],
}: {
  entries: TimelineEntry[]
  apps?: App[]
}) {
  return (
    <ol className="mt-2 ml-1">
      {entries.map((entry, i) => {
        const last = i === entries.length - 1
        return (
          <li
            key={`${entry.organization}-${entry.period}`}
            className="relative flex gap-4"
          >
            <div className="flex flex-col items-center" aria-hidden>
              <div className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary ring-2 ring-primary/20" />
              {!last && <div className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className={cn("flex flex-col gap-1.5", !last && "pb-8")}>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="leading-tight font-semibold">
                  <MaybeLink href={entry.url}>{entry.title}</MaybeLink>
                </span>
                <span
                  className="hidden text-muted-foreground sm:inline"
                  aria-hidden
                >
                  ·
                </span>
                <span className="text-sm text-muted-foreground">
                  <MaybeLink href={entry.organizationUrl}>
                    {entry.organization}
                  </MaybeLink>
                </span>
              </div>
              <span className="text-xs font-medium text-primary/80 dark:text-sky-400/80">
                {entry.period}
              </span>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">
                <WithAppMentions text={entry.description} apps={apps} />
              </p>
              {entry.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** External link when there's a URL, plain text otherwise. */
function MaybeLink({
  href,
  children,
}: {
  href?: string
  children: React.ReactNode
}) {
  if (!href) return children
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
    >
      {children}
    </a>
  )
}
