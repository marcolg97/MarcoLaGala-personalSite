import { GithubIcon, LinkedinIcon } from "@/components/icons"
import { site } from "@/content"
import { cn } from "@/lib/utils"

const links = [
  { href: site.links.github, label: "GitHub", icon: GithubIcon },
  { href: site.links.linkedin, label: "LinkedIn", icon: LinkedinIcon },
]

/** GitHub and LinkedIn links, as icons only or with their names. */
export function SocialLinks({
  showLabels = false,
  className,
}: {
  showLabels?: boolean
  className?: string
}) {
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={showLabels ? undefined : label}
          className={cn(
            "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground",
            className
          )}
        >
          <Icon className="size-4" />
          {showLabels && label}
        </a>
      ))}
    </>
  )
}
