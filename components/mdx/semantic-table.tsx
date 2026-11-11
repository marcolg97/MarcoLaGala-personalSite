"use client"

import { EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { AutoplayHint, StateButton, useAutoplay, useInView } from "./interactive"

/**
 * Semantic tokens as a table: the name, what it means, and the primitive it points to.
 * The last column sits in a dashed "implementation" frame: switch to "What components
 * see" and it blurs out, because components only know the first two columns.
 *
 *   <SemanticTable rows={[
 *     { token: "actionPrimary", meaning: "the color of the main action",
 *       usedBy: "buttons", points: "yellow500", color: "#F5B400" },
 *   ]} />
 */

type Row = { token: string; meaning: string; usedBy: string; points: string; color: string }

const views = ["The whole table", "What components see"]

export function SemanticTable({ rows }: { rows: Row[] }) {
  const { ref, inView } = useInView<HTMLElement>()
  const autoplay = useAutoplay(views.length, inView, 3500, 3)
  const hidden = autoplay.index === 1
  const last = rows.length - 1

  // The third column: a dashed frame drawn cell by cell, so it spans all the rows
  const frame = (i: number) =>
    cn(
      "border-x-2 border-dashed border-[#6E56CF]/50 px-4",
      i === -1 && "rounded-t-xl border-t-2 pt-3",
      i === last && "rounded-b-xl border-b-2 pb-3"
    )

  return (
    <figure data-figure="semantic-table" ref={ref} className="not-prose">
      <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
        Switch views: what do components know?
      </AutoplayHint>
      <div role="group" aria-label="View" className="mb-4 flex flex-wrap justify-center gap-1.5">
        {views.map((v, i) => (
          <StateButton
            key={v}
            selected={i === autoplay.index}
            running={autoplay.running}
            interval={autoplay.interval}
            onClick={() => autoplay.pick(i)}
          >
            {v}
          </StateButton>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[30rem] grid-cols-[auto_1fr_auto] items-stretch text-sm">
          {/* Header */}
          <div className="border-b border-current/15 px-3 pt-3 pb-2 font-semibold">Semantic token</div>
          <div className="border-b border-current/15 px-3 pt-3 pb-2 font-semibold">What it means</div>
          <div className={cn(frame(-1), "flex items-center gap-1.5 pb-2 font-semibold")}>
            {hidden ? (
              <span className="inline-flex items-center gap-1.5 text-[#6E56CF] dark:text-[#A898F5]">
                <EyeOff className="size-4" aria-hidden /> Hidden
              </span>
            ) : (
              "Points to"
            )}
          </div>

          {rows.map((row, i) => (
            <div key={row.token} className="contents">
              <div className={cn("flex items-center px-3 py-3", i < last && "border-b border-current/10")}>
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8rem]">{row.token}</code>
              </div>
              <div className={cn("px-3 py-3", i < last && "border-b border-current/10")}>
                <p className="m-0">{row.meaning}</p>
                <p className="m-0 text-xs opacity-60">used by {row.usedBy}</p>
              </div>
              <div className={cn(frame(i), "flex items-center py-3")}>
                <span
                  className="inline-flex items-center gap-2 font-mono text-[0.8rem] transition duration-500"
                  style={{ filter: hidden ? "blur(5px)" : "none", opacity: hidden ? 0.35 : 1 }}
                  aria-hidden={hidden}
                >
                  <span className="size-3.5 rounded-full ring-1 ring-current/25" style={{ background: row.color }} />
                  {row.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="mt-3 mb-0 text-center text-sm font-semibold text-[#6E56CF] dark:text-[#A898F5]">
        {hidden
          ? "Components only know the name and what it means. Where it points is an implementation detail."
          : "The theme decides where each name points. Change it here, and no component notices."}
      </p>
      <figcaption>
        Three of these tokens use the same primitive, but they are three different decisions.
      </figcaption>
    </figure>
  )
}
