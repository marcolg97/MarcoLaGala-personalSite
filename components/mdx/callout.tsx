import {
  CircleAlert,
  Info,
  Lightbulb,
  MessageSquareWarning,
  TriangleAlert,
} from "lucide-react"
import type { CalloutType } from "@/lib/mdx"
import { cn } from "@/lib/utils"

const variants: Record<CalloutType, { icon: typeof Info; className: string }> =
  {
    note: { icon: Info, className: "[--callout:var(--color-sky-500)]" },
    tip: { icon: Lightbulb, className: "[--callout:var(--color-emerald-500)]" },
    important: {
      icon: MessageSquareWarning,
      className: "[--callout:var(--color-violet-500)]",
    },
    warning: {
      icon: TriangleAlert,
      className: "[--callout:var(--color-amber-500)]",
    },
    caution: {
      icon: CircleAlert,
      className: "[--callout:var(--color-rose-500)]",
    },
  }

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}) {
  const { icon: Icon, className } = variants[type] ?? variants.note

  return (
    <aside
      className={cn(
        "relative my-8 rounded-xl border-l-4 border-(--callout) bg-(--callout)/8 px-6 py-5 dark:bg-(--callout)/12",
        "[&_p]:my-3 [&>:first-child]:mt-0 [&>:last-child]:mb-0",
        className
      )}
    >
      <span className="absolute -top-4 -left-4 flex size-8 items-center justify-center rounded-full bg-background ring-1 ring-(--callout)/40">
        <Icon className="size-4 text-(--callout)" aria-hidden />
      </span>
      {title && <p className="mb-2 font-semibold">{title}</p>}
      {children}
    </aside>
  )
}
