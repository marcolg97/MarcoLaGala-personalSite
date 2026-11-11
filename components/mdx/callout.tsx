import {
  BookOpen,
  CircleAlert,
  Info,
  Lightbulb,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import type { CalloutType } from "@/lib/mdx"
import { cn } from "@/lib/utils"

const variants: Record<
  CalloutType,
  { icon: typeof Info; label: string; className: string }
> = {
  note: {
    icon: Info,
    label: "Note",
    className: "[--callout:var(--color-sky-500)]",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    className: "[--callout:var(--color-emerald-500)]",
  },
  important: {
    icon: Sparkles,
    label: "Important",
    className: "[--callout:var(--color-violet-500)]",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    className: "[--callout:var(--color-amber-500)]",
  },
  caution: {
    icon: CircleAlert,
    label: "Caution",
    className: "[--callout:var(--color-rose-500)]",
  },
  learn: {
    icon: BookOpen,
    label: "Learn more",
    className: "[--callout:var(--color-indigo-500)]",
  },
}

/**
 * A highlighted box. The header shows the type's icon and the title (or the type's
 * label when there's no title):
 *
 *   <Callout type="learn" title="Learn more: real palettes">
 *   - [Tailwind colors](https://tailwindcss.com/docs/colors): ...
 *   </Callout>
 *
 * GitHub alerts (`> [!TIP] Title`) are turned into this component too.
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}) {
  const { icon: Icon, label, className } = variants[type] ?? variants.note

  return (
    <aside
      className={cn(
        "my-8 rounded-xl border-l-4 border-(--callout) bg-(--callout)/8 px-6 py-5 dark:bg-(--callout)/12",
        "[&_p]:my-3 [&_ul]:my-3 [&>:last-child]:mb-0",
        className
      )}
    >
      <p className="!mt-0 !mb-3 flex items-center gap-2.5 font-semibold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--callout)/15">
          <Icon className="size-5 text-(--callout)" aria-hidden />
        </span>
        <span>{title ?? label}</span>
      </p>
      {children}
    </aside>
  )
}
