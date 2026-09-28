import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { projectCategories } from "@/components/projects/categories"
import { ProjectRow } from "@/components/projects/project-row"
import { PageHeader } from "@/components/site/page-header"
import { getContent } from "@/content"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("projects")
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description"),
  })
}

export default async function ProjectsPage() {
  const locale = await getLocale()
  const t = await getTranslations("projects")
  const { projects } = getContent(locale)

  // Featured projects open the page; each category lists the others.
  // Categories without projects are hidden.
  const featured = projects.filter((p) => p.featured)
  const sections = projectCategories
    .map((category) => ({
      ...category,
      projects: projects.filter(
        (p) => p.category === category.id && !p.featured
      ),
      // The nav counts featured projects too, so it matches the whole category
      total: projects.filter((p) => p.category === category.id).length,
    }))
    .filter((section) => section.projects.length > 0)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-14 px-6 py-12 md:py-20">
      <div className="flex flex-col gap-6">
        <PageHeader title={t("title")} description={t("description")} />

        {sections.length > 1 && (
          <nav aria-label={t("sectionsNav")} className="flex flex-wrap gap-2">
            {sections.map(({ id, icon: Icon, total }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Icon
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {t(`categories.${id}.title`)}
                <span className="text-muted-foreground tabular-nums">
                  {total}
                </span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {featured.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="featured">
          <h2
            id="featured"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
          >
            {t("featured")}
          </h2>
          <ul className="grid gap-3">
            {featured.map((project) => {
              const category = projectCategories.find(
                (c) => c.id === project.category
              )!
              return (
                <li key={project.title}>
                  <ProjectRow
                    project={project}
                    variant="featured"
                    label={
                      <span className="mb-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <category.icon
                          className="size-3.5"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        {t(`categories.${category.id}.title`)}
                      </span>
                    }
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {sections.map(({ id, icon: Icon, projects }) => (
        <section key={id} id={id} className="flex scroll-mt-24 flex-col gap-3">
          <header className="flex flex-col gap-0.5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Icon
                  className="size-5 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {t(`categories.${id}.title`)}
              </h2>
              <span className="text-sm text-muted-foreground tabular-nums">
                {t("count", { count: projects.length })}
              </span>
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {t(`categories.${id}.description`)}
            </p>
          </header>

          <ul className="flex flex-col">
            {projects.map((project) => (
              <li key={project.title}>
                <ProjectRow project={project} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
