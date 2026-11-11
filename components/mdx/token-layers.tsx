"use client"

import {
  AutoplayHint,
  StateButton,
  useAutoplay,
  useInView,
} from "./interactive"

/**
 * The same brand request ("make the main buttons teal") applied to a primitive and
 * to a semantic token, on one dashboard. Cycles on its own while on screen, until the
 * reader picks a state.
 *
 *   <TokenLayers />                     before, primitive, semantic: the comparison
 *   <TokenLayers mode="before-after" /> before and after changing the primitive, slowly,
 *                                       three times, then it stops on "after"
 *   <TokenLayers mode="highlight" />    the "after" screen, circling the three elements
 *                                       that turned teal by mistake, one at a time
 */

const YELLOW = "#F5B400"
const TEAL = "#0D6B57"
const RED = "#E5484D"
const INK = "#1C1C1E"

/** Text and icons on a filled shape: white on teal, dark ink on yellow. */
const on = (fill: string) => (fill === TEAL ? "#FFFFFF" : INK)

const states = [
  {
    label: "Before",
    change: "yellow500 = #F5B400",
    action: YELLOW,
    others: YELLOW,
  },
  {
    label: "Change the primitive",
    change: "primitive: yellow500 = #0D6B57 (teal)",
    action: TEAL,
    others: TEAL,
  },
  {
    label: "Change the semantic token",
    change: "semantic: actionPrimary → teal700",
    action: TEAL,
    others: YELLOW,
  },
]

const fade = { transition: "fill 0.45s, opacity 0.35s" } as const

const mistakes = [
  { label: "warning banner", x: 300, y: 99 },
  { label: "pending badge", x: 598, y: 218 },
  { label: "chart bar", x: 336, y: 222 },
]

