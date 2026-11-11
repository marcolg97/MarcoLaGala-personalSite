"use client"

import { AutoplayHint, StateButton, useAutoplay, useInView, useNarrow } from "./interactive"

/**
 * Tokens as a dependency graph: components point to semantic tokens, semantic tokens
 * point to primitives. Each state is a theme: only the arrows on the right move, the
 * components and their arrows never change. Cycles a few times while on screen, then
 * stops; the reader can pick a state.
 *
 *   <TokenGraph />
 */

const primitives = [
  { name: "yellow500", color: "#F5B400" },
  { name: "orange500", color: "#F2711C" },
  { name: "teal700", color: "#0D6B57" },
  { name: "gray100", color: "#F2F2F4" },
]

const semantic = ["actionPrimary", "statusWarning", "dataHighlight", "surfaceCard"]

const components = [
  { name: "Button", token: 0 },
  { name: "Warning banner", token: 1 },
  { name: "Chart bar", token: 2 },
  { name: "Card", token: 3 },
]

/** For each theme, the primitive each semantic token points to. */
const themes = [
  { label: "Yellow", links: [0, 0, 0, 3] },
  { label: "Teal buttons", links: [2, 0, 0, 3] },
  { label: "Orange brand", links: [1, 1, 1, 3] },
]

const WIDE = { W: 640, COMP_X: 16, COMP_W: 170, SEM_X: 236, SEM_W: 168, PRIM_X: 470, PRIM_W: 154 }
const NARROW = { W: 440, COMP_X: 6, COMP_W: 148, SEM_X: 176, SEM_W: 124, PRIM_X: 324, PRIM_W: 112 }
const rowY = (i: number) => 62 + i * 62
const primY = (i: number) => 56 + i * 52
const fade = { transition: "opacity 0.6s, fill 0.6s, stroke 0.6s" } as const

/** An open arrowhead pointing right, ending at (x, y). */
const head = (x: number, y: number) => `M${x - 7} ${y - 5} L ${x} ${y} L ${x - 7} ${y + 5}`

export function TokenGraph() {
  const { ref, inView } = useInView<HTMLElement>()
  const narrow = useNarrow()
  const G = narrow ? NARROW : WIDE
  const autoplay = useAutoplay(themes.length, inView, 3800, 5)
  const theme = themes[autoplay.index]
  const colorOf = (token: number) => primitives[theme.links[token]].color

  return (
    <figure data-figure="token-graph" ref={ref} className="not-prose">
      <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
        Pick a theme: watch which arrows move
      </AutoplayHint>
      <div role="group" aria-label="Theme" className="mb-4 flex flex-wrap justify-center gap-1.5">
        {themes.map((t, i) => (
          <StateButton
            key={t.label}
            selected={i === autoplay.index}
            running={autoplay.running}
            interval={autoplay.interval}
            onClick={() => autoplay.pick(i)}
          >
            {t.label}
          </StateButton>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${G.W} 320`}
        width="100%"
        role="img"
        aria-label="A graph of arrows in three columns. Components and pages: Button, Warning banner, Chart bar, Card. Each one points to one semantic token: actionPrimary, statusWarning, dataHighlight, surfaceCard. The semantic tokens point to primitives: yellow500, orange500, teal700, gray100. When the theme changes, only the arrows from semantic tokens to primitives move; the components and their arrows never change."
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >

        {/* Column titles */}
        <g fill="currentColor" stroke="none" fontSize="15" fontWeight="600" textAnchor="middle">
          <text x={G.COMP_X + G.COMP_W / 2} y="22">{narrow ? "Components" : "Components & pages"}</text>
          <text x={G.SEM_X + G.SEM_W / 2} y="22">Semantic tokens</text>
          <text x={G.PRIM_X + G.PRIM_W / 2} y="22">Primitives</text>
        </g>
        <g fill="#1E7A47" stroke="none" fontSize="13" fontWeight="600" textAnchor="middle">
          <text x={G.COMP_X + G.COMP_W / 2} y="40">never touched</text>
          <text x={G.PRIM_X + G.PRIM_W / 2} y="40" fill="#C9302C">
            {narrow ? "only these move" : "only these arrows move"}
          </text>
        </g>
        <rect x={G.COMP_X - 8} y="46" width={G.COMP_W + 16} height="250" rx="14" fill="#1E7A47" fillOpacity="0.06" stroke="#1E7A47" strokeOpacity="0.35" strokeDasharray="5 5" />

        {/* Components → semantic: fixed */}
        {components.map((c, i) => (
          <g key={c.name} strokeOpacity="0.45" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${G.COMP_X + G.COMP_W} ${rowY(i) + 20} L ${G.SEM_X - 3} ${rowY(c.token) + 20}`} />
            <path d={head(G.SEM_X - 3, rowY(c.token) + 20)} />
          </g>
        ))}

        {/* Semantic → primitive: every possible link, only the active one visible */}
        {semantic.map((s, si) =>
          primitives.map((p, pi) => {
            const active = theme.links[si] === pi
            // Links arriving at the same primitive land side by side, not on top of each other
            const arriving = theme.links.map((l, k) => (l === pi ? k : -1)).filter((k) => k >= 0)
            const slot = Math.max(0, arriving.indexOf(si))
            const x1 = G.SEM_X + G.SEM_W
            const y1 = rowY(si) + 20
            const x2 = G.PRIM_X - 3
            const y2 = primY(pi) + 17 + (slot - (arriving.length - 1) / 2) * 8
            const color = p.name === "gray100" ? "#8E8E93" : p.color
            return (
              <g
                key={`${s}-${p.name}`}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={active ? 1 : 0}
                style={fade}
              >
                <circle cx={x1} cy={y1} r="3.5" fill={color} stroke="none" />
                <path d={`M${x1} ${y1} C ${x1 + 30} ${y1} ${x2 - 36} ${y2} ${x2} ${y2}`} />
                <path d={head(x2, y2)} />
              </g>
            )
          })
        )}

        {/* Components, with the color they end up with */}
        {components.map((c, i) => (
          <g key={c.name}>
            <rect x={G.COMP_X} y={rowY(i)} width={G.COMP_W} height="40" rx="10" fill="var(--background)" strokeOpacity="0.4" />
            <rect x={G.COMP_X + 10} y={rowY(i) + 10} width="20" height="20" rx="6" fill={colorOf(c.token)} stroke={INK_OUTLINE} strokeOpacity="0.25" style={fade} />
            <text x={G.COMP_X + 40} y={rowY(i) + 25} fill="currentColor" stroke="none" fontSize={narrow ? 14 : 15}>
              {c.name}
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
        {primitives.map((p, i) => {
          const used = theme.links.includes(i)
          return (
            <g key={p.name} opacity={used ? 1 : 0.45} style={fade}>
              <rect x={G.PRIM_X} y={primY(i)} width={G.PRIM_W} height="34" rx="9" fill="var(--background)" strokeOpacity="0.4" />
              <rect x={G.PRIM_X + 9} y={primY(i) + 8} width="18" height="18" rx="5" fill={p.color} stroke={INK_OUTLINE} strokeOpacity="0.25" />
              <text className="mono" x={G.PRIM_X + 36} y={primY(i) + 22} fill="currentColor" stroke="none" fontSize="14">
                {p.name}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>
        Components point to semantic tokens, and semantic tokens point to primitives. A new theme only moves the arrows on the right: components and pages are never touched.
      </figcaption>
    </figure>
  )
}

const INK_OUTLINE = "#1C1C1E"
