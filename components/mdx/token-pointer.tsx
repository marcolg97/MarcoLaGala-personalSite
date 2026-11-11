"use client"

import { useRef, useState } from "react"
import { CircleCheck, Hand, RotateCcw } from "lucide-react"
import { Confetti } from "./achievement"
import { useNarrow } from "./interactive"
import { trackEvent } from "@/lib/analytics"

/**
 * A theme change the reader does by hand, drawn like the other token graphs:
 * components point to semantic tokens, semantic tokens point to primitives. The tip of
 * each arrow on the right is a handle: drag it (or focus it and use the arrow keys) onto
 * another primitive, and the components that use that token change color. When the
 * arrows match `to`, confetti and a short message. "Reset" puts everything back.
 *
 *   <TokenPointer
 *     goal="Point actionPrimary to teal700"
 *     success="One arrow moved. Only the button changed."
 *     components={[{ name: "Button", token: 0 }]}
 *     tokens={["actionPrimary"]}
 *     primitives={[{ name: "yellow500", color: "#F5B400" }, { name: "teal700", color: "#0D6B57" }]}
 *     from={[0]}
 *     to={[1]}
 *   />
 */

type Primitive = { name: string; color: string }

const WIDE = { W: 640, COMP_X: 16, COMP_W: 170, SEM_X: 236, SEM_W: 168, PRIM_X: 470, PRIM_W: 154 }
const NARROW = { W: 440, COMP_X: 6, COMP_W: 148, SEM_X: 176, SEM_W: 124, PRIM_X: 324, PRIM_W: 112 }
const rowY = (i: number) => 22 + i * 56

const head = (x: number, y: number) => `M${x - 7} ${y - 5} L ${x} ${y} L ${x - 7} ${y + 5}`
const linkColor = (p: Primitive) => (/^gray/.test(p.name) ? "#8E8E93" : p.color)

