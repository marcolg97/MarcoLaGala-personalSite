"use client"

import { cn } from "@/lib/utils"
import { useNarrow, useSeenOnce } from "./interactive"

/**
 * The cost of component tokens, in two pictures.
 *
 *   <TokenChain />  two layers vs three: the third layer adds one name, it removes nothing
 *   <TokenGrid />   the 36 component tokens of one button; only one does something new
 */

const PURPLE = "#6E56CF"
const YELLOW = "#F5B400"
const TEAL = "#0D6B57"
const head = (x: number, y: number) => `M${x - 7} ${y - 5} L ${x} ${y} L ${x - 7} ${y + 5}`

type Box = { x: number; w: number; label: string; kind: "comp" | "token" | "new" | "prim" }

function Row({ y, title, boxes }: { y: number; title: string; boxes: Box[] }) {
  return (
    <g>
      <text x="0" y={y - 12} fill="currentColor" stroke="none" fontSize="14" fontWeight="600" opacity="0.7">
        {title}
      </text>
      {boxes.slice(1).map((b, i) => {
        const from = boxes[i]
        return (
          <g key={b.label} strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${from.x + from.w} ${y + 20} H ${b.x - 3}`} />
            <path d={head(b.x - 3, y + 20)} />
          </g>
        )
      })}
      {boxes.map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={y}
            width={b.w}
            height="40"
            rx="10"
            fill={b.kind === "new" ? `${PURPLE}1F` : "var(--background)"}
            stroke={b.kind === "token" || b.kind === "new" ? PURPLE : "currentColor"}
            strokeOpacity={b.kind === "token" ? 0.6 : b.kind === "new" ? 1 : 0.4}
            strokeWidth={b.kind === "new" ? 2.5 : 1.5}
          />
          {b.kind === "comp" && <rect x={b.x + 10} y={y + 10} width="20" height="20" rx="6" fill={YELLOW} stroke="#8E8E93" strokeOpacity="0.6" />}
          {b.kind === "prim" && <rect x={b.x + 9} y={y + 11} width="18" height="18" rx="5" fill={YELLOW} stroke="#8E8E93" strokeOpacity="0.6" />}
          <text
            className={b.kind === "comp" ? undefined : "mono"}
            x={b.kind === "comp" ? b.x + 40 : b.kind === "prim" ? b.x + 34 : b.x + b.w / 2}
            y={y + 25}
            textAnchor={b.kind === "comp" || b.kind === "prim" ? "start" : "middle"}
            fill="currentColor"
            stroke="none"
            fontSize={b.kind === "new" ? 12.5 : 14}
          >
            {b.label}
          </text>
        </g>
      ))}
    </g>
  )
}

/** Phone layout: the two chains as columns, read from top to bottom. */
function Column({ x, title, boxes }: { x: number; title: string; boxes: { label: string; kind: Box["kind"] }[] }) {
  const W = 196
  return (
    <g>
      <text x={x + W / 2} y="20" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16" fontWeight="600" opacity="0.7">
        {title}
      </text>
      {boxes.map((b, i) => {
        const y = 36 + i * 72
        const color = b.kind === "comp" || b.kind === "prim"
        return (
          <g key={b.label}>
            {i > 0 && (
              <g strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={`M${x + W / 2} ${y - 30} V ${y - 3}`} />
                <path d={`M${x + W / 2 - 5} ${y - 10} L ${x + W / 2} ${y - 3} L ${x + W / 2 + 5} ${y - 10}`} />
              </g>
            )}
            <rect
              x={x}
              y={y}
              width={W}
              height={b.kind === "new" ? 46 : 42}
              rx="10"
              fill={b.kind === "new" ? `${PURPLE}1F` : "var(--background)"}
              stroke={b.kind === "token" || b.kind === "new" ? PURPLE : "currentColor"}
              strokeOpacity={b.kind === "token" ? 0.6 : b.kind === "new" ? 1 : 0.4}
              strokeWidth={b.kind === "new" ? 2.5 : 1.5}
            />
            {color && <rect x={x + 12} y={y + 11} width="20" height="20" rx="6" fill={YELLOW} stroke="#8E8E93" strokeOpacity="0.6" />}
            <text
              className={b.kind === "comp" ? undefined : "mono"}
              x={color ? x + 42 : x + W / 2}
              y={y + 27}
              textAnchor={color ? "start" : "middle"}
              fill="currentColor"
              stroke="none"
              fontSize="16"
            >
              {b.kind === "new" ? (
                <>
                  <tspan x={x + W / 2} dy="-8">button.primary</tspan>
                  <tspan x={x + W / 2} dy="17">.background</tspan>
                </>
              ) : (
                b.label
              )}
            </text>
            {b.kind === "new" && (
              <text className="hand" x={x + W} y={y + 64} textAnchor="end" fill={PURPLE} stroke="none" fontSize="22">
                +1 name
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

export function TokenChain() {
  const narrow = useNarrow()
  const comp: Box = { x: 0, w: 108, label: "Button", kind: "comp" }
  const sem: Box = { x: 372, w: 132, label: "actionPrimary", kind: "token" }
  const prim: Box = { x: 530, w: 110, label: "yellow500", kind: "prim" }
  return (
    <figure className="not-prose my-6">
      {narrow ? (
        <svg
          viewBox="0 0 420 330"
          width="100%"
          role="img"
          aria-label="Two layers: Button points to actionPrimary, which points to yellow500. Three layers: Button points to button.primary.background, which points to actionPrimary, which points to yellow500. The third layer adds one name between the component and the semantic token; it removes nothing."
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <Column
            x={2}
            title="Two layers"
            boxes={[
              { label: "Button", kind: "comp" },
              { label: "actionPrimary", kind: "token" },
              { label: "yellow500", kind: "prim" },
            ]}
          />
          <Column
            x={222}
            title="Three layers"
            boxes={[
              { label: "Button", kind: "comp" },
              { label: "button.primary.background", kind: "new" },
              { label: "actionPrimary", kind: "token" },
              { label: "yellow500", kind: "prim" },
            ]}
          />
        </svg>
      ) : (
      <svg
        viewBox="0 0 640 200"
        width="100%"
        role="img"
        aria-label="Two layers: Button points to actionPrimary, which points to yellow500. Three layers: Button points to button.primary.background, which points to actionPrimary, which points to yellow500. The third layer adds one name between the component and the semantic token; it removes nothing."
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <Row y={30} title="Two layers" boxes={[comp, sem, prim]} />
        <Row y={132} title="Three layers" boxes={[comp, { x: 134, w: 212, label: "button.primary.background", kind: "new" }, sem, prim]} />
        <text className="hand" x="240" y="196" textAnchor="middle" fill={PURPLE} stroke="none" fontSize="22">
          one more name
        </text>
      </svg>
      )}
      <figcaption>The third layer doesn&apos;t replace anything. It adds one name between the component and the semantic token.</figcaption>
    </figure>
  )
}

const properties = ["background", "label", "border", "radius"]
const variants = ["primary", "secondary", "tertiary"]
const states = ["normal", "pressed", "disabled"]

export function TokenGrid() {
  const { ref, seen } = useSeenOnce<HTMLElement>(0.4)
  let n = 0
  return (
    <figure ref={ref} className="not-prose my-6">
      <div className="overflow-x-auto">
        <div className="mx-auto grid w-max grid-cols-[auto_repeat(4,4.75rem)] gap-1 text-xs">
          <span />
          {properties.map((p) => (
            <span key={p} className="pb-1 text-center font-mono font-semibold">
              {p}
            </span>
          ))}
          {variants.map((v) =>
            states.map((s, si) => (
              <div key={`${v}-${s}`} className={cn("contents")}>
                <span className={cn("pr-2 text-right font-mono leading-6 whitespace-nowrap", si === 0 && v !== variants[0] && "mt-2")}>
                  <span className={cn("font-semibold", si !== 0 && "opacity-0")}>{v}</span> <span className="opacity-60">{s}</span>
                </span>
                {properties.map((p, pi) => {
                  const overridden = v === "primary" && s === "normal" && pi === 0
                  const delay = n++ * 45
                  return (
                    <span
                      key={p}
                      title={overridden ? "button.primary.background → teal700" : `button.${v}.${p}.${s} → a semantic token`}
                      className={cn(
                        "token-grid-cell block h-6 rounded-md border text-center font-mono text-[0.65rem] leading-[1.4rem] whitespace-nowrap",
                        si === 0 && v !== variants[0] && "mt-2",
                        overridden ? "border-transparent font-semibold text-white" : "border-current/20 bg-muted opacity-70"
                      )}
                      style={{ background: overridden ? TEAL : undefined, animationDelay: `${delay}ms` }}
                      data-seen={seen || undefined}
                    >
                      {overridden ? "teal700" : "= semantic"}
                    </span>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
      <figcaption>
        One button, 4 properties × 3 variants × 3 states = 36 component tokens. 35 of them only repeat a semantic token. One does something new.
      </figcaption>
    </figure>
  )
}
