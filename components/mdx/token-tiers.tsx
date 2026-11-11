"use client"

import { AutoplayHint, StateButton, useAutoplay, useInView, useNarrow } from "./interactive"

/**
 * Why a third tier exists: teal buttons, but the selected menu item must stay yellow,
 * and both use `actionPrimary`. With two tiers the only lever is `actionPrimary`, so
 * both change. With a component token, the theme overrides only the button.
 *
 *   <TokenTiers />            both setups, the reader can switch
 *   <TokenTiers only={0} />   only "Two layers", no buttons
 *   <TokenTiers only={1} />   only "Three layers", no buttons
 */

const YELLOW = "#F5B400"
const TEAL = "#0D6B57"
const RED = "#E5484D"
const INK = "#1C1C1E"

const states = [
  { label: "Two layers", change: "change actionPrimary → teal700" },
  { label: "Three layers", change: "override button.primary.background → teal700" },
]

const WIDE = { W: 640, COMP: { x: 6, w: 124 }, CT: { x: 152, w: 220 }, SEM: { x: 394, w: 120 }, PRIM: { x: 528, w: 108 } }
const NARROW = { W: 500, COMP: { x: 2, w: 106 }, CT: { x: 126, w: 132 }, SEM: { x: 276, w: 112 }, PRIM: { x: 398, w: 100 } }
const BUTTON_Y = 64
const MENU_Y = 160
const SEM_Y = 112
const fade = { transition: "opacity 0.6s, fill 0.6s" } as const

const head = (x: number, y: number) => `M${x - 7} ${y - 5} L ${x} ${y} L ${x - 7} ${y + 5}`
const curve = (x1: number, y1: number, x2: number, y2: number) =>
  `M${x1} ${y1} C ${x1 + 40} ${y1} ${x2 - 40} ${y2} ${x2} ${y2}`

function Link({ from, to, color, show }: { from: [number, number]; to: [number, number]; color: string; show: boolean }) {
  return (
    <g stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={show ? 1 : 0} style={fade}>
      <path d={curve(from[0], from[1], to[0] - 3, to[1])} />
      <path d={head(to[0] - 3, to[1])} />
    </g>
  )
}

const captions = [
  "With two layers, the only lever is actionPrimary: the button and the menu item change together.",
  "A component token gives the button its own lever. Only its link moves, and the menu item stays yellow.",
]