export function TokenPointer({
  goal,
  success,
  components,
  tokens,
  primitives,
  from,
  to,
}: {
  goal: string
  success: string
  components: { name: string; token: number }[]
  tokens: string[]
  primitives: Primitive[]
  /** For each token, the index of the primitive it points to at the start, and in the goal. */
  from: number[]
  to: number[]
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const narrow = useNarrow()
  const G = narrow ? NARROW : WIDE
  const [links, setLinks] = useState(from)
  const [drag, setDrag] = useState<{ token: number; y: number } | null>(null)
  const [touched, setTouched] = useState(false)
  const [round, setRound] = useState(0)

  const rows = Math.max(tokens.length, primitives.length)
  const primY = (i: number) => rowY(i) + ((tokens.length - primitives.length) * 56) / 2
  const targetY = (i: number) => primY(i) + 17
  const height = rowY(rows - 1) + 56
  const solved = links.every((l, i) => l === to[i])

  function svgY(clientY: number) {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return 0
    const point = svg.createSVGPoint()
    point.y = clientY
    return point.matrixTransform(matrix.inverse()).y
  }

  function nearest(y: number) {
    let best = 0
    primitives.forEach((_, i) => {
      if (Math.abs(targetY(i) - y) < Math.abs(targetY(best) - y)) best = i
    })
    return best
  }

  function pointTo(token: number, primitive: number) {
    const next = links.map((l, i) => (i === token ? primitive : l))
    setTouched(true)
    setLinks(next)
    if (!solved && next.every((l, i) => l === to[i])) trackEvent("exercise_completed", { goal })
  }

  function reset() {
    setLinks(from)
    setDrag(null)
    setTouched(false)
    setRound((r) => r + 1)
  }

  return (
    <div data-figure="token-pointer" className="not-prose my-6 rounded-xl border bg-muted/30 p-3 sm:p-4">
      <p className="m-0 mb-2 flex items-center justify-center gap-2 text-center text-sm font-semibold">
        <Hand className="size-4 shrink-0" aria-hidden />
        Your turn: {goal}
      </p>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${G.W} ${height}`}
          width="100%"
          className="touch-none select-none"
          role="group"
          aria-label={`Token graph. ${goal}. Each arrow tip on the right can be moved with the arrow keys.`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          onPointerMove={(e) => {
            if (drag) setDrag({ token: drag.token, y: svgY(e.clientY) })
          }}
          onPointerUp={() => {
            if (!drag) return
            pointTo(drag.token, nearest(drag.y))
            setDrag(null)
          }}
          onPointerCancel={() => setDrag(null)}
        >
          {/* Components → semantic: fixed */}
          {components.map((c, i) => (
            <g key={c.name} strokeOpacity="0.45" strokeLinecap="round" strokeLinejoin="round">
              <path d={`M${G.COMP_X + G.COMP_W} ${rowY(i) + 20} L ${G.SEM_X - 3} ${rowY(c.token) + 20}`} />
              <path d={head(G.SEM_X - 3, rowY(c.token) + 20)} />
            </g>
          ))}

          {/* Primitives (drawn before the arrows, so the handles stay on top) */}
          {primitives.map((p, i) => {
            const used = links.includes(i)
            const hovered = drag !== null && nearest(drag.y) === i
            return (
              <g key={p.name} opacity={used || hovered ? 1 : 0.5} style={{ transition: "opacity 0.3s" }}>
                <rect
                  x={G.PRIM_X}
                  y={primY(i)}
                  width={G.PRIM_W}
                  height="34"
                  rx="9"
                  fill="var(--background)"
                  strokeOpacity={hovered ? 1 : 0.4}
                  strokeWidth={hovered ? 2.5 : 1.5}
                  stroke={hovered ? "#6E56CF" : "currentColor"}
                />
                <rect x={G.PRIM_X + 9} y={primY(i) + 8} width="18" height="18" rx="5" fill={p.color} stroke="#1C1C1E" strokeOpacity="0.25" />
                <text className="mono" x={G.PRIM_X + 36} y={primY(i) + 22} fill="currentColor" stroke="none" fontSize="14">
                  {p.name}
                </text>
              </g>
            )
          })}

          {/* Semantic → primitive: draggable tips */}
          {tokens.map((t, i) => {
            const target = primitives[links[i]]
            const x1 = G.SEM_X + G.SEM_W
            const y1 = rowY(i) + 20
            const dragging = drag?.token === i
            // Arrows that arrive at the same primitive land side by side, not on top of each other
            const arriving = links.map((l, k) => (l === links[i] ? k : -1)).filter((k) => k >= 0)
            const slot = arriving.indexOf(i) - (arriving.length - 1) / 2
            const y2 = dragging ? drag.y : targetY(links[i]) + slot * (narrow ? 20 : 16)
            const color = linkColor(dragging ? primitives[nearest(drag.y)] : target)
            return (
              <g key={t} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx={x1} cy={y1} r="3.5" fill={color} stroke="none" />
                <path d={`M${x1} ${y1} C ${x1 + 30} ${y1} ${(G.PRIM_X - 3) - 36} ${y2} ${(G.PRIM_X - 3) - 10} ${y2}`} />
                <g
                  role="slider"
                  tabIndex={0}
                  aria-label={`${t} points to`}
                  aria-valuemin={0}
                  aria-valuemax={primitives.length - 1}
                  aria-valuenow={links[i]}
                  aria-valuetext={target.name}
                  className="cursor-grab outline-none focus-visible:[&_circle]:stroke-[#6E56CF] active:cursor-grabbing"
                  onPointerDown={(e) => {
                    e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId)
                    setDrag({ token: i, y: svgY(e.clientY) })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault()
                      pointTo(i, Math.min(primitives.length - 1, links[i] + 1))
                    }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault()
                      pointTo(i, Math.max(0, links[i] - 1))
                    }
                  }}
                >
                  <circle cx={(G.PRIM_X - 3) - 10} cy={y2} r={narrow ? 12 : 10} fill="transparent" stroke="none" />
                  <circle
                    cx={(G.PRIM_X - 3) - 10}
                    cy={y2}
                    r={narrow ? 8.5 : 7}
                    fill="var(--background)"
                    strokeWidth="2.5"
                    className={touched || solved ? undefined : "motion-safe:animate-pulse"}
                  />
                  <circle cx={(G.PRIM_X - 3) - 10} cy={y2} r="3" fill={color} stroke="none" />
                </g>
              </g>
            )
          })}

          {/* Components, with the color they get from their token */}
          {components.map((c, i) => (
            <g key={c.name}>
              <rect x={G.COMP_X} y={rowY(i)} width={G.COMP_W} height="40" rx="10" fill="var(--background)" strokeOpacity="0.4" />
              <rect
                x={G.COMP_X + 10}
                y={rowY(i) + 10}
                width="20"
                height="20"
                rx="6"
                fill={primitives[links[c.token]].color}
                stroke="#1C1C1E"
                strokeOpacity="0.25"
                style={{ transition: "fill 0.4s" }}
              />
              <text x={G.COMP_X + 40} y={rowY(i) + 25} fill="currentColor" stroke="none" fontSize={narrow ? 14 : 15}>
                {c.name}
              </text>
            </g>
          ))}

          {/* Semantic tokens */}
          {tokens.map((t, i) => (
            <g key={t}>
              <rect x={G.SEM_X} y={rowY(i)} width={G.SEM_W} height="40" rx="10" fill="var(--background)" stroke="#6E56CF" strokeOpacity="0.6" />
              <text className="mono" x={G.SEM_X + G.SEM_W / 2} y={rowY(i) + 25} textAnchor="middle" fill="currentColor" stroke="none" fontSize="14">
                {t}
              </text>
            </g>
          ))}
        </svg>
        <Confetti key={round} burst={solved} />
      </div>
      <div className="mt-2 flex min-h-7 items-center justify-between gap-3 text-sm">
        <p aria-live="polite" className="m-0">
          {solved ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <CircleCheck className="size-4 shrink-0" aria-hidden />
              {success}
            </span>
          ) : (
            <span className="text-xs opacity-70">Drag the round handles on the right. Components and token names never move.</span>
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-current/20 px-2.5 py-0.5 text-xs font-semibold hover:bg-current/10"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset
        </button>
      </div>
    </div>
  )
}
