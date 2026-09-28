import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"

/** A home/list section with a small uppercase title and an optional "view all" link. */
export function Section({
  title,
  link,
  className,
  children,
}: {
  title: string
  link?: { href: string; label: string }
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {link && (
          <Link
            href={link.href}
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
