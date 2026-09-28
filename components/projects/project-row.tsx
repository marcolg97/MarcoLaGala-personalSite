import { ArrowUpRight, Star } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { GithubIcon } from "@/components/icons"
import { listRowClassName } from "@/components/site/list-row"
import type { Project } from "@/content"
import { getRepoInfo } from "@/lib/github-repo"
import { cn } from "@/lib/utils"

/**
 * A project as a list row, or as a highlighted panel for featured projects.
 * The whole row links to the site (or to GitHub when there's no site): the title
 * link is stretched over the row, so the GitHub chip can be a separate link.
 */
export async function ProjectRow({
  project,
  variant = "row",
  label,
}: {
  project: Project
  variant?: "row" | "featured"
  /** Small line above the title, e.g. the category in the featured section */
  label?: React.ReactNode
}) {
  const href = project.url ?? project.github
  const featured = variant === "featured"

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        featured
          ? "group rounded-2xl border bg-muted/30 p-5 transition-colors hover:bg-muted/60 has-[a:focus-visible]:bg-muted/60"
          : cn(listRowClassName, "has-[a:focus-visible]:bg-muted/60")
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {label}
        <h3
          className={cn(
            "flex items-center gap-1.5",
            featured ? "text-lg font-semibold tracking-tight" : "font-medium"
          )}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
          {href && (
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
              aria-hidden
            />
          )}
        </h3>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {project.description}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground/80">
          {project.tags.join(" · ")}
        </p>
      </div>

      {project.github && <RepoChip url={project.github} />}
    </article>
  )
}

async function RepoChip({ url }: { url: string }) {
  const [repo, t] = await Promise.all([
    getRepoInfo(url),
    getTranslations("projects"),
  ])
  if (!repo) return null

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("repository", { name: repo.name, stars: repo.stars ?? 0 })}
      className="relative z-10 inline-flex shrink-0 items-center gap-2 self-start rounded-md border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
    >
      <GithubIcon className="size-3.5" />
      {repo.name}
      {repo.stars !== null && repo.stars > 0 && (
        <span className="inline-flex items-center gap-1 border-l pl-2 tabular-nums">
          <Star className="size-3" aria-hidden />
          {repo.stars}
        </span>
      )}
    </a>
  )
}
