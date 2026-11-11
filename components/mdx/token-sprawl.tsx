"use client"

import { useEffect, useState } from "react"
import { RotateCcw, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView, useReducedMotion } from "./interactive"

/**
 * What happens when you solve "one component needs a different color" with a new
 * semantic token: the shared list fills up with tokens that serve one component each,
 * one at a time, until it explodes. Plays once when it comes on screen; "Play again".
 *
 *   <TokenSprawl />
 */

const shared = ["actionPrimary", "statusWarning", "dataHighlight", "surfaceCard"]

const oneOff = [
  { token: "actionPrimaryButton", only: "Button" },
  { token: "actionPrimaryMenu", only: "Menu item" },
  { token: "actionPrimaryTab", only: "Tab bar" },
  { token: "actionPrimaryLink", only: "Link" },
  { token: "statusWarningBanner", only: "Banner" },
  { token: "statusWarningBadge", only: "Badge" },
  { token: "surfaceCardProfile", only: "Profile card" },
  { token: "surfaceCardPromo", only: "Promo card" },
  { token: "dataHighlightChart", only: "Chart" },
]

const STEP_MS = 1100

export function TokenSprawl() {
  const { ref, inView } = useInView<HTMLElement>()
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const shown = reducedMotion ? oneOff.length : step
  const exploded = shown >= oneOff.length

  useEffect(() => {
    if (!inView || reducedMotion || step >= oneOff.length) return
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : STEP_MS)
    return () => clearTimeout(id)
  }, [inView, reducedMotion, step])

  return (
    <figure data-figure="token-sprawl" ref={ref} className="not-prose my-6">
      <div
        className={cn(
          "rounded-xl border-2 p-4 transition-colors duration-500",
          exploded ? "motion-safe:animate-[token-shake_0.5s_ease-in-out] border-[#E5484D] bg-[#E5484D]/6" : "border-[#6E56CF]/40 bg-muted/30"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">
          <span>Semantic tokens</span>
          <span className={cn("font-mono tabular-nums transition-colors", exploded && "text-[#E5484D]")} aria-live="polite">
            {shared.length + shown} tokens
          </span>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {shared.map((t) => (
            <li key={t} className="rounded-lg border border-[#6E56CF]/60 bg-background px-2.5 py-1.5 font-mono text-[0.8rem]">
              {t}
              <span className="block font-sans text-[0.7rem] opacity-60">shared</span>
            </li>
          ))}
          {oneOff.slice(0, shown).map((t) => (
            <li
              key={t.token}
              className="animate-in fade-in zoom-in-95 rounded-lg border border-dashed border-[#E5484D] bg-background px-2.5 py-1.5 font-mono text-[0.8rem] duration-300"
            >
              {t.token}
              <span className="block font-sans text-[0.7rem] text-[#E5484D]">only {t.only}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 flex min-h-7 items-center justify-between gap-3 text-sm">
        <p className="m-0">
          {exploded ? (
            <span className="inline-flex items-start gap-1.5 font-semibold text-[#C9302C] dark:text-[#FF6B6B]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              The list exploded: {shared.length + oneOff.length} tokens, and {oneOff.length} of them serve one component each. Which one should a new toggle use?
            </span>
          ) : (
            <span className="text-xs opacity-70">Every new exception adds one more token to the shared list.</span>
          )}
        </p>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={!exploded || reducedMotion}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-current/20 px-2.5 py-0.5 text-xs font-semibold hover:bg-current/10 disabled:opacity-0"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Play again
        </button>
      </div>
    </figure>
  )
}
