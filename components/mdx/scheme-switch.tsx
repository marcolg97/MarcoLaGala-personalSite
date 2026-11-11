"use client"

import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { AutoplayHint, useAutoplay, useInView, useNarrow } from "./interactive"

/**
 * Dark mode as a switch: the same components and semantic tokens, two sets of links to
 * the primitives. Flipping the switch only moves the arrows on the right. Toggles a few
 * times while on screen, then stops; clicking the switch stops it too.
 *
 *   <SchemeSwitch />
 */

const primitives = [
  { name: "gray100", color: "#F2F2F4" },
  { name: "yellow500", color: "#F5B400" },
  { name: "yellow300", color: "#FFD966" },
  { name: "gray900", color: "#1C1C1E" },
]

const semantic = ["surfaceCard", "textPrimary", "actionPrimary"]
const components = ["Card", "Title", "Button"]

/** For each scheme, the primitive each semantic token points to. */
const schemes = [
  { label: "Light", links: [0, 3, 1] },
  { label: "Dark", links: [3, 0, 2] },
]

const WIDE = { W: 640, COMP_X: 16, COMP_W: 150, SEM_X: 222, SEM_W: 168, PRIM_X: 470, PRIM_W: 154 }
const NARROW = { W: 440, COMP_X: 6, COMP_W: 118, SEM_X: 152, SEM_W: 138, PRIM_X: 318, PRIM_W: 118 }
const rowY = (i: number) => 14 + i * 58
const primY = (i: number) => 10 + i * 46
const fade = { transition: "opacity 0.6s, fill 0.6s" } as const
const head = (x: number, y: number) => `M${x - 7} ${y - 5} L ${x} ${y} L ${x - 7} ${y + 5}`
const linkColor = (p: { name: string; color: string }) => (/^gray/.test(p.name) ? "#8E8E93" : p.color)

export function SchemeSwitch() {
  const { ref, inView } = useInView<HTMLElement>()
  const narrow = useNarrow()
  const G = narrow ? NARROW : WIDE
  const autoplay = useAutoplay(schemes.length, inView, 3000, 4)
  const dark = autoplay.index === 1
  const scheme = schemes[autoplay.index]
  const colorOf = (token: number) => primitives[scheme.links[token]].color

  return (
    <figure data-figure="scheme-switch" ref={ref} className="not-prose my-4">
      <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
        Flip the switch: watch which arrows move
      </AutoplayHint>

      <div className="mb-3 flex items-center justify-center gap-3 text-sm font-semibold">
        <span className={cn("inline-flex items-center gap-1.5 transition-opacity", dark && "opacity-45")}>
          <Sun className="size-4" aria-hidden /> Light
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Dark mode"
          onClick={() => autoplay.pick(dark ? 0 : 1)}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-500",
            dark ? "bg-[#6E56CF]" : "bg-current/20"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-500",
              dark && "translate-x-5"
            )}
          />
        </button>
        <span className={cn("inline-flex items-center gap-1.5 transition-opacity", !dark && "opacity-45")}>
          <Moon className="size-4" aria-hidden /> Dark
        </span>
      </div>

      <svg
        viewBox={`0 0 ${G.W} 192`}
        width="100%"
        role="img"
        aria-label={`Three components, Card, Title and Button, point to surfaceCard, textPrimary and actionPrimary. In light mode they point to gray100, gray900 and yellow500. In dark mode they point to gray900, gray100 and yellow300. Now showing: ${scheme.label}.`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Components → semantic: fixed */}
        {components.map((c, i) => (
          <g key={c} strokeOpacity="0.45" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${G.COMP_X + G.COMP_W} ${rowY(i) + 20} L ${G.SEM_X - 3} ${rowY(i) + 20}`} />
            <path d={head(G.SEM_X - 3, rowY(i) + 20)} />
          </g>
        ))}

        {/* Semantic → primitive: every possible link, only the active one visible */}
        {semantic.map((s, si) =>
          primitives.map((p, pi) => {
            const x1 = G.SEM_X + G.SEM_W
            const y1 = rowY(si) + 20
            const x2 = G.PRIM_X - 3
            const y2 = primY(pi) + 17
            const color = linkColor(p)
            return (
              <g
                key={`${s}-${p.name}`}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={scheme.links[si] === pi ? 1 : 0}
                style={fade}
              >
                <circle cx={x1} cy={y1} r="3.5" fill={color} stroke="none" />
                <path d={`M${x1} ${y1} C ${x1 + 30} ${y1} ${x2 - 36} ${y2} ${x2} ${y2}`} />
                <path d={head(x2, y2)} />
              </g>
            )
          })
        )}

        {/* Components, with the color they get */}
        {components.map((c, i) => (
          <g key={c}>
            <rect x={G.COMP_X} y={rowY(i)} width={G.COMP_W} height="40" rx="10" fill="var(--background)" strokeOpacity="0.4" />
            <rect x={G.COMP_X + 10} y={rowY(i) + 10} width="20" height="20" rx="6" fill={colorOf(i)} stroke="#8E8E93" strokeOpacity="0.6" style={fade} />
            <text x={G.COMP_X + 40} y={rowY(i) + 25} fill="currentColor" stroke="none" fontSize="15">
              {c}
            </text>
          </g>
        ))}

        {/* Semantic tokens */}
        {semantic.map((s, i) => (
          <g key={s}>
            <rect x={G.SEM_X} y={rowY(i)} width={G.SEM_W} height="40" rx="10" fill="var(--background)" stroke="#6E56CF" strokeOpacity="0.6" />
            <text className="mono" x={G.SEM_X + G.SEM_W / 2} y={rowY(i) + 25} textAnchor="middle" fill="currentColor" stroke="none" fontSize="14">
              {s}
            </text>
          </g>
        ))}

        {/* Primitives */}
        {primitives.map((p, i) => (
          <g key={p.name} opacity={scheme.links.includes(i) ? 1 : 0.45} style={fade}>
            <rect x={G.PRIM_X} y={primY(i)} width={G.PRIM_W} height="34" rx="9" fill="var(--background)" strokeOpacity="0.4" />
            <rect x={G.PRIM_X + 9} y={primY(i) + 8} width="18" height="18" rx="5" fill={p.color} stroke="#8E8E93" strokeOpacity="0.6" />
            <text className="mono" x={G.PRIM_X + 36} y={primY(i) + 22} fill="currentColor" stroke="none" fontSize="14">
              {p.name}
            </text>
          </g>
        ))}
      </svg>

      {/* The card itself, drawn with the current links */}
      <div className="mt-3 flex justify-center">
        <div
          className="flex w-56 items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-sm ring-1 ring-black/10 transition-colors duration-500"
          style={{ background: colorOf(0), color: colorOf(1) }}
        >
          <span className="text-sm font-semibold">Weekly report</span>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-[#1C1C1E] transition-colors duration-500"
            style={{ background: colorOf(2) }}
          >
            Save
          </span>
        </div>
      </div>
    </figure>
  )
}
