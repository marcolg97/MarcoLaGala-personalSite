import { Fragment } from "react"
import { cn } from "@/lib/utils"

/**
 * Token names taken apart: each part of the full name is colored by its level
 * (category, element, role, emphasis, state). The parts in `drop` (indexes) are faded
 * and struck through; the short name is built from the parts that stay, in order.
 *
 *   <TokenAnatomy examples={[
 *     { name: "color.text.secondary", levels: ["category", "element", "emphasis"],
 *       drop: [0], note: "the date under a title" },
 *   ]} />
 */

type Level = "category" | "element" | "role" | "emphasis" | "state"

const levelStyle: Record<Level, string> = {
  category: "[--lvl:var(--color-zinc-500)]",
  element: "[--lvl:var(--color-sky-600)] dark:[--lvl:var(--color-sky-400)]",
  role: "[--lvl:var(--color-violet-600)] dark:[--lvl:var(--color-violet-400)]",
  emphasis:
    "[--lvl:var(--color-amber-600)] dark:[--lvl:var(--color-amber-400)]",
  state: "[--lvl:var(--color-rose-600)] dark:[--lvl:var(--color-rose-400)]",
}

const order: Level[] = ["category", "element", "role", "emphasis", "state"]

function Part({
  level,
  dropped,
  children,
}: {
  level: Level
  dropped: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-1.5 py-0.5 font-mono text-[0.8rem] text-(--lvl)",
        dropped
          ? "border-dashed border-(--lvl)/30 line-through decoration-[1.5px] opacity-45"
          : "border-(--lvl)/30 bg-(--lvl)/10",
        levelStyle[level]
      )}
    >
      {children}
    </span>
  )
}

/** The parts that stay, joined in camelCase: action + primary → actionPrimary. */
function shortName(parts: string[], drop: number[]) {
  return parts
    .filter((_, i) => !drop.includes(i))
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("")
}

export function TokenAnatomy({
  examples,
}: {
  examples: { name: string; levels: Level[]; drop?: number[]; note: string }[]
}) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border">
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-b bg-muted/40 px-4 py-2.5 text-xs">
        {order.map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "size-2.5 rounded-full bg-(--lvl)",
                levelStyle[level]
              )}
            />
            {level}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 opacity-60">
          <span className="font-mono line-through">abc</span> dropped in a small
          app
        </span>
      </div>
      <ul className="m-0 list-none divide-y p-0">
        {examples.map((example) => {
          const parts = example.name.split(".")
          const drop = example.drop ?? []
          return (
            <li key={example.name} className="m-0 px-4 py-3">
              <div className="flex flex-wrap items-center gap-1">
                {parts.map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 && (
                      <span className="font-mono text-xs opacity-40">.</span>
                    )}
                    <Part level={example.levels[i]} dropped={drop.includes(i)}>
                      {part}
                    </Part>
                  </Fragment>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <span className="opacity-50">→</span>
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8rem] font-semibold">
                  {shortName(parts, drop)}
                </code>
                <span className="opacity-70">{example.note}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
