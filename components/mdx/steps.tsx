"use client"

import { cn } from "@/lib/utils"
import { useReducedMotion, useSeenOnce } from "./interactive"

/**
 * Numbered steps on a vertical line. When a step scrolls into view, its number gets
 * circled by hand in red pen and the text fades in (once; instantly with reduced motion).
 *
 *   <Steps>
 *   <Step n={1} title="Start from the interface">
 *
 *   Markdown content…
 *
 *   </Step>
 *   </Steps>
 */
export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps my-10">{children}</div>
}

export function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  const { ref, seen } = useSeenOnce<HTMLDivElement>(0.2)
  const reduced = useReducedMotion()
  const shown = seen || reduced

  return (
    <div ref={ref} className="group/step relative grid grid-cols-[3rem_1fr] gap-x-4 pb-10 last:pb-0">
      <div className="relative flex justify-center">
        <svg viewBox="0 0 48 48" className="relative z-10 size-12 bg-background" aria-hidden>
          <path
            d="M25 4 C 37 3 45 12 44 24 C 43 37 34 45 23 44 C 11 43 4 35 4 24 C 4 13 12 5 27 4"
            pathLength={1}
            fill="none"
            stroke="#E5484D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={shown ? 0 : 1}
            style={{ transition: reduced ? "none" : "stroke-dashoffset 0.9s ease-out" }}
          />
          <text
            x="24"
            y="32"
            textAnchor="middle"
            fill="#E5484D"
            fontSize="24"
            fontWeight="700"
            style={{ fontFamily: "var(--font-hand), cursive" }}
          >
            {n}
          </text>
        </svg>
        <span aria-hidden className="absolute top-12 bottom-0 w-px bg-current/15 group-last/step:hidden" />
      </div>
      <div
        className={cn(
          "min-w-0 pt-1 transition duration-700 [&>p]:my-3 [&>ul]:my-3 [&>:last-child]:mb-0",
          shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          reduced && "transition-none"
        )}
      >
        <p className="m-0! text-xs font-semibold tracking-wide text-[#E5484D] uppercase">Step {n}</p>
        <p className="mt-0.5! mb-3! text-lg leading-snug font-semibold">{title}</p>
        {children}
      </div>
    </div>
  )
}
