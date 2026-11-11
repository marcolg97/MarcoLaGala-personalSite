"use client"

import { Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import { BlobTrophyArt } from "./blob-thought"
import { useReducedMotion, useSeenOnce } from "./interactive"

/**
 * A small "achievement unlocked" card. The first time it scrolls into view, a burst of
 * confetti pops out of its icon (never with reduced motion). With `trophy`, the icon is
 * the blob holding a trophy: use it once, at the end of a post.
 *
 *   <Achievement title="Level 1 unlocked: primitives">You just built…</Achievement>
 *   <Achievement trophy title="Design tokens: complete">…</Achievement>
 */

const COLORS = ["#F5B400", "#0D6B57", "#F2711C", "#6E56CF", "#E5484D", "#2E6BF6"]

/** Fixed, hand-tuned directions, so the burst looks the same on every render. */
const PIECES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1)
  const distance = 46 + ((i * 37) % 40)
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance - 18),
    r: (i * 67) % 360,
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
    delay: (i % 4) * 40,
  }
})

/** A one-shot burst of confetti from the center of its positioned parent. */
export function Confetti({ burst }: { burst: boolean }) {
  if (!burst) return null
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={cn("absolute block h-2 w-1.5", p.round && "size-2 rounded-full")}
          style={
            {
              background: p.color,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--r": `${p.r}deg`,
              animation: `confetti-burst 1.1s cubic-bezier(0.2, 0.7, 0.3, 1) ${p.delay}ms both`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  )
}

export function Achievement({
  title,
  trophy = false,
  children,
}: {
  title: string
  trophy?: boolean
  children: React.ReactNode
}) {
  const { ref, seen } = useSeenOnce<HTMLDivElement>(0.6)
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      className={cn(
        "not-prose my-8 flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-5 py-4",
        trophy && "flex-col py-6 text-center sm:flex-row sm:text-left"
      )}
    >
      <div className={cn("relative flex shrink-0 items-center justify-center", trophy ? "w-28" : "size-12")}>
        {trophy ? (
          <BlobTrophyArt className="blob-trophy w-28" />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full bg-amber-500/20 ring-2 ring-amber-500/40">
            <Medal className="size-6 text-amber-600 dark:text-amber-400" aria-hidden />
          </span>
        )}
        <Confetti burst={seen && !reduced} />
      </div>
      <div className="min-w-0">
        <p className="m-0 text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
          Achievement unlocked
        </p>
        <p className="mt-0.5 mb-1 text-base font-semibold">{title}</p>
        <div className="text-[0.95rem] leading-relaxed opacity-85 [&_p]:m-0">{children}</div>
      </div>
    </div>
  )
}