export function TokenTiers({ only }: { only?: 0 | 1 }) {
  const { ref, inView } = useInView<HTMLElement>()
  const narrow = useNarrow()
  const G = narrow ? NARROW : WIDE
  const autoplay = useAutoplay(states.length, inView && only === undefined, 4200, 3)
  const index = only ?? autoplay.index
  const three = index === 1
  const buttonColor = TEAL
  const menuColor = three ? YELLOW : TEAL
  const gray = "#8E8E93"

  return (
    <figure data-figure="token-tiers" ref={ref} className="not-prose">
      {only === undefined && (
        <>
      <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
        Pick a setup to compare
      </AutoplayHint>
      <div role="group" aria-label="How many layers" className="mb-3 flex flex-wrap justify-center gap-1.5">
        {states.map((s, i) => (
          <StateButton
            key={s.label}
            selected={i === autoplay.index}
            running={autoplay.running}
            interval={autoplay.interval}
            onClick={() => autoplay.pick(i)}
          >
            {s.label}
          </StateButton>
        ))}
      </div>
        </>
      )}
      <p className="m-0 text-center text-xl font-semibold text-[#E5484D]" style={{ fontFamily: "var(--font-hand), cursive" }}>
        Brief: teal buttons, the selected menu item stays yellow
      </p>
      <p aria-live="polite" className="mt-1 mb-2 text-center font-mono text-sm">
        {states[index].change}
      </p>
      <svg
        viewBox={`0 0 ${G.W} 230`}
        width="100%"
        role="img"
        aria-label={
          [
            "Two components, Button and Menu item, both use actionPrimary. Changing actionPrimary to teal700 turns both teal.",
            "The Button uses the component token button.primary.background, which the theme points to teal700. The Menu item keeps actionPrimary, still yellow500.",
          ][index]
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <g fill="currentColor" stroke="none" fontSize="14" fontWeight="600" textAnchor="middle">
          <text x={G.COMP.x + G.COMP.w / 2} y="30">Components</text>
          {only !== 0 && (
            <text x={G.CT.x + G.CT.w / 2} y="30" opacity={three ? 1 : 0.35} style={fade}>Component token</text>
          )}
          <text x={G.SEM.x + G.SEM.w / 2} y="30">Semantic</text>
          <text x={G.PRIM.x + G.PRIM.w / 2} y="30">Primitives</text>
        </g>

        {/* Links */}
        <Link from={[G.COMP.x + G.COMP.w, BUTTON_Y + 20]} to={[G.SEM.x, SEM_Y + 14]} color={gray} show={!three} />
        <Link from={[G.COMP.x + G.COMP.w, BUTTON_Y + 20]} to={[G.CT.x, BUTTON_Y + 20]} color={gray} show={three} />
        <Link from={[G.CT.x + G.CT.w, BUTTON_Y + 20]} to={[G.PRIM.x, MENU_Y + 20]} color={TEAL} show={three} />
        <Link from={[G.COMP.x + G.COMP.w, MENU_Y + 20]} to={[G.SEM.x, SEM_Y + 26]} color={gray} show />
        <Link from={[G.SEM.x + G.SEM.w, SEM_Y + 20]} to={[G.PRIM.x, MENU_Y + 20]} color={TEAL} show={!three} />
        <Link from={[G.SEM.x + G.SEM.w, SEM_Y + 20]} to={[G.PRIM.x, BUTTON_Y + 20]} color={YELLOW} show={three} />

        {/* Components */}
        {[
          { name: "Button", y: BUTTON_Y, color: buttonColor },
          { name: "Menu item", y: MENU_Y, color: menuColor },
        ].map((c) => (
          <g key={c.name}>
            <rect x={G.COMP.x} y={c.y} width={G.COMP.w} height="40" rx="10" fill="var(--background)" strokeOpacity="0.4" />
            <rect x={G.COMP.x + 10} y={c.y + 10} width="20" height="20" rx="6" fill={c.color} stroke={INK} strokeOpacity="0.25" style={fade} />
            <text x={G.COMP.x + 40} y={c.y + 25} fill="currentColor" stroke="none" fontSize={narrow ? 14 : 15}>
              {c.name}
            </text>
          </g>
        ))}

        {/* Component token (not shown before it is introduced) */}
        <g opacity={three ? 1 : only === 0 ? 0 : 0.3} style={fade}>
          <rect x={G.CT.x} y={BUTTON_Y} width={G.CT.w} height="40" rx="10" fill="var(--background)" stroke="#6E56CF" strokeOpacity="0.6" strokeDasharray={three ? undefined : "5 5"} />
          <text className="mono" x={G.CT.x + G.CT.w / 2} y={BUTTON_Y + 25} textAnchor="middle" fill="currentColor" stroke="none" fontSize={narrow ? 13 : 12.5}>
            {narrow ? (
              <>
                <tspan x={G.CT.x + G.CT.w / 2} dy="-7">button.primary</tspan>
                <tspan x={G.CT.x + G.CT.w / 2} dy="15">.background</tspan>
              </>
            ) : (
              "button.primary.background"
            )}
          </text>
        </g>

        {/* Semantic token */}
        <rect x={G.SEM.x} y={SEM_Y} width={G.SEM.w} height="40" rx="10" fill="var(--background)" stroke="#6E56CF" strokeOpacity="0.6" />
        <text className="mono" x={G.SEM.x + G.SEM.w / 2} y={SEM_Y + 25} textAnchor="middle" fill="currentColor" stroke="none" fontSize={narrow ? 13 : 14}>
          actionPrimary
        </text>

        {/* Primitives */}
        {[
          { name: "yellow500", y: BUTTON_Y + 3, color: YELLOW },
          { name: "teal700", y: MENU_Y + 3, color: TEAL },
        ].map((p) => (
          <g key={p.name}>
            <rect x={G.PRIM.x} y={p.y} width={G.PRIM.w} height="34" rx="9" fill="var(--background)" strokeOpacity="0.4" />
            <rect x={G.PRIM.x + 8} y={p.y + 8} width="18" height="18" rx="5" fill={p.color} stroke={INK} strokeOpacity="0.25" />
            <text className="mono" x={G.PRIM.x + 31} y={p.y + 22} fill="currentColor" stroke="none" fontSize="12.5">
              {p.name}
            </text>
          </g>
        ))}

        {/* Verdict */}
        <g opacity={three ? 0 : 1} style={fade}>
          <ellipse cx={G.COMP.x + 20} cy={MENU_Y + 20} rx="17" ry="17" stroke={RED} strokeWidth="2.5" />
          <text className="hand" x={G.COMP.x + 66} y={MENU_Y + 64} textAnchor="middle" fill={RED} stroke="none" fontSize="24">
            not this one!
          </text>
        </g>
        <text className="hand" x={G.COMP.x + 66} y={MENU_Y + 64} textAnchor="middle" fill={RED} stroke="none" fontSize="24" opacity={three ? 1 : 0} style={fade}>
          ✓ still yellow
        </text>
      </svg>
      <figcaption>{captions[index]}</figcaption>
    </figure>
  )
}