export function TokenLayers({
  mode = "compare",
}: {
  mode?: "before-after" | "highlight" | "compare"
}) {
  const { ref, inView } = useInView<HTMLElement>()
  const shown =
    mode === "before-after"
      ? [states[0], { ...states[1], label: "After" }]
      : states
  // Before/after: slow, three times, then stop on "after". Highlight: one mistake at a
  // time, twice around, then all three.
  const autoplay = useAutoplay(
    mode === "highlight" ? mistakes.length + 1 : shown.length,
    inView,
    mode === "before-after" ? 4500 : mode === "highlight" ? 1800 : 3200,
    mode === "before-after" ? 5 : mode === "highlight" ? 7 : 6
  )
  const state = mode === "highlight" ? states[1] : shown[autoplay.index]
  const highlight = autoplay.running
    ? autoplay.index % (mistakes.length + 1)
    : mistakes.length
  const circled = (i: number) =>
    mode === "highlight" && (highlight === i || highlight === mistakes.length)
  const showWrong = mode === "compare" && autoplay.index === 1
  const showRight = mode === "compare" && autoplay.index === 2

  return (
    <figure data-figure="token-layers" ref={ref} className="not-prose">
      {mode !== "highlight" && (
        <>
          <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
            Pick a step to compare
          </AutoplayHint>
          <div
            role="group"
            aria-label="Which token changes"
            className="mb-4 flex flex-wrap justify-center gap-1.5"
          >
            {shown.map((s, i) => (
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
      <p
        className="m-0 text-center text-xl font-semibold text-[#E5484D]"
        style={{ fontFamily: "var(--font-hand), cursive" }}
      >
        Brief: make the main buttons teal
      </p>
      <p aria-live="polite" className="mt-1 mb-2 text-center font-mono text-sm">
        {state.change}
      </p>
      <svg
        viewBox="30 48 580 250"
        width="100%"
        role="img"
        aria-label={`Dashboard, ${state.label.toLowerCase()}: ${state.change}.`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <g transform="translate(0 -6)">
          <rect
            x="40"
            y="62"
            width="560"
            height="232"
            rx="14"
            strokeOpacity="0.4"
          />
          <path d="M150 62 V 294" strokeOpacity="0.2" />
          <circle
            cx="66"
            cy="86"
            r="9"
            fill="currentColor"
            stroke="none"
            opacity="0.3"
          />
          <rect
            x="56"
            y="110"
            width="80"
            height="14"
            rx="7"
            stroke="none"
            fill={state.action}
            style={fade}
          />
          {[134, 158, 182].map((y) => (
            <rect
              key={y}
              x="56"
              y={y}
              width="80"
              height="14"
              rx="7"
              fill="currentColor"
              stroke="none"
              opacity="0.12"
            />
          ))}
          <rect
            x="170"
            y="78"
            width="120"
            height="12"
            rx="6"
            fill="currentColor"
            stroke="none"
            opacity="0.3"
          />
          <rect
            x="496"
            y="72"
            width="88"
            height="26"
            rx="13"
            stroke="none"
            fill={state.action}
            style={fade}
          />
          <rect
            x="514"
            y="82"
            width="52"
            height="6"
            rx="3"
            fill={on(state.action)}
            opacity="0.8"
            stroke="none"
            style={fade}
          />
          <rect
            x="170"
            y="108"
            width="414"
            height="28"
            rx="8"
            stroke="none"
            fill={state.others}
            style={fade}
          />
          <circle
            cx="186"
            cy="122"
            r="6"
            fill={on(state.others)}
            stroke="none"
            opacity="0.7"
            style={fade}
          />
          <rect
            x="200"
            y="119"
            width="170"
            height="6"
            rx="3"
            fill={on(state.others)}
            stroke="none"
            opacity="0.65"
            style={fade}
          />
          {[170, 313, 456].map((x) => (
            <g key={x}>
              <rect
                x={x}
                y="148"
                width="128"
                height="50"
                rx="10"
                fill="currentColor"
                fillOpacity="0.04"
                strokeOpacity="0.2"
              />
              <rect
                x={x + 12}
                y="160"
                width="58"
                height="11"
                rx="5.5"
                fill="currentColor"
                stroke="none"
                opacity="0.4"
              />
              <rect
                x={x + 12}
                y="180"
                width="38"
                height="7"
                rx="3.5"
                fill="currentColor"
                stroke="none"
                opacity="0.2"
              />
            </g>
          ))}
          <rect
            x="546"
            y="158"
            width="30"
            height="14"
            rx="7"
            stroke="none"
            fill={state.others}
            style={fade}
          />
          {[
            [182, 264, 24],
            [216, 252, 36],
            [250, 258, 30],
            [284, 244, 44],
            [318, 250, 38],
            [386, 254, 34],
          ].map(([x, y, h]) => (
            <rect
              key={x}
              x={x}
              y={y}
              width="22"
              height={h}
              rx="4"
              fill="currentColor"
              stroke="none"
              opacity="0.18"
            />
          ))}
          <rect
            x="352"
            y="236"
            width="22"
            height="52"
            rx="4"
            stroke="none"
            fill={state.others}
            style={fade}
          />
          <rect
            x="470"
            y="256"
            width="114"
            height="28"
            rx="14"
            stroke="none"
            fill={state.action}
            style={fade}
          />
          <rect
            x="496"
            y="267"
            width="62"
            height="6"
            rx="3"
            fill={on(state.action)}
            opacity="0.8"
            stroke="none"
            style={fade}
          />
          <g
            stroke={RED}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={showWrong ? 1 : 0}
            style={fade}
          >
            <ellipse
              cx="377"
              cy="122"
              rx="218"
              ry="22"
              transform="rotate(-1.5 377 122)"
            />
            <ellipse
              cx="561"
              cy="165"
              rx="26"
              ry="15"
              transform="rotate(-8 561 165)"
            />
            <ellipse
              cx="363"
              cy="262"
              rx="20"
              ry="34"
              transform="rotate(6 363 262)"
            />
            <text
              className="hand"
              x="290"
              y="225"
              textAnchor="middle"
              fill={RED}
              stroke="none"
              fontSize="32"
            >
              not these!
            </text>
          </g>
          {[
            <ellipse
              key="banner"
              cx="377"
              cy="122"
              rx="218"
              ry="22"
              transform="rotate(-1.5 377 122)"
            />,
            <ellipse
              key="badge"
              cx="561"
              cy="165"
              rx="26"
              ry="15"
              transform="rotate(-8 561 165)"
            />,
            <ellipse
              key="bar"
              cx="363"
              cy="262"
              rx="20"
              ry="34"
              transform="rotate(6 363 262)"
            />,
          ].map((shape, i) => (
            <g
              key={mistakes[i].label}
              stroke={RED}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={circled(i) ? 1 : 0}
              style={fade}
            >
              {shape}
              <text
                className="hand"
                x={mistakes[i].x}
                y={mistakes[i].y}
                textAnchor={i === 0 ? "middle" : "end"}
                fill={RED}
                stroke="var(--background)"
                strokeWidth="6"
                paintOrder="stroke"
                fontSize="28"
              >
                {mistakes[i].label}
              </text>
            </g>
          ))}
          <text
            className="hand"
            x="300"
            y="225"
            textAnchor="middle"
            fill={RED}
            stroke="none"
            fontSize="32"
            opacity={showRight ? 1 : 0}
            style={fade}
          >
            ✓ only the main actions
          </text>
        </g>
      </svg>
      <figcaption>
        {mode === "before-after"
          ? "Before and after: one change to the primitive, and the main buttons are teal."
          : mode === "highlight"
            ? "Look again: the warning banner, the pending badge and the chart bar are teal too. Nobody asked for that."
            : "Same request, two systems. Change the primitive, and everything yellow changes. Change the semantic token, and only the elements with that purpose change."}
      </figcaption>
    </figure>
  )
}
