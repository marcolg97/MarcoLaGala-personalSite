import { CircleCheck, CircleX } from "lucide-react"
import { cn } from "@/lib/utils"

const tones = {
  problem: {
    icon: CircleX,
    className: "[--status:var(--color-rose-600)] dark:[--status:var(--color-rose-400)]",
  },
  solved: {
    icon: CircleCheck,
    className: "[--status:var(--color-emerald-600)] dark:[--status:var(--color-emerald-400)]",
  },
}

/**
 * A small red or green pill that marks where the story stands: a problem appears,
 * a problem gets solved. Put it at the start of a paragraph:
 *
 *   <Status tone="problem">Problem: consistency</Status> Every value was decided…
 *   <Status tone="solved">Solved</Status> Three yellows become one.
 */
export function Status({
  tone,
  children,
}: {
  tone: keyof typeof tones
  children: React.ReactNode
}) {
  const { icon: Icon, className } = tones[tone]
  return (
    <span
      className={cn(
        "mr-1.5 inline-flex items-center gap-1 rounded-full border border-(--status)/30 bg-(--status)/10 px-2.5 py-0.5 align-[0.05em] text-[0.8rem] font-semibold whitespace-nowrap text-(--status)",
        className
      )}
    >
      <Icon className="size-4" aria-hidden />
      {children}
    </span>
  )
}
